/**
 * MapView Component Tests
 * Tests for the Leaflet map visualization component
 */

import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import MapView from '../components/MapView'

// Mock Leaflet to avoid DOM issues in tests
jest.mock('leaflet', () => ({
  map: jest.fn(() => ({
    setView: jest.fn(() => ({
      addLayer: jest.fn()
    })),
    addLayer: jest.fn(),
    fitBounds: jest.fn(),
    remove: jest.fn()
  })),
  tileLayer: jest.fn(() => ({
    addTo: jest.fn()
  })),
  markerClusterGroup: jest.fn(() => ({
    addLayer: jest.fn(),
    clearLayers: jest.fn(),
    getBounds: jest.fn(() => ({
      isValid: jest.fn(() => true)
    }))
  })),
  marker: jest.fn(() => ({
    bindPopup: jest.fn()
  })),
  divIcon: jest.fn(),
  control: {
    zoom: jest.fn(() => ({
      addTo: jest.fn()
    }))
  }
}))

jest.mock('leaflet.markercluster', () => ({}))

describe('MapView Component', () => {
  const mockProperties = [
    {
      id: '1',
      latitude: 40.7128,
      longitude: -74.006,
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      rentFormatted: '$2,500',
      bedrooms: 3,
      bathrooms: 2,
      squareFeetFormatted: '1,800',
      propertyType: 'Single Family',
      distanceFormatted: '0.5 mi',
      daysOnMarketFormatted: '30 days',
      listingUrl: 'https://example.com/listing/1'
    },
    {
      id: '2',
      latitude: 40.7580,
      longitude: -73.9855,
      address: '456 Oak Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
      rentFormatted: '$2,800',
      bedrooms: 2,
      bathrooms: 1,
      squareFeetFormatted: '1,200',
      propertyType: 'Apartment',
      distanceFormatted: '0.8 mi',
      daysOnMarketFormatted: '15 days',
      listingUrl: 'https://example.com/listing/2'
    }
  ]

  test('renders map container', () => {
    const { container } = render(
      <MapView
        properties={mockProperties}
        centerLat={40.7128}
        centerLng={-74.006}
        loading={false}
      />
    )

    const mapContainer = container.querySelector('[style*="min-height"]')
    expect(mapContainer).toBeInTheDocument()
  })

  test('displays loading state', () => {
    render(
      <MapView
        properties={[]}
        centerLat={40.7128}
        centerLng={-74.006}
        loading={true}
      />
    )

    expect(screen.getByText('Loading map...')).toBeInTheDocument()
  })

  test('displays empty state when no properties', () => {
    render(
      <MapView
        properties={[]}
        centerLat={40.7128}
        centerLng={-74.006}
        loading={false}
      />
    )

    expect(screen.getByText('No properties to display on map')).toBeInTheDocument()
  })

  test('renders with properties data', () => {
    const { container } = render(
      <MapView
        properties={mockProperties}
        centerLat={40.7128}
        centerLng={-74.006}
        loading={false}
      />
    )

    const mapContainer = container.querySelector('[style*="min-height"]')
    expect(mapContainer).toBeInTheDocument()
  })

  test('uses default center coordinates when not provided', () => {
    const { container } = render(
      <MapView
        properties={mockProperties}
        loading={false}
      />
    )

    const mapContainer = container.querySelector('[style*="min-height"]')
    expect(mapContainer).toBeInTheDocument()
  })

  test('applies responsive classes', () => {
    const { container } = render(
      <MapView
        properties={mockProperties}
        centerLat={40.7128}
        centerLng={-74.006}
        loading={false}
      />
    )

    const wrapper = container.querySelector('.w-full')
    expect(wrapper).toBeInTheDocument()
  })

  test('renders map with correct styling', () => {
    const { container } = render(
      <MapView
        properties={mockProperties}
        centerLat={40.7128}
        centerLng={-74.006}
        loading={false}
      />
    )

    const mapDiv = container.querySelector('[style*="min-height"]')
    expect(mapDiv).toHaveClass('rounded-lg', 'shadow-md', 'border', 'border-gray-200')
  })
})
