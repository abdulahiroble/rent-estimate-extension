/**
 * Address Search Input Component
 * Enhanced search input with autocomplete and history
 */

import React, { useState, useEffect } from 'react'
import AddressAutocomplete from './AddressAutocomplete'

export default function AddressSearchInput({
  onSearch,
  onAddressSelect,
  placeholder = 'Enter address',
  disabled = false
}) {
  const [address, setAddress] = useState('')
  const [searchHistory, setSearchHistory] = useState([])
  const [showHistoryDropdown, setShowHistoryDropdown] = useState(false)

  /**
   * Load search history from localStorage
   */
  useEffect(() => {
    try {
      const saved = localStorage.getItem('addressSearchHistory')
      if (saved) {
        setSearchHistory(JSON.parse(saved))
      }
    } catch (err) {
      console.error('Error loading search history:', err)
    }
  }, [])

  /**
   * Save search history to localStorage
   */
  const saveToHistory = (addressData) => {
    try {
      const newHistory = [
        {
          displayName: addressData.displayName,
          address: addressData.address,
          lat: addressData.lat,
          lon: addressData.lon,
          timestamp: new Date().toISOString()
        },
        ...searchHistory.filter(
          (item) => item.displayName !== addressData.displayName
        )
      ].slice(0, 10) // Keep last 10 searches

      setSearchHistory(newHistory)
      localStorage.setItem('addressSearchHistory', JSON.stringify(newHistory))
    } catch (err) {
      console.error('Error saving search history:', err)
    }
  }

  /**
   * Handle address selection from autocomplete
   */
  const handleAddressSelect = (suggestion) => {
    setAddress(suggestion.displayName)
    saveToHistory(suggestion)
    onAddressSelect(suggestion)
    setShowHistoryDropdown(false)
  }

  /**
   * Handle search submission
   */
  const handleSearch = () => {
    if (address.trim()) {
      onSearch(address)
    }
  }

  /**
   * Handle history item click
   */
  const handleHistoryClick = (item) => {
    setAddress(item.displayName)
    onAddressSelect(item)
    setShowHistoryDropdown(false)
  }

  /**
   * Clear search history
   */
  const clearHistory = () => {
    setSearchHistory([])
    localStorage.removeItem('addressSearchHistory')
    setShowHistoryDropdown(false)
  }

  return (
    <div className="w-full space-y-3">
      {/* Address Autocomplete Input */}
      <div>
        <label className="block text-rentestText text-sm font-semibold mb-2">
          Search Address
        </label>
        <div className="flex gap-2">
          <div className="flex-1">
            <AddressAutocomplete
              value={address}
              onChange={setAddress}
              onSelect={handleAddressSelect}
              placeholder={placeholder}
              disabled={disabled}
              maxSuggestions={5}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={!address.trim() || disabled}
            className="bg-rentestPrimary hover:bg-rentestSecondary disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            title="Search"
          >
            🔍
          </button>
        </div>
      </div>

      {/* Search History */}
      {showHistoryDropdown && searchHistory.length > 0 && (
        <div className="bg-white border-2 border-rentestBorder rounded-lg shadow-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-rentestText text-sm">Recent Searches</h3>
            <button
              onClick={clearHistory}
              className="text-xs text-rentestText hover:text-red-600 transition-colors"
            >
              Clear
            </button>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {searchHistory.map((item, index) => (
              <button
                key={index}
                onClick={() => handleHistoryClick(item)}
                className="w-full text-left p-2 hover:bg-rentestBgLight rounded transition-colors"
              >
                <div className="text-sm font-semibold text-rentestText">
                  {item.address}
                </div>
                <div className="text-xs text-rentestText opacity-75 truncate">
                  {item.displayName}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Show History Button */}
      {showHistoryDropdown === false && searchHistory.length > 0 && (
        <button
          onClick={() => setShowHistoryDropdown(true)}
          className="text-sm text-rentestPrimary hover:text-rentestSecondary transition-colors"
        >
          📋 View search history ({searchHistory.length})
        </button>
      )}
    </div>
  )
}
