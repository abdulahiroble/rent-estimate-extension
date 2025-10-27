# Quick Test Reference - Comparable Properties API

## Enable Mock API
```bash
# In .env.local
NEXT_PUBLIC_USE_MOCK_API=true
```

## Run Tests
```bash
cd customize-app
npm test -- comparableProperties.test.js
```

## Quick Manual Tests (Browser Console)

### 1. Basic Query
```javascript
import { getComparableProperties } from '@/services/rentcastApi'

const comps = await getComparableProperties('456 Oak Avenue', 'San Francisco', 'CA', '94102')
console.log(`Found ${comps.totalCount} properties`)
console.log(`Average rent: $${comps.averageRent}`)
```

### 2. Filter by Property Type
```javascript
const comps = await getComparableProperties('456 Oak Avenue', 'San Francisco', 'CA', '94102', {
  propertyType: 'Single Family'
})
console.log(`Found ${comps.count} Single Family properties`)
```

### 3. Sort by Price (Low to High)
```javascript
const comps = await getComparableProperties('456 Oak Avenue', 'San Francisco', 'CA', '94102', {
  sortBy: 'price',
  sortOrder: 'asc'
})
console.log('Cheapest:', comps.properties[0].rent)
console.log('Most expensive:', comps.properties[comps.properties.length - 1].rent)
```

### 4. Pagination
```javascript
const page1 = await getComparableProperties('456 Oak Avenue', 'San Francisco', 'CA', '94102', {
  page: 1,
  pageSize: 2
})
console.log(`Page 1: ${page1.count} of ${page1.totalCount}`)
console.log(`Total pages: ${page1.totalPages}`)
```

### 5. Check Cache
```javascript
import { getCacheStats } from '@/services/rentcastApi'

const stats = getCacheStats()
console.log(`Cache hits: ${stats.stats.hits}`)
console.log(`Cache misses: ${stats.stats.misses}`)
console.log(`Cached items: ${stats.comparablePropertiesSize}`)
```

### 6. UI Formatting
```javascript
import { transformComparablePropertiesForUI } from '@/utils/responseTransformer'

const comps = await getComparableProperties('456 Oak Avenue', 'San Francisco', 'CA', '94102')
const ui = transformComparablePropertiesForUI(comps)
console.log(ui.properties[0].rentFormatted) // '$2,300'
console.log(ui.properties[0].distanceFormatted) // '0.15 mi'
```

## Expected Mock Data

| Address | Rent | Type | Beds | Baths | SqFt | Days | Distance |
|---------|------|------|------|-------|------|------|----------|
| 457 Oak Ave | $2,550 | Single Family | 3 | 2 | 1,750 | 85 | 0.10 mi |
| 458 Oak Ave | $2,600 | Single Family | 3 | 2 | 1,850 | 52 | 0.15 mi |
| 459 Oak Ave | $2,450 | Condo | 2 | 2 | 1,600 | 28 | 0.22 mi |
| 460 Oak Ave | $2,750 | Single Family | 4 | 3 | 2,100 | 15 | 0.35 mi |
| 461 Oak Ave | $2,300 | Apartment | 2 | 1 | 1,400 | 67 | 0.45 mi |
| 462 Oak Ave | $2,900 | Single Family | 3 | 2 | 1,950 | 8 | 0.55 mi |

**Average Rent:** ~$2,600  
**Median Rent:** ~$2,600  
**Range:** $2,300 - $2,900

## Test Checklist

- [ ] Mock API returns 5-6 properties
- [ ] Default sort by price (ascending) works
- [ ] Filtering by property type works
- [ ] Sorting by all fields works (price, distance, daysOnMarket, bedrooms, bathrooms, squareFeet)
- [ ] Pagination returns correct page count
- [ ] Cache stores and retrieves data
- [ ] Invalid parameters throw proper errors
- [ ] UI transformation formats values correctly
- [ ] Statistics are calculated correctly
- [ ] All 30+ unit tests pass

## Common Issues & Solutions

**Issue:** "NEXT_PUBLIC_USE_MOCK_API is not set"
- **Solution:** Add to `.env.local`: `NEXT_PUBLIC_USE_MOCK_API=true`

**Issue:** "Cannot find module '@/services/rentcastApi'"
- **Solution:** Make sure you're in the `customize-app` directory

**Issue:** Tests fail with "Cannot find module"
- **Solution:** Run `npm install` first

**Issue:** Cache not working
- **Solution:** Check that `NEXT_PUBLIC_USE_MOCK_API=true` is set

## Files to Review

1. **API Implementation:** `services/rentcastApi.js`
2. **Mock Data:** `services/mockRentcastApi.js`
3. **Types:** `types/rentcast.ts`
4. **UI Transform:** `utils/responseTransformer.js`
5. **Tests:** `__tests__/comparableProperties.test.js`
6. **Testing Guide:** `.taskmaster/docs/COMPARABLE_PROPERTIES_TESTING.md`

## Next: Create UI Component

After testing is complete, create React component:
- Display comparable properties in cards
- Add filter controls (property type)
- Add sort controls (price, distance, etc.)
- Add pagination controls
- Style with Tailwind CSS
