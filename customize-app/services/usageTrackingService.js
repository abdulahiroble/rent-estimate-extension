/**
 * Usage Tracking Service
 * Manages quota and usage tracking for freemium model
 */

const STORAGE_KEY = 'rentest_usage'
const FREE_TIER_QUOTA = 5 // lookups per month (optimized for cost and conversion)
const QUOTA_WARNING_THRESHOLD = 0.8 // 80% of quota

/**
 * Get current usage data
 */
export async function getUsageData() {
  return new Promise((resolve) => {
    // Try Chrome storage first (in extension context)
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get(STORAGE_KEY, (result) => {
        if (result[STORAGE_KEY]) {
          resolve(result[STORAGE_KEY])
        } else {
          const defaultData = getDefaultUsageData()
          chrome.storage.local.set({ [STORAGE_KEY]: defaultData })
          resolve(defaultData)
        }
      })
      return
    }

    // Fallback to localStorage (for testing in local environment)
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        resolve(JSON.parse(stored))
      } else {
        const defaultData = getDefaultUsageData()
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData))
        resolve(defaultData)
      }
    } catch (error) {
      console.warn('Storage not available, using default data:', error)
      resolve(getDefaultUsageData())
    }
  })
}

/**
 * Get default usage data structure
 */
function getDefaultUsageData() {
  const now = new Date()
  return {
    lookups: 0,
    monthStart: getMonthStart(now),
    lastReset: getMonthStart(now),
    createdAt: now.toISOString()
  }
}

/**
 * Get first day of current month
 */
function getMonthStart(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1).toISOString()
}

/**
 * Check if month has changed and reset if needed
 */
async function checkAndResetMonthly() {
  const usage = await getUsageData()
  const now = new Date()
  const currentMonthStart = getMonthStart(now)

  if (usage.monthStart !== currentMonthStart) {
    // Month has changed, reset counter
    const newUsage = {
      ...usage,
      lookups: 0,
      monthStart: currentMonthStart,
      lastReset: currentMonthStart
    }

    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.set({ [STORAGE_KEY]: newUsage }, () => {
          resolve(newUsage)
        })
      } else {
        // Fallback to localStorage
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newUsage))
        } catch (error) {
          console.warn('Failed to save to localStorage:', error)
        }
        resolve(newUsage)
      }
    })
  }

  return usage
}

/**
 * Track a lookup/search
 */
export async function trackLookup() {
  const usage = await checkAndResetMonthly()

  const newUsage = {
    ...usage,
    lookups: usage.lookups + 1
  }

  return new Promise((resolve) => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ [STORAGE_KEY]: newUsage }, () => {
        resolve(newUsage)
      })
    } else {
      // Fallback to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newUsage))
      } catch (error) {
        console.warn('Failed to save to localStorage:', error)
      }
      resolve(newUsage)
    }
  })
}

/**
 * Get remaining lookups for free tier
 */
export async function getRemainingLookups() {
  const usage = await checkAndResetMonthly()
  return Math.max(0, FREE_TIER_QUOTA - usage.lookups)
}

/**
 * Check if quota is exceeded
 */
export async function isQuotaExceeded() {
  const remaining = await getRemainingLookups()
  return remaining <= 0
}

/**
 * Check if user should see warning
 */
export async function shouldShowWarning() {
  const usage = await checkAndResetMonthly()
  const usagePercent = usage.lookups / FREE_TIER_QUOTA
  return usagePercent >= QUOTA_WARNING_THRESHOLD
}

/**
 * Get usage statistics
 */
export async function getUsageStats() {
  const usage = await checkAndResetMonthly()
  const remaining = getRemainingLookups()
  const usagePercent = Math.round((usage.lookups / FREE_TIER_QUOTA) * 100)

  return {
    used: usage.lookups,
    remaining: await remaining,
    quota: FREE_TIER_QUOTA,
    percentUsed: usagePercent,
    percentRemaining: 100 - usagePercent,
    monthStart: usage.monthStart,
    monthEnd: getMonthEnd(usage.monthStart),
    isExceeded: await isQuotaExceeded(),
    shouldWarn: await shouldShowWarning()
  }
}

/**
 * Get last day of month
 */
function getMonthEnd(monthStartIso) {
  const date = new Date(monthStartIso)
  const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1)
  const lastDay = new Date(nextMonth.getTime() - 1)
  return lastDay.toISOString()
}

/**
 * Reset usage (admin function)
 */
export async function resetUsage() {
  const defaultData = getDefaultUsageData()

  return new Promise((resolve) => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ [STORAGE_KEY]: defaultData }, () => {
        resolve(defaultData)
      })
    } else {
      resolve(defaultData)
    }
  })
}

/**
 * Get usage percentage
 */
export async function getUsagePercentage() {
  const usage = await checkAndResetMonthly()
  return Math.round((usage.lookups / FREE_TIER_QUOTA) * 100)
}

/**
 * Format remaining days in month
 */
export function getRemainingDaysInMonth(monthStartIso) {
  const date = new Date(monthStartIso)
  const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1)
  const lastDay = new Date(nextMonth.getTime() - 1)
  const today = new Date()

  const daysRemaining = Math.ceil(
    (lastDay - today) / (1000 * 60 * 60 * 24)
  )

  return Math.max(0, daysRemaining)
}

const usageTrackingService = {
  getUsageData,
  checkAndResetMonthly,
  trackLookup,
  getRemainingLookups,
  isQuotaExceeded,
  shouldShowWarning,
  getUsageStats,
  resetUsage,
  getUsagePercentage,
  getRemainingDaysInMonth,
  FREE_TIER_QUOTA,
  QUOTA_WARNING_THRESHOLD
}

export default usageTrackingService
