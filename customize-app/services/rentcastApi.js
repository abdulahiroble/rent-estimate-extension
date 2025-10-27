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

// Dedicated cache for comparable properties with metadata
const comparablePropertiesCache = new Map()
const COMPARABLE_CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

// Cache statistics
let cacheStats = {
  hits: 0,
  misses: 0,
  errors: 0
}

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
 * Get comparable rental properties with advanced filtering, sorting, and pagination
 * @param {string} address - Property address
 * @param {string} city - City name
 * @param {string} state - State abbreviation
 * @param {string} zipCode - ZIP code
 * @param {Object} options - Advanced options
 * @param {number} options.radius - Search radius in miles (default: 1, max: 5)
 * @param {string} options.propertyType - Filter by property type (e.g., 'single-family', 'multi-family', 'condo')
 * @param {string} options.sortBy - Sort field: 'price', 'distance', 'daysOnMarket' (default: 'price')
 * @param {string} options.sortOrder - Sort order: 'asc' or 'desc' (default: 'asc')
 * @param {number} options.page - Page number for pagination (default: 1)
 * @param {number} options.pageSize - Results per page (default: 20, max: 100)
 * @returns {Promise<Object>} Comparable properties data with pagination metadata
 */
export async function getComparableProperties(
  address,
  city,
  state,
  zipCode,
  options = {}
) {
  try {
    // Set defaults
    const {
      radius = 1,
      propertyType = null,
      sortBy = 'price',
      sortOrder = 'asc',
      page = 1,
      pageSize = 20
    } = options

    // Validate parameters
    if (radius < 0.1 || radius > 5) {
      const error = new Error('Radius must be between 0.1 and 5 miles')
      error.statusCode = 400
      throw error
    }
    if (pageSize < 1 || pageSize > 100) {
      const error = new Error('Page size must be between 1 and 100')
      error.statusCode = 400
      throw error
    }
    if (page < 1) {
      const error = new Error('Page must be greater than 0')
      error.statusCode = 400
      throw error
    }

    // Generate cache key
    const cacheKey = generateComparablePropertiesCacheKey(
      address,
      city,
      state,
      zipCode,
      { radius, propertyType, sortBy, sortOrder, page, pageSize }
    )

    // Check cache first
    const cachedData = getComparablePropertiesFromCache(cacheKey)
    if (cachedData) {
      return cachedData
    }

    const params = {
      radius: Math.min(radius, 5)
    }
    if (address) params.address = formatAddress(address)
    if (city) params.city = formatCity(city)
    if (state) params.state = formatState(state)
    if (zipCode) params.zipCode = formatZipCode(zipCode)

    let response
    // Use mock API if enabled
    if (USE_MOCK_API) {
      const mockData = await mockGetComparableProperties(
        params.address,
        params.city,
        params.state,
        params.zipCode,
        radius
      )
      response = mockData
    } else {
      response = await makeRequest('/avm/rent/long-term', params)
    }

    // Handle empty response
    if (!response || !response.properties || response.properties.length === 0) {
      console.warn('[RentCast API] No comparable properties found for the given criteria')
      const emptyResult = transformComparablePropertiesWithOptions(
        { properties: [] },
        {
          propertyType,
          sortBy,
          sortOrder,
          page,
          pageSize
        }
      )
      setComparablePropertiesInCache(cacheKey, emptyResult)
      return emptyResult
    }

    const result = transformComparablePropertiesWithOptions(
      response,
      {
        propertyType,
        sortBy,
        sortOrder,
        page,
        pageSize
      }
    )

    // Cache the result
    setComparablePropertiesInCache(cacheKey, result)
    return result
  } catch (error) {
    cacheStats.errors++
    console.error('[RentCast API Error] getComparableProperties:', error.message)
    
    // Return user-friendly error response
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to retrieve comparable properties',
      error: error,
      userMessage: getErrorMessage(error)
    }
  }
}

/**
 * Get user-friendly error message
 * @private
 */
function getErrorMessage(error) {
  if (error.statusCode === 400) {
    return error.message
  }
  if (error.statusCode === 404) {
    return 'No comparable properties found for this location'
  }
  if (error.statusCode === 429) {
    return 'Too many requests. Please try again later'
  }
  if (error.statusCode === 401 || error.statusCode === 403) {
    return 'Authentication error. Please check your API key'
  }
  return 'Unable to retrieve comparable properties. Please try again'
}

/**
 * Get comparable properties with advanced filtering and pagination
 * This is an enhanced version that handles all transformations client-side
 * @private
 */
function transformComparablePropertiesWithOptions(data, options) {
  if (!data || !data.properties) {
    return {
      properties: [],
      count: 0,
      totalCount: 0,
      page: options.page,
      pageSize: options.pageSize,
      totalPages: 0,
      searchRadius: options.radius || 1,
      averageRent: 0,
      medianRent: 0,
      rentRange: { min: 0, max: 0 },
      appliedFilters: {
        propertyType: options.propertyType,
        sortBy: options.sortBy,
        sortOrder: options.sortOrder
      }
    }
  }

  let properties = (data.properties || []).map(prop => ({
    address: prop.address || '',
    city: prop.city || '',
    state: prop.state || '',
    zipCode: prop.zipCode || '',
    rent: Math.round(prop.rent || 0),
    bedrooms: prop.bedrooms || null,
    bathrooms: prop.bathrooms || null,
    squareFeet: prop.squareFootage || prop.squareFeet || null,
    propertyType: prop.propertyType || 'Unknown',
    daysOnMarket: prop.daysOnMarket || null,
    listingUrl: prop.listingUrl || null,
    latitude: prop.latitude || null,
    longitude: prop.longitude || null,
    distance: prop.distance || null
  }))

  // Apply property type filter
  if (options.propertyType) {
    properties = properties.filter(
      prop => prop.propertyType.toLowerCase() === options.propertyType.toLowerCase()
    )
  }

  // Apply sorting
  properties = sortProperties(properties, options.sortBy, options.sortOrder)

  // Calculate statistics on filtered data
  const rentValues = properties.map(p => p.rent).filter(r => r > 0)
  const averageRent = rentValues.length > 0
    ? Math.round(rentValues.reduce((a, b) => a + b, 0) / rentValues.length)
    : 0
  const medianRent = rentValues.length > 0
    ? Math.round(calculateMedian(rentValues))
    : 0

  // Apply pagination
  const totalCount = properties.length
  const totalPages = Math.ceil(totalCount / options.pageSize)
  const startIndex = (options.page - 1) * options.pageSize
  const endIndex = startIndex + options.pageSize
  const paginatedProperties = properties.slice(startIndex, endIndex)

  return {
    properties: paginatedProperties,
    count: paginatedProperties.length,
    totalCount,
    page: options.page,
    pageSize: options.pageSize,
    totalPages,
    searchRadius: data.searchRadius || 1,
    averageRent,
    medianRent,
    rentRange: {
      min: rentValues.length > 0 ? Math.min(...rentValues) : 0,
      max: rentValues.length > 0 ? Math.max(...rentValues) : 0
    },
    appliedFilters: {
      propertyType: options.propertyType,
      sortBy: options.sortBy,
      sortOrder: options.sortOrder
    }
  }
}

/**
 * Sort properties by specified criteria
 * @private
 */
function sortProperties(properties, sortBy, sortOrder) {
  const sorted = [...properties]
  const isAsc = sortOrder === 'asc'

  sorted.sort((a, b) => {
    let aValue, bValue

    switch (sortBy) {
      case 'price':
        aValue = a.rent || 0
        bValue = b.rent || 0
        break
      case 'distance':
        aValue = a.distance || Infinity
        bValue = b.distance || Infinity
        break
      case 'daysOnMarket':
        aValue = a.daysOnMarket || Infinity
        bValue = b.daysOnMarket || Infinity
        break
      case 'bedrooms':
        aValue = a.bedrooms || 0
        bValue = b.bedrooms || 0
        break
      case 'bathrooms':
        aValue = a.bathrooms || 0
        bValue = b.bathrooms || 0
        break
      case 'squareFeet':
        aValue = a.squareFeet || 0
        bValue = b.squareFeet || 0
        break
      default:
        return 0
    }

    if (aValue < bValue) return isAsc ? -1 : 1
    if (aValue > bValue) return isAsc ? 1 : -1
    return 0
  })

  return sorted
}

/**
 * Calculate median value from array
 * @private
 */
function calculateMedian(values) {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2
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
 * Get comparable properties from cache
 * @private
 */
function getComparablePropertiesFromCache(key) {
  const cached = comparablePropertiesCache.get(key)
  if (cached && Date.now() - cached.timestamp < COMPARABLE_CACHE_DURATION) {
    cacheStats.hits++
    console.log(`[RentCast Cache Hit] Comparable Properties: ${key}`)
    return cached.data
  }
  comparablePropertiesCache.delete(key)
  cacheStats.misses++
  return null
}

/**
 * Store comparable properties in cache
 * @private
 */
function setComparablePropertiesInCache(key, data) {
  comparablePropertiesCache.set(key, {
    data,
    timestamp: Date.now()
  })
}

/**
 * Generate cache key for comparable properties
 * @private
 */
function generateComparablePropertiesCacheKey(address, city, state, zipCode, options) {
  return `comps:${address}:${city}:${state}:${zipCode}:${JSON.stringify(options)}`
}

/**
 * Clear all cached data
 */
export function clearCache() {
  cache.clear()
  comparablePropertiesCache.clear()
  console.log('[RentCast Cache] Cleared all cached data')
}

/**
 * Clear comparable properties cache
 */
export function clearComparablePropertiesCache() {
  comparablePropertiesCache.clear()
  console.log('[RentCast Cache] Cleared comparable properties cache')
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  return {
    size: cache.size,
    comparablePropertiesSize: comparablePropertiesCache.size,
    entries: Array.from(cache.keys()),
    comparablePropertiesEntries: Array.from(comparablePropertiesCache.keys()),
    stats: cacheStats
  }
}

/**
 * Reset cache statistics
 */
export function resetCacheStats() {
  cacheStats = {
    hits: 0,
    misses: 0,
    errors: 0
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
