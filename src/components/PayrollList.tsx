'use client'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'

interface Payroll {
  id: string
  periodStart: string
  periodEnd: string
  basePay: number
  overtimePay: number
  deductions: number
  absentDays: number
  absentDeduction: number
  netPay: number
  status: string
  employee: { firstName: string; lastName: string; position: { baseSalary: number } | null }
}

export default function PayrollList({ payrolls, isAdmin }: { payrolls: Payroll[]; isAdmin: boolean }) {
  const router = useRouter()

  const handleProcess = async (id: string) => {
    await fetch(`/api/payroll/${id}/process`, { method: 'POST' })
    router.refresh()
  }

  const statusColors: Record<string, string> = {
    DRAFT: 'bg-gray-100 text-gray-800',
    PROCESSED: 'bg-blue-100 text-blue-800',
    PAID: 'bg-green-100 text-green-800',
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Payroll Records</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {isAdmin && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Employee</th>}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Period</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Base Pay</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Overtime</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Deductions</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Absent</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Net Pay</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
              {isAdmin && <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-700">
            {payrolls.map((p) => (
              <tr key={p.id}>
                {isAdmin && (
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {p.employee.firstName} {p.employee.lastName}
                  </td>
                )}
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                  {format(new Date(p.periodStart), 'MMM d')} - {format(new Date(p.periodEnd), 'MMM d, yyyy')}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white text-right">${p.basePay.toFixed(2)}</td>
                <td className="px-4 py-3 text-sm text-green-600 text-right">+${p.overtimePay.toFixed(2)}</td>
                <td className="px-4 py-3 text-sm text-red-600 text-right">-${p.deductions.toFixed(2)}</td>
                <td className="px-4 py-3 text-sm text-red-600 text-right">
                  {p.absentDays} days (-${p.absentDeduction.toFixed(2)})
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white text-right">${p.netPay.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${statusColors[p.status]}`}>{p.status}</span>
                </td>
                {isAdmin && (
                  <td className="px-4 py-3">
                    {p.status === 'DRAFT' && (
                      <button
                        onClick={() => handleProcess(p.id)}
                        className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Process
                      </button>
                    )}
                    {p.status === 'PROCESSED' && (
                      <button
                        onClick={() => handleProcess(p.id)}
                        className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Mark Paid
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
            {payrolls.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-500">No payroll records</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
