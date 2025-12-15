import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import AnalyticsCharts from '@/components/AnalyticsCharts'

export default async function ReportsPage() {
  const session = await getServerSession(authOptions)
  if (session?.user.role !== 'ADMIN' && session?.user.role !== 'HR') redirect('/dashboard')

  const [employeeCount, leaveStats, attendanceStats, payrollTotal] = await Promise.all([
    prisma.employee.count({ where: { isActive: true } }),
    prisma.leave.groupBy({
      by: ['type'],
      _count: true,
      where: { status: 'APPROVED' },
    }),
    prisma.attendance.groupBy({
      by: ['status'],
      _count: true,
    }),
    prisma.payroll.aggregate({
      _sum: { netPay: true },
      where: { status: 'PAID' },
    }),
  ])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-sm text-gray-500">Total Employees</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{employeeCount}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-sm text-gray-500">Approved Leaves</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {leaveStats.reduce((acc, l) => acc + l._count, 0)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-sm text-gray-500">Attendance Records</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {attendanceStats.reduce((acc, a) => acc + a._count, 0)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-sm text-gray-500">Total Payroll Paid</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            ${(payrollTotal._sum.netPay || 0).toFixed(2)}
          </p>
        </div>
      </div>
      <AnalyticsCharts leaveStats={leaveStats} attendanceStats={attendanceStats} />
    </div>
  )
}
