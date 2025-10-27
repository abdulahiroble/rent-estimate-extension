/**
 * Comparable Properties API Tests
 * Tests filtering, sorting, pagination, caching, and error handling
 */

import { getComparableProperties, getCacheStats, clearComparablePropertiesCache } from '../services/rentcastApi'
import { transformComparablePropertiesForUI } from '../utils/responseTransformer'

// Enable mock API for testing
process.env.NEXT_PUBLIC_USE_MOCK_API = 'true'

describe('Comparable Properties API', () => {
  beforeEach(() => {
    clearComparablePropertiesCache()
  })

  describe('Basic Queries', () => {
    test('should return comparable properties', async () => {
      const comps = await getComparableProperties(
        '456 Oak Avenue',
        'San Francisco',
        'CA',
        '94102'
      )

      expect(comps).toBeDefined()
      expect(comps.properties).toBeInstanceOf(Array)
      expect(comps.properties.length).toBeGreaterThan(0)
      expect(comps.totalCount).toBeGreaterThan(0)
      expect(comps.averageRent).toBeGreaterThan(0)
      expect(comps.medianRent).toBeGreaterThan(0)
    })

    test('should return properties with required fields', async () => {
      const comps = await getComparableProperties(
        '456 Oak Avenue',
        'San Francisco',
        'CA',
        '94102'
      )

      const prop = comps.properties[0]
      expect(prop.address).toBeDefined()
      expect(prop.city).toBeDefined()
      expect(prop.state).toBeDefined()
      expect(prop.zipCode).toBeDefined()
      expect(prop.rent).toBeGreaterThan(0)
      expect(prop.propertyType).toBeDefined()
    })
  })

  describe('Filtering', () => {
    test('should filter by property type', async () => {
      const comps = await getComparableProperties(
        '456 Oak Avenue',
        'San Francisco',
        'CA',
        '94102',
        {
          propertyType: 'Single Family'
        }
      )

      expect(comps.properties.every(p => p.propertyType === 'Single Family')).toBe(true)
      expect(comps.appliedFilters.propertyType).toBe('Single Family')
    })

    test('should handle case-insensitive property type filter', async () => {
      const comps = await getComparableProperties(
        '456 Oak Avenue',
        'San Francisco',
        'CA',
        '94102',
        {
          propertyType: 'single family'
        }
      )

      expect(comps.properties.every(p => p.propertyType.toLowerCase() === 'single family')).toBe(true)
    })
  })

  describe('Sorting', () => {
    test('should sort by price ascending', async () => {
      const comps = await getComparableProperties(
        '456 Oak Avenue',
        'San Francisco',
        'CA',
        '94102',
        {
          sortBy: 'price',
          sortOrder: 'asc'
        }
      )

      for (let i = 0; i < comps.properties.length - 1; i++) {
        expect(comps.properties[i].rent).toBeLessThanOrEqual(comps.properties[i + 1].rent)
      }
    })

    test('should sort by price descending', async () => {
      const comps = await getComparableProperties(
        '456 Oak Avenue',
        'San Francisco',
        'CA',
        '94102',
        {
          sortBy: 'price',
          sortOrder: 'desc'
        }
      )

      for (let i = 0; i < comps.properties.length - 1; i++) {
        expect(comps.properties[i].rent).toBeGreaterThanOrEqual(comps.properties[i + 1].rent)
      }
    })

    test('should sort by distance ascending', async () => {
      const comps = await getComparableProperties(
        '456 Oak Avenue',
        'San Francisco',
        'CA',
        '94102',
        {
          sortBy: 'distance',
          sortOrder: 'asc'
        }
      )

      for (let i = 0; i < comps.properties.length - 1; i++) {
        expect(comps.properties[i].distance).toBeLessThanOrEqual(comps.properties[i + 1].distance)
      }
    })

    test('should sort by daysOnMarket ascending', async () => {
      const comps = await getComparableProperties(
        '456 Oak Avenue',
        'San Francisco',
        'CA',
        '94102',
        {
          sortBy: 'daysOnMarket',
          sortOrder: 'asc'
        }
      )

      for (let i = 0; i < comps.properties.length - 1; i++) {
        expect(comps.properties[i].daysOnMarket).toBeLessThanOrEqual(comps.properties[i + 1].daysOnMarket)
      }
    })
  })

  describe('Pagination', () => {
    test('should return first page', async () => {
      const comps = await getComparableProperties(
        '456 Oak Avenue',
        'San Francisco',
        'CA',
        '94102',
        {
          page: 1,
          pageSize: 2
        }
      )

      expect(comps.page).toBe(1)
      expect(comps.pageSize).toBe(2)
      expect(comps.count).toBe(2)
      expect(comps.hasPreviousPage).toBe(false)
      expect(comps.hasNextPage).toBe(true)
    })

    test('should return middle page', async () => {
      const comps = await getComparableProperties(
        '456 Oak Avenue',
        'San Francisco',
        'CA',
        '94102',
        {
          page: 2,
          pageSize: 2
        }
      )

      expect(comps.page).toBe(2)
      expect(comps.count).toBe(2)
      expect(comps.hasPreviousPage).toBe(true)
      expect(comps.hasNextPage).toBe(true)
    })

    test('should return last page', async () => {
      const comps = await getComparableProperties(
        '456 Oak Avenue',
        'San Francisco',
        'CA',
        '94102',
        {
          page: 3,
          pageSize: 2
        }
      )

      expect(comps.page).toBe(3)
      expect(comps.hasPreviousPage).toBe(true)
      expect(comps.hasNextPage).toBe(false)
    })

    test('should calculate totalPages correctly', async () => {
      const comps = await getComparableProperties(
        '456 Oak Avenue',
        'San Francisco',
        'CA',
        '94102',
        {
          pageSize: 2
        }
      )

      expect(comps.totalPages).toBe(Math.ceil(comps.totalCount / 2))
    })
  })

  describe('Caching', () => {
    test('should cache results', async () => {
      clearComparablePropertiesCache()

      // First call - cache miss
      await getComparableProperties(
        '456 Oak Avenue',
        'San Francisco',
        'CA',
        '94102'
      )

      let stats = getCacheStats()
      expect(stats.stats.misses).toBe(1)
      expect(stats.stats.hits).toBe(0)

      // Second call - cache hit
      await getComparableProperties(
        '456 Oak Avenue',
        'San Francisco',
        'CA',
        '94102'
      )

      stats = getCacheStats()
      expect(stats.stats.hits).toBe(1)
    })

    test('should clear cache', async () => {
      await getComparableProperties(
        '456 Oak Avenue',
        'San Francisco',
        'CA',
        '94102'
      )

      let stats = getCacheStats()
      expect(stats.comparablePropertiesSize).toBeGreaterThan(0)

      clearComparablePropertiesCache()
      stats = getCacheStats()
      expect(stats.comparablePropertiesSize).toBe(0)
    })
  })

  describe('Error Handling', () => {
    test('should reject invalid radius', async () => {
      await expect(
        getComparableProperties(
          '456 Oak Avenue',
          'San Francisco',
          'CA',
          '94102',
          { radius: 10 }
        )
      ).rejects.toThrow('Radius must be between 0.1 and 5 miles')
    })

    test('should reject invalid page size', async () => {
      await expect(
        getComparableProperties(
          '456 Oak Avenue',
          'San Francisco',
          'CA',
          '94102',
          { pageSize: 200 }
        )
      ).rejects.toThrow('Page size must be between 1 and 100')
    })

    test('should reject invalid page', async () => {
      await expect(
        getComparableProperties(
          '456 Oak Avenue',
          'San Francisco',
          'CA',
          '94102',
          { page: 0 }
        )
      ).rejects.toThrow('Page must be greater than 0')
    })
  })

  describe('UI Transformation', () => {
    test('should format currency values', async () => {
      const comps = await getComparableProperties(
        '456 Oak Avenue',
        'San Francisco',
        'CA',
        '94102'
      )

      const uiData = transformComparablePropertiesForUI(comps)
      const prop = uiData.properties[0]

      expect(prop.rentFormatted).toMatch(/^\$[\d,]+$/)
      expect(uiData.averageRentFormatted).toMatch(/^\$[\d,]+$/)
      expect(uiData.medianRentFormatted).toMatch(/^\$[\d,]+$/)
    })

    test('should format distance values', async () => {
      const comps = await getComparableProperties(
        '456 Oak Avenue',
        'San Francisco',
        'CA',
        '94102'
      )

      const uiData = transformComparablePropertiesForUI(comps)
      const prop = uiData.properties[0]

      expect(prop.distanceFormatted).toMatch(/^\d+\.\d+ mi$/)
    })

    test('should include UI helper flags', async () => {
      const comps = await getComparableProperties(
        '456 Oak Avenue',
        'San Francisco',
        'CA',
        '94102'
      )

      const uiData = transformComparablePropertiesForUI(comps)

      expect(uiData.hasResults).toBe(true)
      expect(typeof uiData.hasPreviousPage).toBe('boolean')
      expect(typeof uiData.hasNextPage).toBe('boolean')
    })

    test('should calculate price per square foot', async () => {
      const comps = await getComparableProperties(
        '456 Oak Avenue',
        'San Francisco',
        'CA',
        '94102'
      )

      const uiData = transformComparablePropertiesForUI(comps)
      const prop = uiData.properties[0]

      if (prop.squareFeet) {
        expect(prop.pricePerSqFt).toBe(Math.round(prop.rent / prop.squareFeet))
      }
    })
  })

  describe('Combined Operations', () => {
    test('should filter, sort, and paginate together', async () => {
      const comps = await getComparableProperties(
        '456 Oak Avenue',
        'San Francisco',
        'CA',
        '94102',
        {
          propertyType: 'Single Family',
          sortBy: 'price',
          sortOrder: 'asc',
          page: 1,
          pageSize: 10
        }
      )

      expect(comps.properties.every(p => p.propertyType === 'Single Family')).toBe(true)
      expect(comps.appliedFilters.propertyType).toBe('Single Family')
      expect(comps.appliedFilters.sortBy).toBe('price')
      expect(comps.page).toBe(1)
    })
  })
})
