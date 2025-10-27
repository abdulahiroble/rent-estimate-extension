/**
 * Rent Trend Chart Component
 * Displays historical rent trends using Chart.js
 */

import React, { useState, useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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
  Title,
  Tooltip,
  Legend,
  Filler
)

export default function RentTrendChart({ historicalData }) {
  const [timePeriod, setTimePeriod] = useState(12) // 12 months default

  const chartData = useMemo(() => {
    if (!historicalData || !historicalData.items) {
      return null
    }

    const items = historicalData.items
    const filteredItems = items.slice(Math.max(0, items.length - timePeriod))

    const labels = filteredItems.map((item) => `${item.month} ${item.year}`)
    const averageRents = filteredItems.map((item) => item.averageRent)
    const medianRents = filteredItems.map((item) => item.medianRent)

    return {
      labels,
      datasets: [
        {
          label: 'Average Rent',
          data: averageRents,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#3b82f6',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointHoverRadius: 6
        },
        {
          label: 'Median Rent',
          data: medianRents,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#10b981',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointHoverRadius: 6
        }
      ]
    }
  }, [historicalData, timePeriod])

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12,
            weight: 'bold'
          },
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
        displayColors: true,
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: $${context.parsed.y.toLocaleString()}`
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: function (value) {
            return '$' + value.toLocaleString()
          },
          font: {
            size: 11
          },
          color: '#6b7280'
        },
        grid: {
          color: 'rgba(229, 231, 235, 0.5)',
          drawBorder: false
        }
      },
      x: {
        ticks: {
          font: {
            size: 11
          },
          color: '#6b7280'
        },
        grid: {
          display: false,
          drawBorder: false
        }
      }
    }
  }

  if (!chartData) {
    return null
  }

  return (
    <div className="bg-rentestBgLight border-2 border-rentestBorder rounded-lg p-6 max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-rentestPrimary">📈 Rent Trends</h2>
      </div>

      {/* Time Period Selector */}
      <div className="flex gap-2">
        {[3, 6, 12].map((period) => (
          <button
            key={period}
            onClick={() => setTimePeriod(period)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
              timePeriod === period
                ? 'bg-rentestPrimary text-white'
                : 'bg-white border-2 border-rentestBorder text-rentestText hover:border-rentestPrimary'
            }`}
          >
            {period}M
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg p-4 border border-rentestBorder">
        <Line data={chartData} options={options} height={300} />
      </div>

      {/* Info */}
      <p className="text-xs text-rentestText text-center opacity-75">
        Showing {timePeriod}-month trend
      </p>
    </div>
  )
}
