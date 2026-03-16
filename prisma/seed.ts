/**
 * Seed script — creates the initial AdminUser.
 * Run once: npx prisma db seed
 * OR: npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('@prisma/client')
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email    = process.env.SEED_ADMIN_EMAIL    ?? 'admin@vintage.com'
  const password = process.env.SEED_ADMIN_PASSWORD ?? 'ChangeMe123!'
  const name     = process.env.SEED_ADMIN_NAME     ?? 'Admin'

  const existing = await prisma.adminUser.findUnique({ where: { email } })
  if (existing) {
    console.log(`Admin user already exists: ${email}`)
    return
  }

  const passwordHash = await bcrypt.hash(password, 12)

  const user = await prisma.adminUser.create({
    data: { email, name, passwordHash },
  })

  console.log(`✅ Admin created: ${user.email}`)
  console.log(`   Password: ${password}`)
  console.log(`   ⚠️  Change this password after first login!`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
