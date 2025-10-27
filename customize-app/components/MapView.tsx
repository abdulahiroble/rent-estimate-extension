/**
 * MapView Component
 * Displays comparable properties on an interactive map with clustering
 */

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'

interface Property {
  id: string
  latitude: number
  longitude: number
  address: string
  city: string
  state: string
  zipCode: string
  rentFormatted: string
  bedrooms: number
  bathrooms: number
  squareFeetFormatted: string
  propertyType: string
  distanceFormatted: string
  daysOnMarketFormatted: string
  listingUrl?: string
}

interface MapViewProps {
  properties: Property[]
  centerLat?: number
  centerLng?: number
  loading?: boolean
}

export default function MapView({ properties, centerLat, centerLng, loading = false }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)
  const markersCluster = useRef<any>(null)
  const [mapReady, setMapReady] = useState(false)

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return

    try {
      // Create map instance
      map.current = L.map(mapContainer.current).setView(
        [centerLat || 40.7128, centerLng || -74.006],
        12
      )

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
        className: 'map-tiles'
      }).addTo(map.current)

      // Initialize marker cluster group
      markersCluster.current = (L as any).markerClusterGroup({
        maxClusterRadius: 80,
        disableClusteringAtZoom: 16
      })
      map.current.addLayer(markersCluster.current)

      // Add zoom controls
      L.control.zoom({ position: 'topright' }).addTo(map.current)

      setMapReady(true)
    } catch (error) {
      console.error('Error initializing map:', error)
    }

    return () => {
      // Cleanup on unmount
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [centerLat, centerLng])

  // Update markers when properties change
  useEffect(() => {
    if (!map.current || !markersCluster.current || !mapReady) return

    try {
      // Clear existing markers
      markersCluster.current.clearLayers()

      if (!properties || properties.length === 0) return

      // Add markers for each property
      properties.forEach(property => {
        if (!property.latitude || !property.longitude) return

        // Create custom icon
        const icon = L.divIcon({
          className: 'custom-marker',
          html: `
            <div class="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full border-2 border-white shadow-lg font-bold text-xs">
              📍
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32]
        })

        // Create popup content
        const popupContent = `
          <div class="w-64 p-3">
            <div class="mb-2">
              <p class="text-lg font-bold text-blue-600">${property.rentFormatted}</p>
              <p class="text-xs text-gray-600">/month</p>
            </div>
            <p class="font-semibold text-gray-900 text-sm mb-1">${property.address}</p>
            <p class="text-xs text-gray-600 mb-2">
              ${property.city}, ${property.state} ${property.zipCode}
            </p>
            <div class="grid grid-cols-2 gap-2 mb-2 text-xs">
              <div>
                <p class="text-gray-600">Beds</p>
                <p class="font-semibold">${property.bedrooms || 'N/A'}</p>
              </div>
              <div>
                <p class="text-gray-600">Baths</p>
                <p class="font-semibold">${property.bathrooms || 'N/A'}</p>
              </div>
              <div>
                <p class="text-gray-600">SqFt</p>
                <p class="font-semibold">${property.squareFeetFormatted}</p>
              </div>
              <div>
                <p class="text-gray-600">Distance</p>
                <p class="font-semibold">${property.distanceFormatted}</p>
              </div>
            </div>
            <div class="text-xs mb-2">
              <p class="text-gray-600">Type: <span class="font-semibold capitalize">${property.propertyType}</span></p>
              <p class="text-gray-600">On Market: <span class="font-semibold">${property.daysOnMarketFormatted}</span></p>
            </div>
            ${
              property.listingUrl
                ? `<a href="${property.listingUrl}" target="_blank" rel="noopener noreferrer" class="block w-full text-center px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700">View Listing</a>`
                : ''
            }
          </div>
        `

        // Create marker
        const marker = L.marker([property.latitude, property.longitude], { icon })
        marker.bindPopup(popupContent, {
          maxWidth: 300,
          className: 'property-popup'
        })

        // Add marker to cluster
        markersCluster.current!.addLayer(marker)
      })

      // Fit bounds if properties exist
      if (properties.length > 0) {
        const bounds = markersCluster.current!.getBounds()
        if (bounds.isValid()) {
          map.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 })
        }
      }
    } catch (error) {
      console.error('Error updating markers:', error)
    }
  }, [properties, mapReady])

  // Loading state
  if (loading) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    )
  }

  // Empty state
  if (!properties || properties.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No properties to display on map</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <style>{`
        .custom-marker {
          background: none;
          border: none;
        }

        .leaflet-marker-icon {
          border-radius: 50%;
        }

        .property-popup .leaflet-popup-content-wrapper {
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .property-popup .leaflet-popup-tip {
          background-color: white;
        }

        .leaflet-container {
          border-radius: 8px;
          overflow: hidden;
        }

        .leaflet-control-zoom {
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .marker-cluster {
          background-clip: padding-box;
          border-radius: 20px;
          background-color: #3b82f6;
          border: 2px solid rgba(255, 255, 255, 0.5);
        }

        .marker-cluster span {
          background-color: #1e40af;
          border-radius: 20px;
          color: white;
          font-weight: bold;
          font-size: 12px;
          line-height: 24px;
          text-align: center;
          width: 24px;
          height: 24px;
        }

        .marker-cluster.marker-cluster-small {
          background-color: #60a5fa;
        }

        .marker-cluster.marker-cluster-small span {
          background-color: #3b82f6;
        }

        .marker-cluster.marker-cluster-medium {
          background-color: #3b82f6;
        }

        .marker-cluster.marker-cluster-medium span {
          background-color: #1e40af;
        }

        .marker-cluster.marker-cluster-large {
          background-color: #1e40af;
        }

        .marker-cluster.marker-cluster-large span {
          background-color: #1e3a8a;
        }
      `}</style>
      <div
        ref={mapContainer}
        className="w-full h-96 rounded-lg shadow-md border border-gray-200"
        style={{ minHeight: '400px' }}
      />
    </div>
  )
}
