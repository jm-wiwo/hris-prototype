'use client'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'

interface Employee {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  isActive: boolean
  hireDate: string
  position: { title: string; department: { name: string } } | null
}

export default function EmployeeTable({ employees }: { employees: Employee[] }) {
  const router = useRouter()

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    await fetch(`/api/employees/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !isActive }),
    })
    router.refresh()
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Email</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Position</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Department</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Role</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Hire Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
            <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y dark:divide-gray-700">
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-medium">
                {emp.firstName} {emp.lastName}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{emp.email}</td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{emp.position?.title || '-'}</td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{emp.position?.department.name || '-'}</td>
              <td className="px-4 py-3">
                <span className="px-2 py-1 text-xs rounded bg-primary-100 text-primary-700">{emp.role}</span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                {format(new Date(emp.hireDate), 'MMM d, yyyy')}
              </td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 text-xs rounded-full ${emp.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {emp.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => handleToggleStatus(emp.id, emp.isActive)}
                  className={`px-2 py-1 text-xs rounded ${emp.isActive ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
                >
                  {emp.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
