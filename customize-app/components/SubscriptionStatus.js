/**
 * Subscription Status Component
 * Displays user subscription status and upgrade options
 */

import React, { useState, useEffect } from 'react'
import {
  getSubscriptionDetails,
  getRemainingTrialDays,
  openPaymentPage,
  openTrialPage,
  openLoginPage
} from '../services/paymentService'

export default function SubscriptionStatus() {
  const [subscription, setSubscription] = useState(null)
  const [trialDays, setTrialDays] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSubscriptionStatus = async () => {
      try {
        const details = await getSubscriptionDetails()
        setSubscription(details)

        if (details.isTrialActive) {
          const remaining = await getRemainingTrialDays()
          setTrialDays(remaining)
        }
      } catch (error) {
        console.error('Error loading subscription status:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSubscriptionStatus()
  }, [])

  if (loading) {
    return null
  }

  if (!subscription) {
    return null
  }

  // Premium Subscriber
  if (subscription.isPaid) {
    return (
      <div className="bg-rentestSuccess bg-opacity-10 border border-rentestSuccess rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-rentestSuccess font-semibold text-sm">⭐ Premium Subscriber</p>
            <p className="text-rentestText text-xs">Unlimited rent estimates</p>
          </div>
          <button
            onClick={openLoginPage}
            className="text-xs bg-rentestSuccess hover:bg-green-600 text-white px-3 py-1 rounded transition-colors"
          >
            Manage
          </button>
        </div>
      </div>
    )
  }

  // Trial Active
  if (subscription.isTrialActive) {
    return (
      <div className="bg-rentestWarning bg-opacity-10 border border-rentestWarning rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-rentestWarning font-semibold text-sm">🎯 Trial Active</p>
            <p className="text-rentestText text-xs">
              {trialDays} days remaining
            </p>
          </div>
          <button
            onClick={openPaymentPage}
            className="text-xs bg-rentestWarning hover:bg-yellow-500 text-white px-3 py-1 rounded transition-colors"
          >
            Upgrade
          </button>
        </div>
      </div>
    )
  }

  // Free User
  return (
    <div className="bg-rentestBgLight border-2 border-rentestBorder rounded-lg p-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-rentestText font-semibold text-sm">Free Plan</p>
          <p className="text-rentestText text-xs">Limited to 5 estimates per day</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => openTrialPage()}
            className="text-xs bg-rentestAccent hover:bg-blue-500 text-white px-3 py-1 rounded transition-colors"
          >
            Try Free
          </button>
          <button
            onClick={openPaymentPage}
            className="text-xs bg-rentestPrimary hover:bg-rentestSecondary text-white px-3 py-1 rounded transition-colors"
          >
            Upgrade
          </button>
        </div>
      </div>
    </div>
  )
}
