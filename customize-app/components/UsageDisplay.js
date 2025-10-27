/**
 * Usage Display Component
 * Shows current usage and quota information
 */

import React from 'react'
import { useUsageTracking } from '../hooks/useUsageTracking'

export default function UsageDisplay() {
  const {
    stats,
    loading,
    isPremium,
    getUsageText,
    getUsageColor,
    getWarningMessage
  } = useUsageTracking()

  if (loading || !stats) {
    return null
  }

  const warningMessage = getWarningMessage()
  const usageText = getUsageText()
  const usageColor = getUsageColor()

  return (
    <div className="space-y-2">
      {/* Usage Bar */}
      <div className="bg-rentestBgLight rounded-lg p-3 border border-rentestBorder">
        <div className="flex justify-between items-center mb-2">
          <span className="text-rentestText text-sm font-semibold">
            {isPremium ? '⭐ Premium' : 'Monthly Lookups'}
          </span>
          <span className={`text-sm font-bold ${usageColor}`}>
            {usageText}
          </span>
        </div>

        {!isPremium && (
          <>
            {/* Progress Bar */}
            <div className="w-full bg-rentestBorder rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  stats.isExceeded
                    ? 'bg-rentestDanger'
                    : stats.shouldWarn
                    ? 'bg-rentestWarning'
                    : 'bg-rentestSuccess'
                }`}
                style={{ width: `${Math.min(stats.percentUsed, 100)}%` }}
              />
            </div>

            {/* Percentage Text */}
            <div className="text-xs text-rentestText mt-1">
              {stats.percentUsed}% used
            </div>
          </>
        )}
      </div>

      {/* Warning Message */}
      {warningMessage && (
        <div
          className={`text-xs p-2 rounded border ${
            stats.isExceeded
              ? 'bg-red-50 border-rentestDanger text-rentestDanger'
              : 'bg-yellow-50 border-rentestWarning text-rentestWarning'
          }`}
        >
          {warningMessage}
        </div>
      )}

      {/* Info Text */}
      {!isPremium && (
        <p className="text-xs text-rentestText text-center">
          Resets on the 1st of each month
        </p>
      )}
    </div>
  )
}
