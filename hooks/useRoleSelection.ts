'use client'

import { useState, useEffect } from 'react'

interface RoleSelectionData {
  role: 'customer' | 'artist'
  timestamp: string
  expiry: string
}

/**
 * Hook to manage role selection modal visibility
 * Checks localStorage to determine if user has already selected a role
 * Returns modal state and control functions
 */
export function useRoleSelection() {
  const [shouldShowModal, setShouldShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    // Add a small delay to avoid flash on initial page load
    const timer = setTimeout(() => {
      const storedData = localStorage.getItem('brightears_role_selected')

      if (!storedData) {
        // No previous selection - show modal
        setShouldShowModal(true)
        setIsLoading(false)
        return
      }

      try {
        const data: RoleSelectionData = JSON.parse(storedData)
        const expiryDate = new Date(data.expiry)
        const now = new Date()

        if (now > expiryDate) {
          // Selection expired - show modal again
          localStorage.removeItem('brightears_role_selected')
          setShouldShowModal(true)
        } else {
          // Valid selection exists - don't show modal
          setShouldShowModal(false)
        }
      } catch (error) {
        // Invalid data - clear and show modal
        localStorage.removeItem('brightears_role_selected')
        setShouldShowModal(true)
      }

      setIsLoading(false)
    }, 1500) // 1.5 second delay to let hero load first

    return () => clearTimeout(timer)
  }, [])

  const hideModal = () => {
    setShouldShowModal(false)
  }

  const resetSelection = () => {
    localStorage.removeItem('brightears_role_selected')
    setShouldShowModal(true)
  }

  return {
    shouldShowModal,
    isLoading,
    hideModal,
    resetSelection
  }
}
