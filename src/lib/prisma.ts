import { Pool, neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'

// Use a fallback just in case DATABASE_URL is undefined during build or client-side introspection
const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/dummy'

let adapter
if (process.env.DATABASE_URL) {
  // Only inject ws on the server side to avoid webpack errors.
  if (typeof window === 'undefined') {
    neonConfig.webSocketConstructor = require('ws')
  }
  const pool = new Pool({ connectionString })
  adapter = new PrismaNeon(pool as any)
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient((adapter ? { adapter, log: ['error', 'warn'] } : { log: ['error', 'warn'] }) as any)

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
