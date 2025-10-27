/**
 * Location Integration Utility
 * Integrates location detection with property search
 */

import { formatLocation } from '../services/locationService'

/**
 * Convert address to search parameters
 */
export function addressToSearchParams(address) {
  if (!address) {
    return null
  }

  return {
    address: address.address || '',
    city: address.city || '',
    state: address.state || '',
    zipCode: address.zipCode || '',
    latitude: address.latitude,
    longitude: address.longitude
  }
}

/**
 * Validate address for search
 */
export function validateAddressForSearch(address) {
  if (!address) {
    return { valid: false, error: 'No address provided' }
  }

  // At least city and state, or zip code
  const hasCity = !!address.city
  const hasState = !!address.state
  const hasZip = !!address.zipCode

  if (!hasZip && (!hasCity || !hasState)) {
    return {
      valid: false,
      error: 'Address must include city/state or ZIP code'
    }
  }

  return { valid: true }
}

/**
 * Get search query from address
 */
export function getSearchQuery(address) {
  if (!address) {
    return ''
  }

  const parts = []

  if (address.address) {
    parts.push(address.address)
  }

  if (address.city) {
    parts.push(address.city)
  }

  if (address.state) {
    parts.push(address.state)
  }

  if (address.zipCode) {
    parts.push(address.zipCode)
  }

  return parts.join(', ')
}

/**
 * Format location for display in search
 */
export function formatLocationForDisplay(address) {
  return formatLocation(address)
}

/**
 * Get location confidence level
 */
export function getLocationConfidence(location) {
  if (!location) {
    return 'unknown'
  }

  const accuracy = location.accuracy || 0

  // Accuracy in meters
  if (accuracy < 100) {
    return 'high' // Very accurate (< 100m)
  } else if (accuracy < 500) {
    return 'medium' // Reasonable (< 500m)
  } else if (accuracy < 1000) {
    return 'low' // Approximate (< 1km)
  } else {
    return 'very_low' // Rough estimate
  }
}

/**
 * Get confidence emoji
 */
export function getConfidenceEmoji(confidence) {
  const emojiMap = {
    high: '🎯',
    medium: '✓',
    low: '~',
    very_low: '?',
    unknown: '?'
  }

  return emojiMap[confidence] || '?'
}

/**
 * Get confidence message
 */
export function getConfidenceMessage(confidence) {
  const messageMap = {
    high: 'Very accurate location',
    medium: 'Good location accuracy',
    low: 'Approximate location',
    very_low: 'Rough location estimate',
    unknown: 'Location accuracy unknown'
  }

  return messageMap[confidence] || 'Unknown accuracy'
}

/**
 * Prepare location for API call
 */
export function prepareLocationForAPI(address) {
  const validation = validateAddressForSearch(address)

  if (!validation.valid) {
    throw new Error(validation.error)
  }

  return {
    address: address.address || undefined,
    city: address.city || undefined,
    state: address.state || undefined,
    zipCode: address.zipCode || undefined
  }
}

/**
 * Merge manual address with location data
 */
export function mergeAddressWithLocation(manualAddress, locationAddress) {
  if (!locationAddress) {
    return manualAddress
  }

  if (!manualAddress) {
    return locationAddress
  }

  // Prefer manual address fields if provided, otherwise use location
  return {
    address: manualAddress.address || locationAddress.address,
    city: manualAddress.city || locationAddress.city,
    state: manualAddress.state || locationAddress.state,
    zipCode: manualAddress.zipCode || locationAddress.zipCode,
    latitude: locationAddress.latitude,
    longitude: locationAddress.longitude
  }
}

const locationIntegration = {
  addressToSearchParams,
  validateAddressForSearch,
  getSearchQuery,
  formatLocationForDisplay,
  getLocationConfidence,
  getConfidenceEmoji,
  getConfidenceMessage,
  prepareLocationForAPI,
  mergeAddressWithLocation
}

export default locationIntegration
