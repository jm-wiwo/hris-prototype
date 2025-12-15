import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function PerformancePage() {
  const session = await getServerSession(authOptions)
  if (session?.user.role !== 'ADMIN' && session?.user.role !== 'HR') redirect('/dashboard')

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Performance Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Goals & OKRs</h2>
          <p className="text-gray-500 text-sm">Track employee goals and key results</p>
          <button className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700">
            Set Goals
          </button>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Performance Reviews</h2>
          <p className="text-gray-500 text-sm">Conduct and manage performance evaluations</p>
          <button className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700">
            Start Review
          </button>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Feedback</h2>
          <p className="text-gray-500 text-sm">360-degree feedback collection</p>
          <button className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700">
            Request Feedback
          </button>
        </div>
      </div>
    </div>
  )
}
