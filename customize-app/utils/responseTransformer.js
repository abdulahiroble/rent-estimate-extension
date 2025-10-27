/**
 * Response transformer for RentCast API data
 * Standardizes and normalizes API responses
 */

/**
 * Transform rent estimate response
 */
export function transformRentEstimate(data) {
  if (!data) return null
  
  // Extract property attributes from subjectProperty if available
  const subjectProperty = data.subjectProperty || {}
  
  return {
    address: data.address || '',
    city: data.city || '',
    state: data.state || '',
    zipCode: data.zipCode || '',
    rentEstimate: Math.round(data.rent || 0),
    rentEstimateMin: Math.round(data.rentRangeLow || 0),
    rentEstimateMax: Math.round(data.rentRangeHigh || 0),
    bedrooms: subjectProperty.bedrooms || null,
    bathrooms: subjectProperty.bathrooms || null,
    squareFeet: subjectProperty.squareFootage || null,
    propertyType: subjectProperty.propertyType || 'Unknown',
    lastUpdated: data.lastUpdated || new Date().toISOString(),
    confidence: calculateConfidence(data),
    comparables: data.comparables || []
  }
}

/**
 * Transform comparable properties response
 */
export function transformComparableProperties(data) {
  if (!data || !data.properties) return null
  
  return {
    properties: (data.properties || []).map(prop => ({
      address: prop.address || '',
      city: prop.city || '',
      state: prop.state || '',
      zipCode: prop.zipCode || '',
      rent: Math.round(prop.rent || 0),
      bedrooms: prop.bedrooms || null,
      bathrooms: prop.bathrooms || null,
      squareFeet: prop.squareFeet || null,
      propertyType: prop.propertyType || 'Unknown',
      daysOnMarket: prop.daysOnMarket || null,
      listingUrl: prop.listingUrl || null
    })),
    count: data.count || 0,
    searchRadius: data.searchRadius || 1,
    averageRent: Math.round(data.averageRent || 0),
    medianRent: Math.round(data.medianRent || 0),
    rentRange: {
      min: Math.round(Math.min(...(data.properties || []).map(p => p.rent || 0))),
      max: Math.round(Math.max(...(data.properties || []).map(p => p.rent || 0)))
    }
  }
}

/**
 * Transform market statistics response
 */
export function transformMarketStatistics(data) {
  if (!data) return null
  
  return {
    zipCode: data.zipCode || '',
    city: data.city || '',
    state: data.state || '',
    averageRent: Math.round(data.averageRent || 0),
    medianRent: Math.round(data.medianRent || 0),
    rentMin: Math.round(data.rentMin || 0),
    rentMax: Math.round(data.rentMax || 0),
    rentRange: {
      min: Math.round(data.rentMin || 0),
      max: Math.round(data.rentMax || 0)
    },
    listingCount: data.listingCount || 0,
    averageDaysOnMarket: Math.round(data.averageDaysOnMarket || 0),
    rentTrend: data.rentTrend || 'stable',
    rentChangePercent: parseFloat((data.rentChangePercent || 0).toFixed(2)),
    marketHealth: calculateMarketHealth(data)
  }
}

/**
 * Transform historical market data response
 */
export function transformHistoricalMarketData(data) {
  if (!data || !data.data) return null
  
  return {
    zipCode: data.zipCode || '',
    city: data.city || '',
    state: data.state || '',
    data: (data.data || []).map(point => ({
      date: point.date || '',
      averageRent: Math.round(point.averageRent || 0),
      medianRent: Math.round(point.medianRent || 0),
      listingCount: point.listingCount || 0
    })),
    trend: calculateTrend(data.data || [])
  }
}

/**
 * Transform property search response
 */
export function transformPropertySearch(data) {
  if (!data || !data.results) return null
  
  return {
    results: (data.results || []).map(result => ({
      address: result.address || '',
      city: result.city || '',
      state: result.state || '',
      zipCode: result.zipCode || '',
      bedrooms: result.bedrooms || null,
      bathrooms: result.bathrooms || null,
      squareFeet: result.squareFeet || null,
      propertyType: result.propertyType || 'Unknown',
      yearBuilt: result.yearBuilt || null,
      lastSalePrice: result.lastSalePrice || null,
      lastSaleDate: result.lastSaleDate || null
    })),
    count: data.count || 0,
    totalCount: data.totalCount || 0
  }
}

/**
 * Transform property details response
 */
export function transformPropertyDetails(data) {
  if (!data) return null
  
  return {
    address: data.address || '',
    city: data.city || '',
    state: data.state || '',
    zipCode: data.zipCode || '',
    latitude: data.latitude || null,
    longitude: data.longitude || null,
    bedrooms: data.bedrooms || null,
    bathrooms: data.bathrooms || null,
    squareFeet: data.squareFeet || null,
    propertyType: data.propertyType || 'Unknown',
    yearBuilt: data.yearBuilt || null,
    lotSize: data.lotSize || null,
    stories: data.stories || null,
    garage: data.garage || null,
    pool: data.pool || false,
    basement: data.basement || false,
    lastSalePrice: data.lastSalePrice || null,
    lastSaleDate: data.lastSaleDate || null,
    taxAssessedValue: data.taxAssessedValue || null,
    annualPropertyTax: data.annualPropertyTax || null,
    rentEstimate: data.rentEstimate ? Math.round(data.rentEstimate) : null,
    rentEstimateMin: data.rentEstimateMin ? Math.round(data.rentEstimateMin) : null,
    rentEstimateMax: data.rentEstimateMax ? Math.round(data.rentEstimateMax) : null
  }
}

/**
 * Calculate confidence score for rent estimate
 */
function calculateConfidence(data) {
  let confidence = 0.5 // Base confidence
  
  // Increase confidence if we have more data points
  if (data.bedrooms) confidence += 0.1
  if (data.bathrooms) confidence += 0.1
  if (data.squareFeet) confidence += 0.1
  if (data.propertyType) confidence += 0.1
  
  // Ensure confidence is between 0 and 1
  return Math.min(Math.max(confidence, 0), 1)
}

/**
 * Calculate market health score
 */
function calculateMarketHealth(data) {
  let health = 'neutral'
  
  if (data.rentTrend === 'up') {
    health = data.rentChangePercent > 5 ? 'hot' : 'warming'
  } else if (data.rentTrend === 'down') {
    health = data.rentChangePercent < -5 ? 'cold' : 'cooling'
  }
  
  return health
}

/**
 * Calculate trend from historical data
 */
function calculateTrend(dataPoints) {
  if (!dataPoints || dataPoints.length < 2) {
    return 'insufficient_data'
  }
  
  const first = dataPoints[0]?.averageRent || 0
  const last = dataPoints[dataPoints.length - 1]?.averageRent || 0
  
  if (first === 0) return 'insufficient_data'
  
  const percentChange = ((last - first) / first) * 100
  
  if (percentChange > 2) return 'up'
  if (percentChange < -2) return 'down'
  return 'stable'
}

/**
 * Format currency for display
 */
export function formatCurrency(value) {
  if (value === null || value === undefined) return 'N/A'
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

/**
 * Format number for display
 */
export function formatNumber(value) {
  if (value === null || value === undefined) return 'N/A'
  
  return new Intl.NumberFormat('en-US').format(value)
}

/**
 * Format percentage for display
 */
export function formatPercentage(value) {
  if (value === null || value === undefined) return 'N/A'
  
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}
