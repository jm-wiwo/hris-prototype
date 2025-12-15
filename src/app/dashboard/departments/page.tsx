import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export default async function DepartmentsPage() {
  const session = await getServerSession(authOptions)
  if (session?.user.role !== 'ADMIN' && session?.user.role !== 'HR') redirect('/dashboard')

  const departments = await prisma.department.findMany({
    include: {
      organization: true,
      positions: { include: { _count: { select: { employees: true } } } },
    },
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Departments</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div key={dept.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{dept.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{dept.organization?.name}</p>
            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Positions: {dept.positions.length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Employees: {dept.positions.reduce((acc, p) => acc + p._count.employees, 0)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
