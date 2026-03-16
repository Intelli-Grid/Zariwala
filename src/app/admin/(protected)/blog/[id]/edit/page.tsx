'use client'

import { useState, useEffect, use } from 'react'
import { BlogPostForm } from '@/components/admin/BlogPostForm'

export default function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/admin/blog/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.post) {
          setPost({
            ...data.post,
            tags: Array.isArray(data.post.tags) ? data.post.tags.join(', ') : data.post.tags || '',
          })
        } else {
          setError('Post not found')
        }
        setLoading(false)
      })
      .catch(() => { setError('Failed to load post'); setLoading(false) })
  }, [id])

  if (loading) return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 w-64 bg-[var(--color-ivory-dark)] rounded" />
      <div className="h-96 bg-[var(--color-ivory-dark)] rounded-2xl" />
    </div>
  )

  if (error) return (
    <div className="text-center text-red-500 font-body py-8">{error}</div>
  )

  return <BlogPostForm mode="edit" postId={id} initialData={post} />
}
