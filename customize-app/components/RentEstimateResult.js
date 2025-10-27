/**
 * Rent Estimate Result Component
 * Displays rent estimate data with confidence score and property details
 */

import React from 'react'
import { formatCurrency, formatNumber } from '../utils/responseTransformer'

export default function RentEstimateResult({ estimate, loading, error, onReset }) {
  if (loading) {
    return (
      <div className="bg-rentestBgLight rounded-lg p-6 max-w-md mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-rentestBorder rounded w-3/4"></div>
          <div className="h-12 bg-rentestBorder rounded"></div>
          <div className="h-4 bg-rentestBorder rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (error) {
    const isQuotaExceeded = error.toLowerCase().includes('limit reached') || 
                           error.toLowerCase().includes('quota exceeded') ||
                           error.toLowerCase().includes('upgrade to premium')
    
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 max-w-md mx-auto">
        <h3 className="text-lg font-bold text-red-700 mb-2">
          {isQuotaExceeded ? '🔒 Monthly Limit Reached' : 'Error'}
        </h3>
        <p className="text-red-600 mb-4">{error}</p>
        
        {isQuotaExceeded ? (
          <div className="space-y-2">
            <button
              onClick={() => {
                // Open ExtPay payment page
                if (typeof window !== 'undefined' && window.extpay) {
                  window.extpay.openPaymentPage()
                } else {
                  // Fallback: open in new window
                  window.open('https://extensionpay.com/checkout/rentestrentestimates', '_blank')
                }
              }}
              className="w-full bg-rentestPrimary hover:bg-rentestSecondary text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              🚀 Upgrade to Premium
            </button>
            <button
              onClick={() => {
                // Start free trial
                if (typeof window !== 'undefined' && window.extpay) {
                  window.extpay.openTrialPage()
                } else {
                  // Fallback: open in new window
                  window.open('https://extensionpay.com/checkout/rentestrentestimates?trial=true', '_blank')
                }
              }}
              className="w-full bg-rentestAccent hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              🎯 Start Free Trial
            </button>
            <button
              onClick={onReset}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <p className="text-xs text-gray-500 text-center mt-2">
              14-day free trial • Cancel anytime • Unlimited searches
            </p>
          </div>
        ) : (
          <button
            onClick={onReset}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    )
  }

  if (!estimate) {
    return null
  }

  const confidencePercent = Math.round((estimate.confidence || 0.5) * 100)
  const confidenceColor =
    confidencePercent >= 80
      ? 'text-rentestSuccess'
      : confidencePercent >= 60
      ? 'text-rentestWarning'
      : 'text-rentestDanger'

  return (
    <div className="bg-rentestBgLight border-2 border-rentestBorder rounded-lg p-6 max-w-md mx-auto">
      {/* Property Address */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-rentestPrimary mb-2">
          {estimate.address}
        </h2>
        <p className="text-rentestText text-sm">
          {estimate.city}, {estimate.state} {estimate.zipCode}
        </p>
      </div>

      {/* Main Estimate */}
      <div className="bg-white rounded-lg p-4 mb-6 border border-rentestBorder">
        <p className="text-rentestText text-sm font-semibold mb-2">Estimated Monthly Rent</p>
        <p className="text-4xl font-bold text-rentestPrimary mb-2">
          {formatCurrency(estimate.rentEstimate)}
        </p>
        <p className="text-rentestText text-xs">
          Range: {formatCurrency(estimate.rentEstimateMin)} - {formatCurrency(estimate.rentEstimateMax)}
        </p>
      </div>

      {/* Property Details */}
      {(estimate.bedrooms || estimate.bathrooms || estimate.squareFeet) && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          {estimate.bedrooms !== null && (
            <div className="bg-white rounded-lg p-3 border border-rentestBorder text-center">
              <p className="text-rentestText text-xs font-semibold">Bedrooms</p>
              <p className="text-xl font-bold text-rentestPrimary">{estimate.bedrooms}</p>
            </div>
          )}
          {estimate.bathrooms !== null && (
            <div className="bg-white rounded-lg p-3 border border-rentestBorder text-center">
              <p className="text-rentestText text-xs font-semibold">Bathrooms</p>
              <p className="text-xl font-bold text-rentestPrimary">{estimate.bathrooms}</p>
            </div>
          )}
          {estimate.squareFeet !== null && (
            <div className="bg-white rounded-lg p-3 border border-rentestBorder text-center">
              <p className="text-rentestText text-xs font-semibold">Sq Ft</p>
              <p className="text-xl font-bold text-rentestPrimary">
                {formatNumber(estimate.squareFeet)}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Property Type */}
      {estimate.propertyType && (
        <div className="bg-white rounded-lg p-3 mb-6 border border-rentestBorder">
          <p className="text-rentestText text-xs font-semibold">Property Type</p>
          <p className="text-rentestPrimary font-semibold">{estimate.propertyType}</p>
        </div>
      )}

      {/* Confidence Score */}
      <div className="bg-white rounded-lg p-4 mb-6 border border-rentestBorder">
        <div className="flex justify-between items-center mb-2">
          <p className="text-rentestText text-sm font-semibold">Estimate Confidence</p>
          <p className={`text-sm font-bold ${confidenceColor}`}>{confidencePercent}%</p>
        </div>
        <div className="w-full bg-rentestBorder rounded-full h-2">
          <div
            className="bg-rentestSuccess h-2 rounded-full transition-all duration-300"
            style={{ width: `${confidencePercent}%` }}
          ></div>
        </div>
      </div>

      {/* Last Updated */}
      {estimate.lastUpdated && (
        <p className="text-rentestText text-xs text-center mb-4">
          Last updated: {new Date(estimate.lastUpdated).toLocaleDateString()}
        </p>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onReset}
          className="flex-1 bg-rentestPrimary hover:bg-rentestSecondary text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          New Search
        </button>
        <button
          className="flex-1 bg-rentestAccent hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          title="Save this estimate"
        >
          💾 Save
        </button>
      </div>
    </div>
  )
}
