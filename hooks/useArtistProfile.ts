import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'

export interface ArtistProfile {
  id: string
  stageName: string
  realName?: string
  bio?: string
  bioTh?: string
  category: string
  subCategories: string[]
  baseCity: string
  serviceAreas: string[]
  languages: string[]
  genres: string[]
  hourlyRate?: number
  minimumHours: number
  profileImage?: string
  coverImage?: string
  images: string[]
  audioSamples: string[]
  videos: string[]
  website?: string
  facebook?: string
  instagram?: string
  tiktok?: string
  youtube?: string
  spotify?: string
  soundcloud?: string
  lineId?: string
  totalCompletedBookings?: number
  averageRating?: number
  recentReviews?: any[]
}

export function useArtistProfile() {
  const { user, isLoaded } = useUser()
  const [profile, setProfile] = useState<ArtistProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch artist profile
  const fetchProfile = async () => {
    if (!user) return

    try {
      setLoading(true)
      const response = await fetch('/api/artist/profile', {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch profile')
      }

      const data = await response.json()
      setProfile(data.artist)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile')
      console.error('Error fetching artist profile:', err)
    } finally {
      setLoading(false)
    }
  }

  // Update artist profile
  const updateProfile = async (updates: Partial<ArtistProfile>) => {
    if (!user) throw new Error('User not authenticated')

    try {
      setLoading(true)
      const response = await fetch('/api/artist/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      const data = await response.json()
      setProfile(data.artist)
      setError(null)
      return data.artist
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Upload media files
  const uploadMedia = async (type: 'profile' | 'cover' | 'gallery' | 'audio', files: File[]) => {
    if (!user) throw new Error('User not authenticated')

    try {
      setLoading(true)
      
      // Convert files to base64
      const filePromises = files.map(file => {
        return new Promise<{ name: string; data: string; type: string }>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => {
            const base64 = (reader.result as string).split(',')[1]
            resolve({
              name: file.name,
              data: base64,
              type: file.type
            })
          }
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
      })

      const fileData = await Promise.all(filePromises)

      const response = await fetch('/api/artist/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          files: fileData
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to upload files')
      }

      const data = await response.json()
      setProfile(data.artist)
      setError(null)
      return data.uploadedFiles
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload files'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Delete media file
  const deleteMedia = async (type: 'profile' | 'cover' | 'gallery' | 'audio', fileUrl: string) => {
    if (!user) throw new Error('User not authenticated')

    try {
      setLoading(true)
      const response = await fetch(`/api/artist/upload?type=${type}&file=${encodeURIComponent(fileUrl)}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete file')
      }

      const data = await response.json()
      setProfile(data.artist)
      setError(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete file'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Fetch profile when user is loaded
  useEffect(() => {
    if (isLoaded && user) {
      fetchProfile()
    } else if (isLoaded && !user) {
      setLoading(false)
    }
  }, [user, isLoaded])

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    uploadMedia,
    deleteMedia,
    isAuthenticated: !!user,
  }
}