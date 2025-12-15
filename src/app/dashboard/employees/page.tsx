import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import EmployeeTable from '@/components/EmployeeTable'

export default async function EmployeesPage() {
  const session = await getServerSession(authOptions)
  if (session?.user.role !== 'ADMIN' && session?.user.role !== 'HR') redirect('/dashboard')

  const employeesRaw = await prisma.employee.findMany({
    include: {
      position: { include: { department: true } },
      organization: true,
    },
    orderBy: { lastName: 'asc' },
  })

  const employees = employeesRaw.map(emp => ({
    id: emp.id,
    email: emp.email,
    firstName: emp.firstName,
    lastName: emp.lastName,
    role: emp.role,
    isActive: emp.isActive,
    hireDate: emp.hireDate.toISOString(),
    position: emp.position ? { title: emp.position.title, department: { name: emp.position.department.name } } : null,
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Employees</h1>
      </div>
      <EmployeeTable employees={employees} />
    </div>
  )
}