import type { Metadata } from 'next'
import BlogSearchClient from './BlogSearchClient'

export const metadata: Metadata = {
  title: 'Search Articles | Zariwala',
  description: 'Search our library of vintage guides, valuation insights, and brand histories.',
}

export default function BlogSearchPage() {
  return <BlogSearchClient />
}
