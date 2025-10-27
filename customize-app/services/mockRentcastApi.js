/**
 * Mock RentCast API Service
 * Provides realistic mock data for local testing without consuming API quota
 * Enable/disable via NEXT_PUBLIC_USE_MOCK_API environment variable
 */

// Mock data for common test addresses
const MOCK_PROPERTIES = {
  '1600-pennsylvania-ave-nw-washington-dc-20500': {
    id: '1600-Pennsylvania-Ave-NW,-Washington,-DC-20500',
    formattedAddress: '1600 Pennsylvania Ave NW, Washington, DC 20500',
    addressLine1: '1600 Pennsylvania Ave NW',
    addressLine2: null,
    city: 'Washington',
    state: 'DC',
    stateFips: '11',
    zipCode: '20500',
    county: 'District of Columbia',
    countyFips: '001',
    latitude: 38.897705,
    longitude: -77.034394,
    propertyType: 'Single Family',
    bedrooms: 6,
    bathrooms: 2,
    squareFootage: 5500,
    lotSize: 18000,
    yearBuilt: 1800
  },
  '733-15th-st-nw-washington-dc-20005': {
    id: '733-15th-St-NW,-Washington,-DC-20005',
    formattedAddress: '733 15th St NW, Washington, DC 20005',
    addressLine1: '733 15th St NW',
    addressLine2: null,
    city: 'Washington',
    state: 'DC',
    stateFips: '11',
    zipCode: '20005',
    county: 'District of Columbia',
    countyFips: '001',
    latitude: 38.899837,
    longitude: -77.033371,
    propertyType: 'Apartment',
    bedrooms: 2,
    bathrooms: 2,
    squareFootage: 1200,
    lotSize: null,
    yearBuilt: 1950
  },
  '123-main-street-new-york-ny-10001': {
    id: '123-Main-St,-New-York,-NY-10001',
    formattedAddress: '123 Main St, New York, NY 10001',
    addressLine1: '123 Main St',
    addressLine2: null,
    city: 'New York',
    state: 'NY',
    stateFips: '36',
    zipCode: '10001',
    county: 'New York',
    countyFips: '061',
    latitude: 40.7128,
    longitude: -74.0060,
    propertyType: 'Condo',
    bedrooms: 1,
    bathrooms: 1,
    squareFootage: 650,
    lotSize: null,
    yearBuilt: 2000
  },
  'default': {
    id: 'mock-property-default',
    formattedAddress: '456 Oak Avenue, San Francisco, CA 94102',
    addressLine1: '456 Oak Avenue',
    addressLine2: null,
    city: 'San Francisco',
    state: 'CA',
    stateFips: '06',
    zipCode: '94102',
    county: 'San Francisco',
    countyFips: '075',
    latitude: 37.7749,
    longitude: -122.4194,
    propertyType: 'Single Family',
    bedrooms: 3,
    bathrooms: 2,
    squareFootage: 1800,
    lotSize: 5000,
    yearBuilt: 1995
  }
}

// Mock rent estimate data
const MOCK_RENT_ESTIMATES = {
  '1600-pennsylvania-ave-nw-washington-dc-20500': {
    rent: 3550,
    rentRangeLow: 2760,
    rentRangeHigh: 4340,
    latitude: 38.897705,
    longitude: -77.034394,
    subjectProperty: {
      propertyType: 'Single Family',
      bedrooms: 6,
      bathrooms: 2,
      squareFootage: 5500
    },
    comparables: [
      {
        id: 'comp-1',
        formattedAddress: '1700 Pennsylvania Ave NW, Washington, DC 20500',
        addressLine1: '1700 Pennsylvania Ave NW',
        city: 'Washington',
        state: 'DC',
        zipCode: '20500',
        propertyType: 'Single Family',
        bedrooms: 6,
        bathrooms: 2,
        squareFootage: 5400,
        price: 3600,
        listingType: 'Standard',
        listedDate: '2025-09-15T00:00:00.000Z',
        lastSeenDate: '2025-10-27T00:00:00.000Z',
        daysOnMarket: 42,
        distance: 0.3,
        daysOld: 1,
        correlation: 0.98
      },
      {
        id: 'comp-2',
        formattedAddress: '1500 Pennsylvania Ave NW, Washington, DC 20500',
        addressLine1: '1500 Pennsylvania Ave NW',
        city: 'Washington',
        state: 'DC',
        zipCode: '20500',
        propertyType: 'Single Family',
        bedrooms: 5,
        bathrooms: 2,
        squareFootage: 5200,
        price: 3400,
        listingType: 'Standard',
        listedDate: '2025-09-20T00:00:00.000Z',
        lastSeenDate: '2025-10-26T00:00:00.000Z',
        daysOnMarket: 37,
        distance: 0.5,
        daysOld: 2,
        correlation: 0.95
      }
    ]
  },
  '733-15th-st-nw-washington-dc-20005': {
    rent: 2180,
    rentRangeLow: 1830,
    rentRangeHigh: 2520,
    latitude: 38.899837,
    longitude: -77.033371,
    subjectProperty: {
      propertyType: 'Apartment',
      bedrooms: 2,
      bathrooms: 2,
      squareFootage: 1200
    },
    comparables: [
      {
        id: 'comp-3',
        formattedAddress: '733 15th St NW, Apt 508, Washington, DC 20005',
        addressLine1: '733 15th St NW',
        addressLine2: 'Apt 508',
        city: 'Washington',
        state: 'DC',
        zipCode: '20005',
        propertyType: 'Apartment',
        bedrooms: 2,
        bathrooms: 2,
        squareFootage: 1208,
        price: 2200,
        listingType: 'Standard',
        listedDate: '2025-06-13T00:00:00.000Z',
        lastSeenDate: '2025-10-27T00:00:00.000Z',
        daysOnMarket: 137,
        distance: 0.0,
        daysOld: 1,
        correlation: 0.99
      }
    ]
  },
  'default': {
    rent: 2500,
    rentRangeLow: 2100,
    rentRangeHigh: 2900,
    latitude: 37.7749,
    longitude: -122.4194,
    subjectProperty: {
      propertyType: 'Single Family',
      bedrooms: 3,
      bathrooms: 2,
      squareFootage: 1800
    },
    comparables: [
      {
        id: 'comp-default-1',
        formattedAddress: '457 Oak Avenue, San Francisco, CA 94102',
        addressLine1: '457 Oak Avenue',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94102',
        propertyType: 'Single Family',
        bedrooms: 3,
        bathrooms: 2,
        squareFootage: 1750,
        price: 2550,
        listingType: 'Standard',
        listedDate: '2025-08-01T00:00:00.000Z',
        lastSeenDate: '2025-10-25T00:00:00.000Z',
        daysOnMarket: 85,
        distance: 0.1,
        daysOld: 3,
        correlation: 0.97
      }
    ]
  }
}

/**
 * Get mock property key from address
 */
function getMockPropertyKey(address, city, state, zipCode) {
  if (!address) return 'default'
  
  const key = `${address.toLowerCase().replace(/\s+/g, '-')}-${city?.toLowerCase().replace(/\s+/g, '-')}-${state?.toUpperCase()}-${zipCode}`
    .replace(/[^a-z0-9-]/g, '')
  
  return key
}

/**
 * Mock getRentEstimate
 */
export async function mockGetRentEstimate(address, city, state, zipCode) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500))
  
  const key = getMockPropertyKey(address, city, state, zipCode)
  const estimate = MOCK_RENT_ESTIMATES[key] || MOCK_RENT_ESTIMATES.default
  
  return {
    ...estimate,
    address: address || 'Mock Address',
    city: city || 'Mock City',
    state: state || 'XX',
    zipCode: zipCode || '00000'
  }
}

/**
 * Mock getPropertyData
 */
export async function mockGetPropertyData(address, city, state, zipCode) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 300))
  
  const key = getMockPropertyKey(address, city, state, zipCode)
  const property = MOCK_PROPERTIES[key] || MOCK_PROPERTIES.default
  
  return {
    ...property,
    address: address || property.addressLine1,
    city: city || property.city,
    state: state || property.state,
    zipCode: zipCode || property.zipCode
  }
}

/**
 * Mock getComparableProperties
 * Returns realistic comparable properties data for testing filtering, sorting, and pagination
 */
export async function mockGetComparableProperties(address, city, state, zipCode, radius = 1) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 400))
  
  const key = getMockPropertyKey(address, city, state, zipCode)
  const estimate = MOCK_RENT_ESTIMATES[key] || MOCK_RENT_ESTIMATES.default
  
  // Generate extended mock data for testing pagination and filtering
  const baseComparables = estimate.comparables || []
  
  // Generate additional properties for pagination testing
  const extendedProperties = [
    ...baseComparables.map(comp => ({
      address: comp.addressLine1 || comp.formattedAddress,
      city: comp.city || city || 'Mock City',
      state: comp.state || state || 'XX',
      zipCode: comp.zipCode || zipCode || '00000',
      rent: comp.price || 2500,
      bedrooms: comp.bedrooms || 3,
      bathrooms: comp.bathrooms || 2,
      squareFootage: comp.squareFootage || 1800,
      propertyType: comp.propertyType || 'Single Family',
      daysOnMarket: comp.daysOnMarket || 45,
      listingUrl: `https://example.com/listing/${comp.id}`,
      latitude: 37.7749 + (Math.random() - 0.5) * 0.05,
      longitude: -122.4194 + (Math.random() - 0.5) * 0.05,
      distance: comp.distance || Math.random() * 2
    })),
    // Add more mock properties for pagination testing
    {
      address: '458 Oak Avenue',
      city: city || 'Mock City',
      state: state || 'XX',
      zipCode: zipCode || '00000',
      rent: 2600,
      bedrooms: 3,
      bathrooms: 2,
      squareFootage: 1850,
      propertyType: 'Single Family',
      daysOnMarket: 52,
      listingUrl: 'https://example.com/listing/comp-extra-1',
      latitude: 37.7750,
      longitude: -122.4193,
      distance: 0.15
    },
    {
      address: '459 Oak Avenue',
      city: city || 'Mock City',
      state: state || 'XX',
      zipCode: zipCode || '00000',
      rent: 2450,
      bedrooms: 2,
      bathrooms: 2,
      squareFootage: 1600,
      propertyType: 'Condo',
      daysOnMarket: 28,
      listingUrl: 'https://example.com/listing/comp-extra-2',
      latitude: 37.7751,
      longitude: -122.4192,
      distance: 0.22
    },
    {
      address: '460 Oak Avenue',
      city: city || 'Mock City',
      state: state || 'XX',
      zipCode: zipCode || '00000',
      rent: 2750,
      bedrooms: 4,
      bathrooms: 3,
      squareFootage: 2100,
      propertyType: 'Single Family',
      daysOnMarket: 15,
      listingUrl: 'https://example.com/listing/comp-extra-3',
      latitude: 37.7752,
      longitude: -122.4191,
      distance: 0.35
    },
    {
      address: '461 Oak Avenue',
      city: city || 'Mock City',
      state: state || 'XX',
      zipCode: zipCode || '00000',
      rent: 2300,
      bedrooms: 2,
      bathrooms: 1,
      squareFootage: 1400,
      propertyType: 'Apartment',
      daysOnMarket: 67,
      listingUrl: 'https://example.com/listing/comp-extra-4',
      latitude: 37.7753,
      longitude: -122.4190,
      distance: 0.45
    },
    {
      address: '462 Oak Avenue',
      city: city || 'Mock City',
      state: state || 'XX',
      zipCode: zipCode || '00000',
      rent: 2900,
      bedrooms: 3,
      bathrooms: 2,
      squareFootage: 1950,
      propertyType: 'Single Family',
      daysOnMarket: 8,
      listingUrl: 'https://example.com/listing/comp-extra-5',
      latitude: 37.7754,
      longitude: -122.4189,
      distance: 0.55
    }
  ]
  
  // Calculate statistics
  const rentValues = extendedProperties.map(p => p.rent).filter(r => r > 0)
  const averageRent = rentValues.length > 0
    ? Math.round(rentValues.reduce((a, b) => a + b, 0) / rentValues.length)
    : 0
  const medianRent = rentValues.length > 0
    ? Math.round(calculateMockMedian(rentValues))
    : 0
  
  return {
    properties: extendedProperties,
    count: extendedProperties.length,
    searchRadius: radius,
    averageRent,
    medianRent,
    address: address || 'Mock Address',
    city: city || 'Mock City',
    state: state || 'XX',
    zipCode: zipCode || '00000'
  }
}

/**
 * Calculate median for mock data
 * @private
 */
function calculateMockMedian(values) {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2
}

/**
 * Mock getMarketStatistics
 */
export async function mockGetMarketStatistics(zipCode) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 300))
  
  return {
    zipCode: zipCode || '00000',
    averageRent: 2500,
    medianRent: 2400,
    rentTrend: 2.5, // percent change
    averageDaysOnMarket: 45,
    listingCount: 125,
    marketTightness: 'moderate',
    pricePerSqFt: 2.1,
    yearOverYearChange: 3.2
  }
}

/**
 * Mock searchProperties
 */
export async function mockSearchProperties(query) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300))
  
  // Return mock search results
  return [
    {
      id: 'search-result-1',
      formattedAddress: '123 Main St, New York, NY 10001',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      latitude: 40.7128,
      longitude: -74.0060
    },
    {
      id: 'search-result-2',
      formattedAddress: '456 Oak Avenue, San Francisco, CA 94102',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      latitude: 37.7749,
      longitude: -122.4194
    }
  ]
}

const mockRentcastApi = {
  mockGetRentEstimate,
  mockGetPropertyData,
  mockGetComparableProperties,
  mockGetMarketStatistics,
  mockSearchProperties
}

export default mockRentcastApi
