/**
 * Property Information Component
 * Displays comprehensive property details retrieved from the RentCast API
 */

import React, { useState, useEffect, useCallback } from 'react'
import { formatCurrency, formatNumber } from '../utils/responseTransformer'
import rentcastApi from '../services/rentcastApi'

export default function PropertyInformation({ address, city, state, zipCode, loading, error }) {
  const [propertyDetails, setPropertyDetails] = useState(null)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [detailsError, setDetailsError] = useState(null)

  const fetchPropertyDetails = useCallback(async () => {
    setDetailsLoading(true)
    setDetailsError(null)
    
    try {
      const details = await rentcastApi.getPropertyDetails(address, city, state, zipCode)
      setPropertyDetails(details)
    } catch (error) {
      console.error('Error fetching property details:', error)
      setDetailsError(error.message || 'Failed to fetch property details')
    } finally {
      setDetailsLoading(false)
    }
  }, [address, city, state, zipCode])

  // Fetch property details when address information changes
  useEffect(() => {
    if (address && city && state && zipCode) {
      fetchPropertyDetails()
    } else {
      setPropertyDetails(null)
      setDetailsError(null)
    }
  }, [address, city, state, zipCode, fetchPropertyDetails])

  // Show loading state
  if (loading || detailsLoading) {
    return (
      <div className="bg-rentestBgLight rounded-lg p-6 max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-rentestBorder rounded w-3/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 bg-rentestBorder rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error || detailsError) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 max-w-4xl mx-auto">
        <h3 className="text-lg font-bold text-red-700 mb-2">Error Loading Property Information</h3>
        <p className="text-red-600">{error || detailsError}</p>
      </div>
    )
  }

  // Show no data state
  if (!propertyDetails) {
    return (
      <div className="bg-rentestBgLight rounded-lg p-6 max-w-4xl mx-auto">
        <p className="text-rentestText text-center">Enter an address to view property information</p>
      </div>
    )
  }

  return (
    <div className="bg-rentestBgLight rounded-lg p-6 max-w-4xl mx-auto">
      {/* Property Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-rentestPrimary mb-2">
          {propertyDetails.address}
        </h2>
        <p className="text-rentestText text-lg">
          {propertyDetails.city}, {propertyDetails.state} {propertyDetails.zipCode}
        </p>
        {propertyDetails.latitude && propertyDetails.longitude && (
          <p className="text-rentestText text-sm mt-1">
            📍 {propertyDetails.latitude.toFixed(6)}, {propertyDetails.longitude.toFixed(6)}
          </p>
        )}
      </div>

      {/* Basic Property Information */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-rentestPrimary mb-4">Basic Information</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {propertyDetails.bedrooms !== null && (
            <div className="bg-white rounded-lg p-4 border border-rentestBorder text-center">
              <p className="text-rentestText text-sm font-semibold mb-1">Bedrooms</p>
              <p className="text-2xl font-bold text-rentestPrimary">{propertyDetails.bedrooms}</p>
            </div>
          )}
          {propertyDetails.bathrooms !== null && (
            <div className="bg-white rounded-lg p-4 border border-rentestBorder text-center">
              <p className="text-rentestText text-sm font-semibold mb-1">Bathrooms</p>
              <p className="text-2xl font-bold text-rentestPrimary">{propertyDetails.bathrooms}</p>
            </div>
          )}
          {propertyDetails.squareFeet !== null && (
            <div className="bg-white rounded-lg p-4 border border-rentestBorder text-center">
              <p className="text-rentestText text-sm font-semibold mb-1">Square Feet</p>
              <p className="text-2xl font-bold text-rentestPrimary">
                {formatNumber(propertyDetails.squareFeet)}
              </p>
            </div>
          )}
          <div className="bg-white rounded-lg p-4 border border-rentestBorder text-center">
            <p className="text-rentestText text-sm font-semibold mb-1">Property Type</p>
            <p className="text-lg font-bold text-rentestPrimary capitalize">
              {propertyDetails.propertyType?.toLowerCase() || 'Unknown'}
            </p>
          </div>
        </div>
      </div>

      {/* Property Features */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-rentestPrimary mb-4">Property Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {propertyDetails.yearBuilt !== null && (
            <div className="bg-white rounded-lg p-4 border border-rentestBorder">
              <p className="text-rentestText text-sm font-semibold mb-1">Year Built</p>
              <p className="text-lg font-bold text-rentestPrimary">{propertyDetails.yearBuilt}</p>
            </div>
          )}
          {propertyDetails.stories !== null && (
            <div className="bg-white rounded-lg p-4 border border-rentestBorder">
              <p className="text-rentestText text-sm font-semibold mb-1">Stories</p>
              <p className="text-lg font-bold text-rentestPrimary">{propertyDetails.stories}</p>
            </div>
          )}
          {propertyDetails.lotSize !== null && (
            <div className="bg-white rounded-lg p-4 border border-rentestBorder">
              <p className="text-rentestText text-sm font-semibold mb-1">Lot Size</p>
              <p className="text-lg font-bold text-rentestPrimary">
                {formatNumber(propertyDetails.lotSize)} sq ft
              </p>
            </div>
          )}
          {propertyDetails.garage !== null && (
            <div className="bg-white rounded-lg p-4 border border-rentestBorder">
              <p className="text-rentestText text-sm font-semibold mb-1">Garage</p>
              <p className="text-lg font-bold text-rentestPrimary capitalize">
                {propertyDetails.garage}
              </p>
            </div>
          )}
          <div className="bg-white rounded-lg p-4 border border-rentestBorder">
            <p className="text-rentestText text-sm font-semibold mb-1">Pool</p>
            <p className="text-lg font-bold text-rentestPrimary">
              {propertyDetails.pool ? 'Yes' : 'No'}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-rentestBorder">
            <p className="text-rentestText text-sm font-semibold mb-1">Basement</p>
            <p className="text-lg font-bold text-rentestPrimary">
              {propertyDetails.basement ? 'Yes' : 'No'}
            </p>
          </div>
        </div>
      </div>

      {/* Financial Information */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-rentestPrimary mb-4">Financial Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {propertyDetails.lastSalePrice !== null && (
            <div className="bg-white rounded-lg p-4 border border-rentestBorder">
              <p className="text-rentestText text-sm font-semibold mb-1">Last Sale Price</p>
              <p className="text-xl font-bold text-rentestPrimary">
                {formatCurrency(propertyDetails.lastSalePrice)}
              </p>
              {propertyDetails.lastSaleDate && (
                <p className="text-rentestText text-xs mt-1">
                  Sold: {new Date(propertyDetails.lastSaleDate).toLocaleDateString()}
                </p>
              )}
            </div>
          )}
          {propertyDetails.taxAssessedValue !== null && (
            <div className="bg-white rounded-lg p-4 border border-rentestBorder">
              <p className="text-rentestText text-sm font-semibold mb-1">Tax Assessed Value</p>
              <p className="text-xl font-bold text-rentestPrimary">
                {formatCurrency(propertyDetails.taxAssessedValue)}
              </p>
            </div>
          )}
          {propertyDetails.annualPropertyTax !== null && (
            <div className="bg-white rounded-lg p-4 border border-rentestBorder">
              <p className="text-rentestText text-sm font-semibold mb-1">Annual Property Tax</p>
              <p className="text-xl font-bold text-rentestPrimary">
                {formatCurrency(propertyDetails.annualPropertyTax)}
              </p>
            </div>
          )}
          {propertyDetails.rentEstimate !== null && (
            <div className="bg-rentestAccent bg-opacity-10 rounded-lg p-4 border border-rentestAccent">
              <p className="text-rentestText text-sm font-semibold mb-1">Rent Estimate</p>
              <p className="text-xl font-bold text-rentestPrimary">
                {formatCurrency(propertyDetails.rentEstimate)}
              </p>
              {propertyDetails.rentEstimateMin !== null && propertyDetails.rentEstimateMax !== null && (
                <p className="text-rentestText text-xs mt-1">
                  Range: {formatCurrency(propertyDetails.rentEstimateMin)} - {formatCurrency(propertyDetails.rentEstimateMax)}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-white rounded-lg p-4 border border-rentestBorder">
        <div className="flex items-center justify-between">
          <p className="text-rentestText text-sm">
            Property information sourced from public records and RentCast API
          </p>
          <button
            onClick={fetchPropertyDetails}
            className="text-rentestPrimary hover:text-rentestSecondary text-sm font-semibold transition-colors"
            title="Refresh property information"
          >
            🔄 Refresh
          </button>
        </div>
      </div>
    </div>
  )
}
