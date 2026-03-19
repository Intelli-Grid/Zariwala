'use client'

import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import Link from 'next/link'

const COLUMNS = [
  { id: 'NEW', title: 'New' },
  { id: 'IN_REVIEW', title: 'In Review' },
  { id: 'OFFER_SENT', title: 'Offer Sent' },
  { id: 'ACCEPTED', title: 'Accepted' },
  { id: 'COMPLETED', title: 'Completed' },
]

const STATUS_COLORS: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-700 border-blue-200',
  IN_REVIEW: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  OFFER_SENT: 'bg-purple-100 text-purple-700 border-purple-200',
  ACCEPTED: 'bg-green-100 text-green-700 border-green-200',
  COMPLETED: 'bg-gray-100 text-gray-700 border-gray-200',
}

export default function KanbanBoard({ initialInquiries }: { initialInquiries: any[] }) {
  const [data, setData] = useState(initialInquiries)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    // Find inquiry being moved
    const itemToMove = data.find(i => i.id === draggableId)
    if (!itemToMove) return

    const newStatus = destination.droppableId

    // Optimistic UI update
    const newData = Array.from(data)
    const index = newData.findIndex(i => i.id === draggableId)
    newData[index] = { ...newData[index], status: newStatus }
    setData(newData)

    // Call API to persist
    try {
      const res = await fetch(`/api/admin/inquiries/${draggableId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) {
        throw new Error('Failed to update status')
      }
    } catch (e) {
      console.error(e)
      // Revert on failure
      setData(initialInquiries)
    }
  }

  if (!isMounted) return null // avoid hydration mismatch for dnd

  // Group by status
  const grouped = COLUMNS.reduce((acc, col) => {
    acc[col.id] = data.filter(i => {
      // Map legacy/edge statuses into columns if necessary, but ideally strict match
      if (col.id === 'IN_REVIEW' && i.status === 'REVIEWING') return true
      return i.status === col.id
    })
    return acc
  }, {} as Record<string, any[]>)

  return (
    <div className="flex gap-6 overflow-x-auto pb-6 h-full min-h-[70vh]">
      <DragDropContext onDragEnd={onDragEnd}>
        {COLUMNS.map(col => (
          <div key={col.id} className="flex-1 min-w-[300px] flex flex-col bg-[var(--color-ivory)] rounded-2xl border border-[var(--color-gold)]/10">
            <div className="p-4 border-b border-[var(--color-ivory-dark)] flex items-center justify-between">
              <h3 className="font-display text-lg text-[var(--color-espresso)]">{col.title}</h3>
              <span className="font-body text-xs text-[var(--color-gray-500)] bg-white px-2 py-1 rounded-full shadow-sm">
                {grouped[col.id].length}
              </span>
            </div>

            <Droppable droppableId={col.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex-1 p-3 overflow-y-auto transition-colors ${snapshot.isDraggingOver ? 'bg-[var(--color-gold)]/5' : ''}`}
                >
                  {grouped[col.id].map((inquiry, index) => (
                    <Draggable key={inquiry.id} draggableId={inquiry.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`mb-3 bg-white p-4 rounded-xl border transition-shadow shadow-sm ${snapshot.isDragging ? 'shadow-lg border-[var(--color-gold)] scale-[1.02] z-50' : 'border-[var(--color-ivory-dark)] hover:border-[var(--color-gold)]/30'}`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-mono text-xs text-[var(--color-gray-500)]">{inquiry.reference}</span>
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${STATUS_COLORS[col.id]}`}>
                              {col.title}
                            </span>
                          </div>
                          <h4 className="font-body font-bold text-[var(--color-espresso)] mb-1">{inquiry.sellerName}</h4>
                          <p className="font-body text-xs text-[var(--color-gray-500)] truncate mb-3">
                            {(inquiry.category || (inquiry.categories && inquiry.categories[0]) || 'No Category')}
                          </p>
                          <div className="flex justify-between items-center mt-3 pt-3 border-t border-[var(--color-ivory-dark)]">
                            <span className="font-body text-[10px] text-[var(--color-gray-400)]">
                              {new Date(inquiry.createdAt).toLocaleDateString()}
                            </span>
                            <Link
                              href={`/admin/inquiries/${inquiry.id}`}
                              className="text-xs font-body font-semibold text-[var(--color-gold-dark)] hover:text-[var(--color-espresso)]"
                            >
                              Review →
                            </Link>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </DragDropContext>
    </div>
  )
}
