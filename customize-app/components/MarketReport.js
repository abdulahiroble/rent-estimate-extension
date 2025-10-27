/**
 * Market Report Component
 * Comprehensive market analysis with all charts and metrics
 */

import React, { useState } from 'react'
import RentTrendChart from './RentTrendChart'
import MarketStatsChart from './MarketStatsChart'
import MarketHealthChart from './MarketHealthChart'

export default function MarketReport({ zipCode, city, state, stats, historical }) {
  const [activeTab, setActiveTab] = useState('overview')

  const handlePrint = () => {
    window.print()
  }

  if (!stats) {
    return null
  }

  return (
    <div className="bg-rentestBgLight rounded-lg p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-rentestPrimary">Market Report</h1>
          <p className="text-rentestText text-sm">
            {city}, {state} {zipCode}
          </p>
        </div>
        <button
          onClick={handlePrint}
          className="bg-rentestPrimary hover:bg-rentestSecondary text-white font-bold py-2 px-4 rounded-lg transition-colors print:hidden"
        >
          🖨️ Print Report
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b-2 border-rentestBorder print:hidden">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'trends', label: 'Trends' },
          { id: 'health', label: 'Health' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-semibold text-sm transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-rentestPrimary text-rentestPrimary'
                : 'text-rentestText hover:text-rentestPrimary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <MarketStatsChart stats={stats} historical={historical} />

          {/* Summary Section */}
          <div className="bg-white rounded-lg p-6 border border-rentestBorder space-y-4">
            <h2 className="text-lg font-bold text-rentestPrimary">Market Summary</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-semibold text-rentestText mb-2">Rent Metrics</h3>
                <ul className="space-y-1 text-sm text-rentestText">
                  <li>
                    <span className="font-semibold">Average:</span> $
                    {Math.round(stats.averageRent).toLocaleString()}
                  </li>
                  <li>
                    <span className="font-semibold">Median:</span> $
                    {Math.round(stats.medianRent).toLocaleString()}
                  </li>
                  <li>
                    <span className="font-semibold">Range:</span> $
                    {Math.round(stats.minRent).toLocaleString()} - $
                    {Math.round(stats.maxRent).toLocaleString()}
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-rentestText mb-2">Market Indicators</h3>
                <ul className="space-y-1 text-sm text-rentestText">
                  <li>
                    <span className="font-semibold">Growth Rate:</span>{' '}
                    {stats.rentGrowth.toFixed(2)}%
                  </li>
                  <li>
                    <span className="font-semibold">Vacancy Rate:</span>{' '}
                    {stats.vacancyRate.toFixed(2)}%
                  </li>
                  <li>
                    <span className="font-semibold">Active Listings:</span>{' '}
                    {stats.totalListings}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trends Tab */}
      {activeTab === 'trends' && (
        <div className="space-y-6">
          {historical && <RentTrendChart historicalData={historical} />}
        </div>
      )}

      {/* Health Tab */}
      {activeTab === 'health' && (
        <div className="space-y-6">
          <MarketHealthChart stats={stats} historical={historical} />
        </div>
      )}

    </div>
  )
}
