/**
 * Market Health Chart Component
 * Displays vacancy rates and listing activity
 */

import React, { useMemo } from 'react'
import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export default function MarketHealthChart({ stats, historical }) {
  const vacancyTrendData = useMemo(() => {
    if (!historical || !historical.items) return null

    const items = historical.items.slice(-12) // Last 12 months
    const labels = items.map((item) => `${item.month}`)
    const vacancyRates = items.map((item) => item.vacancyRate)

    return {
      labels,
      datasets: [
        {
          label: 'Vacancy Rate (%)',
          data: vacancyRates,
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#f59e0b',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointHoverRadius: 6
        }
      ]
    }
  }, [historical])

  const listingActivityData = useMemo(() => {
    if (!historical || !historical.items) return null

    const items = historical.items.slice(-12) // Last 12 months
    const labels = items.map((item) => `${item.month}`)
    const listings = items.map((item) => item.totalListings)

    return {
      labels,
      datasets: [
        {
          label: 'Total Listings',
          data: listings,
          backgroundColor: 'rgba(59, 130, 246, 0.6)',
          borderColor: '#3b82f6',
          borderWidth: 2,
          borderRadius: 6
        }
      ]
    }
  }, [historical])

  const vacancyOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: { size: 12, weight: 'bold' },
          color: '#374151'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 13, weight: 'bold' },
        bodyFont: { size: 12 },
        borderColor: '#e5e7eb',
        borderWidth: 1,
        callbacks: {
          label: function (context) {
            return `${context.parsed.y.toFixed(2)}%`
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function (value) {
            return value + '%'
          },
          font: { size: 11 },
          color: '#6b7280'
        },
        grid: {
          color: 'rgba(229, 231, 235, 0.5)',
          drawBorder: false
        }
      },
      x: {
        ticks: {
          font: { size: 11 },
          color: '#6b7280'
        },
        grid: {
          display: false,
          drawBorder: false
        }
      }
    }
  }

  const listingOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: { size: 12, weight: 'bold' },
          color: '#374151'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 13, weight: 'bold' },
        bodyFont: { size: 12 },
        borderColor: '#e5e7eb',
        borderWidth: 1,
        callbacks: {
          label: function (context) {
            return `${context.parsed.y.toLocaleString()} listings`
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return value.toLocaleString()
          },
          font: { size: 11 },
          color: '#6b7280'
        },
        grid: {
          color: 'rgba(229, 231, 235, 0.5)',
          drawBorder: false
        }
      },
      x: {
        ticks: {
          font: { size: 11 },
          color: '#6b7280'
        },
        grid: {
          display: false,
          drawBorder: false
        }
      }
    }
  }

  if (!vacancyTrendData || !listingActivityData) {
    return null
  }

  return (
    <div className="bg-rentestBgLight border-2 border-rentestBorder rounded-lg p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <h2 className="text-lg font-bold text-rentestPrimary">🏥 Market Health</h2>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vacancy Trend */}
        <div className="bg-white rounded-lg p-4 border border-rentestBorder">
          <h3 className="text-sm font-bold text-rentestText mb-4">Vacancy Trend</h3>
          <Line data={vacancyTrendData} options={vacancyOptions} height={250} />
        </div>

        {/* Listing Activity */}
        <div className="bg-white rounded-lg p-4 border border-rentestBorder">
          <h3 className="text-sm font-bold text-rentestText mb-4">Listing Activity</h3>
          <Bar data={listingActivityData} options={listingOptions} height={250} />
        </div>
      </div>

      {/* Health Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white rounded-lg p-4 border border-rentestBorder">
          <p className="text-rentestText text-xs font-semibold mb-2">Current Vacancy</p>
          <p className="text-2xl font-bold text-rentestPrimary">
            {stats?.vacancyRate.toFixed(1)}%
          </p>
          <p className="text-xs text-rentestText mt-2">
            {stats?.vacancyRate > 10
              ? '⚠️ High vacancy'
              : stats?.vacancyRate < 3
              ? '🔥 Tight market'
              : '✓ Balanced'}
          </p>
        </div>

        <div className="bg-white rounded-lg p-4 border border-rentestBorder">
          <p className="text-rentestText text-xs font-semibold mb-2">Total Listings</p>
          <p className="text-2xl font-bold text-rentestPrimary">
            {stats?.totalListings.toLocaleString()}
          </p>
          <p className="text-xs text-rentestText mt-2">
            {stats?.totalListings > 100 ? '📊 Active market' : '🏚️ Limited supply'}
          </p>
        </div>

        <div className="bg-white rounded-lg p-4 border border-rentestBorder">
          <p className="text-rentestText text-xs font-semibold mb-2">Price/Sqft</p>
          <p className="text-2xl font-bold text-rentestPrimary">
            ${stats?.pricePerSqft.toFixed(2)}
          </p>
          <p className="text-xs text-rentestText mt-2">
            Market rate indicator
          </p>
        </div>
      </div>
    </div>
  )
}
