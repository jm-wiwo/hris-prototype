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

  const { periodStart, periodEnd } = await req.json()
  const startDate = new Date(periodStart)
  const endDate = new Date(periodEnd)

  const employees = await prisma.employee.findMany({
    where: { isActive: true, position: { isNot: null } },
    include: { position: true },
  })

  const workingDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
  const weekendDays = Math.floor(workingDays / 7) * 2
  const effectiveWorkDays = workingDays - weekendDays

  const payrolls = []

  for (const emp of employees) {
    if (!emp.position) continue

    const monthlyBaseSalary = emp.position.baseSalary
    const dailyRate = monthlyBaseSalary / 22
    const periodBasePay = dailyRate * effectiveWorkDays

    const absentLeaves = await prisma.leave.findMany({
      where: {
        employeeId: emp.id,
        type: 'ABSENT',
        status: 'APPROVED',
        dateFrom: { lte: endDate },
        dateTo: { gte: startDate },
      },
    })

    let absentDays = 0
    for (const leave of absentLeaves) {
      const leaveStart = new Date(Math.max(leave.dateFrom.getTime(), startDate.getTime()))
      const leaveEnd = new Date(Math.min(leave.dateTo.getTime(), endDate.getTime()))
      absentDays += Math.ceil((leaveEnd.getTime() - leaveStart.getTime()) / (1000 * 60 * 60 * 24)) + 1
    }

    const overtimeLeaves = await prisma.leave.findMany({
      where: {
        employeeId: emp.id,
        type: 'OVERTIME',
        status: 'APPROVED',
        dateFrom: { lte: endDate },
        dateTo: { gte: startDate },
      },
    })

    let overtimeHours = 0
    for (const ot of overtimeLeaves) {
      const otStart = new Date(Math.max(ot.dateFrom.getTime(), startDate.getTime()))
      const otEnd = new Date(Math.min(ot.dateTo.getTime(), endDate.getTime()))
      overtimeHours += Math.ceil((otEnd.getTime() - otStart.getTime()) / (1000 * 60 * 60 * 24)) * 8
    }

    const hourlyRate = dailyRate / 8
    const overtimePay = overtimeHours * hourlyRate * 1.25
    const absentDeduction = absentDays * dailyRate
    const taxDeduction = periodBasePay * 0.1
    const sssDeduction = Math.min(periodBasePay * 0.045, 1125)
    const philhealthDeduction = Math.min(periodBasePay * 0.02, 900)
    const totalDeductions = taxDeduction + sssDeduction + philhealthDeduction

    const netPay = periodBasePay + overtimePay - absentDeduction - totalDeductions

    const payroll = await prisma.payroll.create({
      data: {
        employeeId: emp.id,
        periodStart: startDate,
        periodEnd: endDate,
        basePay: periodBasePay,
        overtimePay,
        deductions: totalDeductions,
        absentDays,
        absentDeduction,
        netPay: Math.max(0, netPay),
        status: 'DRAFT',
      },
    })

    payrolls.push(payroll)
    await createAuditLog(session.user.id, 'generated payroll for', 'Payroll', payroll.id)
  }

  return NextResponse.json({ payrolls, count: payrolls.length })
}
