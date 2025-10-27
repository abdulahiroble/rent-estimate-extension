/**
 * Market Insights Component
 * Displays local market statistics and trends
 */

import React, { useState, useEffect } from 'react'
import { getMarketInsights } from '../services/marketInsightsService'
import {
  getTrendEmoji,
  getTrendColor,
  formatRent,
  formatPercentage
} from '../utils/marketDataTransformer'

export default function MarketInsights({ zipCode, city, state }) {
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadInsights = async () => {
      if (!zipCode) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const data = await getMarketInsights(zipCode)
        setInsights(data)
      } catch (err) {
        console.error('Error loading market insights:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadInsights()
  }, [zipCode])

  if (loading) {
    return (
      <div className="bg-rentestBgLight rounded-lg p-6 max-w-md mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-rentestBorder rounded w-1/2"></div>
          <div className="h-4 bg-rentestBorder rounded"></div>
          <div className="h-4 bg-rentestBorder rounded w-3/4"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 max-w-md mx-auto">
        <p className="text-red-600 text-sm">Unable to load market insights</p>
      </div>
    )
  }

  if (!insights || !insights.stats) {
    return null
  }

  const { stats, insights: insightsList } = insights
  const trendEmoji = getTrendEmoji(stats.marketTrend)
  const trendColor = getTrendColor(stats.marketTrend)

  return (
    <div className="bg-rentestBgLight border-2 border-rentestBorder rounded-lg p-6 max-w-md mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-rentestPrimary">📊 Market Insights</h2>
        <span className={`text-2xl ${trendColor}`}>{trendEmoji}</span>
      </div>

      {/* Location */}
      <div className="text-sm text-rentestText">
        <p className="font-semibold">{city}, {state} {zipCode}</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Average Rent */}
        <div className="bg-white rounded-lg p-3 border border-rentestBorder">
          <p className="text-rentestText text-xs font-semibold mb-1">Avg Rent</p>
          <p className="text-rentestPrimary font-bold text-lg">
            {formatRent(stats.averageRent)}
          </p>
        </div>

        {/* Rent Growth */}
        <div className="bg-white rounded-lg p-3 border border-rentestBorder">
          <p className="text-rentestText text-xs font-semibold mb-1">Annual Growth</p>
          <p className={`font-bold text-lg ${getTrendColor(stats.marketTrend)}`}>
            {formatPercentage(stats.rentGrowth)}
          </p>
        </div>

        {/* Vacancy Rate */}
        <div className="bg-white rounded-lg p-3 border border-rentestBorder">
          <p className="text-rentestText text-xs font-semibold mb-1">Vacancy</p>
          <p className="text-rentestText font-bold text-lg">
            {formatPercentage(stats.vacancyRate)}
          </p>
        </div>

        {/* Total Listings */}
        <div className="bg-white rounded-lg p-3 border border-rentestBorder">
          <p className="text-rentestText text-xs font-semibold mb-1">Listings</p>
          <p className="text-rentestText font-bold text-lg">
            {stats.totalListings}
          </p>
        </div>
      </div>

      {/* Market Insights */}
      {insightsList && insightsList.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-rentestText">Key Insights</p>
          <div className="space-y-2">
            {insightsList.map((insight, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-3 border border-rentestBorder flex items-start gap-2"
              >
                <span className="text-lg flex-shrink-0">{insight.emoji}</span>
                <p className="text-sm text-rentestText">{insight.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Stats */}
      <div className="bg-white rounded-lg p-3 border border-rentestBorder space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-rentestText">Median Rent</span>
          <span className="font-semibold text-rentestText">
            {formatRent(stats.medianRent)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-rentestText">Price/Sqft</span>
          <span className="font-semibold text-rentestText">
            ${stats.pricePerSqft.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-rentestText">Rent Range</span>
          <span className="font-semibold text-rentestText">
            {formatRent(stats.minRent)} - {formatRent(stats.maxRent)}
          </span>
        </div>
      </div>

      {/* Last Updated */}
      <p className="text-xs text-rentestText text-center opacity-75">
        Last updated: {new Date(stats.lastUpdated).toLocaleDateString()}
      </p>
    </div>
  )
}
