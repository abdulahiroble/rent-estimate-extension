/**
 * Debounce utility for reducing function call frequency
 */

/**
 * Create a debounced function that delays execution
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, delay = 300) {
  let timeoutId = null

  return function debounced(...args) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      func.apply(this, args)
      timeoutId = null
    }, delay)
  }
}

/**
 * Create a debounced async function
 * @param {Function} func - Async function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced async function
 */
export function debounceAsync(func, delay = 300) {
  let timeoutId = null
  let lastPromise = null

  return function debounced(...args) {
    return new Promise((resolve, reject) => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      timeoutId = setTimeout(async () => {
        try {
          const result = await func.apply(this, args)
          lastPromise = Promise.resolve(result)
          resolve(result)
        } catch (error) {
          lastPromise = Promise.reject(error)
          reject(error)
        }
        timeoutId = null
      }, delay)
    })
  }
}

/**
 * Cancel a debounced function
 * @param {Function} debounced - Debounced function to cancel
 */
export function cancelDebounce(debounced) {
  if (debounced && debounced.cancel) {
    debounced.cancel()
  }
}
