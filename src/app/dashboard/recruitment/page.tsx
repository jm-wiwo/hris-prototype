import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function RecruitmentPage() {
  const session = await getServerSession(authOptions)
  if (session?.user.role !== 'ADMIN' && session?.user.role !== 'HR') redirect('/dashboard')

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Recruitment & Onboarding</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Job Openings</h2>
        <p className="text-gray-500">No active job postings. Create a new position to start recruiting.</p>
        <button className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
          Create Job Posting
        </button>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Onboarding Checklist</h2>
        <ul className="space-y-2 text-gray-600 dark:text-gray-400">
          <li>1. Complete employee profile</li>
          <li>2. Assign department and position</li>
          <li>3. Setup system access</li>
          <li>4. Schedule orientation</li>
          <li>5. Assign mentor/buddy</li>
        </ul>
      </div>
    </div>
  )
}
