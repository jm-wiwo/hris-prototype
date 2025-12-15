'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊', roles: ['ADMIN', 'HR', 'EMPLOYEE'] },
  { href: '/dashboard/profile', label: 'Profile', icon: '👤', roles: ['ADMIN', 'HR', 'EMPLOYEE'] },
  { href: '/dashboard/attendance', label: 'Attendance', icon: '🕐', roles: ['ADMIN', 'HR', 'EMPLOYEE'] },
  { href: '/dashboard/leaves', label: 'Leaves', icon: '📝', roles: ['ADMIN', 'HR', 'EMPLOYEE'] },
  { href: '/dashboard/payroll', label: 'Payroll', icon: '💰', roles: ['ADMIN', 'HR', 'EMPLOYEE'] },
  { href: '/dashboard/employees', label: 'Employees', icon: '👥', roles: ['ADMIN', 'HR'] },
  { href: '/dashboard/departments', label: 'Departments', icon: '🏢', roles: ['ADMIN', 'HR'] },
  { href: '/dashboard/recruitment', label: 'Recruitment', icon: '📋', roles: ['ADMIN', 'HR'] },
  { href: '/dashboard/performance', label: 'Performance', icon: '📈', roles: ['ADMIN', 'HR'] },
  { href: '/dashboard/benefits', label: 'Benefits', icon: '🎁', roles: ['ADMIN', 'HR'] },
  { href: '/dashboard/announcements', label: 'Announcements', icon: '📢', roles: ['ADMIN', 'HR', 'EMPLOYEE'] },
  { href: '/dashboard/reports', label: 'Reports', icon: '📑', roles: ['ADMIN', 'HR'] },
  { href: '/dashboard/audit-logs', label: 'Audit Logs', icon: '🔍', roles: ['ADMIN'] },
  { href: '/dashboard/settings', label: 'Settings', icon: '⚙️', roles: ['ADMIN', 'HR', 'EMPLOYEE'] },
]

export default function Sidebar({ role }: { role: string }) {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col">
      <div className="p-4 border-b dark:border-gray-700">
        <h1 className="text-xl font-bold text-primary-600">HRIS</h1>
      </div>
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {navItems
            .filter((item) => item.roles.includes(role))
            .map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    pathname === item.href
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
        </ul>
      </nav>
    </aside>
  )
}
