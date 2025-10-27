/**
 * Location Status Component
 * Displays current location status and information
 */

import React from 'react'
import { formatLocation } from '../services/locationService'

export default function LocationStatus({
  location,
  address,
  loading,
  error,
  onClear
}) {
  if (loading) {
    return (
      <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded flex items-center gap-2">
        <span className="animate-spin">⟳</span>
        <p className="text-blue-700 text-sm">Detecting your location...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
        <p className="text-red-700 text-sm font-semibold">Error</p>
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    )
  }

  if (!location || !address) {
    return null
  }

  const displayAddress = formatLocation(address)
  const accuracy = location.accuracy ? Math.round(location.accuracy) : null

  return (
    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded space-y-2">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-green-700 text-sm font-semibold flex items-center gap-2">
            <span>✓</span> Location Detected
          </p>
          <p className="text-green-600 text-sm mt-1">{displayAddress}</p>

          {accuracy && (
            <p className="text-green-600 text-xs mt-1 opacity-75">
              Accuracy: ±{accuracy}m
            </p>
          )}

          {location.cached && (
            <p className="text-green-600 text-xs mt-1 opacity-75">
              (Cached location)
            </p>
          )}
        </div>

        {onClear && (
          <button
            onClick={onClear}
            className="text-green-600 hover:text-green-700 text-sm font-semibold ml-2"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}
