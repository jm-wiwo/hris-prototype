import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import LeaveForm from '@/components/LeaveForm'
import LeaveList from '@/components/LeaveList'

export default async function LeavesPage() {
  const session = await getServerSession(authOptions)
  const isAdmin = session?.user.role === 'ADMIN' || session?.user.role === 'HR'

  const leavesRaw = await prisma.leave.findMany({
    where: isAdmin ? {} : { employeeId: session?.user.id },
    include: {
      employee: { select: { firstName: true, lastName: true, email: true } },
      approvedBy: { select: { firstName: true, lastName: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  const leaves = leavesRaw.map(leave => ({
    id: leave.id,
    type: leave.type,
    dateFrom: leave.dateFrom.toISOString(),
    dateTo: leave.dateTo.toISOString(),
    purpose: leave.purpose,
    status: leave.status,
    signature: leave.signature,
    createdAt: leave.createdAt.toISOString(),
    employee: leave.employee,
    approvedBy: leave.approvedBy,
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leave Management</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <LeaveForm />
        </div>
        <div className="lg:col-span-2">
          <LeaveList leaves={leaves} isAdmin={isAdmin} />
        </div>
      </div>
    </div>
  )
}