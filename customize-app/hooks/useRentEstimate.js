/**
 * Custom React Hook for RentCast API
 * Handles rent estimate fetching with loading and error states
 */

import { useState, useCallback } from 'react'
import { getRentEstimate, getComparableProperties, getMarketStatistics } from '../services/rentcastApi'

export function useRentEstimate() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchRentEstimate = useCallback(async (address, city, state, zipCode) => {
    setLoading(true)
    setError(null)
    try {
      const result = await getRentEstimate(address, city, state, zipCode)
      setData(result)
      return result
    } catch (err) {
      setError(err.message)
      console.error('Error fetching rent estimate:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { data, loading, error, fetchRentEstimate }
}

export function useComparableProperties() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchComparables = useCallback(async (address, city, state, zipCode, radius = 1) => {
    setLoading(true)
    setError(null)
    try {
      const result = await getComparableProperties(address, city, state, zipCode, radius)
      setData(result)
      return result
    } catch (err) {
      setError(err.message)
      console.error('Error fetching comparable properties:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { data, loading, error, fetchComparables }
}

export function useMarketStatistics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchMarketStats = useCallback(async (zipCode) => {
    setLoading(true)
    setError(null)
    try {
      const result = await getMarketStatistics(zipCode)
      setData(result)
      return result
    } catch (err) {
      setError(err.message)
      console.error('Error fetching market statistics:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { data, loading, error, fetchMarketStats }
}
