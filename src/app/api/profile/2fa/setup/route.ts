import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { authenticator } from 'otplib'
import * as QRCode from 'qrcode'

export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const secret = authenticator.generateSecret()
  const otpauth = authenticator.keyuri(session.user.email!, 'HRIS', secret)
  const qrCode = await QRCode.toDataURL(otpauth)

  return NextResponse.json({ secret, qrCode })
}
