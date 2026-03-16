import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    const email = 'admin@vintage.com'
    const password = 'ChangeMe123!'
    const name = 'Admin'

    const existing = await prisma.adminUser.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ message: 'Admin user already exists', email })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const admin = await prisma.adminUser.create({
      data: { email, passwordHash, name },
    })

    return NextResponse.json({
      success: true,
      message: 'Admin user created. Delete this route in production!',
      email: admin.email,
      defaultPassword: password,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
