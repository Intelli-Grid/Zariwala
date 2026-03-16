import { NextRequest, NextResponse } from 'next/server'

const ALGOLIA_APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!
const ALGOLIA_SEARCH_KEY = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY!
const INDEX = 'vcc_blog_posts'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim()

  if (!q) {
    return NextResponse.json({ hits: [] })
  }

  if (!ALGOLIA_APP_ID || !ALGOLIA_SEARCH_KEY) {
    return NextResponse.json({ hits: [], error: 'Search not configured' }, { status: 503 })
  }

  try {
    const res = await fetch(
      `https://${ALGOLIA_APP_ID}-dsn.algolia.net/1/indexes/${INDEX}/query`,
      {
        method: 'POST',
        headers: {
          'X-Algolia-Application-Id': ALGOLIA_APP_ID,
          'X-Algolia-API-Key': ALGOLIA_SEARCH_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: q,
          hitsPerPage: 10,
          attributesToRetrieve: ['title', 'slug', 'excerpt', 'category', 'coverImage', 'publishedAt', 'url'],
          attributesToHighlight: [],
        }),
      }
    )

    if (!res.ok) {
      const err = await res.json()
      console.error('[Blog Search] Algolia error:', err)
      return NextResponse.json({ hits: [] })
    }

    const data = await res.json()
    return NextResponse.json({ hits: data.hits || [] })
  } catch (err) {
    console.error('[Blog Search] Fetch error:', err)
    return NextResponse.json({ hits: [] })
  }
}
