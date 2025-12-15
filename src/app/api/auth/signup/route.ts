import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { email, password, firstName, lastName } = await req.json()

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const existing = await prisma.employee.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 })
    }

    const hashedPassword = await hash(password, 12)

    await prisma.employee.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
      },
    })

    return NextResponse.json({ message: 'Account created successfully' })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
