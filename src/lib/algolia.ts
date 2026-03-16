// lib/algolia.ts
// Algolia search client — blog + product indexing
// Credentials: ACTIVE — App ID: 9PFGLKSH9R

export const BLOG_INDEX = 'vcc_blog_posts'
export const PRODUCT_INDEX = 'vcc_products'

// ─── Admin client (server-side only, for write operations) ─────────────────

function getAlgoliaAdminClient() {
  const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
  const adminKey = process.env.ALGOLIA_ADMIN_KEY

  if (!appId || !adminKey) {
    throw new Error('Algolia admin credentials not configured')
  }

  // Lazy import to avoid bundling in client
  const { algoliasearch } = require('algoliasearch')
  return algoliasearch(appId, adminKey)
}

// ─── Blog Post Indexing ─────────────────────────────────────────────────────

export async function indexBlogPost(post: {
  id: string
  title: string
  slug: string
  excerpt: string
  category?: string | null
  tags?: string[]
  publishedAt?: Date | string | null
  coverImage?: string | null
}): Promise<boolean> {
  try {
    const client = getAlgoliaAdminClient()
    await client.saveObject({
      indexName: BLOG_INDEX,
      body: {
        objectID: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        category: post.category || null,
        tags: post.tags || [],
        publishedAt: post.publishedAt
          ? new Date(post.publishedAt).getTime() / 1000
          : null,
        coverImage: post.coverImage || null,
        url: `/blog/${post.slug}`,
      },
    })
    console.log(`[Algolia] Indexed blog post: ${post.slug}`)
    return true
  } catch (err) {
    console.error('[Algolia] Blog index failed:', err)
    return false
  }
}

export async function removeBlogPostFromIndex(postId: string): Promise<boolean> {
  try {
    const client = getAlgoliaAdminClient()
    await client.deleteObject({ indexName: BLOG_INDEX, objectID: postId })
    console.log(`[Algolia] Removed blog post: ${postId}`)
    return true
  } catch (err) {
    console.error('[Algolia] Blog remove failed:', err)
    return false
  }
}

// ─── Product Indexing ───────────────────────────────────────────────────────

export interface ProductAlgoliaRecord {
  objectID: string
  sku: string
  title: string
  slug: string
  category: string
  era?: string
  origin?: string
  price: number
  isAvailable: boolean
  condition: string
  coverImage?: string
}

export async function syncProductToAlgolia(product: ProductAlgoliaRecord): Promise<boolean> {
  try {
    const client = getAlgoliaAdminClient()
    await client.saveObject({
      indexName: PRODUCT_INDEX,
      body: {
        objectID: product.objectID,
        sku: product.sku,
        title: product.title,
        slug: product.slug,
        category: product.category,
        era: product.era || null,
        origin: product.origin || null,
        price: product.price,
        isAvailable: product.isAvailable,
        condition: product.condition,
        coverImage: product.coverImage || null,
        url: `/shop/${product.slug}`,
      },
    })
    console.log(`[Algolia] Synced product: ${product.sku}`)
    return true
  } catch (err) {
    console.error('[Algolia] Product sync failed:', err)
    return false
  }
}

export async function removeProductFromAlgolia(productId: string): Promise<boolean> {
  try {
    const client = getAlgoliaAdminClient()
    await client.deleteObject({ indexName: PRODUCT_INDEX, objectID: productId })
    console.log(`[Algolia] Removed product: ${productId}`)
    return true
  } catch (err) {
    console.error('[Algolia] Product remove failed:', err)
    return false
  }
}
