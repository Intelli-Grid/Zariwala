'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Save, ArrowLeft, Upload, Loader2, Eye } from 'lucide-react'

const CATEGORIES = [
  'Valuation Guide',
  'Brand History',
  'Authentication',
  'Market Trends',
  'Seller Tips',
  'Heritage Textiles',
  'Care & Restoration',
]

interface BlogFormData {
  title: string
  excerpt: string
  category: string
  coverImage: string
  content: string
  seoTitle: string
  seoDescription: string
  tags: string
  published: boolean
}

interface BlogPostFormProps {
  initialData?: Partial<BlogFormData>
  postId?: string
  mode: 'new' | 'edit'
}

async function uploadCoverImage(file: File): Promise<string> {
  const sigRes = await fetch('/api/cloudinary/sign', { method: 'POST' })
  if (!sigRes.ok) throw new Error('Could not get upload signature')
  const sig = await sigRes.json()

  const formData = new FormData()
  formData.append('file', file)
  formData.append('api_key', sig.apiKey)
  formData.append('timestamp', sig.timestamp.toString())
  formData.append('signature', sig.signature)
  formData.append('folder', 'blog_covers')
  formData.append('upload_preset', sig.uploadPreset)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
    { method: 'POST', body: formData }
  )
  const data = await res.json()
  if (!data.secure_url) throw new Error('Upload failed')
  return data.secure_url
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function BlogPostForm({ initialData, postId, mode }: BlogPostFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [error, setError] = useState('')
  const [previewMode, setPreviewMode] = useState(false)

  const [form, setForm] = useState<BlogFormData>({
    title: initialData?.title || '',
    excerpt: initialData?.excerpt || '',
    category: initialData?.category || '',
    coverImage: initialData?.coverImage || '',
    content: initialData?.content || '',
    seoTitle: initialData?.seoTitle || '',
    seoDescription: initialData?.seoDescription || '',
    tags: initialData?.tags || '',
    published: initialData?.published || false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true)
    try {
      const url = await uploadCoverImage(file)
      setForm(prev => ({ ...prev, coverImage: url }))
    } catch (err: any) {
      setError('Image upload failed: ' + err.message)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (publish?: boolean) => {
    setLoading(true)
    setError('')

    const payload = {
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      published: publish !== undefined ? publish : form.published,
    }

    try {
      const url = mode === 'new' ? '/api/admin/blog' : `/api/admin/blog/${postId}`
      const method = mode === 'new' ? 'POST' : 'PATCH'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save post')

      router.push('/admin/blog')
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[var(--color-ivory-dark)]">
        <div className="flex items-center gap-3">
          <Link href="/admin/blog" className="p-2 bg-white border border-[var(--color-gold)]/20 rounded-full hover:bg-[var(--color-ivory)] transition-colors">
            <ArrowLeft className="h-4 w-4 text-[var(--color-espresso)]" />
          </Link>
          <h1 className="text-2xl font-display text-[var(--color-espresso)]">
            {mode === 'new' ? 'New Blog Post' : 'Edit Blog Post'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className="btn-ghost px-4 py-2 text-sm flex items-center gap-1.5"
          >
            <Eye className="h-4 w-4" />
            {previewMode ? 'Edit' : 'Preview'}
          </button>
          <button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={loading}
            className="btn-ghost px-4 py-2 text-sm"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={loading}
            className="btn-primary flex items-center gap-2 px-5"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {form.published ? 'Update' : 'Publish'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl font-body text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--color-gold)]/10 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-gray-500)] mb-1.5 font-body">Title *</label>
              <input
                type="text"
                name="title"
                required
                value={form.title}
                onChange={handleChange}
                className="field-input w-full text-xl font-display"
                placeholder="e.g. How to Date Vintage Levi's Jeans"
              />
              {form.title && (
                <p className="text-xs text-[var(--color-gray-500)] font-body mt-1">
                  Slug: <code className="text-blue-600">{generateSlug(form.title)}</code>
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-gray-500)] mb-1.5 font-body">Excerpt *</label>
              <textarea
                name="excerpt"
                rows={2}
                required
                value={form.excerpt}
                onChange={handleChange}
                className="field-input w-full text-sm"
                placeholder="A one or two sentence summary that appears in blog listings and search results..."
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-gray-500)] font-body">Content *</label>
                <span className="text-xs text-[var(--color-gray-500)] font-body">HTML or plain text</span>
              </div>
              {previewMode ? (
                <div
                  className="prose max-w-none font-body text-[var(--color-espresso-mid)] min-h-[400px] p-4 bg-[var(--color-ivory)] rounded-xl border border-[var(--color-ivory-dark)]"
                  dangerouslySetInnerHTML={{ __html: form.content }}
                />
              ) : (
                <textarea
                  name="content"
                  rows={20}
                  required
                  value={form.content}
                  onChange={handleChange}
                  className="field-input w-full font-mono text-sm leading-relaxed"
                  placeholder="<p>Write your content here. HTML is supported.</p>&#10;&#10;<h2>Subheading</h2>&#10;<p>More content...</p>"
                />
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Status */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-[var(--color-gold)]/10 space-y-4">
            <h3 className="font-display text-base text-[var(--color-espresso)] border-b border-[var(--color-ivory-dark)] pb-2">Publication</h3>

            <div className="flex items-center gap-3 bg-[var(--color-ivory)] p-3 rounded-xl border border-[var(--color-ivory-dark)]">
              <input
                type="checkbox"
                name="published"
                id="published"
                checked={form.published}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 accent-[var(--color-gold-dark)]"
              />
              <label htmlFor="published" className="text-sm font-medium text-[var(--color-espresso)] font-body cursor-pointer">
                Publish immediately
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-gray-500)] mb-1.5 font-body">Category</label>
              <select name="category" value={form.category} onChange={handleChange} className="field-input w-full text-sm">
                <option value="">No category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-gray-500)] mb-1.5 font-body">Tags</label>
              <input
                type="text"
                name="tags"
                value={form.tags}
                onChange={handleChange}
                className="field-input w-full text-sm"
                placeholder="levis, denim, authentication"
              />
              <p className="text-xs text-[var(--color-gray-500)] font-body mt-1">Comma-separated</p>
            </div>
          </div>

          {/* Cover Image */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-[var(--color-gold)]/10 space-y-3">
            <h3 className="font-display text-base text-[var(--color-espresso)] border-b border-[var(--color-ivory-dark)] pb-2">Cover Image</h3>

            {form.coverImage && (
              <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.coverImage} alt="Cover" className="w-full h-full object-cover" />
              </div>
            )}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingImage}
              className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-[var(--color-gold)]/30 rounded-xl text-sm font-body text-[var(--color-gray-500)] hover:border-[var(--color-gold)] hover:text-[var(--color-espresso)] transition-colors"
            >
              {uploadingImage ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
              ) : (
                <><Upload className="w-4 h-4" /> Upload from Cloudinary</>
              )}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
            />

            <div>
              <input
                type="url"
                name="coverImage"
                value={form.coverImage}
                onChange={handleChange}
                className="field-input w-full text-xs"
                placeholder="Or paste an image URL..."
              />
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-[var(--color-gold)]/10 space-y-3">
            <h3 className="font-display text-base text-[var(--color-espresso)] border-b border-[var(--color-ivory-dark)] pb-2">SEO</h3>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-gray-500)] mb-1.5 font-body">SEO Title</label>
              <input
                type="text"
                name="seoTitle"
                value={form.seoTitle}
                onChange={handleChange}
                className="field-input w-full text-sm"
                placeholder="Defaults to post title"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-gray-500)] mb-1.5 font-body">Meta Description</label>
              <textarea
                name="seoDescription"
                rows={2}
                value={form.seoDescription}
                onChange={handleChange}
                className="field-input w-full text-sm"
                placeholder="Defaults to excerpt"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
