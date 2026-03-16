import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@vintage.com'
  const password = 'ChangeMe123!'
  const name = 'Admin User'

  const hashedPassword = await bcrypt.hash(password, 10)

  const admin = await prisma.adminUser.upsert({
    where: { email },
    update: {
      passwordHash: hashedPassword,
    },
    create: {
      email,
      passwordHash: hashedPassword,
      name,
    },
  })

  console.log({
    message: 'Admin user created successfully',
    email: admin.email,
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
