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

  const attendance = await prisma.attendance.findFirst({
    where: { employeeId: session.user.id, date: { gte: today } },
  })

  if (!attendance) {
    return NextResponse.json({ error: 'Not clocked in' }, { status: 400 })
  }

  if (attendance.timeOut) {
    return NextResponse.json({ error: 'Already clocked out' }, { status: 400 })
  }

  const now = new Date()
  const hoursWorked = (now.getTime() - attendance.timeIn!.getTime()) / (1000 * 60 * 60)

  const updated = await prisma.attendance.update({
    where: { id: attendance.id },
    data: {
      timeOut: now,
      status: hoursWorked < 4 ? 'HALF_DAY' : attendance.status,
    },
  })

  await createAuditLog(session.user.id, 'clocked out', 'Attendance', updated.id)

  return NextResponse.json({ attendance: updated })
}
