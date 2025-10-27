/**
 * Location Detection Button Component
 * Button to detect user's current location
 */

import React, { useState, useEffect } from 'react'
import { useLocation } from '../hooks/useLocation'

export default function LocationDetectionButton({
  onLocationDetected,
  onError,
  variant = 'primary',
  showLabel = true,
  disabled = false
}) {
  const {
    loading,
    error,
    isAvailable,
    getAddressFromLocation,
    isPermissionDenied
  } = useLocation()
  const [showPermissionError, setShowPermissionError] = useState(false)

  useEffect(() => {
    if (isPermissionDenied) {
      setShowPermissionError(true)
    }
  }, [isPermissionDenied])

  const handleClick = async () => {
    try {
      setShowPermissionError(false)
      const address = await getAddressFromLocation()

      if (onLocationDetected) {
        onLocationDetected(address)
      }
    } catch (err) {
      console.error('Location detection error:', err)
      setShowPermissionError(err.code === 1) // PERMISSION_DENIED

      if (onError) {
        onError(err)
      }
    }
  }

  if (!isAvailable()) {
    return null
  }

  const buttonClasses = {
    primary: 'bg-rentestPrimary hover:bg-rentestSecondary text-white',
    secondary: 'bg-white border-2 border-rentestBorder text-rentestText hover:border-rentestPrimary',
    minimal: 'text-rentestPrimary hover:text-rentestSecondary'
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleClick}
        disabled={disabled || loading}
        className={`
          flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold
          transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
          ${buttonClasses[variant]}
        `}
      >
        {loading ? (
          <>
            <span className="animate-spin">⟳</span>
            {showLabel && 'Detecting...'}
          </>
        ) : (
          <>
            <span>📍</span>
            {showLabel && 'Use My Location'}
          </>
        )}
      </button>

      {/* Permission Error */}
      {showPermissionError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
          <p className="text-red-700 text-sm">
            <span className="font-semibold">Location access denied.</span> Please enable location
            permission in your browser settings to use this feature.
          </p>
        </div>
      )}

      {/* Other Errors */}
      {error && !showPermissionError && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded">
          <p className="text-yellow-700 text-sm">{error}</p>
        </div>
      )}
    </div>
  )
}
