/**
 * RentCast API Configuration
 */

export const RENTCAST_CONFIG = {
  // API Endpoints
  API_BASE_URL: 'https://api.rentcast.io/v1',
  
  // API Key (loaded from environment)
  API_KEY: process.env.RENTCAST_API_KEY,
  
  // Cache settings
  CACHE: {
    ENABLED: true,
    DURATION_MS: 24 * 60 * 60 * 1000, // 24 hours
    MAX_ENTRIES: 1000
  },
  
  // Rate limiting
  RATE_LIMIT: {
    ENABLED: true,
    REQUESTS_PER_MINUTE: 60,
    REQUESTS_PER_HOUR: 1000
  },
  
  // Retry settings
  RETRY: {
    MAX_ATTEMPTS: 3,
    BASE_DELAY_MS: 1000,
    MAX_DELAY_MS: 10000
  },
  
  // Request timeout
  REQUEST_TIMEOUT_MS: 30000,
  
  // Search parameters
  SEARCH: {
    DEFAULT_RADIUS_MILES: 1,
    MAX_RADIUS_MILES: 5,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100
  },
  
  // Feature flags
  FEATURES: {
    COMPARABLE_PROPERTIES: true,
    MARKET_STATISTICS: true,
    HISTORICAL_DATA: true,
    PROPERTY_DETAILS: true
  }
}

/**
 * Validate configuration
 */
export function validateConfig() {
  if (!RENTCAST_CONFIG.API_KEY) {
    console.warn('[RentCast Config] RENTCAST_API_KEY environment variable is not set')
    return false
  }
  return true
}

/**
 * Get API configuration for current environment
 */
export function getApiConfig() {
  return {
    baseUrl: RENTCAST_CONFIG.API_BASE_URL,
    apiKey: RENTCAST_CONFIG.API_KEY,
    timeout: RENTCAST_CONFIG.REQUEST_TIMEOUT_MS,
    cache: RENTCAST_CONFIG.CACHE,
    retry: RENTCAST_CONFIG.RETRY
  }
}

export default RENTCAST_CONFIG
