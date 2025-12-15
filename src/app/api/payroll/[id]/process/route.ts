import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createAuditLog } from '@/lib/audit'
import { sendPayrollNotification } from '@/lib/email'
import { format } from 'date-fns'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (session.user.role !== 'ADMIN' && session.user.role !== 'HR') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const payroll = await prisma.payroll.findUnique({
    where: { id: params.id },
    include: { employee: true },
  })

  if (!payroll) {
    return NextResponse.json({ error: 'Payroll not found' }, { status: 404 })
  }

  const newStatus = payroll.status === 'DRAFT' ? 'PROCESSED' : 'PAID'

  const updated = await prisma.payroll.update({
    where: { id: params.id },
    data: {
      status: newStatus,
      paidAt: newStatus === 'PAID' ? new Date() : null,
    },
  })

  await createAuditLog(session.user.id, `${newStatus.toLowerCase()} payroll`, 'Payroll', payroll.id)

  if (newStatus === 'PAID') {
    try {
      const period = `${format(payroll.periodStart, 'MMM d')} - ${format(payroll.periodEnd, 'MMM d, yyyy')}`
      await sendPayrollNotification(
        `${payroll.employee.firstName} ${payroll.employee.lastName}`,
        payroll.employee.email,
        period,
        payroll.netPay
      )
    } catch {}
  }

  return NextResponse.json({ payroll: updated })
}
