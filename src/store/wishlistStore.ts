'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WishlistStore {
  items: string[]
  add: (id: string) => void
  remove: (id: string) => void
  toggle: (id: string) => void
  has: (id: string) => boolean
  clear: () => void
  count: () => number
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      add: (id) => set((s) => ({ items: [...new Set([...s.items, id])] })),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i !== id) })),
      toggle: (id) => {
        if (get().has(id)) get().remove(id)
        else get().add(id)
      },
      has: (id) => get().items.includes(id),
      clear: () => set({ items: [] }),
      count: () => get().items.length,
    }),
    { name: 'heritage-wishlist' }
  )
)
