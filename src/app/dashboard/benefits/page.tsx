import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function BenefitsPage() {
  const session = await getServerSession(authOptions)
  if (session?.user.role !== 'ADMIN' && session?.user.role !== 'HR') redirect('/dashboard')

  const benefits = [
    { name: 'Health Insurance', description: 'Comprehensive medical, dental, and vision coverage', enrolled: 45 },
    { name: 'Life Insurance', description: '2x annual salary life insurance', enrolled: 42 },
    { name: 'Retirement Plan', description: '401(k) with 4% company match', enrolled: 38 },
    { name: 'Paid Time Off', description: '15 days vacation + 10 sick days', enrolled: 50 },
    { name: 'Gym Membership', description: 'Subsidized fitness center membership', enrolled: 25 },
    { name: 'Education Assistance', description: 'Up to $5,000/year for continuing education', enrolled: 12 },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Benefits Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {benefits.map((benefit) => (
          <div key={benefit.name} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{benefit.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{benefit.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">{benefit.enrolled} enrolled</span>
              <button className="px-3 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700">
                Manage
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
