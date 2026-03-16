// /api/search — product search via Algolia
// Used by the product gallery/shop search interface

import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('q') ?? ''
  const category = searchParams.get('category')
  const page = parseInt(searchParams.get('page') ?? '0', 10)

  if (!query.trim()) return NextResponse.json({ hits: [], nbHits: 0 })

  const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
  const searchKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY
  const indexName = process.env.ALGOLIA_PRODUCT_INDEX ?? 'vcc_products'

  if (!appId || !searchKey) {
    return NextResponse.json({ hits: [], nbHits: 0, error: 'Algolia not configured' })
  }

  try {
    const filters = [
      'isAvailable:true',
      category ? `category:${category}` : null,
    ].filter(Boolean).join(' AND ')

    const res = await fetch(
      `https://${appId}-dsn.algolia.net/1/indexes/${indexName}/query`,
      {
        method: 'POST',
        headers: {
          'X-Algolia-API-Key': searchKey,
          'X-Algolia-Application-Id': appId,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          hitsPerPage: 30,
          page,
          filters: filters || undefined,
          attributesToRetrieve: [
            'objectID', 'slug', 'sku', 'title', 'category',
            'era', 'origin', 'price', 'isAvailable', 'condition', 'coverImage',
          ],
        }),
      }
    )

    const data = await res.json()
    return NextResponse.json({
      hits: data.hits ?? [],
      nbHits: data.nbHits ?? 0,
      nbPages: data.nbPages ?? 0,
    })
  } catch (err) {
    console.error('[Algolia] Product search error:', err)
    return NextResponse.json({ hits: [], nbHits: 0 })
  }
}
