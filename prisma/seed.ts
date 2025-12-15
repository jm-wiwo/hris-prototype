import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const { hash } = bcrypt
const prisma = new PrismaClient()

async function main() {
  const org = await prisma.organization.create({
    data: {
      name: 'Acme Corporation',
      address: '123 Business Ave, Tech City',
    },
  })

  const dept = await prisma.department.create({
    data: {
      name: 'Human Resources',
      organizationId: org.id,
    },
  })

  const position = await prisma.position.create({
    data: {
      title: 'HR Manager',
      departmentId: dept.id,
      baseSalary: 75000,
    },
  })

  const adminPassword = await hash('admin123', 12)
  await prisma.employee.create({
    data: {
      email: 'admin@acme.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: Role.ADMIN,
      positionId: position.id,
      organizationId: org.id, 
    },
  })

  const empPosition = await prisma.position.create({
    data: {
      title: 'Software Developer',
      departmentId: dept.id,
      baseSalary: 60000,
    },
  })

  const empPassword = await hash('employee123', 12)
  await prisma.employee.create({
    data: {
      email: 'employee@acme.com',
      password: empPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: Role.EMPLOYEE,
      positionId: empPosition.id,
      organizationId: org.id,
    },
  })

  console.log('Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
