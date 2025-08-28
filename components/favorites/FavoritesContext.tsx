'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useUser } from '@clerk/nextjs'
import { apiFetch } from '@/lib/api'

interface FavoritesContextType {
  favorites: string[] // Array of artist IDs
  isFavorite: (artistId: string) => boolean
  addToFavorites: (artistId: string) => Promise<boolean>
  removeFromFavorites: (artistId: string) => Promise<boolean>
  toggleFavorite: (artistId: string) => Promise<boolean>
  isLoading: boolean
  refreshFavorites: () => Promise<void>
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

interface FavoritesProviderProps {
  children: ReactNode
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [favorites, setFavorites] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { user, isLoaded } = useUser()

  // Load favorites when user logs in
  const refreshFavorites = async () => {
    if (!isLoaded || !user) {
      setFavorites([])
      return
    }

    setIsLoading(true)
    try {
      const response = await apiFetch('/api/favorites')
      if (response.ok) {
        const data = await response.json()
        const favoriteIds = data.favorites.map((artist: any) => artist.id)
        setFavorites(favoriteIds)
      }
    } catch (error) {
      console.error('Error loading favorites:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Load favorites on mount and when user changes
  useEffect(() => {
    refreshFavorites()
  }, [user, isLoaded])

  const isFavorite = (artistId: string): boolean => {
    return favorites.includes(artistId)
  }

  const addToFavorites = async (artistId: string): Promise<boolean> => {
    if (!isLoaded || !user) {
      return false
    }

    try {
      const response = await apiFetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ artistId }),
      })

      if (response.ok) {
        setFavorites(prev => [...prev, artistId])
        return true
      }
      return false
    } catch (error) {
      console.error('Error adding to favorites:', error)
      return false
    }
  }

  const removeFromFavorites = async (artistId: string): Promise<boolean> => {
    if (!isLoaded || !user) {
      return false
    }

    try {
      const response = await apiFetch(`/api/favorites?artistId=${artistId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setFavorites(prev => prev.filter(id => id !== artistId))
        return true
      }
      return false
    } catch (error) {
      console.error('Error removing from favorites:', error)
      return false
    }
  }

  const toggleFavorite = async (artistId: string): Promise<boolean> => {
    if (isFavorite(artistId)) {
      return await removeFromFavorites(artistId)
    } else {
      return await addToFavorites(artistId)
    }
  }

  const value: FavoritesContextType = {
    favorites,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isLoading,
    refreshFavorites,
  }

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}