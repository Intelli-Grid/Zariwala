// Stub route — the sell form now posts to /api/inquiry
// This route is kept to prevent 404s from any old client-side references
import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    { error: 'Please use /api/inquiry instead' },
    { status: 301 }
  )
}
