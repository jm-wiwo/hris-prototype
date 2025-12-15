import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import StatsCards from '@/components/StatsCards'
import RecentActivity from '@/components/RecentActivity'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const isAdmin = session?.user.role === 'ADMIN' || session?.user.role === 'HR'

  const [employeeCount, pendingLeaves, todayAttendance, announcements] = await Promise.all([
    isAdmin ? prisma.employee.count({ where: { isActive: true } }) : 0,
    prisma.leave.count({
      where: isAdmin ? { status: 'PENDING' } : { employeeId: session?.user.id, status: 'PENDING' },
    }),
    prisma.attendance.count({
      where: {
        date: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        ...(isAdmin ? {} : { employeeId: session?.user.id }),
      },
    }),
    prisma.announcement.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { author: { select: { firstName: true, lastName: true } } },
    }),
  ])

  const stats = isAdmin
    ? [
        { label: 'Total Employees', value: employeeCount, icon: '👥' },
        { label: 'Pending Leaves', value: pendingLeaves, icon: '📝' },
        { label: 'Present Today', value: todayAttendance, icon: '✅' },
      ]
    : [
        { label: 'My Pending Leaves', value: pendingLeaves, icon: '📝' },
        { label: 'Attendance Today', value: todayAttendance > 0 ? 'Checked In' : 'Not Yet', icon: '🕐' },
      ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      <StatsCards stats={stats} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Announcements</h2>
          <div className="space-y-4">
            {announcements.length === 0 ? (
              <p className="text-gray-500">No announcements</p>
            ) : (
              announcements.map((a) => (
                <div key={a.id} className="border-b dark:border-gray-700 pb-3">
                  <h3 className="font-medium text-gray-900 dark:text-white">{a.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{a.content.slice(0, 100)}...</p>
                  <p className="text-xs text-gray-400 mt-1">
                    By {a.author.firstName} {a.author.lastName}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
