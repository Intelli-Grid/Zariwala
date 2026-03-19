/**
 * Seed script — creates the initial AdminUser.
 * Run once: npx prisma db seed
 * OR: npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
 */

import { config } from 'dotenv'
import path from 'path'
// We need to provide the absolute path or run ts-node from src/lib to ensure the environment is correct.
config({ path: path.join(__dirname, '../.env.local') })

import bcrypt from 'bcryptjs'
import { prisma } from '../src/lib/prisma'

async function main() {
  const email    = process.env.SEED_ADMIN_EMAIL    ?? 'admin@vintage.com'
  const password = process.env.SEED_ADMIN_PASSWORD ?? 'ChangeMe123!'
  const name     = process.env.SEED_ADMIN_NAME     ?? 'Admin'

  const existingAdmin = await prisma.adminUser.findUnique({ where: { email } })
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(password, 12)
    const user = await prisma.adminUser.create({
      data: { email, name, passwordHash },
    })
    console.log(`✅ Admin created: ${user.email}`)
    console.log(`   Password: ${password}`)
    console.log(`   ⚠️  Change this password after first login!`)
  } else {
    console.log(`Admin user already exists: ${email}`)
  }

  const categories = [
    { slug: 'denim', name: 'Denim & Workwear', currency: 'USD', isActive: true, sortOrder: 1 },
    { slug: 'sportswear', name: 'Retro Sports & Streetwear', currency: 'USD', isActive: true, sortOrder: 2 },
    { slug: 'designer', name: 'Archive Designer & Luxury', currency: 'USD', isActive: true, sortOrder: 3 },
    { slug: 'heritage-textiles', name: 'Silk Sarees & Heritage Weaves', currency: 'INR', priceRangeMin: 500, priceRangeMax: 150000, isActive: true, sortOrder: 4 },
    { slug: 'outerwear', name: 'Jackets & Outerwear', currency: 'USD', isActive: true, sortOrder: 5 },
    { slug: 'accessories', name: 'Bags, Scarves & Accessories', currency: 'USD', isActive: true, sortOrder: 6 },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    })
  }
  console.log(`✅ Seeded ${categories.length} core categories.`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
