# HRIS - Human Resource Information System

A production-ready HR management platform built with Next.js, PostgreSQL, and Docker.

## Features

- **Authentication**: Sign In/Sign Up with 2FA support
- **Leave Management**: Emergency, Sick, Vacation, Overtime, Offset, Absent (with overlap validation)
- **Attendance**: Automated clock-in/clock-out system
- **Payroll**: Automated calculation with deductions for absences
- **Employee Management**: CRUD with RBAC (Admin/HR/Employee)
- **Analytics**: Charts and reports dashboard
- **Audit Logs**: Track all sensitive operations
- **Dark Mode**: Theme switching
- **Email Notifications**: Leave approvals, payslip alerts

## Quick Start

```bash
# Start all services
docker-compose up -d

# Access the application
http://localhost:3000

# Access MailHog (email testing)
http://localhost:8025
```

## Default Accounts

After seeding:
- **Admin**: admin@acme.com / admin123
- **Employee**: employee@acme.com / employee123

## Development

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database
npm run db:seed

# Start development server
npm run dev
```

## Tech Stack

- Next.js 14 (App Router)
- PostgreSQL + Prisma ORM
- NextAuth.js
- TailwindCSS
- Docker + Docker Compose
