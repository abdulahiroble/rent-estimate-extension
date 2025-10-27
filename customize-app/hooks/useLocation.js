/**
 * useLocation Hook
 * Manages location detection and address retrieval
 */

import { useState, useCallback } from 'react'
import {
  getCurrentLocation,
  reverseGeocode,
  getAddressFromCurrentLocation,
  isGeolocationAvailable,
  checkLocationPermission,
  clearCachedLocation
} from '../services/locationService'

export function useLocation() {
  const [location, setLocation] = useState(null)
  const [address, setAddress] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [permissionStatus, setPermissionStatus] = useState('unknown')

  /**
   * Check location permission status
   */
  const checkPermission = useCallback(async () => {
    try {
      const status = await checkLocationPermission()
      setPermissionStatus(status)
      return status
    } catch (err) {
      console.error('Error checking permission:', err)
      return 'unknown'
    }
  }, [])

  /**
   * Get current location
   */
  const getLocation = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const loc = await getCurrentLocation()
      setLocation(loc)

      return loc
    } catch (err) {
      console.error('Error getting location:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Get address from current location
   */
  const getAddressFromLocation = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const addr = await getAddressFromCurrentLocation()
      setLocation({
        latitude: addr.latitude,
        longitude: addr.longitude,
        accuracy: addr.accuracy,
        timestamp: addr.timestamp
      })
      setAddress(addr)

      return addr
    } catch (err) {
      console.error('Error getting address:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Reverse geocode coordinates
   */
  const geocodeCoordinates = useCallback(async (latitude, longitude) => {
    try {
      setLoading(true)
      setError(null)

      const addr = await reverseGeocode(latitude, longitude)
      setLocation({ latitude, longitude, timestamp: new Date().toISOString() })
      setAddress(addr)

      return addr
    } catch (err) {
      console.error('Error geocoding coordinates:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Clear location data
   */
  const clearLocation = useCallback(() => {
    setLocation(null)
    setAddress(null)
    setError(null)
    clearCachedLocation()
  }, [])

  /**
   * Check if geolocation is available
   */
  const isAvailable = useCallback(() => {
    return isGeolocationAvailable()
  }, [])

  return {
    location,
    address,
    loading,
    error,
    permissionStatus,
    getLocation,
    getAddressFromLocation,
    geocodeCoordinates,
    clearLocation,
    checkPermission,
    isAvailable,
    // Convenience properties
    latitude: location?.latitude,
    longitude: location?.longitude,
    hasLocation: !!location,
    hasAddress: !!address,
    isPermissionGranted: permissionStatus === 'granted',
    isPermissionDenied: permissionStatus === 'denied'
  }
}

export default useLocation
