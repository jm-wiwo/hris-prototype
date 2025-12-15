import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createAuditLog } from '@/lib/audit'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (session.user.role !== 'ADMIN' && session.user.role !== 'HR') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { title, content } = await req.json()

  const announcement = await prisma.announcement.create({
    data: { title, content, authorId: session.user.id },
  })

  await createAuditLog(session.user.id, 'created', 'Announcement', announcement.id)

  return NextResponse.json({ announcement })
}
