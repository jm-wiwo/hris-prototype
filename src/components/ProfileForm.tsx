'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Employee {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  address: string | null
  position: { title: string; department: { name: string } } | null
  organization: { name: string } | null
}

export default function ProfileForm({ employee }: { employee: Employee }) {
  const [form, setForm] = useState({
    firstName: employee.firstName,
    lastName: employee.lastName,
    phone: employee.phone || '',
    address: employee.address || '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    setLoading(false)

    if (res.ok) {
      setMessage('Profile updated successfully')
      router.refresh()
    } else {
      setMessage('Failed to update profile')
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Personal Information</h2>
      {message && <div className={`p-3 rounded mb-4 text-sm ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</div>}
      <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded">
        <p className="text-sm text-gray-600 dark:text-gray-400">Email: <span className="font-medium text-gray-900 dark:text-white">{employee.email}</span></p>
        <p className="text-sm text-gray-600 dark:text-gray-400">Position: <span className="font-medium text-gray-900 dark:text-white">{employee.position?.title || 'Not assigned'}</span></p>
        <p className="text-sm text-gray-600 dark:text-gray-400">Department: <span className="font-medium text-gray-900 dark:text-white">{employee.position?.department.name || 'Not assigned'}</span></p>
        <p className="text-sm text-gray-600 dark:text-gray-400">Organization: <span className="font-medium text-gray-900 dark:text-white">{employee.organization?.name || 'Not assigned'}</span></p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
          <textarea
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            rows={2}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
