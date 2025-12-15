'use client'
import { useEffect, useState } from 'react'

interface Activity {
  id: string
  action: string
  entity: string
  createdAt: string
  user: { firstName: string; lastName: string }
}

export default function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    fetch('/api/audit-logs?limit=5')
      .then((res) => res.json())
      .then((data) => setActivities(data.logs || []))
      .catch(() => {})
  }, [])

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Recent Activity</h2>
      <div className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-gray-500">No recent activity</p>
        ) : (
          activities.map((a) => (
            <div key={a.id} className="flex items-start gap-3 border-b dark:border-gray-700 pb-3">
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-sm">
                {a.user.firstName[0]}
              </div>
              <div>
                <p className="text-sm text-gray-900 dark:text-white">
                  <span className="font-medium">{a.user.firstName} {a.user.lastName}</span> {a.action} {a.entity}
                </p>
                <p className="text-xs text-gray-400">{new Date(a.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
