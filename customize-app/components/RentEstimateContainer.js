/**
 * Rent Estimate Container Component
 * Main container that manages rent estimate search and display
 */

import React, { useState, useCallback } from 'react'
import { useRentEstimate } from '../hooks/useRentEstimate'
import { parseApiError, logError } from '../utils/errorHandler'
import { canPerformLookup, performLookupWithQuota } from '../utils/quotaEnforcement'
import RentEstimateSearch from './RentEstimateSearch'
import RentEstimateResult from './RentEstimateResult'
import PropertyInformation from './PropertyInformation'
import UsageDisplay from './UsageDisplay'
import MarketInsights from './MarketInsights'
import UpgradePrompt from './UpgradePrompt'

export default function RentEstimateContainer() {
  const { data, loading, error, fetchRentEstimate } = useRentEstimate()
  const [searchHistory, setSearchHistory] = useState([])
  const [userError, setUserError] = useState('')
  const [searchCount, setSearchCount] = useState(0) // Track searches to refresh usage display

  const handleSearch = useCallback(
    async (addressData) => {
      setUserError('')

      try {
        // Check usage quota before making API call
        const quotaCheck = await canPerformLookup()
        if (!quotaCheck.allowed) {
          if (quotaCheck.reason === 'quota_exceeded') {
            setUserError('Monthly lookup limit reached. Upgrade to premium for unlimited searches.')
          } else {
            setUserError('Unable to perform lookup. Please try again.')
          }
          return
        }

        // Perform lookup with quota tracking
        const result = await performLookupWithQuota(async () => {
          return await fetchRentEstimate(
            addressData.address,
            addressData.city,
            addressData.state,
            addressData.zipCode
          )
        })

        // Add to search history
        setSearchHistory((prev) => [
          {
            address: result.address,
            city: result.city,
            state: result.state,
            zipCode: result.zipCode,
            estimate: result.rentEstimate,
            timestamp: new Date()
          },
          ...prev.slice(0, 9) // Keep last 10 searches
        ])

        // Increment search count to trigger UsageDisplay refresh
        setSearchCount(prev => prev + 1)
      } catch (err) {
        logError('RentEstimateContainer.handleSearch', err)
        const parsedError = parseApiError(err)
        setUserError(parsedError.userMessage)
      }
    },
    [fetchRentEstimate]
  )

  const handleReset = useCallback(() => {
    setUserError('')
  }, [])

  return (
    <div className="w-full space-y-6">
      {/* Search Form */}
      <RentEstimateSearch onSearch={handleSearch} loading={loading} />

      {/* Upgrade Prompt - automatically updates when usage changes */}
      <UpgradePrompt />

      {/* Usage Display - key forces refresh on search */}
      <UsageDisplay key={searchCount} />

      {/* Results */}
      {(data || error || loading) && (
        <>
          <RentEstimateResult
            estimate={data}
            loading={loading}
            error={userError || error}
            onReset={handleReset}
          />
          
          {/* Property Information - show when we have address data */}
          {data && (
            <PropertyInformation
              address={data.address}
              city={data.city}
              state={data.state}
              zipCode={data.zipCode}
              loading={loading}
              error={userError || error}
            />
          )}

          {/* Market Insights - show when we have zip code data */}
          {data && data.zipCode && (
            <MarketInsights
              zipCode={data.zipCode}
              city={data.city}
              state={data.state}
            />
          )}
        </>
      )}

      {/* Search History */}
      {searchHistory.length > 0 && !data && (
        <div className="bg-rentestBgLight rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-bold text-rentestPrimary mb-4">Recent Searches</h3>
          <div className="space-y-2">
            {searchHistory.map((item, index) => (
              <button
                key={index}
                onClick={() =>
                  handleSearch({
                    address: item.address,
                    city: item.city,
                    state: item.state,
                    zipCode: item.zipCode
                  })
                }
                className="w-full text-left p-3 bg-white rounded-lg border border-rentestBorder hover:border-rentestPrimary hover:bg-blue-50 transition-colors"
              >
                <p className="text-rentestText font-semibold text-sm">{item.address}</p>
                <p className="text-rentestText text-xs">
                  {item.city}, {item.state} {item.zipCode}
                </p>
                <p className="text-rentestPrimary font-bold text-sm">
                  ${item.estimate.toLocaleString()}/mo
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
