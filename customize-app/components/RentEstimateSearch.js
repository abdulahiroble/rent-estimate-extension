/**
 * Rent Estimate Search Component
 * Form for searching rent estimates by address
 */

import React, { useState } from 'react'
import { parseAddressString } from '../utils/addressFormatter'

export default function RentEstimateSearch({ onSearch, loading }) {
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!address.trim()) {
      setError('Please enter a street address')
      return
    }

    onSearch({
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      zipCode: zipCode.trim()
    })
  }

  const handleAddressChange = (e) => {
    const value = e.target.value
    setAddress(value)

    // Try to parse full address if comma-separated
    if (value.includes(',')) {
      const parsed = parseAddressString(value)
      if (parsed) {
        setAddress(parsed.address)
        setCity(parsed.city)
        setState(parsed.state)
        setZipCode(parsed.zipCode)
      }
    }
  }

  const handleUseCurrentLocation = async () => {
    setError('')
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      return
    }

    try {
      // Show loading state
      setError('Getting your location...')
      
      // Get current position
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        })
      })

      const { latitude, longitude } = position.coords
      
      // Reverse geocode to get address (using a mock service for now)
      // In production, you'd use a real geocoding service
      const mockAddress = await reverseGeocodeMock(latitude, longitude)
      
      // Fill form with location data
      setAddress(mockAddress.address)
      setCity(mockAddress.city)
      setState(mockAddress.state)
      setZipCode(mockAddress.zipCode)
      setError('')
      
    } catch (error) {
      let errorMessage = 'Unable to get your location'
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Location access denied. Please enable location permissions.'
          break
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location information is unavailable.'
          break
        case error.TIMEOUT:
          errorMessage = 'Location request timed out. Please try again.'
          break
        default:
          errorMessage = 'An unknown error occurred while getting your location.'
          break
      }
      
      setError(errorMessage)
    }
  }

  // Mock reverse geocoding function (replace with real service in production)
  const reverseGeocodeMock = async (lat, lon) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Return mock address based on coordinates
    // In production, use a real geocoding API like Google Maps, Mapbox, etc.
    return {
      address: 'Current Location',
      city: 'Your City',
      state: 'XX',
      zipCode: '00000'
    }
  }

  return (
    <div className="bg-rentestBgLight rounded-lg p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-rentestPrimary mb-4">Search Rent Estimate</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Street Address */}
        <div>
          <label className="block text-rentestText text-sm font-semibold mb-2">
            Street Address *
          </label>
          <input
            type="text"
            value={address}
            onChange={handleAddressChange}
            placeholder="e.g., 123 Main Street"
            className="w-full border-2 border-rentestBorder rounded-lg py-2 px-3 text-rentestText focus:border-rentestPrimary focus:outline-none transition-colors"
            disabled={loading}
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-rentestText text-sm font-semibold mb-2">City</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g., New York"
            className="w-full border-2 border-rentestBorder rounded-lg py-2 px-3 text-rentestText focus:border-rentestPrimary focus:outline-none transition-colors"
            disabled={loading}
          />
        </div>

        {/* State and ZIP */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-rentestText text-sm font-semibold mb-2">State</label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value.toUpperCase())}
              placeholder="NY"
              maxLength="2"
              className="w-full border-2 border-rentestBorder rounded-lg py-2 px-3 text-rentestText focus:border-rentestPrimary focus:outline-none transition-colors uppercase"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-rentestText text-sm font-semibold mb-2">ZIP Code</label>
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="10001"
              className="w-full border-2 border-rentestBorder rounded-lg py-2 px-3 text-rentestText focus:border-rentestPrimary focus:outline-none transition-colors"
              disabled={loading}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Current Location Button */}
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={loading}
          className="w-full bg-rentestAccent hover:bg-blue-500 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          <span className="flex items-center justify-center">
            <span className="mr-2">📍</span>
            Use Current Location
          </span>
        </button>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-rentestPrimary hover:bg-rentestSecondary disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-colors"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <span className="animate-spin mr-2">⏳</span>
              Searching...
            </span>
          ) : (
            <span>🔍 Get Rent Estimate</span>
          )}
        </button>

        {/* Help Text */}
        <p className="text-rentestText text-xs text-center">
          Enter at least a street address. City, state, and ZIP are optional.
        </p>
      </form>
    </div>
  )
}
