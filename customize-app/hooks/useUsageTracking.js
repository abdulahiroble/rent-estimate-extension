/**
 * useUsageTracking Hook
 * Manages usage tracking state and quota enforcement
 */

import { useState, useEffect, useCallback } from 'react'
import {
  getUsageStats,
  trackLookup,
  isQuotaExceeded,
  shouldShowWarning,
  getRemainingLookups,
  getUsagePercentage
} from '../services/usageTrackingService'
import { getUserInfo } from '../services/paymentService'

export function useUsageTracking() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isPremium, setIsPremium] = useState(false)

  /**
   * Load usage statistics
   */
  const loadStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Check if paywall bypass is enabled (for local testing)
      const bypassPaywall = process.env.NEXT_PUBLIC_BYPASS_PAYWALL === 'true'
      
      if (bypassPaywall) {
        console.log('[Dev Mode] Paywall bypassed - simulating paid user')
        const usageStats = await getUsageStats()
        setStats(usageStats)
        setIsPremium(true) // Simulate paid user
        setLoading(false)
        return
      }

      // Get user info from ExtPay to check if they're paid
      const userInfo = await getUserInfo()
      const isPaid = userInfo && userInfo.paid === true

      // Get usage stats
      const usageStats = await getUsageStats()

      setStats(usageStats)
      setIsPremium(isPaid)
    } catch (err) {
      console.error('Error loading usage stats:', err)
      setError(err.message)
      // Default to free tier on error
      setIsPremium(false)
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Initialize on mount
   */
  useEffect(() => {
    loadStats()
  }, [loadStats])

  /**
   * Record a lookup
   */
  const recordLookup = useCallback(async () => {
    try {
      // Premium users don't need to track
      if (isPremium) {
        return { allowed: true, exceeded: false }
      }

      // Check quota before tracking
      const exceeded = await isQuotaExceeded()
      if (exceeded) {
        return { allowed: false, exceeded: true }
      }

      // Track the lookup
      await trackLookup()

      // Reload stats
      await loadStats()

      return { allowed: true, exceeded: false }
    } catch (err) {
      console.error('Error recording lookup:', err)
      return { allowed: false, exceeded: false, error: err.message }
    }
  }, [isPremium, loadStats])

  /**
   * Check if can perform lookup
   */
  const canPerformLookup = useCallback(async () => {
    if (isPremium) {
      return true
    }

    const exceeded = await isQuotaExceeded()
    return !exceeded
  }, [isPremium])

  /**
   * Get warning message
   */
  const getWarningMessage = useCallback(() => {
    if (!stats || isPremium) {
      return null
    }

    if (stats.isExceeded) {
      return `Monthly lookup limit reached. Upgrade to unlimited searches.`
    }

    if (stats.shouldWarn) {
      return `${stats.remaining} lookup${stats.remaining !== 1 ? 's' : ''} remaining this month. Upgrade for unlimited.`
    }

    return null
  }, [stats, isPremium])

  /**
   * Get usage display text
   */
  const getUsageText = useCallback(() => {
    if (!stats) {
      return ''
    }

    if (isPremium) {
      return 'Unlimited'
    }

    return `${stats.used}/${stats.quota}`
  }, [stats, isPremium])

  /**
   * Get usage color
   */
  const getUsageColor = useCallback(() => {
    if (!stats || isPremium) {
      return 'text-rentestSuccess'
    }

    if (stats.isExceeded) {
      return 'text-rentestDanger'
    }

    if (stats.shouldWarn) {
      return 'text-rentestWarning'
    }

    return 'text-rentestSuccess'
  }, [stats, isPremium])

  /**
   * Refresh stats
   */
  const refresh = useCallback(() => {
    loadStats()
  }, [loadStats])

  return {
    stats,
    loading,
    error,
    isPremium,
    recordLookup,
    canPerformLookup,
    getWarningMessage,
    getUsageText,
    getUsageColor,
    refresh,
    // Convenience properties
    used: stats?.used || 0,
    remaining: stats?.remaining || 0,
    quota: stats?.quota || 0,
    percentUsed: stats?.percentUsed || 0,
    isExceeded: stats?.isExceeded || false,
    shouldWarn: stats?.shouldWarn || false
  }
}

export default useUsageTracking
