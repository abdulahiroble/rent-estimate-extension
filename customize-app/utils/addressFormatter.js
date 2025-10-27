/**
 * Address validation and formatting utilities
 */

/**
 * Validate address format
 */
export function isValidAddress(address) {
  if (!address || typeof address !== 'string') {
    return false
  }
  
  const trimmed = address.trim()
  
  // Must be at least 5 characters
  if (trimmed.length < 5) {
    return false
  }
  
  // Must contain at least one number (street number)
  if (!/\d/.test(trimmed)) {
    return false
  }
  
  return true
}

/**
 * Validate city name
 */
export function isValidCity(city) {
  if (!city || typeof city !== 'string') {
    return false
  }
  
  const trimmed = city.trim()
  
  // Must be at least 2 characters
  if (trimmed.length < 2) {
    return false
  }
  
  // Should only contain letters and spaces
  if (!/^[a-zA-Z\s'-]+$/.test(trimmed)) {
    return false
  }
  
  return true
}

/**
 * Validate state abbreviation
 */
export function isValidState(state) {
  if (!state || typeof state !== 'string') {
    return false
  }
  
  const trimmed = state.trim().toUpperCase()
  
  // Must be exactly 2 characters
  if (trimmed.length !== 2) {
    return false
  }
  
  // Must be letters only
  if (!/^[A-Z]{2}$/.test(trimmed)) {
    return false
  }
  
  // Valid US state abbreviations
  const validStates = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
    'DC', 'AS', 'GU', 'MP', 'PR', 'UM', 'VI'
  ]
  
  return validStates.includes(trimmed)
}

/**
 * Validate ZIP code
 */
export function isValidZipCode(zipCode) {
  if (!zipCode || typeof zipCode !== 'string') {
    return false
  }
  
  const trimmed = zipCode.trim()
  
  // Must be 5 digits or 5+4 format
  const zipRegex = /^\d{5}(-\d{4})?$/
  
  return zipRegex.test(trimmed)
}

/**
 * Format address for API
 */
export function formatAddress(address) {
  if (!address) return ''
  
  return address
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

/**
 * Format city for API
 */
export function formatCity(city) {
  if (!city) return ''
  
  return city
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

/**
 * Format state for API
 */
export function formatState(state) {
  if (!state) return ''
  
  return state.trim().toUpperCase()
}

/**
 * Format ZIP code for API
 */
export function formatZipCode(zipCode) {
  if (!zipCode) return ''
  
  return zipCode.trim()
}

/**
 * Parse full address string into components
 * Handles formats like: "123 Main St, New York, NY 10001"
 */
export function parseAddressString(addressString) {
  if (!addressString || typeof addressString !== 'string') {
    return null
  }
  
  const parts = addressString.split(',').map(p => p.trim())
  
  if (parts.length < 2) {
    return null
  }
  
  const address = parts[0]
  
  // Try to parse city, state, zip from remaining parts
  let city = ''
  let state = ''
  let zipCode = ''
  
  if (parts.length >= 2) {
    const lastPart = parts[parts.length - 1]
    const zipMatch = lastPart.match(/\d{5}(-\d{4})?/)
    
    if (zipMatch) {
      zipCode = zipMatch[0]
      // Extract state (usually 2 letters before zip)
      const stateMatch = lastPart.match(/([A-Z]{2})\s+\d{5}/)
      if (stateMatch) {
        state = stateMatch[1]
      }
    }
    
    // City is usually the second part
    if (parts.length >= 2) {
      city = parts[1].replace(/\s+[A-Z]{2}\s+\d{5}.*/, '').trim()
    }
  }
  
  return {
    address: formatAddress(address),
    city: formatCity(city),
    state: formatState(state),
    zipCode: formatZipCode(zipCode)
  }
}

/**
 * Validate complete address object
 * Note: ZIP code is optional - RentCast can work with address, city, state
 */
export function validateAddressObject(addressObj) {
  const errors = []
  
  if (!addressObj.address || !isValidAddress(addressObj.address)) {
    errors.push('Invalid address format')
  }
  
  if (addressObj.city && !isValidCity(addressObj.city)) {
    errors.push('Invalid city name')
  }
  
  if (addressObj.state && !isValidState(addressObj.state)) {
    errors.push('Invalid state abbreviation')
  }
  
  // ZIP code is optional, but if provided, must be valid
  if (addressObj.zipCode && addressObj.zipCode.trim() !== '' && !isValidZipCode(addressObj.zipCode)) {
    errors.push('Invalid ZIP code format')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Get user-friendly address string
 */
export function formatAddressForDisplay(address, city, state, zipCode) {
  const parts = []
  
  if (address) parts.push(address)
  if (city) parts.push(city)
  
  const stateZip = [state, zipCode].filter(Boolean).join(' ')
  if (stateZip) parts.push(stateZip)
  
  return parts.join(', ')
}
