/**
 * RentCast API TypeScript Interfaces
 * Type definitions for all RentCast API requests and responses
 */

// ============ Rent Estimate Types ============

export interface RentEstimateRequest {
  address?: string
  city?: string
  state?: string
  zipCode?: string
}

export interface RentEstimateResponse {
  address: string
  city: string
  state: string
  zipCode: string
  rentEstimate: number
  rentEstimateMin: number
  rentEstimateMax: number
  bedrooms?: number
  bathrooms?: number
  squareFeet?: number
  propertyType?: string
  lastUpdated?: string
}

// ============ Comparable Properties Types ============

export interface ComparableProperty {
  address: string
  city: string
  state: string
  zipCode: string
  rent: number
  bedrooms?: number
  bathrooms?: number
  squareFeet?: number
  propertyType?: string
  daysOnMarket?: number
  listingUrl?: string
  latitude?: number
  longitude?: number
  distance?: number
}

export interface ComparablePropertiesRequest {
  address?: string
  city?: string
  state?: string
  zipCode?: string
  radius?: number
}

export interface ComparablePropertiesOptions {
  radius?: number
  propertyType?: string | null
  sortBy?: 'price' | 'distance' | 'daysOnMarket' | 'bedrooms' | 'bathrooms' | 'squareFeet'
  sortOrder?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

export interface AppliedFilters {
  propertyType?: string | null
  sortBy?: string
  sortOrder?: string
}

export interface ComparablePropertiesResponse {
  properties: ComparableProperty[]
  count: number
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
  searchRadius: number
  averageRent: number
  medianRent: number
  rentRange: {
    min: number
    max: number
  }
  appliedFilters?: AppliedFilters
}

// ============ Market Statistics Types ============

export interface MarketStatisticsRequest {
  zipCode: string
}

export interface MarketStatisticsResponse {
  zipCode: string
  city: string
  state: string
  averageRent: number
  medianRent: number
  rentMin: number
  rentMax: number
  listingCount: number
  averageDaysOnMarket: number
  rentTrend: 'up' | 'down' | 'stable'
  rentChangePercent: number
}

// ============ Historical Market Data Types ============

export interface HistoricalMarketDataRequest {
  zipCode: string
}

export interface HistoricalMarketDataPoint {
  date: string
  averageRent: number
  medianRent: number
  listingCount: number
}

export interface HistoricalMarketDataResponse {
  zipCode: string
  city: string
  state: string
  data: HistoricalMarketDataPoint[]
}

// ============ Property Search Types ============

export interface PropertySearchRequest {
  address?: string
  city?: string
  state?: string
  zipCode?: string
  propertyType?: string
  minBedrooms?: number
  maxBedrooms?: number
  minBathrooms?: number
  maxBathrooms?: number
  minSquareFeet?: number
  maxSquareFeet?: number
}

export interface PropertySearchResult {
  address: string
  city: string
  state: string
  zipCode: string
  bedrooms?: number
  bathrooms?: number
  squareFeet?: number
  propertyType?: string
  yearBuilt?: number
  lastSalePrice?: number
  lastSaleDate?: string
}

export interface PropertySearchResponse {
  results: PropertySearchResult[]
  count: number
  totalCount: number
}

// ============ Property Details Types ============

export interface PropertyDetailsRequest {
  address?: string
  city?: string
  state?: string
  zipCode?: string
}

export interface PropertyDetails {
  address: string
  city: string
  state: string
  zipCode: string
  latitude?: number
  longitude?: number
  bedrooms?: number
  bathrooms?: number
  squareFeet?: number
  propertyType?: string
  yearBuilt?: number
  lotSize?: number
  stories?: number
  garage?: number
  pool?: boolean
  basement?: boolean
  lastSalePrice?: number
  lastSaleDate?: string
  taxAssessedValue?: number
  annualPropertyTax?: number
}

export interface PropertyDetailsResponse extends PropertyDetails {
  rentEstimate?: number
  rentEstimateMin?: number
  rentEstimateMax?: number
}

// ============ API Error Types ============

export interface ApiError {
  statusCode: number
  message: string
  error?: string
  details?: Record<string, any>
}

export interface ApiErrorResponse {
  error: ApiError
  userMessage: string
}

// ============ Cache Types ============

export interface CacheEntry<T> {
  data: T
  timestamp: number
  expiresAt: number
}

export interface CacheStats {
  size: number
  entries: string[]
}

// ============ API Response Wrapper ============

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: ApiError
  timestamp: string
}
