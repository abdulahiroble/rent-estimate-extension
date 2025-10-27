/**
 * Quota Enforcement Utility
 * Enforces usage limits for free tier users
 */

import {
  trackLookup,
  isQuotaExceeded,
  getRemainingLookups
} from '../services/usageTrackingService'
import { isSubscriptionActive } from '../services/paymentService'

/**
 * Check if user can perform a lookup
 */
export async function canPerformLookup() {
  try {
    // Check if paywall bypass is enabled (for local testing)
    const bypassPaywall = process.env.NEXT_PUBLIC_BYPASS_PAYWALL === 'true'
    if (bypassPaywall) {
      console.log('[Dev Mode] Quota check bypassed - allowing lookup')
      return { allowed: true, reason: 'dev_bypass' }
    }

    // Premium users always can
    const isPremium = await isSubscriptionActive()
    if (isPremium) {
      return { allowed: true, reason: 'premium' }
    }

    // Check quota for free users
    const exceeded = await isQuotaExceeded()
    if (exceeded) {
      return { allowed: false, reason: 'quota_exceeded' }
    }

    return { allowed: true, reason: 'free_tier' }
  } catch (error) {
    console.error('Error checking quota:', error)
    // Allow on error to prevent blocking users
    return { allowed: true, reason: 'error', error: error.message }
  }
}

/**
 * Perform a lookup with quota enforcement
 */
export async function performLookupWithQuota(lookupFunction) {
  try {
    // Check if allowed
    const { allowed, reason } = await canPerformLookup()

    if (!allowed) {
      return {
        success: false,
        error: 'Quota exceeded. Upgrade to continue.',
        reason
      }
    }

    // Perform the lookup
    const result = await lookupFunction()

    // Track the lookup (only for free users, not for dev bypass or premium)
    if (reason === 'free_tier') {
      await trackLookup()
    }

    return {
      success: true,
      data: result,
      reason
    }
  } catch (error) {
    console.error('Error performing lookup:', error)
    return {
      success: false,
      error: error.message,
      reason: 'error'
    }
  }
}

/**
 * Get quota status message
 */
export async function getQuotaStatusMessage() {
  try {
    const isPremium = await isSubscriptionActive()

    if (isPremium) {
      return 'Premium: Unlimited lookups'
    }

    const remaining = await getRemainingLookups()

    if (remaining === 0) {
      return 'Quota exceeded. Upgrade to continue.'
    }

    if (remaining <= 3) {
      return `⚠️ Only ${remaining} lookup${remaining !== 1 ? 's' : ''} left`
    }

    return `${remaining} lookups remaining`
  } catch (error) {
    console.error('Error getting quota status:', error)
    return 'Unable to check quota'
  }
}

/**
 * Get quota enforcement config
 */
export async function getQuotaConfig() {
  try {
    const isPremium = await isSubscriptionActive()
    const remaining = await getRemainingLookups()
    const exceeded = await isQuotaExceeded()

    return {
      isPremium,
      remaining,
      exceeded,
      canLookup: !exceeded || isPremium,
      quotaMessage: await getQuotaStatusMessage()
    }
  } catch (error) {
    console.error('Error getting quota config:', error)
    return {
      isPremium: false,
      remaining: 0,
      exceeded: false,
      canLookup: true,
      quotaMessage: 'Error checking quota'
    }
  }
}

/**
 * Validate lookup before execution
 */
export async function validateLookup() {
  const { allowed, reason } = await canPerformLookup()

  if (!allowed) {
    const error = new Error('Quota exceeded')
    error.code = 'QUOTA_EXCEEDED'
    error.reason = reason
    throw error
  }

  return true
}

const quotaEnforcement = {
  canPerformLookup,
  performLookupWithQuota,
  getQuotaStatusMessage,
  getQuotaConfig,
  validateLookup
}

export default quotaEnforcement
