import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true
})

export { cloudinary }

// File upload configurations
export const UPLOAD_CONFIGS = {
  images: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: {
      quality: 'auto',
      fetch_format: 'auto'
    }
  },
  audio: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedFormats: ['mp3', 'wav', 'm4a', 'aac'],
    resource_type: 'video' as const // Cloudinary uses 'video' for audio files
  },
  profileImages: {
    maxFileSize: 2 * 1024 * 1024, // 2MB
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: {
      width: 400,
      height: 400,
      crop: 'fill',
      gravity: 'face',
      quality: 'auto',
      fetch_format: 'auto'
    }
  },
  coverImages: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: {
      width: 1200,
      height: 400,
      crop: 'fill',
      quality: 'auto',
      fetch_format: 'auto'
    }
  }
}

// Helper function to validate file type
export function isValidFileType(file: File, allowedFormats: string[]): boolean {
  const fileExtension = file.name.split('.').pop()?.toLowerCase()
  return fileExtension ? allowedFormats.includes(fileExtension) : false
}

// Helper function to validate file size
export function isValidFileSize(file: File, maxSize: number): boolean {
  return file.size <= maxSize
}

// Generate upload preset folder structure
export function getUploadFolder(type: 'profile' | 'cover' | 'gallery' | 'audio', artistId: string): string {
  return `brightears/artists/${artistId}/${type}`
}

// Generate public ID for uploaded files
export function generatePublicId(type: string, artistId: string, filename: string): string {
  const timestamp = Date.now()
  const cleanFilename = filename.replace(/[^a-zA-Z0-9]/g, '_')
  return `${getUploadFolder(type as any, artistId)}/${timestamp}_${cleanFilename}`
}