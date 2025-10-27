/**
 * Historical Trends Component
 * Displays historical market trends
 */

import React, { useState, useEffect } from 'react'
import { getHistoricalData } from '../services/marketInsightsService'
import { formatRent, formatPercentage } from '../utils/marketDataTransformer'

export default function HistoricalTrends({ zipCode, city, state }) {
  const [historical, setHistorical] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadHistorical = async () => {
      if (!zipCode) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const data = await getHistoricalData(zipCode)
        setHistorical(data)
      } catch (err) {
        console.error('Error loading historical data:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadHistorical()
  }, [zipCode])

  if (loading) {
    return (
      <div className="bg-rentestBgLight rounded-lg p-6 max-w-md mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-rentestBorder rounded w-1/2"></div>
          <div className="h-4 bg-rentestBorder rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
        <p className="text-yellow-600 text-sm">Historical data unavailable</p>
      </div>
    )
  }

  if (!historical || !historical.items || historical.items.length === 0) {
    return null
  }

  const { items, trend } = historical
  const latestData = items[items.length - 1]
  const oldestData = items[0]

  return (
    <div className="bg-rentestBgLight border-2 border-rentestBorder rounded-lg p-6 max-w-md mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-rentestPrimary">📈 Historical Trends</h2>
        <span className="text-2xl">
          {trend.direction === 'up' ? '↗️' : trend.direction === 'down' ? '↘️' : '➡️'}
        </span>
      </div>

      {/* Trend Summary */}
      <div className="bg-white rounded-lg p-4 border border-rentestBorder">
        <div className="space-y-3">
          <div>
            <p className="text-rentestText text-sm font-semibold mb-1">Overall Trend</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-rentestPrimary">
                {formatRent(trend.change)}
              </p>
              <p className={`text-sm font-semibold ${
                trend.percentChange > 0 ? 'text-rentestSuccess' : 'text-rentestDanger'
              }`}>
                {trend.percentChange > 0 ? '+' : ''}{formatPercentage(trend.percentChange)}
              </p>
            </div>
            <p className="text-xs text-rentestText mt-1">
              From {new Date(oldestData.date).toLocaleDateString()} to {new Date(latestData.date).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Latest Data */}
      <div className="bg-white rounded-lg p-4 border border-rentestBorder">
        <p className="text-rentestText text-sm font-semibold mb-3">Latest Data</p>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-rentestText text-sm">Average Rent</span>
            <span className="font-semibold text-rentestText">
              {formatRent(latestData.averageRent)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-rentestText text-sm">Median Rent</span>
            <span className="font-semibold text-rentestText">
              {formatRent(latestData.medianRent)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-rentestText text-sm">Vacancy Rate</span>
            <span className="font-semibold text-rentestText">
              {formatPercentage(latestData.vacancyRate)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-rentestText text-sm">Listings</span>
            <span className="font-semibold text-rentestText">
              {latestData.totalListings}
            </span>
          </div>
        </div>
      </div>

      {/* Historical Data Table */}
      <div className="bg-white rounded-lg p-4 border border-rentestBorder">
        <p className="text-rentestText text-sm font-semibold mb-3">Historical Data</p>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex justify-between text-xs py-2 border-b border-rentestBorder last:border-b-0"
            >
              <span className="text-rentestText font-semibold">
                {item.month} {item.year}
              </span>
              <span className="text-rentestText">
                {formatRent(item.averageRent)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Data Period */}
      <p className="text-xs text-rentestText text-center opacity-75">
        Data from {items.length} months
      </p>
    </div>
  )
}
