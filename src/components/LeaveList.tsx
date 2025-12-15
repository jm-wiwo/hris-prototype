'use client'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'

interface Leave {
  id: string
  type: string
  dateFrom: string
  dateTo: string
  purpose: string
  status: string
  signature: string | null
  createdAt: string
  employee: { firstName: string; lastName: string; email: string }
  approvedBy: { firstName: string; lastName: string } | null
}

export default function LeaveList({ leaves, isAdmin }: { leaves: Leave[]; isAdmin: boolean }) {
  const router = useRouter()

  const handleAction = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    await fetch(`/api/leaves/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    router.refresh()
  }

  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Leave Requests</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {isAdmin && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Employee</th>}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Duration</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Purpose</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
              {isAdmin && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-700">
            {leaves.map((leave) => (
              <tr key={leave.id}>
                {isAdmin && (
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {leave.employee.firstName} {leave.employee.lastName}
                  </td>
                )}
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{leave.type}</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                  {format(new Date(leave.dateFrom), 'MMM d')} - {format(new Date(leave.dateTo), 'MMM d, yyyy')}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">{leave.purpose}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${statusColors[leave.status]}`}>{leave.status}</span>
                </td>
                {isAdmin && (
                  <td className="px-4 py-3">
                    {leave.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAction(leave.id, 'APPROVED')}
                          className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(leave.id, 'REJECTED')}
                          className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
            {leaves.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">No leave requests found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
