import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createAuditLog } from '@/lib/audit'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'HR'

  const leaves = await prisma.leave.findMany({
    where: isAdmin ? {} : { employeeId: session.user.id },
    include: {
      employee: { select: { firstName: true, lastName: true, email: true } },
      approvedBy: { select: { firstName: true, lastName: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ leaves })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { type, dateFrom, dateTo, purpose, signature } = await req.json()

  if (!type || !dateFrom || !dateTo || !purpose || !signature) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
  }

  const fromDate = new Date(dateFrom)
  const toDate = new Date(dateTo)

  if (fromDate > toDate) {
    return NextResponse.json({ error: 'Invalid date range' }, { status: 400 })
  }

  const overlapping = await prisma.leave.findFirst({
    where: {
      employeeId: session.user.id,
      status: { not: 'REJECTED' },
      OR: [
        { dateFrom: { lte: toDate }, dateTo: { gte: fromDate } },
      ],
    },
  })

  if (overlapping) {
    return NextResponse.json({ error: 'Leave dates overlap with an existing request' }, { status: 400 })
  }

  const leave = await prisma.leave.create({
    data: {
      employeeId: session.user.id,
      type,
      dateFrom: fromDate,
      dateTo: toDate,
      purpose,
      signature,
    },
  })

  await createAuditLog(session.user.id, 'created', 'Leave', leave.id)

  return NextResponse.json({ leave })
}
