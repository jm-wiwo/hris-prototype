import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import AnnouncementForm from '@/components/AnnouncementForm'
import { format } from 'date-fns'

export default async function AnnouncementsPage() {
  const session = await getServerSession(authOptions)
  const isAdmin = session?.user.role === 'ADMIN' || session?.user.role === 'HR'

  const announcements = await prisma.announcement.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
    include: { author: { select: { firstName: true, lastName: true } } },
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Announcements</h1>
      {isAdmin && <AnnouncementForm />}
      <div className="space-y-4">
        {announcements.map((a) => (
          <div key={a.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{a.title}</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2 whitespace-pre-wrap">{a.content}</p>
            <p className="text-sm text-gray-400 mt-4">
              By {a.author.firstName} {a.author.lastName} on {format(new Date(a.createdAt), 'MMM d, yyyy')}
            </p>
          </div>
        ))}
        {announcements.length === 0 && (
          <p className="text-gray-500 text-center py-8">No announcements</p>
        )}
      </div>
    </div>
  )
}
