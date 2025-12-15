import { format } from 'date-fns'

interface Attendance {
  id: string
  date: string
  timeIn: string | null
  timeOut: string | null
  status: string
  employee: { firstName: string; lastName: string }
}

export default function AttendanceLog({ attendances, isAdmin }: { attendances: Attendance[]; isAdmin: boolean }) {
  const statusColors: Record<string, string> = {
    PRESENT: 'bg-green-100 text-green-800',
    LATE: 'bg-yellow-100 text-yellow-800',
    ABSENT: 'bg-red-100 text-red-800',
    HALF_DAY: 'bg-orange-100 text-orange-800',
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Attendance Log</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {isAdmin && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Employee</th>}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Time In</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Time Out</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-700">
            {attendances.map((a) => (
              <tr key={a.id}>
                {isAdmin && (
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {a.employee.firstName} {a.employee.lastName}
                  </td>
                )}
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{format(new Date(a.date), 'MMM d, yyyy')}</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                  {a.timeIn ? format(new Date(a.timeIn), 'hh:mm a') : '-'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                  {a.timeOut ? format(new Date(a.timeOut), 'hh:mm a') : '-'}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${statusColors[a.status]}`}>{a.status}</span>
                </td>
              </tr>
            ))}
            {attendances.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">No attendance records</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
