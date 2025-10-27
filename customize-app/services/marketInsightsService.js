/**
 * Market Insights Service
 * Manages market data retrieval and caching
 */

import {
  getMarketStatistics,
  getHistoricalMarketData
} from './rentcastApi'
import {
  transformMarketStatistics,
  transformHistoricalMarketData,
  getMarketInsightSummary
} from '../utils/marketDataTransformer'

const CACHE_KEY_STATS = 'market_stats'
const CACHE_KEY_HISTORICAL = 'market_historical'
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

/**
 * Get cached market data
 */
function getFromCache(key, zipCode) {
  try {
    const cached = localStorage.getItem(`${key}_${zipCode}`)
    if (cached) {
      const data = JSON.parse(cached)
      if (Date.now() - data.timestamp < CACHE_DURATION) {
        console.log(`[Market Cache Hit] ${key} for ${zipCode}`)
        return data.value
      }
      localStorage.removeItem(`${key}_${zipCode}`)
    }
  } catch (error) {
    console.error('Error reading from cache:', error)
  }
  return null
}

/**
 * Store market data in cache
 */
function setInCache(key, zipCode, data) {
  try {
    localStorage.setItem(
      `${key}_${zipCode}`,
      JSON.stringify({
        value: data,
        timestamp: Date.now()
      })
    )
  } catch (error) {
    console.error('Error writing to cache:', error)
  }
}

/**
 * Get market statistics for a zip code
 */
export async function getMarketStats(zipCode) {
  if (!zipCode) {
    throw new Error('ZIP code is required')
  }

  try {
    // Check cache first
    const cached = getFromCache(CACHE_KEY_STATS, zipCode)
    if (cached) {
      return cached
    }

    // Fetch from API
    const response = await getMarketStatistics(zipCode)
    const transformed = transformMarketStatistics(response)

    // Cache the result
    setInCache(CACHE_KEY_STATS, zipCode, transformed)

    return transformed
  } catch (error) {
    console.error(`Error fetching market stats for ${zipCode}:`, error)
    throw error
  }
}

/**
 * Get historical market data for a zip code
 */
export async function getHistoricalData(zipCode) {
  if (!zipCode) {
    throw new Error('ZIP code is required')
  }

  try {
    // Check cache first
    const cached = getFromCache(CACHE_KEY_HISTORICAL, zipCode)
    if (cached) {
      return cached
    }

    // Fetch from API
    const response = await getHistoricalMarketData(zipCode)
    const transformed = transformHistoricalMarketData(response)

    // Cache the result
    setInCache(CACHE_KEY_HISTORICAL, zipCode, transformed)

    return transformed
  } catch (error) {
    console.error(`Error fetching historical data for ${zipCode}:`, error)
    throw error
  }
}

/**
 * Get complete market insights for a zip code
 */
export async function getMarketInsights(zipCode) {
  if (!zipCode) {
    throw new Error('ZIP code is required')
  }

  try {
    const [stats, historical] = await Promise.all([
      getMarketStats(zipCode),
      getHistoricalData(zipCode).catch(() => null)
    ])

    const insights = getMarketInsightSummary(stats)

    return {
      zipCode,
      stats,
      historical,
      insights,
      lastUpdated: new Date().toISOString()
    }
  } catch (error) {
    console.error(`Error fetching market insights for ${zipCode}:`, error)
    throw error
  }
}

/**
 * Get market data for multiple zip codes
 */
export async function getMultipleMarketStats(zipCodes) {
  if (!Array.isArray(zipCodes) || zipCodes.length === 0) {
    throw new Error('At least one ZIP code is required')
  }

  try {
    const results = await Promise.allSettled(
      zipCodes.map((zipCode) => getMarketStats(zipCode))
    )

    return results.map((result, index) => ({
      zipCode: zipCodes[index],
      data: result.status === 'fulfilled' ? result.value : null,
      error: result.status === 'rejected' ? result.reason.message : null
    }))
  } catch (error) {
    console.error('Error fetching multiple market stats:', error)
    throw error
  }
}

/**
 * Clear market data cache
 */
export function clearMarketCache(zipCode = null) {
  try {
    if (zipCode) {
      localStorage.removeItem(`${CACHE_KEY_STATS}_${zipCode}`)
      localStorage.removeItem(`${CACHE_KEY_HISTORICAL}_${zipCode}`)
    } else {
      // Clear all market data
      const keys = Object.keys(localStorage)
      keys.forEach((key) => {
        if (key.startsWith(CACHE_KEY_STATS) || key.startsWith(CACHE_KEY_HISTORICAL)) {
          localStorage.removeItem(key)
        }
      })
    }
  } catch (error) {
    console.error('Error clearing cache:', error)
  }
}

/**
 * Get cache status
 */
export function getCacheStatus(zipCode) {
  try {
    const statsKey = `${CACHE_KEY_STATS}_${zipCode}`
    const historicalKey = `${CACHE_KEY_HISTORICAL}_${zipCode}`

    const statsData = localStorage.getItem(statsKey)
    const historicalData = localStorage.getItem(historicalKey)

    return {
      hasStats: !!statsData,
      hasHistorical: !!historicalData,
      statsAge: statsData ? Date.now() - JSON.parse(statsData).timestamp : null,
      historicalAge: historicalData ? Date.now() - JSON.parse(historicalData).timestamp : null
    }
  } catch (error) {
    console.error('Error getting cache status:', error)
    return {
      hasStats: false,
      hasHistorical: false,
      statsAge: null,
      historicalAge: null
    }
  }
}

const marketInsightsService = {
  getMarketStats,
  getHistoricalData,
  getMarketInsights,
  getMultipleMarketStats,
  clearMarketCache,
  getCacheStatus,
  CACHE_DURATION
}

export default marketInsightsService
