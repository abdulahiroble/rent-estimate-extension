/**
 * Tiered Cache Service
 * Implements aggressive caching with user-tier-based TTL
 * - Free tier: 7 days (604,800,000 ms)
 * - Premium tier: 30 days (2,592,000,000 ms)
 * 
 * This service reduces API calls and operational costs by caching
 * responses longer for premium users while maintaining reasonable
 * freshness for free tier users.
 */

// Cache TTL constants (in milliseconds)
const CACHE_TTL = {
  FREE: 7 * 24 * 60 * 60 * 1000,      // 7 days
  PREMIUM: 30 * 24 * 60 * 60 * 1000,  // 30 days
  DEFAULT: 24 * 60 * 60 * 1000        // 24 hours (fallback)
}

// Main cache stores
const rentEstimateCache = new Map()
const comparablePropertiesCache = new Map()
const marketStatisticsCache = new Map()
const propertyDetailsCache = new Map()

// Cache metadata for analytics
const cacheMetadata = {
  rentEstimate: { hits: 0, misses: 0, evictions: 0 },
  comparableProperties: { hits: 0, misses: 0, evictions: 0 },
  marketStatistics: { hits: 0, misses: 0, evictions: 0 },
  propertyDetails: { hits: 0, misses: 0, evictions: 0 }
}

// User tier tracking (will be populated from payment service)
let currentUserTier = 'free'

/**
 * Set the current user tier (free or premium)
 * Called from payment/subscription service
 */
export function setUserTier(tier) {
  if (tier !== 'free' && tier !== 'premium') {
    console.warn(`[Tiered Cache] Invalid tier: ${tier}, defaulting to 'free'`)
    currentUserTier = 'free'
    return
  }
  currentUserTier = tier
  console.log(`[Tiered Cache] User tier set to: ${tier}`)
}

/**
 * Get the current user tier
 */
export function getUserTier() {
  return currentUserTier
}

/**
 * Get TTL for current user tier
 */
function getTTLForCurrentUser() {
  return currentUserTier === 'premium' ? CACHE_TTL.PREMIUM : CACHE_TTL.FREE
}

/**
 * Check if cache entry is still valid
 */
function isCacheValid(timestamp, ttl) {
  return Date.now() - timestamp < ttl
}

/**
 * Get from cache with TTL validation
 */
function getFromCache(cacheMap, key, cacheType) {
  const entry = cacheMap.get(key)
  
  if (!entry) {
    cacheMetadata[cacheType].misses++
    return null
  }

  const ttl = entry.userTier === 'premium' ? CACHE_TTL.PREMIUM : CACHE_TTL.FREE
  
  if (isCacheValid(entry.timestamp, ttl)) {
    cacheMetadata[cacheType].hits++
    console.log(`[Tiered Cache Hit] ${cacheType}: ${key}`)
    return entry.data
  }

  // Cache expired, remove it
  cacheMap.delete(key)
  cacheMetadata[cacheType].evictions++
  cacheMetadata[cacheType].misses++
  return null
}

/**
 * Store in cache with user tier metadata
 */
function setInCache(cacheMap, key, data, cacheType) {
  cacheMap.set(key, {
    data,
    timestamp: Date.now(),
    userTier: currentUserTier,
    ttl: getTTLForCurrentUser()
  })
  console.log(`[Tiered Cache Set] ${cacheType}: ${key} (TTL: ${currentUserTier === 'premium' ? '30 days' : '7 days'})`)
}

/**
 * Rent Estimate Cache Operations
 */
export function getRentEstimateFromCache(key) {
  return getFromCache(rentEstimateCache, key, 'rentEstimate')
}

export function setRentEstimateInCache(key, data) {
  setInCache(rentEstimateCache, key, data, 'rentEstimate')
}

export function clearRentEstimateCache() {
  rentEstimateCache.clear()
  cacheMetadata.rentEstimate = { hits: 0, misses: 0, evictions: 0 }
  console.log('[Tiered Cache] Cleared rent estimate cache')
}

/**
 * Comparable Properties Cache Operations
 */
export function getComparablePropertiesFromCache(key) {
  return getFromCache(comparablePropertiesCache, key, 'comparableProperties')
}

export function setComparablePropertiesInCache(key, data) {
  setInCache(comparablePropertiesCache, key, data, 'comparableProperties')
}

export function clearComparablePropertiesCache() {
  comparablePropertiesCache.clear()
  cacheMetadata.comparableProperties = { hits: 0, misses: 0, evictions: 0 }
  console.log('[Tiered Cache] Cleared comparable properties cache')
}

/**
 * Market Statistics Cache Operations
 */
export function getMarketStatisticsFromCache(key) {
  return getFromCache(marketStatisticsCache, key, 'marketStatistics')
}

export function setMarketStatisticsInCache(key, data) {
  setInCache(marketStatisticsCache, key, data, 'marketStatistics')
}

export function clearMarketStatisticsCache() {
  marketStatisticsCache.clear()
  cacheMetadata.marketStatistics = { hits: 0, misses: 0, evictions: 0 }
  console.log('[Tiered Cache] Cleared market statistics cache')
}

/**
 * Property Details Cache Operations
 */
export function getPropertyDetailsFromCache(key) {
  return getFromCache(propertyDetailsCache, key, 'propertyDetails')
}

export function setPropertyDetailsInCache(key, data) {
  setInCache(propertyDetailsCache, key, data, 'propertyDetails')
}

export function clearPropertyDetailsCache() {
  propertyDetailsCache.clear()
  cacheMetadata.propertyDetails = { hits: 0, misses: 0, evictions: 0 }
  console.log('[Tiered Cache] Cleared property details cache')
}

/**
 * Clear all caches
 */
export function clearAllCaches() {
  rentEstimateCache.clear()
  comparablePropertiesCache.clear()
  marketStatisticsCache.clear()
  propertyDetailsCache.clear()
  console.log('[Tiered Cache] Cleared all caches')
}

/**
 * Get cache statistics and analytics
 */
export function getCacheStats() {
  const totalHits = Object.values(cacheMetadata).reduce((sum, m) => sum + m.hits, 0)
  const totalMisses = Object.values(cacheMetadata).reduce((sum, m) => sum + m.misses, 0)
  const totalEvictions = Object.values(cacheMetadata).reduce((sum, m) => sum + m.evictions, 0)
  const hitRate = totalHits + totalMisses > 0 ? (totalHits / (totalHits + totalMisses) * 100).toFixed(2) : 0

  return {
    currentUserTier,
    ttlSettings: {
      free: `${CACHE_TTL.FREE / (24 * 60 * 60 * 1000)} days`,
      premium: `${CACHE_TTL.PREMIUM / (24 * 60 * 60 * 1000)} days`
    },
    cacheSize: {
      rentEstimate: rentEstimateCache.size,
      comparableProperties: comparablePropertiesCache.size,
      marketStatistics: marketStatisticsCache.size,
      propertyDetails: propertyDetailsCache.size,
      total: rentEstimateCache.size + comparablePropertiesCache.size + marketStatisticsCache.size + propertyDetailsCache.size
    },
    statistics: {
      ...cacheMetadata,
      total: {
        hits: totalHits,
        misses: totalMisses,
        evictions: totalEvictions,
        hitRate: `${hitRate}%`
      }
    }
  }
}

/**
 * Reset cache statistics
 */
export function resetCacheStats() {
  Object.keys(cacheMetadata).forEach(key => {
    cacheMetadata[key] = { hits: 0, misses: 0, evictions: 0 }
  })
  console.log('[Tiered Cache] Reset cache statistics')
}

/**
 * Get cache entries for debugging
 */
export function getCacheEntries() {
  return {
    rentEstimate: Array.from(rentEstimateCache.keys()),
    comparableProperties: Array.from(comparablePropertiesCache.keys()),
    marketStatistics: Array.from(marketStatisticsCache.keys()),
    propertyDetails: Array.from(propertyDetailsCache.keys())
  }
}

/**
 * Validate cache integrity
 * Removes expired entries across all caches
 */
export function validateCacheIntegrity() {
  let removedCount = 0

  const validateCache = (cacheMap, cacheType) => {
    for (const [key, entry] of cacheMap.entries()) {
      const ttl = entry.userTier === 'premium' ? CACHE_TTL.PREMIUM : CACHE_TTL.FREE
      if (!isCacheValid(entry.timestamp, ttl)) {
        cacheMap.delete(key)
        removedCount++
      }
    }
  }

  validateCache(rentEstimateCache, 'rentEstimate')
  validateCache(comparablePropertiesCache, 'comparableProperties')
  validateCache(marketStatisticsCache, 'marketStatistics')
  validateCache(propertyDetailsCache, 'propertyDetails')

  console.log(`[Tiered Cache] Validated cache integrity, removed ${removedCount} expired entries`)
  return removedCount
}

const tieredCacheService = {
  setUserTier,
  getUserTier,
  getRentEstimateFromCache,
  setRentEstimateInCache,
  getComparablePropertiesFromCache,
  setComparablePropertiesInCache,
  getMarketStatisticsFromCache,
  setMarketStatisticsInCache,
  getPropertyDetailsFromCache,
  setPropertyDetailsInCache,
  clearAllCaches,
  getCacheStats,
  resetCacheStats,
  getCacheEntries,
  validateCacheIntegrity
}

export default tieredCacheService
