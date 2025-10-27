/**
 * Upgrade Prompt Component
 * Shows upgrade prompts at different usage levels
 */

import React, { useState } from 'react'
import { useUsageTracking } from '../hooks/useUsageTracking'
import { openPaymentPage } from '../services/paymentService'

export default function UpgradePrompt({ onDismiss }) {
  const { stats, isPremium, shouldWarn } = useUsageTracking()
  const [dismissed, setDismissed] = useState(false)

  // Don't show if: no stats, user is premium, or no warning needed
  if (!stats || isPremium || !shouldWarn) {
    return null
  }

  // For quota exceeded, always show (never allow dismiss)
  const isQuotaExceeded = stats.isExceeded
  
  // For warnings (not exceeded), allow dismiss
  if (dismissed && !isQuotaExceeded) {
    return null
  }

  const handleDismiss = () => {
    setDismissed(true)
    if (onDismiss) {
      onDismiss()
    }
  }

  const handleUpgrade = () => {
    openPaymentPage()
  }

  // Determine prompt type based on usage
  let title, message, icon

  if (stats.isExceeded) {
    title = 'Monthly Limit Reached'
    message = `You've used all ${stats.quota} lookups for this month. Upgrade to unlimited searches.`
    icon = '🔒'
  } else if (stats.percentUsed >= 80) {
    title = 'Running Low on Lookups'
    message = `Only ${stats.remaining} lookup${stats.remaining !== 1 ? 's' : ''} remaining. Upgrade for unlimited.`
    icon = '⚠️'
  } else if (stats.percentUsed >= 50) {
    title = 'Halfway Through Your Monthly Limit'
    message = `You've used ${stats.used} of ${stats.quota} lookups. Upgrade to unlimited searches.`
    icon = '📊'
  }

  return (
    <div className="bg-gradient-to-r from-rentestAccent to-rentestPrimary rounded-lg p-4 text-white">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-start gap-2">
          <span className="text-xl">{icon}</span>
          <div>
            <h3 className="font-bold text-sm">{title}</h3>
            <p className="text-xs opacity-90">{message}</p>
          </div>
        </div>
        {/* Only show dismiss button if quota is NOT exceeded */}
        {!isQuotaExceeded && (
          <button
            onClick={handleDismiss}
            className="text-white hover:opacity-80 transition-opacity"
            title="Dismiss"
          >
            ✕
          </button>
        )}
      </div>

      <button
        onClick={handleUpgrade}
        className="w-full bg-white text-rentestPrimary hover:bg-gray-100 font-bold py-2 px-3 rounded text-sm transition-colors mt-2"
      >
        Upgrade to Unlimited
      </button>
    </div>
  )
}
