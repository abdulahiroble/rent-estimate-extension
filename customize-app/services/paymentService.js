/**
 * Payment Service
 * Wrapper around ExtPay for subscription management via Chrome messaging
 * ExtPay runs in background.js, so we communicate via chrome.runtime.sendMessage
 */

import tieredCacheService from './tieredCacheService'

/**
 * Send message to background script
 */
function sendMessageToBackground(message) {
  return new Promise((resolve, reject) => {
    if (typeof chrome === 'undefined' || !chrome.runtime) {
      console.error('Chrome runtime not available')
      reject(new Error('Chrome runtime not available'))
      return
    }

    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Message error:', chrome.runtime.lastError)
        reject(chrome.runtime.lastError)
      } else {
        resolve(response)
      }
    })
  })
}

/**
 * Get current user subscription status
 */
export async function getSubscriptionStatus() {
  try {
    if (typeof chrome === 'undefined' || !chrome.storage) {
      console.warn('Chrome storage not available')
      return null
    }

    return new Promise((resolve) => {
      chrome.storage.sync.get('subscription', (result) => {
        if (result.subscription) {
          resolve(result.subscription)
        } else {
          resolve(null)
        }
      })
    })
  } catch (error) {
    console.error('Error getting subscription status:', error)
    return null
  }
}

/**
 * Check if user has active subscription
 */
export async function isSubscriptionActive() {
  const subscription = await getSubscriptionStatus()
  return subscription && subscription.paid === true
}

/**
 * Check if user is in trial period
 */
export async function isTrialActive() {
  const subscription = await getSubscriptionStatus()
  return subscription && subscription.trialStartedAt && !subscription.paid
}

/**
 * Get subscription details
 */
export async function getSubscriptionDetails() {
  const subscription = await getSubscriptionStatus()
  if (!subscription) {
    return {
      status: 'inactive',
      isPaid: false,
      isTrialActive: false,
      paidAt: null,
      trialStartedAt: null
    }
  }

  return {
    status: subscription.paid ? 'active' : subscription.trialStartedAt ? 'trial' : 'inactive',
    isPaid: subscription.paid === true,
    isTrialActive: !!subscription.trialStartedAt && !subscription.paid,
    paidAt: subscription.paidAt || null,
    trialStartedAt: subscription.trialStartedAt || null
  }
}

/**
 * Open payment page via background script
 */
export async function openPaymentPage() {
  try {
    await sendMessageToBackground('should-pay')
  } catch (error) {
    console.error('Error opening payment page:', error)
  }
}

/**
 * Open trial page via background script
 */
export async function openTrialPage(period = null) {
  try {
    await sendMessageToBackground({ action: 'open-trial', period })
  } catch (error) {
    console.error('Error opening trial page:', error)
  }
}

/**
 * Open login page for reactivation via background script
 */
export async function openLoginPage() {
  try {
    await sendMessageToBackground('open-login')
  } catch (error) {
    console.error('Error opening login page:', error)
  }
}

/**
 * Note: Payment and trial listeners are handled in background.js
 * The frontend receives updates via Chrome storage changes
 */

/**
 * Get user info from ExtPay via background script
 */
export async function getUserInfo() {
  try {
    const user = await sendMessageToBackground('get-user-data')
    return user
  } catch (error) {
    console.error('Error getting user info:', error)
    return null
  }
}

/**
 * Format subscription status for display
 */
export async function getSubscriptionStatusText() {
  const details = await getSubscriptionDetails()

  switch (details.status) {
    case 'active':
      return 'Premium Subscriber'
    case 'trial':
      return 'Trial Active'
    case 'inactive':
    default:
      return 'Free User'
  }
}

/**
 * Get remaining trial days
 */
export async function getRemainingTrialDays() {
  const subscription = await getSubscriptionStatus()
  if (!subscription || !subscription.trialStartedAt) {
    return 0
  }

  const trialStart = new Date(subscription.trialStartedAt)
  const trialEnd = new Date(trialStart.getTime() + 14 * 24 * 60 * 60 * 1000) // 14 days
  const now = new Date()
  const remaining = Math.ceil((trialEnd - now) / (24 * 60 * 60 * 1000))

  return Math.max(0, remaining)
}

/**
 * Sync cache tier with subscription status
 * Updates tiered cache service with current user tier based on subscription
 * Should be called on app initialization and when subscription changes
 */
export async function syncCacheTierWithSubscription() {
  try {
    const details = await getSubscriptionDetails()
    const tier = details.isPaid ? 'premium' : 'free'
    tieredCacheService.setUserTier(tier)
    console.log(`[Payment Service] Cache tier synced: ${tier}`)
    return tier
  } catch (error) {
    console.error('Error syncing cache tier:', error)
    // Default to free tier on error
    tieredCacheService.setUserTier('free')
    return 'free'
  }
}

const paymentService = {
  getSubscriptionStatus,
  isSubscriptionActive,
  isTrialActive,
  getSubscriptionDetails,
  openPaymentPage,
  openTrialPage,
  openLoginPage,
  getUserInfo,
  getSubscriptionStatusText,
  getRemainingTrialDays,
  syncCacheTierWithSubscription
}

export default paymentService
