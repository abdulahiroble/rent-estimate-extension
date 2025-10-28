/**
 * useSubscription Hook
 * Manages subscription state and payment interactions
 */

import { useState, useEffect, useCallback } from 'react'
import {
  getSubscriptionDetails,
  getRemainingTrialDays,
  isSubscriptionActive,
  isTrialActive,
  openPaymentPage,
  openTrialPage,
  openLoginPage,
  onPaymentReceived,
  onTrialStarted,
  syncCacheTierWithSubscription
} from '../services/paymentService'

export function useSubscription() {
  const [subscription, setSubscription] = useState(null)
  const [trialDays, setTrialDays] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  /**
   * Load subscription details
   */
  const loadSubscription = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const details = await getSubscriptionDetails()
      setSubscription(details)

      // Sync cache tier with subscription status
      await syncCacheTierWithSubscription()

      if (details.isTrialActive) {
        const remaining = await getRemainingTrialDays()
        setTrialDays(remaining)
      } else {
        setTrialDays(0)
      }
    } catch (err) {
      console.error('Error loading subscription:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Initialize subscription listeners
   */
  useEffect(() => {
    loadSubscription()

    // Listen for payment events
    onPaymentReceived(() => {
      console.log('Payment received!')
      loadSubscription()
    })

    // Listen for trial started events
    onTrialStarted(() => {
      console.log('Trial started!')
      loadSubscription()
    })
  }, [loadSubscription])

  /**
   * Check if user can use premium features
   */
  const canUsePremium = useCallback(async () => {
    const isPaid = await isSubscriptionActive()
    const isTrialActive_ = await isTrialActive()
    return isPaid || isTrialActive_
  }, [])

  /**
   * Upgrade subscription
   */
  const upgrade = useCallback(() => {
    openPaymentPage()
  }, [])

  /**
   * Start trial
   */
  const startTrial = useCallback((period = null) => {
    openTrialPage(period)
  }, [])

  /**
   * Manage subscription
   */
  const manage = useCallback(() => {
    openLoginPage()
  }, [])

  /**
   * Refresh subscription status
   */
  const refresh = useCallback(() => {
    loadSubscription()
  }, [loadSubscription])

  return {
    subscription,
    trialDays,
    loading,
    error,
    canUsePremium,
    upgrade,
    startTrial,
    manage,
    refresh,
    isPaid: subscription?.isPaid || false,
    isTrialActive: subscription?.isTrialActive || false,
    status: subscription?.status || 'inactive'
  }
}

export default useSubscription
