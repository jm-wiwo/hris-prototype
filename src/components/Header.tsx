'use client'
import { signOut } from 'next-auth/react'
import { useTheme } from '@/app/theme-provider'

interface HeaderProps {
  user: { name?: string | null; email?: string | null; role: string }
}

export default function Header({ user }: HeaderProps) {
  const { theme, setTheme } = useTheme()

  return (
    <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-6 py-4 flex items-center justify-between">
      <div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Welcome,</span>
        <h2 className="font-semibold text-gray-900 dark:text-white">{user.name}</h2>
      </div>
      <div className="flex items-center gap-4">
        <span className="px-2 py-1 text-xs rounded bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300">
          {user.role}
        </span>
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <button
          onClick={() => signOut({ callbackUrl: '/auth/signin' })}
          className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Sign Out
        </button>
      </div>
    </header>
  )
}
