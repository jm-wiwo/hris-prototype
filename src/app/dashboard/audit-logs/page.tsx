import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { format } from 'date-fns'

export default async function AuditLogsPage() {
  const session = await getServerSession(authOptions)
  if (session?.user.role !== 'ADMIN') redirect('/dashboard')

  const logs = await prisma.auditLog.findMany({
    take: 100,
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { firstName: true, lastName: true, email: true } } },
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Audit Logs</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Time</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">User</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Action</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Entity</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-700">
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                  {format(new Date(log.createdAt), 'MMM d, yyyy HH:mm')}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                  {log.user.firstName} {log.user.lastName}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{log.action}</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{log.entity}</td>
                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-500 font-mono">
                  {log.entityId?.slice(0, 8)}...
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
