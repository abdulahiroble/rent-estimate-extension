/**
 * Premium Feature Gate Component
 * Restricts access to premium features and shows upgrade prompts
 */

import React from 'react'
import { useSubscription } from '../hooks/useSubscription'

export default function PremiumFeatureGate({
  children,
  featureName = 'This feature',
  showUpgradePrompt = true,
  fallback = null
}) {
  const { isPaid, isTrialActive, upgrade, startTrial } = useSubscription()

  const hasPremiumAccess = isPaid || isTrialActive

  if (hasPremiumAccess) {
    return children
  }

  if (fallback) {
    return fallback
  }

  if (!showUpgradePrompt) {
    return null
  }

  return (
    <div className="bg-rentestBgLight border-2 border-rentestBorder rounded-lg p-6 max-w-md mx-auto">
      <div className="text-center">
        <h3 className="text-lg font-bold text-rentestPrimary mb-2">🔒 Premium Feature</h3>
        <p className="text-rentestText text-sm mb-4">
          {featureName} is available for premium subscribers and trial users.
        </p>

        <div className="space-y-2">
          <button
            onClick={startTrial}
            className="w-full bg-rentestAccent hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Start Free Trial (14 days)
          </button>
          <button
            onClick={upgrade}
            className="w-full bg-rentestPrimary hover:bg-rentestSecondary text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Upgrade to Premium ($29.99/month)
          </button>
        </div>

        <p className="text-rentestText text-xs mt-4">
          14-day free trial • Cancel anytime • Unlimited searches
        </p>
      </div>
    </div>
  )
}
