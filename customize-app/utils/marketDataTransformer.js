/**
 * Market Data Transformer
 * Transforms RentCast market data for UI consumption
 */

/**
 * Transform market statistics response
 */
export function transformMarketStatistics(data) {
  if (!data) {
    return null
  }

  return {
    zipCode: data.zipCode || '',
    city: data.city || '',
    state: data.state || '',
    averageRent: Math.round(data.averageRent || 0),
    medianRent: Math.round(data.medianRent || 0),
    minRent: Math.round(data.minRent || 0),
    maxRent: Math.round(data.maxRent || 0),
    rentGrowth: parseFloat((data.rentGrowth || 0).toFixed(2)),
    vacancyRate: parseFloat((data.vacancyRate || 0).toFixed(2)),
    totalListings: data.totalListings || 0,
    averageListingPrice: Math.round(data.averageListingPrice || 0),
    pricePerSqft: parseFloat((data.pricePerSqft || 0).toFixed(2)),
    marketTrend: getMarketTrend(data.rentGrowth),
    lastUpdated: data.lastUpdated || new Date().toISOString()
  }
}

/**
 * Transform historical market data
 */
export function transformHistoricalMarketData(data) {
  if (!data || !Array.isArray(data.items)) {
    return null
  }

  return {
    zipCode: data.zipCode || '',
    city: data.city || '',
    state: data.state || '',
    items: data.items.map((item) => ({
      date: item.date || '',
      month: item.month || '',
      year: item.year || '',
      averageRent: Math.round(item.averageRent || 0),
      medianRent: Math.round(item.medianRent || 0),
      rentGrowth: parseFloat((item.rentGrowth || 0).toFixed(2)),
      vacancyRate: parseFloat((item.vacancyRate || 0).toFixed(2)),
      totalListings: item.totalListings || 0
    })),
    trend: calculateTrend(data.items),
    lastUpdated: data.lastUpdated || new Date().toISOString()
  }
}

/**
 * Calculate market trend from historical data
 */
function calculateTrend(items) {
  if (!items || items.length < 2) {
    return { direction: 'stable', change: 0 }
  }

  const oldest = items[0]
  const newest = items[items.length - 1]

  const oldRent = oldest.averageRent || 0
  const newRent = newest.averageRent || 0

  const change = newRent - oldRent
  const percentChange = oldRent > 0 ? (change / oldRent) * 100 : 0

  let direction = 'stable'
  if (percentChange > 2) {
    direction = 'up'
  } else if (percentChange < -2) {
    direction = 'down'
  }

  return {
    direction,
    change: Math.round(change),
    percentChange: parseFloat(percentChange.toFixed(2))
  }
}

/**
 * Get market trend description
 */
function getMarketTrend(rentGrowth) {
  const growth = parseFloat(rentGrowth || 0)

  if (growth > 5) {
    return 'strong_growth'
  } else if (growth > 2) {
    return 'moderate_growth'
  } else if (growth > -2) {
    return 'stable'
  } else if (growth > -5) {
    return 'moderate_decline'
  } else {
    return 'strong_decline'
  }
}

/**
 * Get trend emoji
 */
export function getTrendEmoji(trend) {
  const trendMap = {
    strong_growth: '📈',
    moderate_growth: '↗️',
    stable: '➡️',
    moderate_decline: '↘️',
    strong_decline: '📉'
  }

  return trendMap[trend] || '➡️'
}

/**
 * Get trend color
 */
export function getTrendColor(trend) {
  const colorMap = {
    strong_growth: 'text-rentestSuccess',
    moderate_growth: 'text-green-500',
    stable: 'text-rentestText',
    moderate_decline: 'text-yellow-500',
    strong_decline: 'text-rentestDanger'
  }

  return colorMap[trend] || 'text-rentestText'
}

/**
 * Format rent for display
 */
export function formatRent(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

/**
 * Format percentage for display
 */
export function formatPercentage(value) {
  return `${parseFloat(value).toFixed(2)}%`
}

/**
 * Get market insight summary
 */
export function getMarketInsightSummary(stats) {
  if (!stats) {
    return null
  }

  const insights = []

  // Rent growth insight
  if (stats.rentGrowth > 5) {
    insights.push({
      type: 'growth',
      message: `Rents growing at ${stats.rentGrowth.toFixed(1)}% annually`,
      emoji: '📈'
    })
  } else if (stats.rentGrowth < -2) {
    insights.push({
      type: 'decline',
      message: `Rents declining at ${Math.abs(stats.rentGrowth).toFixed(1)}% annually`,
      emoji: '📉'
    })
  }

  // Vacancy insight
  if (stats.vacancyRate > 10) {
    insights.push({
      type: 'vacancy',
      message: `High vacancy rate: ${stats.vacancyRate.toFixed(1)}%`,
      emoji: '🏚️'
    })
  } else if (stats.vacancyRate < 3) {
    insights.push({
      type: 'tight_market',
      message: `Tight market: ${stats.vacancyRate.toFixed(1)}% vacancy`,
      emoji: '🔥'
    })
  }

  // Market activity insight
  if (stats.totalListings > 100) {
    insights.push({
      type: 'active_market',
      message: `Active market: ${stats.totalListings} listings`,
      emoji: '📊'
    })
  }

  return insights
}

/**
 * Compare two market statistics
 */
export function compareMarketStats(current, previous) {
  if (!current || !previous) {
    return null
  }

  return {
    rentChange: current.averageRent - previous.averageRent,
    rentChangePercent: previous.averageRent > 0
      ? ((current.averageRent - previous.averageRent) / previous.averageRent) * 100
      : 0,
    vacancyChange: current.vacancyRate - previous.vacancyRate,
    listingChange: current.totalListings - previous.totalListings,
    direction: current.averageRent > previous.averageRent ? 'up' : 'down'
  }
}

const marketDataTransformer = {
  transformMarketStatistics,
  transformHistoricalMarketData,
  getTrendEmoji,
  getTrendColor,
  formatRent,
  formatPercentage,
  getMarketInsightSummary,
  compareMarketStats
}

export default marketDataTransformer
