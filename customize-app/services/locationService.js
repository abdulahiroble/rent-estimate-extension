/**
 * Location Service
 * Handles geolocation and reverse geocoding
 */

const CACHE_KEY = 'last_known_location'
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour

/**
 * Get current location using browser Geolocation API
 */
export async function getCurrentLocation(options = {}) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'))
      return
    }

    const defaultOptions = {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 0,
      ...options
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords
        const location = {
          latitude,
          longitude,
          accuracy,
          timestamp: new Date().toISOString()
        }

        // Cache the location
        cacheLocation(location)

        resolve(location)
      },
      (error) => {
        // Try to use cached location on error
        const cached = getCachedLocation()
        if (cached) {
          resolve(cached)
          return
        }

        reject(formatGeolocationError(error))
      },
      defaultOptions
    )
  })
}

/**
 * Format geolocation error messages
 */
function formatGeolocationError(error) {
  let message = 'Unable to get location'

  switch (error.code) {
    case error.PERMISSION_DENIED:
      message = 'Location permission denied. Please enable location access in your browser settings.'
      break
    case error.POSITION_UNAVAILABLE:
      message = 'Location information is unavailable.'
      break
    case error.TIMEOUT:
      message = 'Location request timed out. Please try again.'
      break
    default:
      message = error.message || 'An error occurred while getting your location.'
  }

  const err = new Error(message)
  err.code = error.code
  return err
}

/**
 * Reverse geocode coordinates to address
 */
export async function reverseGeocode(latitude, longitude) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Reverse geocoding failed')
    }

    const data = await response.json()

    return {
      address: data.address?.road || data.address?.street || '',
      city: data.address?.city || data.address?.town || data.address?.village || '',
      state: data.address?.state || '',
      zipCode: data.address?.postcode || '',
      country: data.address?.country || '',
      displayName: data.display_name || '',
      latitude,
      longitude
    }
  } catch (error) {
    console.error('Reverse geocoding error:', error)
    throw new Error('Unable to determine address from coordinates')
  }
}

/**
 * Get address from current location
 */
export async function getAddressFromCurrentLocation(options = {}) {
  try {
    const location = await getCurrentLocation(options)
    const address = await reverseGeocode(location.latitude, location.longitude)

    return {
      ...location,
      ...address
    }
  } catch (error) {
    console.error('Error getting address from location:', error)
    throw error
  }
}

/**
 * Cache location in localStorage
 */
function cacheLocation(location) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        ...location,
        cachedAt: new Date().toISOString()
      })
    )
  } catch (error) {
    console.error('Error caching location:', error)
  }
}

/**
 * Get cached location if still valid
 */
function getCachedLocation() {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (!cached) {
      return null
    }

    const data = JSON.parse(cached)
    const age = Date.now() - new Date(data.cachedAt).getTime()

    if (age > CACHE_DURATION) {
      localStorage.removeItem(CACHE_KEY)
      return null
    }

    return {
      latitude: data.latitude,
      longitude: data.longitude,
      accuracy: data.accuracy,
      timestamp: data.timestamp,
      cached: true
    }
  } catch (error) {
    console.error('Error reading cached location:', error)
    return null
  }
}

/**
 * Clear cached location
 */
export function clearCachedLocation() {
  try {
    localStorage.removeItem(CACHE_KEY)
  } catch (error) {
    console.error('Error clearing cached location:', error)
  }
}

/**
 * Check if geolocation is available
 */
export function isGeolocationAvailable() {
  return !!navigator.geolocation
}

/**
 * Check if location permission is granted
 */
export async function checkLocationPermission() {
  try {
    if (!navigator.permissions) {
      return 'unknown'
    }

    const result = await navigator.permissions.query({ name: 'geolocation' })
    return result.state // 'granted', 'denied', or 'prompt'
  } catch (error) {
    console.error('Error checking location permission:', error)
    return 'unknown'
  }
}

/**
 * Calculate distance between two coordinates (in miles)
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 3959 // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * Format location for display
 */
export function formatLocation(address) {
  if (!address) {
    return ''
  }

  const parts = []
  if (address.address) parts.push(address.address)
  if (address.city) parts.push(address.city)
  if (address.state) parts.push(address.state)
  if (address.zipCode) parts.push(address.zipCode)

  return parts.join(', ')
}

const locationService = {
  getCurrentLocation,
  reverseGeocode,
  getAddressFromCurrentLocation,
  clearCachedLocation,
  isGeolocationAvailable,
  checkLocationPermission,
  calculateDistance,
  formatLocation,
  CACHE_DURATION
}

export default locationService
