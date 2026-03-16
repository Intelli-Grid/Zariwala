'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, Save, X, Check } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  priority: number
}

const EMPTY_CAT = { name: '', slug: '', description: '', priority: 0 }

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading]       = useState(true)
  const [editingId, setEditingId]   = useState<string | null>(null)
  const [editForm, setEditForm]     = useState(EMPTY_CAT)
  const [showAdd, setShowAdd]       = useState(false)

  const load = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/categories')
    if (res.ok) setCategories(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const save = async (id?: string) => {
    const isNew = !id
    const method = isNew ? 'POST' : 'PATCH'
    const url = isNew ? '/api/admin/categories' : `/api/admin/categories/${id}`

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    })

    if (res.ok) {
      setEditingId(null)
      setShowAdd(false)
      load()
    }
  }

  const deleteCat = async (id: string) => {
    if (!confirm('Area you sure you want to delete this category?')) return
    await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
    load()
  }

  const startEdit = (c: Category) => {
    setEditingId(c.id)
    setEditForm({
      name: c.name,
      slug: c.slug,
      description: c.description || '',
      priority: c.priority
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display text-[var(--color-espresso)]">Categories</h1>
          <p className="text-sm text-[var(--color-gray-500)] font-body mt-1">
            Manage the vintage categories for SEO and inquiry tags.
          </p>
        </div>
        <button
          onClick={() => { setShowAdd(true); setEditForm(EMPTY_CAT) }}
          className="btn-primary px-4 py-2 text-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[var(--color-gold)]/20 overflow-hidden">
        <table className="w-full text-left font-body text-sm">
          <thead className="bg-[var(--color-ivory-dark)]/50 text-[var(--color-espresso)]">
            <tr>
              <th className="px-6 py-4 font-medium uppercase tracking-widest text-[10px]">Name (Slug)</th>
              <th className="px-6 py-4 font-medium uppercase tracking-widest text-[10px] w-1/2">Description</th>
              <th className="px-6 py-4 font-medium uppercase tracking-widest text-[10px]">Priority (Sort)</th>
              <th className="px-6 py-4 font-medium uppercase tracking-widest text-[10px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-ivory-dark)]">
            {showAdd && (
              <tr className="bg-amber-50/30">
                <td className="px-4 py-4 space-y-2">
                  <input placeholder="Name" className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-sm outline-none" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
                  <input placeholder="slug" className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-sm outline-none" value={editForm.slug} onChange={e => setEditForm(f => ({ ...f, slug: e.target.value }))} />
                </td>
                <td className="px-4 py-4">
                  <input placeholder="SEO meta description..." className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-sm outline-none" value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} />
                </td>
                <td className="px-4 py-4">
                  <input type="number" className="w-20 bg-white border border-gray-200 rounded px-2 py-1 text-sm outline-none" value={editForm.priority} onChange={e => setEditForm(f => ({ ...f, priority: parseInt(e.target.value) || 0 }))} />
                </td>
                <td className="px-4 py-4 text-right">
                  <button onClick={() => save()} className="p-1.5 text-green-600 hover:bg-green-50 rounded"><Check className="w-4 h-4" /></button>
                  <button onClick={() => setShowAdd(false)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded ml-1"><X className="w-4 h-4" /></button>
                </td>
              </tr>
            )}

            {categories.map(cat => editingId === cat.id ? (
              <tr key={cat.id} className="bg-blue-50/30">
                <td className="px-4 py-4 space-y-2">
                  <input className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-sm outline-none" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
                  <input className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-sm outline-none" value={editForm.slug} onChange={e => setEditForm(f => ({ ...f, slug: e.target.value }))} />
                </td>
                <td className="px-4 py-4">
                  <input className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-sm outline-none" value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} />
                </td>
                <td className="px-4 py-4">
                  <input type="number" className="w-20 bg-white border border-gray-200 rounded px-2 py-1 text-sm outline-none" value={editForm.priority} onChange={e => setEditForm(f => ({ ...f, priority: parseInt(e.target.value) || 0 }))} />
                </td>
                <td className="px-4 py-4 text-right">
                  <button onClick={() => save(cat.id)} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded"><Save className="w-4 h-4" /></button>
                  <button onClick={() => setEditingId(null)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded ml-1"><X className="w-4 h-4" /></button>
                </td>
              </tr>
            ) : (
              <tr key={cat.id} className="hover:bg-[var(--color-ivory-dark)]/20 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-[var(--color-espresso)]">{cat.name}</div>
                  <div className="text-xs text-[var(--color-gray-500)] mt-0.5 font-mono bg-[var(--color-ivory-dark)] inline-block px-1.5 py-0.5 rounded">/{cat.slug}</div>
                </td>
                <td className="px-6 py-4 text-[var(--color-espresso-mid)] text-xs leading-relaxed max-w-sm">
                  {cat.description || <span className="text-gray-400 italic">No description set</span>}
                </td>
                <td className="px-6 py-4 text-[var(--color-espresso-mid)]">
                  {cat.priority}
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => startEdit(cat)} className="text-gray-400 hover:text-blue-600 p-1.5 hover:bg-blue-50 rounded transition-colors mr-1">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteCat(cat.id)} className="text-gray-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}

            {!loading && categories.length === 0 && !showAdd && (
              <tr><td colSpan={4} className="text-center py-10 text-gray-500">No categories found. Add your first category.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
