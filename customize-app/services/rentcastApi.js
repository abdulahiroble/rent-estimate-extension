/**
 * RentCast API Service
 * Handles all API calls to RentCast for property data and rent estimates
 * API Documentation: https://developers.rentcast.io/
 * 
 * Mock API Support:
 * Set NEXT_PUBLIC_USE_MOCK_API=true to use mock data for testing
 */

import {
  formatAddress,
  formatCity,
  formatState,
  formatZipCode,
  validateAddressObject
} from '../utils/addressFormatter'
import {
  transformRentEstimate,
  transformComparableProperties,
  transformMarketStatistics,
  transformHistoricalMarketData,
  transformPropertySearch,
  transformPropertyDetails
} from '../utils/responseTransformer'
import {
  mockGetRentEstimate,
  mockGetPropertyData,
  mockGetComparableProperties,
  mockGetMarketStatistics,
  mockSearchProperties
} from './mockRentcastApi'

const API_BASE_URL = 'https://api.rentcast.io/v1'
const API_KEY = process.env.RENTCAST_API_KEY
const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true'

// Cache for API responses to reduce API calls
const cache = new Map()
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

// Log which API mode is active
if (typeof window !== 'undefined') {
  console.log(`[RentCast API] Mode: ${USE_MOCK_API ? '🧪 MOCK (Testing)' : '🔴 REAL (Production)'}`)
}

/**
 * Get cached data if it exists and hasn't expired
 */
function getFromCache(key) {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }
  cache.delete(key)
  return null
}

/**
 * Store data in cache with timestamp
 */
function setInCache(key, data) {
  cache.set(key, {
    data,
    timestamp: Date.now()
  })
}

/**
 * Make API request to RentCast
 */
async function makeRequest(endpoint, params = {}) {
  if (!API_KEY) {
    throw new Error('RENTCAST_API_KEY environment variable is not set')
  }

  const cacheKey = `${endpoint}:${JSON.stringify(params)}`
  const cachedData = getFromCache(cacheKey)
  
  if (cachedData) {
    console.log(`[RentCast Cache Hit] ${endpoint}`)
    return cachedData
  }

  try {
    const url = new URL(`${API_BASE_URL}${endpoint}`)
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key])
      }
    })

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-API-Key': API_KEY
      }
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        `RentCast API Error: ${response.status} - ${errorData.message || response.statusText}`
      )
    }

    const data = await response.json()
    setInCache(cacheKey, data)
    return data
  } catch (error) {
    console.error(`[RentCast API Error] ${endpoint}:`, error.message)
    throw error
  }
}

/**
 * Get rent estimate for a property by address
 * @param {string} address - Property address
 * @param {string} city - City name
 * @param {string} state - State abbreviation (e.g., 'NY')
 * @param {string} zipCode - ZIP code
 * @returns {Promise<Object>} Rent estimate data
 */
export async function getRentEstimate(address, city, state, zipCode) {
  // Validate and format address
  const addressObj = {
    address: formatAddress(address),
    city: formatCity(city),
    state: formatState(state),
    zipCode: formatZipCode(zipCode)
  }
  
  const validation = validateAddressObject(addressObj)
  if (!validation.isValid) {
    const error = new Error(`Invalid address: ${validation.errors.join(', ')}`)
    error.statusCode = 400
    throw error
  }

  // Use mock API if enabled
  if (USE_MOCK_API) {
    const mockData = await mockGetRentEstimate(
      addressObj.address,
      addressObj.city,
      addressObj.state,
      addressObj.zipCode
    )
    return transformRentEstimate(mockData)
  }

  const params = {}
  if (addressObj.address) params.address = addressObj.address
  if (addressObj.city) params.city = addressObj.city
  if (addressObj.state) params.state = addressObj.state
  if (addressObj.zipCode) params.zipCode = addressObj.zipCode

  const response = await makeRequest('/avm/rent/long-term', params)
  return transformRentEstimate(response)
}

/**
 * Get comparable rental properties
 * @param {string} address - Property address
 * @param {string} city - City name
 * @param {string} state - State abbreviation
 * @param {string} zipCode - ZIP code
 * @param {number} radius - Search radius in miles (default: 1)
 * @returns {Promise<Object>} Comparable properties data
 */
export async function getComparableProperties(address, city, state, zipCode, radius = 1) {
  const params = {
    radius
  }
  if (address) params.address = formatAddress(address)
  if (city) params.city = formatCity(city)
  if (state) params.state = formatState(state)
  if (zipCode) params.zipCode = formatZipCode(zipCode)

  const response = await makeRequest('/avm/rent/long-term', params)
  return transformComparableProperties(response)
}

/**
 * Get market statistics for a zip code
 * @param {string} zipCode - ZIP code
 * @returns {Promise<Object>} Market statistics
 */
export async function getMarketStatistics(zipCode) {
  // Use mock API if enabled
  if (USE_MOCK_API) {
    const mockData = await mockGetMarketStatistics(zipCode)
    return transformMarketStatistics(mockData)
  }

  const response = await makeRequest('/markets/statistics', {
    zipCode: formatZipCode(zipCode)
  })
  return transformMarketStatistics(response)
}

/**
 * Get historical market data for a zip code
 * @param {string} zipCode - ZIP code
 * @returns {Promise<Object>} Historical market data
 */
export async function getHistoricalMarketData(zipCode) {
  // Use mock API if enabled
  if (USE_MOCK_API) {
    const mockData = await mockGetMarketStatistics(zipCode)
    return transformHistoricalMarketData(mockData)
  }

  const response = await makeRequest('/markets/historical', {
    zipCode: formatZipCode(zipCode)
  })
  return transformHistoricalMarketData(response)
}

/**
 * Search for properties by criteria
 * @param {Object} criteria - Search criteria (address, city, state, zipCode, etc.)
 * @returns {Promise<Object>} Property search results
 */
export async function searchProperties(criteria) {
  const params = { ...criteria }
  
  if (params.address) params.address = formatAddress(params.address)
  if (params.city) params.city = formatCity(params.city)
  if (params.state) params.state = formatState(params.state)
  if (params.zipCode) params.zipCode = formatZipCode(params.zipCode)

  const response = await makeRequest('/properties/search', params)
  return transformPropertySearch(response)
}

/**
 * Get property details by address
 * @param {string} address - Property address
 * @param {string} city - City name
 * @param {string} state - State abbreviation
 * @param {string} zipCode - ZIP code
 * @returns {Promise<Object>} Property details
 */
export async function getPropertyDetails(address, city, state, zipCode) {
  // Use mock API if enabled
  if (USE_MOCK_API) {
    const mockData = await mockGetPropertyData(address, city, state, zipCode)
    return transformPropertyDetails(mockData)
  }

  const params = {}
  if (address) params.address = formatAddress(address)
  if (city) params.city = formatCity(city)
  if (state) params.state = formatState(state)
  if (zipCode) params.zipCode = formatZipCode(zipCode)

  const response = await makeRequest('/properties', params)
  return transformPropertyDetails(response)
}

/**
 * Clear all cached data
 */
export function clearCache() {
  cache.clear()
  console.log('[RentCast Cache] Cleared all cached data')
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  return {
    size: cache.size,
    entries: Array.from(cache.keys())
  }
}

const rentcastApi = {
  getRentEstimate,
  getComparableProperties,
  getMarketStatistics,
  getHistoricalMarketData,
  searchProperties,
  getPropertyDetails,
  clearCache,
  getCacheStats
}

export default rentcastApi
