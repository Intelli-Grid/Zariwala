// lib/cloudinary.ts
// Cloudinary helper — credentials are now configured

export async function getSignedUploadParams(folder: string = 'seller_inquiries') {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary credentials not configured.')
  }

  const timestamp = Math.round(Date.now() / 1000)
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET_PHOTOS || 'sell_inquiry_photos'
  
  // Build the string to sign — must match parameters sent with upload request
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}&upload_preset=${uploadPreset}`

  const { createHash } = await import('crypto')
  const signature = createHash('sha256')
    .update(paramsToSign + apiSecret)
    .digest('hex')

  return {
    signature,
    timestamp,
    apiKey,
    cloudName,
    folder,
    uploadPreset,
  }
}

export function cloudinaryUrl(publicId: string, transforms: string | Record<string, string | number> = 'f_auto,q_auto,w_800') {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME
  if (!cloudName || !publicId) return ''
  
  let transformStr = transforms as string
  if (typeof transforms === 'object') {
    const parts = []
    if (transforms.width) parts.push(`w_${transforms.width}`)
    if (transforms.height) parts.push(`h_${transforms.height}`)
    if (transforms.crop) parts.push(`c_${transforms.crop}`)
    parts.push('f_auto,q_auto')
    transformStr = parts.join(',')
  }
  
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformStr}/${publicId}`
}
