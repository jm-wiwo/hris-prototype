import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { authenticator } from 'otplib'
import { createAuditLog } from '@/lib/audit'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { code, secret } = await req.json()

  const isValid = authenticator.verify({ token: code, secret })
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid code' }, { status: 400 })
  }

  await prisma.employee.update({
    where: { id: session.user.id },
    data: {
      twoFactorSecret: secret,
      twoFactorEnabled: true,
    },
  })

  await createAuditLog(session.user.id, 'enabled 2FA', 'Employee', session.user.id)

  return NextResponse.json({ success: true })
}
