/**
 * Error handling utilities for RentCast API
 */

export class RentCastError extends Error {
  constructor(message, statusCode = null, originalError = null) {
    super(message)
    this.name = 'RentCastError'
    this.statusCode = statusCode
    this.originalError = originalError
  }
}

/**
 * Parse and format API error responses
 */
export function parseApiError(error) {
  if (error instanceof RentCastError) {
    return {
      message: error.message,
      statusCode: error.statusCode,
      userMessage: getUserFriendlyMessage(error.message)
    }
  }

  if (error instanceof TypeError) {
    return {
      message: 'Network error - unable to reach RentCast API',
      statusCode: null,
      userMessage: 'Unable to connect to the service. Please check your internet connection.'
    }
  }

  return {
    message: error.message || 'Unknown error',
    statusCode: null,
    userMessage: 'An unexpected error occurred. Please try again.'
  }
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(errorMessage) {
  const errorMap = {
    'RENTCAST_API_KEY': 'API key is not configured. Please contact support.',
    'unauthorized': 'Invalid API credentials. Please contact support.',
    'not_found': 'Property not found. Please check the address and try again.',
    'invalid_address': 'Invalid address format. Please enter a valid US address.',
    'rate_limit': 'Too many requests. Please wait a moment and try again.',
    'server_error': 'Service temporarily unavailable. Please try again later.',
    'network': 'Network connection error. Please check your internet connection.'
  }

  for (const [key, message] of Object.entries(errorMap)) {
    if (errorMessage.toLowerCase().includes(key.toLowerCase())) {
      return message
    }
  }

  return 'Unable to fetch rent estimate. Please try again.'
}

/**
 * Log error for debugging
 */
export function logError(context, error) {
  const timestamp = new Date().toISOString()
  const errorInfo = {
    timestamp,
    context,
    message: error.message,
    stack: error.stack,
    statusCode: error.statusCode
  }

  console.error(`[${timestamp}] ${context}:`, errorInfo)

  // In production, you might want to send this to an error tracking service
  // e.g., Sentry, LogRocket, etc.
}

/**
 * Retry logic for failed API calls
 */
export async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
  let lastError

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      
      // Don't retry on client errors (4xx)
      if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
        throw error
      }

      // Calculate exponential backoff delay
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError
}
