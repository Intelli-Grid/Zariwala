require('dotenv').config({ path: '.env.local' });
const { Pool } = require('@neondatabase/serverless');
const ws = require('ws');

// Neon needs WebSocket for Node environments
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  webSocketConstructor: ws
});

async function run() {
  try {
    const categories = [
      { id: '1', slug: 'denim', name: 'Denim & Workwear', currency: 'USD', isActive: true, sortOrder: 1, createdAt: new Date(), updatedAt: new Date(), priority: 0 },
      { id: '2', slug: 'sportswear', name: 'Retro Sports & Streetwear', currency: 'USD', isActive: true, sortOrder: 2, createdAt: new Date(), updatedAt: new Date(), priority: 0 },
      { id: '3', slug: 'designer', name: 'Archive Designer & Luxury', currency: 'USD', isActive: true, sortOrder: 3, createdAt: new Date(), updatedAt: new Date(), priority: 0 },
      { id: '4', slug: 'heritage-textiles', name: 'Silk Sarees & Heritage Weaves', currency: 'INR', priceRangeMin: 500, priceRangeMax: 150000, isActive: true, sortOrder: 4, createdAt: new Date(), updatedAt: new Date(), priority: 0 },
      { id: '5', slug: 'outerwear', name: 'Jackets & Outerwear', currency: 'USD', isActive: true, sortOrder: 5, createdAt: new Date(), updatedAt: new Date(), priority: 0 },
      { id: '6', slug: 'accessories', name: 'Bags, Scarves & Accessories', currency: 'USD', isActive: true, sortOrder: 6, createdAt: new Date(), updatedAt: new Date(), priority: 0 },
    ];
    
    for (const cat of categories) {
      console.log('Inserting: ', cat.slug);
      await pool.query(`
        INSERT INTO "Category" (id, slug, name, currency, "isActive", "sortOrder", "priceRangeMin", "priceRangeMax", "createdAt", "updatedAt", priority)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (slug) DO UPDATE SET 
          name = EXCLUDED.name,
          currency = EXCLUDED.currency,
          "isActive" = EXCLUDED."isActive",
          "sortOrder" = EXCLUDED."sortOrder",
          "priceRangeMin" = EXCLUDED."priceRangeMin",
          "priceRangeMax" = EXCLUDED."priceRangeMax",
          "updatedAt" = EXCLUDED."updatedAt"
    for (const cat of categories) {
      console.log('Inserting: ', cat.slug);
      await pool.query(`
        INSERT INTO "Category" (id, slug, name, currency, "isActive", "sortOrder", "priceRangeMin", "priceRangeMax", "createdAt", "updatedAt", priority)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (slug) DO UPDATE SET 
          name = EXCLUDED.name,
          currency = EXCLUDED.currency,
          "isActive" = EXCLUDED."isActive",
          "sortOrder" = EXCLUDED."sortOrder",
          "priceRangeMin" = EXCLUDED."priceRangeMin",
          "priceRangeMax" = EXCLUDED."priceRangeMax",
          "updatedAt" = EXCLUDED."updatedAt"
      `, [
        cat.id, cat.slug, cat.name, cat.currency, cat.isActive, cat.sortOrder, cat.priceRangeMin || null, cat.priceRangeMax || null, cat.createdAt, cat.updatedAt, cat.priority
      ]);
    }
    
    // Seed Admin User
    const bcrypt = require('bcryptjs');
    const email = 'admin@vintage.com';
    const existingAdmin = await pool.query(`SELECT id FROM "AdminUser" WHERE email = $1`, [email]);
    if (existingAdmin.rowCount === 0) {
      const hash = await bcrypt.hash('ChangeMe123!', 12);
      await pool.query(`
        INSERT INTO "AdminUser" (id, email, name, "passwordHash", "createdAt")
        VALUES ($1, $2, $3, $4, $5)
      `, ['admin-seed', email, 'Admin', hash, new Date()]);
      console.log('Admin user seeded (admin@vintage.com / ChangeMe123!)');
    } else {
      console.log('Admin user already exists.');
    }

    console.log('Categories seeded successfully directly to Neon!');
  } catch (e) {
    console.error('Failed to seed', e);
  } finally {
    await pool.end();
  }
}

run();
