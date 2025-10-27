/**
 * Comparable Properties with Map Component
 * Displays comparable properties in both list and map views with toggle
 */

import { useState, useCallback } from 'react'
import ComparableProperties from './ComparableProperties'
import MapView from './MapViewWrapper'

export default function ComparablePropertiesWithMap({ address, city, state, zipCode, latitude, longitude }) {
  const [viewMode, setViewMode] = useState('list') // 'list' or 'map'
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(false)

  // Handle view toggle
  const toggleView = (mode) => {
    setViewMode(mode)
  }

  // Memoized callbacks for child components
  const handlePropertiesLoad = useCallback((props) => {
    setProperties(props)
  }, [])

  const handleLoadingChange = useCallback((isLoading) => {
    setLoading(isLoading)
  }, [])

  return (
    <div className="mt-8">
      {/* View Toggle */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => toggleView('list')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            viewMode === 'list'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          📋 List View
        </button>
        <button
          onClick={() => toggleView('map')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            viewMode === 'map'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          🗺️ Map View
        </button>
      </div>

      {/* List View */}
      {viewMode === 'list' && (
        <ComparableProperties
          address={address}
          city={city}
          state={state}
          zipCode={zipCode}
          onPropertiesLoad={handlePropertiesLoad}
          onLoadingChange={handleLoadingChange}
        />
      )}

      {/* Map View */}
      {viewMode === 'map' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">🗺️ Properties Map</h2>
          <MapView
            properties={properties}
            centerLat={latitude}
            centerLng={longitude}
            loading={loading}
          />
        </div>
      )}
    </div>
  )
}
