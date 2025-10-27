/**
 * Rent Estimate API Tests
 * Tests for address validation, formatting, and API integration
 */

import {
  isValidAddress,
  isValidCity,
  isValidState,
  isValidZipCode,
  formatAddress,
  formatCity,
  formatState,
  formatZipCode,
  parseAddressString,
  validateAddressObject
} from '../utils/addressFormatter'

import {
  transformRentEstimate,
  transformComparableProperties,
  transformMarketStatistics,
  formatCurrency,
  formatNumber,
  formatPercentage
} from '../utils/responseTransformer'

describe('Address Formatter', () => {
  describe('Address Validation', () => {
    test('should validate correct address', () => {
      expect(isValidAddress('123 Main Street')).toBe(true)
      expect(isValidAddress('456 Oak Ave')).toBe(true)
    })

    test('should reject invalid addresses', () => {
      expect(isValidAddress('')).toBe(false)
      expect(isValidAddress('Main Street')).toBe(false) // No number
      expect(isValidAddress('123')).toBe(false) // Too short
    })
  })

  describe('City Validation', () => {
    test('should validate correct city names', () => {
      expect(isValidCity('New York')).toBe(true)
      expect(isValidCity('Los Angeles')).toBe(true)
      expect(isValidCity('San Francisco')).toBe(true)
    })

    test('should reject invalid city names', () => {
      expect(isValidCity('')).toBe(false)
      expect(isValidCity('A')).toBe(false) // Too short
      expect(isValidCity('123')).toBe(false) // Numbers only
    })
  })

  describe('State Validation', () => {
    test('should validate correct state abbreviations', () => {
      expect(isValidState('NY')).toBe(true)
      expect(isValidState('CA')).toBe(true)
      expect(isValidState('TX')).toBe(true)
      expect(isValidState('DC')).toBe(true) // District of Columbia
    })

    test('should reject invalid state abbreviations', () => {
      expect(isValidState('')).toBe(false)
      expect(isValidState('USA')).toBe(false) // Too long
      expect(isValidState('ZZ')).toBe(false) // Invalid state
    })
  })

  describe('ZIP Code Validation', () => {
    test('should validate correct ZIP codes', () => {
      expect(isValidZipCode('10001')).toBe(true)
      expect(isValidZipCode('90210')).toBe(true)
      expect(isValidZipCode('10001-1234')).toBe(true) // ZIP+4
    })

    test('should reject invalid ZIP codes', () => {
      expect(isValidZipCode('')).toBe(false)
      expect(isValidZipCode('1000')).toBe(false) // Too short
      expect(isValidZipCode('ABCDE')).toBe(false) // Letters
    })
  })

  describe('Address Formatting', () => {
    test('should format addresses correctly', () => {
      expect(formatAddress('123 main street')).toBe('123 Main Street')
      expect(formatAddress('  456  oak  ave  ')).toBe('456 Oak Ave')
    })

    test('should format cities correctly', () => {
      expect(formatCity('new york')).toBe('New York')
      expect(formatCity('los ANGELES')).toBe('Los Angeles')
    })

    test('should format states correctly', () => {
      expect(formatState('ny')).toBe('NY')
      expect(formatState('ca')).toBe('CA')
    })

    test('should format ZIP codes correctly', () => {
      expect(formatZipCode('  10001  ')).toBe('10001')
      expect(formatZipCode('10001-1234')).toBe('10001-1234')
    })
  })

  describe('Address Parsing', () => {
    test('should parse full address strings', () => {
      const result = parseAddressString('123 Main St, New York, NY 10001')
      expect(result.address).toBe('123 Main St')
      expect(result.city).toBe('New York')
      expect(result.state).toBe('NY')
      expect(result.zipCode).toBe('10001')
    })

    test('should handle incomplete addresses', () => {
      const result = parseAddressString('123 Main St, New York')
      expect(result.address).toBe('123 Main St')
      expect(result.city).toBe('New York')
    })
  })

  describe('Address Object Validation', () => {
    test('should validate complete address object', () => {
      const result = validateAddressObject({
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001'
      })
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    test('should report validation errors', () => {
      const result = validateAddressObject({
        address: 'Main Street', // No number
        city: 'A', // Too short
        state: 'ZZ', // Invalid
        zipCode: '1000' // Too short
      })
      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })
  })
})

describe('Response Transformer', () => {
  describe('Rent Estimate Transformation', () => {
    test('should transform rent estimate response', () => {
      const mockResponse = {
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        rentEstimate: 2500.5,
        rentEstimateMin: 2000,
        rentEstimateMax: 3000,
        bedrooms: 2,
        bathrooms: 1,
        squareFeet: 900,
        propertyType: 'Apartment'
      }

      const result = transformRentEstimate(mockResponse)

      expect(result.rentEstimate).toBe(2501) // Rounded
      expect(result.rentEstimateMin).toBe(2000)
      expect(result.rentEstimateMax).toBe(3000)
      expect(result.bedrooms).toBe(2)
      expect(result.confidence).toBeGreaterThan(0)
    })

    test('should handle missing data', () => {
      const mockResponse = {
        address: '123 Main St',
        rentEstimate: 2500
      }

      const result = transformRentEstimate(mockResponse)

      expect(result.address).toBe('123 Main St')
      expect(result.rentEstimate).toBe(2500)
      expect(result.bedrooms).toBeNull()
    })
  })

  describe('Comparable Properties Transformation', () => {
    test('should transform comparable properties response', () => {
      const mockResponse = {
        properties: [
          {
            address: '456 Oak Ave',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            rent: 2400,
            bedrooms: 2
          },
          {
            address: '789 Elm St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            rent: 2600,
            bedrooms: 2
          }
        ],
        count: 2,
        searchRadius: 1,
        averageRent: 2500,
        medianRent: 2500
      }

      const result = transformComparableProperties(mockResponse)

      expect(result.count).toBe(2)
      expect(result.properties).toHaveLength(2)
      expect(result.averageRent).toBe(2500)
      expect(result.rentRange.min).toBe(2400)
      expect(result.rentRange.max).toBe(2600)
    })
  })

  describe('Market Statistics Transformation', () => {
    test('should transform market statistics response', () => {
      const mockResponse = {
        zipCode: '10001',
        city: 'New York',
        state: 'NY',
        averageRent: 2500,
        medianRent: 2450,
        rentMin: 1800,
        rentMax: 3500,
        listingCount: 150,
        averageDaysOnMarket: 25,
        rentTrend: 'up',
        rentChangePercent: 3.5
      }

      const result = transformMarketStatistics(mockResponse)

      expect(result.averageRent).toBe(2500)
      expect(result.rentTrend).toBe('up')
      expect(result.rentChangePercent).toBe(3.5)
      expect(result.marketHealth).toBe('warming')
    })
  })

  describe('Formatting Functions', () => {
    test('should format currency correctly', () => {
      expect(formatCurrency(2500)).toBe('$2,500')
      expect(formatCurrency(2500.5)).toBe('$2,501')
      expect(formatCurrency(null)).toBe('N/A')
    })

    test('should format numbers correctly', () => {
      expect(formatNumber(1000)).toBe('1,000')
      expect(formatNumber(1000000)).toBe('1,000,000')
      expect(formatNumber(null)).toBe('N/A')
    })

    test('should format percentages correctly', () => {
      expect(formatPercentage(3.5)).toBe('+3.50%')
      expect(formatPercentage(-2.1)).toBe('-2.10%')
      expect(formatPercentage(null)).toBe('N/A')
    })
  })
})

describe('Integration Tests', () => {
  test('should handle complete address validation and formatting flow', () => {
    const input = {
      address: '123 main street',
      city: 'new york',
      state: 'ny',
      zipCode: '10001'
    }

    const formatted = {
      address: formatAddress(input.address),
      city: formatCity(input.city),
      state: formatState(input.state),
      zipCode: formatZipCode(input.zipCode)
    }

    const validation = validateAddressObject(formatted)

    expect(validation.isValid).toBe(true)
    expect(formatted.address).toBe('123 Main Street')
    expect(formatted.city).toBe('New York')
    expect(formatted.state).toBe('NY')
  })

  test('should handle rent estimate API response flow', () => {
    const mockApiResponse = {
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      rentEstimate: 2500.7,
      rentEstimateMin: 2000,
      rentEstimateMax: 3000,
      bedrooms: 2,
      bathrooms: 1,
      squareFeet: 900,
      propertyType: 'Apartment'
    }

    const transformed = transformRentEstimate(mockApiResponse)
    const formatted = formatCurrency(transformed.rentEstimate)

    expect(transformed.rentEstimate).toBe(2501)
    expect(formatted).toBe('$2,501')
  })
})
