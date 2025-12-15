import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import AttendanceLog from '@/components/AttendanceLog'
import AttendanceActions from '@/components/AttendanceActions'

export default async function AttendancePage() {
  const session = await getServerSession(authOptions)
  const isAdmin = session?.user.role === 'ADMIN' || session?.user.role === 'HR'

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todayAttendanceRaw = await prisma.attendance.findFirst({
    where: {
      employeeId: session?.user.id,
      date: { gte: today },
    },
  })

  const todayAttendance = todayAttendanceRaw ? {
    id: todayAttendanceRaw.id,
    timeIn: todayAttendanceRaw.timeIn?.toISOString() ?? null,
    timeOut: todayAttendanceRaw.timeOut?.toISOString() ?? null,
  } : null

  const attendancesRaw = await prisma.attendance.findMany({
    where: isAdmin ? {} : { employeeId: session?.user.id },
    include: { employee: { select: { firstName: true, lastName: true } } },
    orderBy: { date: 'desc' },
    take: 30,
  })

  const attendances = attendancesRaw.map((attendance) => ({
    ...attendance,
    date: attendance.date.toISOString(),
    timeIn: attendance.timeIn?.toISOString() ?? null,
    timeOut: attendance.timeOut?.toISOString() ?? null,
  }))

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance</h1>
      <AttendanceActions todayAttendance={todayAttendance} />
      <AttendanceLog attendances={attendances} isAdmin={isAdmin} />
    </div>
  )
}