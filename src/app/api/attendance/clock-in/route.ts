import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createAuditLog } from '@/lib/audit'

export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const existing = await prisma.attendance.findFirst({
    where: { employeeId: session.user.id, date: { gte: today } },
  })

  if (existing) {
    return NextResponse.json({ error: 'Already clocked in today' }, { status: 400 })
  }

  const now = new Date()
  const isLate = now.getHours() >= 9

  const attendance = await prisma.attendance.create({
    data: {
      employeeId: session.user.id,
      date: today,
      timeIn: now,
      status: isLate ? 'LATE' : 'PRESENT',
    },
  })

  await createAuditLog(session.user.id, 'clocked in', 'Attendance', attendance.id)

  return NextResponse.json({ attendance })
}
