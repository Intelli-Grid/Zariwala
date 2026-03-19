import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const categories = [
      { slug: 'denim', name: 'Denim & Workwear', currency: 'USD', isActive: true, sortOrder: 1 },
      { slug: 'sportswear', name: 'Retro Sports & Streetwear', currency: 'USD', isActive: true, sortOrder: 2 },
      { slug: 'designer', name: 'Archive Designer & Luxury', currency: 'USD', isActive: true, sortOrder: 3 },
      { slug: 'heritage-textiles', name: 'Silk Sarees & Heritage Weaves', currency: 'INR', priceRangeMin: 500, priceRangeMax: 150000, isActive: true, sortOrder: 4 },
      { slug: 'outerwear', name: 'Jackets & Outerwear', currency: 'USD', isActive: true, sortOrder: 5 },
      { slug: 'accessories', name: 'Bags, Scarves & Accessories', currency: 'USD', isActive: true, sortOrder: 6 },
    ]

    const results = []
    
    for (const cat of categories) {
      const res = await prisma.category.upsert({
        where: { slug: cat.slug },
        update: cat,
        create: cat,
      })
      results.push(res)
    }

    return NextResponse.json({ success: true, count: results.length, data: results })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
