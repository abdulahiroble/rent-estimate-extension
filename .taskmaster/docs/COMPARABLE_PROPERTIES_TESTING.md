# Comparable Properties API - Testing Guide

## Overview
The comparable properties API has been enhanced with filtering, sorting, pagination, and caching. Testing can be done using the mock API without consuming API quota.

## Enable Mock API Testing

### Option 1: Environment Variable
Set in `.env.local`:
```
NEXT_PUBLIC_USE_MOCK_API=true
```

### Option 2: Runtime Toggle
```javascript
// In your component or test file
process.env.NEXT_PUBLIC_USE_MOCK_API = 'true'
```

## Mock Data Available
The mock API returns 5-6 comparable properties with:
- Various property types (Single Family, Condo, Apartment)
- Different rent prices ($2,300 - $2,900)
- Multiple bedroom/bathroom configurations
- Varying days on market (8-67 days)
- Distance data (0.15 - 0.55 miles)
- Realistic coordinates and listing URLs

## Test Cases

### 1. Basic Query (No Filters)
```javascript
import { getComparableProperties } from '@/services/rentcastApi'

const comps = await getComparableProperties(
  '456 Oak Avenue',
  'San Francisco',
  'CA',
  '94102'
)

// Expected: Returns all 5-6 properties, sorted by price (default)
console.log(comps.properties.length) // 5-6
console.log(comps.totalCount) // 5-6
console.log(comps.averageRent) // ~2600
console.log(comps.medianRent) // ~2600
```

### 2. Filtering by Property Type
```javascript
const comps = await getComparableProperties(
  '456 Oak Avenue',
  'San Francisco',
  'CA',
  '94102',
  {
    propertyType: 'Single Family'
  }
)

// Expected: Only Single Family properties returned
console.log(comps.properties.every(p => p.propertyType === 'Single Family')) // true
console.log(comps.appliedFilters.propertyType) // 'Single Family'
```

### 3. Sorting by Price (Ascending)
```javascript
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

// Expected: Properties sorted by rent ascending
console.log(comps.properties[0].rent) // 2300 (lowest)
console.log(comps.properties[comps.properties.length - 1].rent) // 2900 (highest)
```

### 4. Sorting by Price (Descending)
```javascript
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

// Expected: Properties sorted by rent descending
console.log(comps.properties[0].rent) // 2900 (highest)
console.log(comps.properties[comps.properties.length - 1].rent) // 2300 (lowest)
```

### 5. Sorting by Distance
```javascript
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

// Expected: Properties sorted by distance ascending
console.log(comps.properties[0].distance) // ~0.15 (closest)
console.log(comps.properties[comps.properties.length - 1].distance) // ~0.55 (farthest)
```

### 6. Sorting by Days on Market
```javascript
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

// Expected: Properties sorted by daysOnMarket ascending
console.log(comps.properties[0].daysOnMarket) // 8 (newest)
console.log(comps.properties[comps.properties.length - 1].daysOnMarket) // 67 (oldest)
```

### 7. Pagination - Page 1
```javascript
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

// Expected: First 2 properties
console.log(comps.count) // 2
console.log(comps.page) // 1
console.log(comps.totalPages) // 3 (6 total / 2 per page)
console.log(comps.hasPreviousPage) // false
console.log(comps.hasNextPage) // true
```

### 8. Pagination - Page 2
```javascript
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

// Expected: Properties 3-4
console.log(comps.count) // 2
console.log(comps.page) // 2
console.log(comps.hasPreviousPage) // true
console.log(comps.hasNextPage) // true
```

### 9. Pagination - Last Page
```javascript
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

// Expected: Last 2 properties
console.log(comps.count) // 2
console.log(comps.page) // 3
console.log(comps.hasPreviousPage) // true
console.log(comps.hasNextPage) // false
```

### 10. Combined Filtering + Sorting + Pagination
```javascript
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

// Expected: Single Family properties sorted by price, first page
console.log(comps.properties.every(p => p.propertyType === 'Single Family')) // true
console.log(comps.appliedFilters.propertyType) // 'Single Family'
console.log(comps.appliedFilters.sortBy) // 'price'
```

### 11. Caching Test
```javascript
import { getCacheStats, clearComparablePropertiesCache } from '@/services/rentcastApi'

// First call - cache miss
const comps1 = await getComparableProperties(
  '456 Oak Avenue',
  'San Francisco',
  'CA',
  '94102'
)

// Check cache stats
let stats = getCacheStats()
console.log(stats.stats.misses) // 1
console.log(stats.stats.hits) // 0

// Second call - cache hit
const comps2 = await getComparableProperties(
  '456 Oak Avenue',
  'San Francisco',
  'CA',
  '94102'
)

stats = getCacheStats()
console.log(stats.stats.hits) // 1
console.log(comps1 === comps2) // true (same cached object)

// Clear cache
clearComparablePropertiesCache()
stats = getCacheStats()
console.log(stats.comparablePropertiesSize) // 0
```

### 12. Error Handling - Invalid Radius
```javascript
try {
  await getComparableProperties(
    '456 Oak Avenue',
    'San Francisco',
    'CA',
    '94102',
    {
      radius: 10 // Max is 5
    }
  )
} catch (error) {
  console.log(error.statusCode) // 400
  console.log(error.message) // 'Radius must be between 0.1 and 5 miles'
  console.log(error.userMessage) // 'Radius must be between 0.1 and 5 miles'
}
```

### 13. Error Handling - Invalid Page Size
```javascript
try {
  await getComparableProperties(
    '456 Oak Avenue',
    'San Francisco',
    'CA',
    '94102',
    {
      pageSize: 200 // Max is 100
    }
  )
} catch (error) {
  console.log(error.statusCode) // 400
  console.log(error.message) // 'Page size must be between 1 and 100'
}
```

### 14. Error Handling - Invalid Page
```javascript
try {
  await getComparableProperties(
    '456 Oak Avenue',
    'San Francisco',
    'CA',
    '94102',
    {
      page: 0 // Must be > 0
    }
  )
} catch (error) {
  console.log(error.statusCode) // 400
  console.log(error.message) // 'Page must be greater than 0'
}
```

### 15. UI Data Transformation
```javascript
import { transformComparablePropertiesForUI } from '@/utils/responseTransformer'

const comps = await getComparableProperties(
  '456 Oak Avenue',
  'San Francisco',
  'CA',
  '94102'
)

const uiData = transformComparablePropertiesForUI(comps)

// Check formatted values
console.log(uiData.properties[0].rentFormatted) // '$2,300'
console.log(uiData.properties[0].squareFeetFormatted) // '1,400'
console.log(uiData.properties[0].distanceFormatted) // '0.15 mi'
console.log(uiData.properties[0].daysOnMarketFormatted) // '28 days'
console.log(uiData.averageRentFormatted) // '$2,600'
console.log(uiData.medianRentFormatted) // '$2,600'
console.log(uiData.rentRange.minFormatted) // '$2,300'
console.log(uiData.rentRange.maxFormatted) // '$2,900'
```

## Testing Checklist

- [ ] Mock API returns 5-6 properties
- [ ] Default sorting by price (ascending) works
- [ ] Filtering by property type works
- [ ] Sorting by all fields (price, distance, daysOnMarket, bedrooms, bathrooms, squareFeet) works
- [ ] Ascending and descending sort order works
- [ ] Pagination returns correct page count
- [ ] Pagination metadata (totalPages, hasPreviousPage, hasNextPage) is correct
- [ ] Cache stores and retrieves data
- [ ] Cache statistics track hits/misses
- [ ] Invalid parameters throw proper errors
- [ ] Error messages are user-friendly
- [ ] UI transformation formats values correctly
- [ ] Statistics (averageRent, medianRent, rentRange) are calculated correctly
- [ ] Applied filters are tracked in response

## Running Tests

### Unit Tests
```bash
cd customize-app
npm test -- rentcastApi.test.js
```

### Manual Testing in Browser
1. Enable mock API: `NEXT_PUBLIC_USE_MOCK_API=true` in `.env.local`
2. Run dev server: `npm run dev`
3. Open browser console (F12)
4. Test API calls using examples above

### Integration Testing with Playwright
```bash
npm run test:e2e
```

## Next Steps
After testing is complete:
1. Create React component for displaying comparable properties
2. Implement filtering and sorting UI controls
3. Add pagination UI
4. Style with Tailwind CSS
