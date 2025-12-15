import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import PayrollList from '@/components/PayrollList'
import PayrollGenerator from '@/components/PayrollGenerator'

export default async function PayrollPage() {
  const session = await getServerSession(authOptions)
  const isAdmin = session?.user.role === 'ADMIN' || session?.user.role === 'HR'

  const payrollsRaw = await prisma.payroll.findMany({
    where: isAdmin ? {} : { employeeId: session?.user.id },
    include: {
      employee: {
        select: { firstName: true, lastName: true, position: { select: { baseSalary: true } } },
      },
    },
    orderBy: { periodEnd: 'desc' },
  })

  const payrolls = payrollsRaw.map(p => ({
    id: p.id,
    periodStart: p.periodStart.toISOString(),
    periodEnd: p.periodEnd.toISOString(),
    basePay: p.basePay,
    overtimePay: p.overtimePay,
    deductions: p.deductions,
    absentDays: p.absentDays,
    absentDeduction: p.absentDeduction,
    netPay: p.netPay,
    status: p.status,
    employee: p.employee,
  }))

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payroll</h1>
      {isAdmin && <PayrollGenerator />}
      <PayrollList payrolls={payrolls} isAdmin={isAdmin} />
    </div>
  )
}