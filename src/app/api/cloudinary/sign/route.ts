import { NextRequest, NextResponse } from 'next/server'
import { getSignedUploadParams } from '@/lib/cloudinary'

export async function POST(req: NextRequest) {
  try {
    // Verify origin in production
    if (process.env.NODE_ENV === 'production') {
      const origin = req.headers.get('origin')
      if (origin !== process.env.NEXT_PUBLIC_APP_URL) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    const params = await getSignedUploadParams('seller_inquiries')
    return NextResponse.json(params)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to generate upload signature' },
      { status: error.message?.includes('not configured') ? 503 : 500 }
    )
  }
}
