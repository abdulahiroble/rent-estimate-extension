/**
 * Market Statistics Chart Component
 * Displays market statistics using bar and doughnut charts
 */

import React, { useMemo } from 'react'
import { Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

export default function MarketStatsChart({ stats, historical }) {
  const rentRangeData = useMemo(() => {
    if (!stats) return null

    return {
      labels: ['Min', 'Average', 'Median', 'Max'],
      datasets: [
        {
          label: 'Rent Amount',
          data: [stats.minRent, stats.averageRent, stats.medianRent, stats.maxRent],
          backgroundColor: [
            'rgba(59, 130, 246, 0.6)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(239, 68, 68, 0.6)'
          ],
          borderColor: [
            '#3b82f6',
            '#3b82f6',
            '#10b981',
            '#ef4444'
          ],
          borderWidth: 2,
          borderRadius: 8
        }
      ]
    }
  }, [stats])

  const rentDistributionData = useMemo(() => {
    if (!stats) return null

    const range1 = stats.minRent
    const range2 = (stats.minRent + stats.averageRent) / 2
    const range3 = (stats.averageRent + stats.maxRent) / 2
    const range4 = stats.maxRent

    return {
      labels: [
        `$${Math.round(range1)}-$${Math.round(range2)}`,
        `$${Math.round(range2)}-$${Math.round(range3)}`,
        `$${Math.round(range3)}-$${Math.round(range4)}`
      ],
      datasets: [
        {
          label: 'Market Distribution',
          data: [25, 50, 25],
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(239, 68, 68, 0.8)'
          ],
          borderColor: [
            '#3b82f6',
            '#10b981',
            '#ef4444'
          ],
          borderWidth: 2
        }
      ]
    }
  }, [stats])

  const rentRangeOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false
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
            return `$${context.parsed.y.toLocaleString()}`
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return '$' + value.toLocaleString()
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

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: { size: 11 },
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
            return `${context.label}: ${context.parsed}%`
          }
        }
      }
    }
  }

  if (!stats || !rentRangeData || !rentDistributionData) {
    return null
  }

  return (
    <div className="bg-rentestBgLight border-2 border-rentestBorder rounded-lg p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <h2 className="text-lg font-bold text-rentestPrimary">📊 Market Statistics</h2>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rent Range Chart */}
        <div className="bg-white rounded-lg p-4 border border-rentestBorder">
          <h3 className="text-sm font-bold text-rentestText mb-4">Rent Range</h3>
          <Bar data={rentRangeData} options={rentRangeOptions} height={250} />
        </div>

        {/* Distribution Chart */}
        <div className="bg-white rounded-lg p-4 border border-rentestBorder">
          <h3 className="text-sm font-bold text-rentestText mb-4">Market Distribution</h3>
          <Doughnut data={rentDistributionData} options={doughnutOptions} height={250} />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-lg p-3 border border-rentestBorder text-center">
          <p className="text-rentestText text-xs font-semibold mb-1">Min Rent</p>
          <p className="text-rentestPrimary font-bold text-lg">
            ${stats.minRent ? Math.round(stats.minRent).toLocaleString() : '—'}
          </p>
        </div>

        <div className="bg-white rounded-lg p-3 border border-rentestBorder text-center">
          <p className="text-rentestText text-xs font-semibold mb-1">Avg Rent</p>
          <p className="text-rentestPrimary font-bold text-lg">
            ${stats.averageRent ? Math.round(stats.averageRent).toLocaleString() : '—'}
          </p>
        </div>

        <div className="bg-white rounded-lg p-3 border border-rentestBorder text-center">
          <p className="text-rentestText text-xs font-semibold mb-1">Median Rent</p>
          <p className="text-rentestPrimary font-bold text-lg">
            ${stats.medianRent ? Math.round(stats.medianRent).toLocaleString() : '—'}
          </p>
        </div>

        <div className="bg-white rounded-lg p-3 border border-rentestBorder text-center">
          <p className="text-rentestText text-xs font-semibold mb-1">Max Rent</p>
          <p className="text-rentestPrimary font-bold text-lg">
            ${stats.maxRent ? Math.round(stats.maxRent).toLocaleString() : '—'}
          </p>
        </div>
      </div>
    </div>
  )
}
