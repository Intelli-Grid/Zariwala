import { getSignedUploadParams } from '@/lib/cloudinary'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const preset = searchParams.get('preset') ?? 'sell_inquiry_photos'

  const folderMap: Record<string, string> = {
    sell_inquiry_photos: 'sell-inquiries',
    product_gallery:     'products',
  }

  const folder = folderMap[preset] ?? 'misc'

  try {
    const params = await getSignedUploadParams(folder)
    return NextResponse.json(params)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 503 })
  }
}

