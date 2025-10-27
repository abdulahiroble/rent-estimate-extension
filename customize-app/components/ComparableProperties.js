/**
 * Comparable Properties Component
 * Displays nearby rental comps with filtering, sorting, and pagination
 */

import { useState, useEffect } from 'react'
import { getComparableProperties, getCacheStats } from '@/services/rentcastApi'
import { transformComparablePropertiesForUI } from '@/utils/responseTransformer'
import PropertyCard from './PropertyCard'

export default function ComparableProperties({ address, city, state, zipCode, onPropertiesLoad, onLoadingChange }) {
  // State management
  const [properties, setProperties] = useState([])
  const [filteredProperties, setFilteredProperties] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [totalCount, setTotalCount] = useState(0)

  // Filter and sort state
  const [propertyType, setPropertyType] = useState('')
  const [sortBy, setSortBy] = useState('price')
  const [sortOrder, setSortOrder] = useState('asc')

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(6)
  const [totalPages, setTotalPages] = useState(0)

  // Fetch comparable properties
  useEffect(() => {
    if (!address || !city || !state || !zipCode) {
      setProperties([])
      setFilteredProperties([])
      return
    }

    const fetchComparables = async () => {
      try {
        setLoading(true)
        onLoadingChange?.(true)
        setError(null)

        const result = await getComparableProperties(
          address,
          city,
          state,
          zipCode,
          {
            propertyType: propertyType || undefined,
            sortBy,
            sortOrder,
            page: currentPage,
            pageSize
          }
        )

        // Transform data for UI display
        const uiData = transformComparablePropertiesForUI(result)

        setProperties(uiData.properties)
        setTotalCount(uiData.totalCount)
        setTotalPages(uiData.totalPages)
        setFilteredProperties(uiData.properties)
        
        // Notify parent component of properties
        onPropertiesLoad?.(uiData.properties)
      } catch (err) {
        console.error('Error fetching comparable properties:', err)
        setError(err.userMessage || 'Failed to load comparable properties')
        setProperties([])
        setFilteredProperties([])
        onPropertiesLoad?.([])
      } finally {
        setLoading(false)
        onLoadingChange?.(false)
      }
    }

    fetchComparables()
  }, [address, city, state, zipCode, propertyType, sortBy, sortOrder, currentPage, pageSize, onPropertiesLoad, onLoadingChange])

  // Handle filter change
  const handleFilterChange = (e) => {
    setPropertyType(e.target.value)
    setCurrentPage(1) // Reset to first page
  }

  // Handle sort change
  const handleSortChange = (e) => {
    const [field, order] = e.target.value.split('-')
    setSortBy(field)
    setSortOrder(order)
    setCurrentPage(1) // Reset to first page
  }

  // Handle page change
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  // Get unique property types from properties
  const getPropertyTypes = () => {
    const types = new Set(properties.map(p => p.propertyType))
    return Array.from(types).sort()
  }

  // Render empty state
  if (!address) {
    return null
  }

  if (error) {
    return (
      <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Comparable Properties</h3>
        <p className="text-red-700">{error}</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6">🏘️ Comparable Properties</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-64 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (!filteredProperties || filteredProperties.length === 0) {
    return (
      <div className="mt-8 p-8 bg-gray-50 border border-gray-200 rounded-lg text-center">
        <div className="text-4xl mb-3">🔍</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Comparable Properties Found</h3>
        <p className="text-gray-600 mb-4">
          We couldn&apos;t find comparable properties for this location. Try searching in a different area.
        </p>
      </div>
    )
  }

  return (
    <div className="mt-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">🏘️ Comparable Properties</h2>
        <p className="text-gray-600">
          Showing {filteredProperties.length} of {totalCount} properties
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Filter by Property Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Type
          </label>
          <select
            value={propertyType}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Types</option>
            {getPropertyTypes().map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={handleSortChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
            <option value="distance-asc">Distance (Closest First)</option>
            <option value="distance-desc">Distance (Farthest First)</option>
            <option value="daysOnMarket-asc">Days on Market (Newest)</option>
            <option value="daysOnMarket-desc">Days on Market (Oldest)</option>
            <option value="bedrooms-asc">Bedrooms (Fewest)</option>
            <option value="bedrooms-desc">Bedrooms (Most)</option>
          </select>
        </div>

        {/* Page Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Results Per Page
          </label>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value))
              setCurrentPage(1)
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={6}>6 per page</option>
            <option value={12}>12 per page</option>
            <option value={20}>20 per page</option>
          </select>
        </div>
      </div>

      {/* Property Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {filteredProperties.map(property => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
          >
            ← Previous
          </button>

          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
          >
            Next →
          </button>
        </div>
      )}

      {/* Cache Info (Debug) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 text-xs text-gray-500">
          <details>
            <summary className="cursor-pointer">Cache Stats</summary>
            <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto">
              {JSON.stringify(getCacheStats(), null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  )
}
