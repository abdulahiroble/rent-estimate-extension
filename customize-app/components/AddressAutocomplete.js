/**
 * Address Autocomplete Component
 * Provides address search with autocomplete suggestions
 */

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { debounceAsync } from '../utils/debounce'

export default function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = 'Enter address',
  disabled = false,
  maxSuggestions = 5
}) {
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [error, setError] = useState('')
  const inputRef = useRef(null)
  const suggestionsRef = useRef(null)

  /**
   * Fetch address suggestions from Nominatim
   */
  const fetchSuggestions = useCallback(
    (query) => {
      if (!query || query.length < 3) {
        setSuggestions([])
        setShowSuggestions(false)
        return
      }

      setLoading(true)
      setError('')

      const debouncedFetch = debounceAsync(async (q) => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=${maxSuggestions}&accept-language=en`
          )

          if (!response.ok) {
            throw new Error('Failed to fetch address suggestions')
          }

          const data = await response.json()

          const formatted = data.map((item) => ({
            address: item.address,
            displayName: item.display_name,
            lat: item.lat,
            lon: item.lon,
            boundingBox: item.boundingbox
          }))

          setSuggestions(formatted)
          setShowSuggestions(formatted.length > 0)
          setSelectedIndex(-1)
        } catch (err) {
          console.error('Address autocomplete error:', err)
          setError('Unable to fetch address suggestions')
          setSuggestions([])
        } finally {
          setLoading(false)
        }
      }, 300)

      debouncedFetch(query)
    },
    [maxSuggestions]
  )

  /**
   * Handle input change
   */
  const handleInputChange = (e) => {
    const newValue = e.target.value
    onChange(newValue)
    setSelectedIndex(-1)

    if (newValue.length >= 3) {
      fetchSuggestions(newValue)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  /**
   * Handle suggestion selection
   */
  const handleSelectSuggestion = (suggestion) => {
    onChange(suggestion.displayName)
    onSelect(suggestion)
    setShowSuggestions(false)
    setSuggestions([])
    setSelectedIndex(-1)
  }

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) {
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        )
        break

      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        )
        break

      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0) {
          handleSelectSuggestion(suggestions[selectedIndex])
        }
        break

      case 'Escape':
        e.preventDefault()
        setShowSuggestions(false)
        setSelectedIndex(-1)
        break

      default:
        break
    }
  }

  /**
   * Handle click outside
   */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  /**
   * Scroll selected item into view
   */
  useEffect(() => {
    if (selectedIndex >= 0 && suggestionsRef.current) {
      const items = suggestionsRef.current.querySelectorAll('[data-suggestion-item]')
      if (items[selectedIndex]) {
        items[selectedIndex].scrollIntoView({ block: 'nearest' })
      }
    }
  }, [selectedIndex])

  return (
    <div className="relative w-full">
      {/* Input Field */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => value.length >= 3 && suggestions.length > 0 && setShowSuggestions(true)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full border-2 border-rentestBorder rounded-lg py-2 px-3 text-rentestText focus:border-rentestPrimary focus:outline-none transition-colors disabled:bg-gray-100"
          autoComplete="off"
        />

        {/* Loading Indicator */}
        {loading && (
          <div className="absolute right-3 top-2.5">
            <div className="animate-spin text-rentestPrimary">⏳</div>
          </div>
        )}

        {/* Clear Button */}
        {value && !loading && (
          <button
            onClick={() => {
              onChange('')
              setSuggestions([])
              setShowSuggestions(false)
              inputRef.current?.focus()
            }}
            className="absolute right-3 top-2.5 text-rentestText hover:text-rentestPrimary transition-colors"
            title="Clear"
          >
            ✕
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-2 text-red-600 text-sm">{error}</div>
      )}

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-rentestBorder rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              data-suggestion-item
              onClick={() => handleSelectSuggestion(suggestion)}
              className={`w-full text-left px-4 py-3 border-b border-rentestBorder last:border-b-0 transition-colors ${
                index === selectedIndex
                  ? 'bg-rentestPrimary text-white'
                  : 'hover:bg-rentestBgLight text-rentestText'
              }`}
            >
              <div className="font-semibold text-sm">{suggestion.address}</div>
              <div className="text-xs opacity-75 truncate">
                {suggestion.displayName}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No Results Message */}
      {showSuggestions && !loading && suggestions.length === 0 && value.length >= 3 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-rentestBorder rounded-lg shadow-lg z-50 p-4 text-center text-rentestText text-sm">
          No addresses found
        </div>
      )}
    </div>
  )
}
