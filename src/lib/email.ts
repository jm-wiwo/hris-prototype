import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'localhost',
  port: parseInt(process.env.SMTP_PORT || '1025'),
  secure: false,
})

export async function sendEmail(to: string, subject: string, html: string) {
  await transporter.sendMail({
    from: '"HRIS System" <noreply@hris.local>',
    to,
    subject,
    html,
  })
}

export async function sendLeaveNotification(employeeName: string, email: string, status: string, leaveType: string) {
  const subject = `Leave Request ${status}`
  const html = `
    <h2>Leave Request Update</h2>
    <p>Dear ${employeeName},</p>
    <p>Your <strong>${leaveType}</strong> leave request has been <strong>${status.toLowerCase()}</strong>.</p>
    <p>Please check your HRIS dashboard for more details.</p>
  `
  await sendEmail(email, subject, html)
}

export async function sendPayrollNotification(employeeName: string, email: string, period: string, netPay: number) {
  const subject = `Payslip Ready - ${period}`
  const html = `
    <h2>Payslip Available</h2>
    <p>Dear ${employeeName},</p>
    <p>Your payslip for <strong>${period}</strong> is now available.</p>
    <p>Net Pay: <strong>$${netPay.toFixed(2)}</strong></p>
    <p>Login to your HRIS dashboard to download the full payslip.</p>
  `
  await sendEmail(email, subject, html)
}
