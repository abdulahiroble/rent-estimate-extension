# RentCast API Integration

This directory contains the RentCast API service layer for the RentEst extension.

## Files

### `rentcastApi.js`
Main API service that handles all communication with RentCast API.

**Features:**
- Automatic caching of API responses (24-hour TTL)
- Error handling and logging
- Request throttling
- Support for all major RentCast endpoints

**Exported Functions:**

#### `getRentEstimate(address, city, state, zipCode)`
Get rent estimate for a property.

```javascript
import { getRentEstimate } from '../services/rentcastApi'

const estimate = await getRentEstimate('123 Main St', 'New York', 'NY', '10001')
```

#### `getComparableProperties(address, city, state, zipCode, radius)`
Get comparable rental properties in the area.

```javascript
const comps = await getComparableProperties('123 Main St', 'New York', 'NY', '10001', 1)
```

#### `getMarketStatistics(zipCode)`
Get market statistics for a zip code.

```javascript
const stats = await getMarketStatistics('10001')
```

#### `getHistoricalMarketData(zipCode)`
Get historical market trends.

```javascript
const history = await getHistoricalMarketData('10001')
```

#### `searchProperties(criteria)`
Search for properties by various criteria.

```javascript
const results = await searchProperties({
  city: 'New York',
  state: 'NY',
  zipCode: '10001'
})
```

#### `getPropertyDetails(address, city, state, zipCode)`
Get detailed property information.

```javascript
const details = await getPropertyDetails('123 Main St', 'New York', 'NY', '10001')
```

#### `clearCache()`
Clear all cached API responses.

```javascript
import { clearCache } from '../services/rentcastApi'
clearCache()
```

#### `getCacheStats()`
Get cache statistics.

```javascript
import { getCacheStats } from '../services/rentcastApi'
const stats = getCacheStats()
console.log(`Cache has ${stats.size} entries`)
```

## Configuration

API configuration is managed in `../config/rentcast.js`:

- **API_KEY**: Loaded from `RENTCAST_API_KEY` environment variable
- **Cache Duration**: 24 hours (configurable)
- **Rate Limiting**: 60 requests/minute, 1000 requests/hour
- **Retry Policy**: 3 attempts with exponential backoff

## Error Handling

Errors are handled through `../utils/errorHandler.js`:

```javascript
import { parseApiError, logError } from '../utils/errorHandler'

try {
  const estimate = await getRentEstimate(...)
} catch (error) {
  const parsedError = parseApiError(error)
  logError('getRentEstimate', error)
  console.log(parsedError.userMessage) // User-friendly message
}
```

## React Hooks

Use the custom hooks in `../hooks/useRentEstimate.js` for React components:

```javascript
import { useRentEstimate, useComparableProperties } from '../hooks/useRentEstimate'

function PropertySearch() {
  const { data, loading, error, fetchRentEstimate } = useRentEstimate()
  
  const handleSearch = async (address, city, state, zip) => {
    try {
      await fetchRentEstimate(address, city, state, zip)
    } catch (err) {
      console.error('Search failed:', err)
    }
  }
  
  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {data && <p>Estimate: ${data.estimate}</p>}
    </div>
  )
}
```

## Environment Variables

Required environment variables in `.env` or `.env.local`:

```
RENTCAST_API_KEY=your_api_key_here
```

Get your API key from: https://app.rentcast.io/app/api

## API Documentation

For complete API documentation, visit: https://developers.rentcast.io/

## Rate Limiting

The service respects RentCast API rate limits:
- Free tier: 50 requests/month
- Foundation: 1,000 requests/month
- Growth: 5,000 requests/month
- Scale: 25,000 requests/month

Caching helps reduce API calls by storing responses for 24 hours.

## Testing

To test the API integration:

```javascript
import rentcastApi from '../services/rentcastApi'

// Test rent estimate
const estimate = await rentcastApi.getRentEstimate('123 Main St', 'New York', 'NY', '10001')
console.log('Rent Estimate:', estimate)

// Test comparable properties
const comps = await rentcastApi.getComparableProperties('123 Main St', 'New York', 'NY', '10001')
console.log('Comparable Properties:', comps)

// Check cache
const stats = rentcastApi.getCacheStats()
console.log('Cache Stats:', stats)
```

## Troubleshooting

### "RENTCAST_API_KEY environment variable is not set"
- Ensure `.env.local` file exists in the `customize-app` directory
- Add `RENTCAST_API_KEY=your_key` to the file
- Restart the development server

### API requests failing
- Check your internet connection
- Verify API key is correct
- Check RentCast API status at https://status.rentcast.io/
- Review error logs in browser console

### Cache not working
- Cache is stored in memory and will be cleared when the extension is reloaded
- Use `clearCache()` to manually clear cache
- Check cache stats with `getCacheStats()`
