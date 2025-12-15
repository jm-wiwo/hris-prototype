import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createAuditLog } from '@/lib/audit'
import { sendLeaveNotification } from '@/lib/email'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (session.user.role !== 'ADMIN' && session.user.role !== 'HR') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { status } = await req.json()

  if (!['APPROVED', 'REJECTED'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const leave = await prisma.leave.update({
    where: { id: params.id },
    data: {
      status,
      approvedById: session.user.id,
      approvedAt: new Date(),
    },
    include: { employee: true },
  })

  await createAuditLog(session.user.id, status.toLowerCase(), 'Leave', leave.id, { status })

  try {
    await sendLeaveNotification(
      `${leave.employee.firstName} ${leave.employee.lastName}`,
      leave.employee.email,
      status,
      leave.type
    )
  } catch {}

  return NextResponse.json({ leave })
}
