# HRIS Application - Schema & Architecture

## Tech Stack
- **Frontend:** Next.js 14 (React, TypeScript, TailwindCSS)
- **Backend:** Next.js API Routes (Node.js)
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** NextAuth.js with JWT
- **Containerization:** Docker + Docker Compose

## High-Value Additions
1. **Audit Logs** - Track all sensitive operations
2. **Email Notifications** - Leave approvals, payroll alerts
3. **PDF Export** - Payslips, leave summaries
4. **Dark Mode** - User preference toggle
5. **Two-Factor Authentication (2FA)** - TOTP-based
6. **Document Management** - Upload/store employee documents
7. **Announcement Board** - Company-wide communications

## Entity Relationships

```
┌─────────────────┐      ┌─────────────────┐
│   Organization  │──1:N─│   Department    │
└─────────────────┘      └─────────────────┘
         │                       │
        1:N                     1:N
         │                       │
┌─────────────────┐      ┌─────────────────┐
│     Employee    │──N:1─│    Position     │
└─────────────────┘      └─────────────────┘
    │    │    │
   1:N  1:N  1:1
    │    │    │
┌───┴──┐ │ ┌──┴───────────┐
│Leave │ │ │  Attendance  │
└──────┘ │ └──────────────┘
         │
    ┌────┴────┐
    │ Payroll │
    └─────────┘
```

## Database Tables

### Core Entities
- **Organization**: id, name, address, settings (JSON)
- **Department**: id, name, orgId, managerId
- **Position**: id, title, departmentId, baseSalary
- **Employee**: id, email, password, firstName, lastName, role (ADMIN/EMPLOYEE/HR), positionId, hireDate, status, 2faSecret

### HR Operations
- **Leave**: id, employeeId, type (EMERGENCY/SICK/VACATION/OVERTIME/OFFSET/ABSENT), dateFrom, dateTo, purpose, status, signature, approvedBy
- **Attendance**: id, employeeId, date, timeIn, timeOut, status
- **Payroll**: id, employeeId, period, basePay, deductions, netPay, status

### Supporting
- **AuditLog**: id, userId, action, entity, entityId, changes, timestamp
- **Document**: id, employeeId, type, filename, url
- **Announcement**: id, title, content, authorId, createdAt
