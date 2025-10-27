/**
 * Property Card Component
 * Displays a single comparable property with key details
 */

export default function PropertyCard({ property }) {
  if (!property) return null

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Header with rent and distance */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 border-b border-gray-200">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-2xl font-bold text-blue-600">{property.rentFormatted}</p>
            <p className="text-xs text-gray-600">/month</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-700">{property.distanceFormatted}</p>
            <p className="text-xs text-gray-600">away</p>
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="px-4 pt-4">
        <p className="font-semibold text-gray-900 text-sm mb-1">{property.address}</p>
        <p className="text-xs text-gray-600 mb-3">
          {property.city}, {property.state} {property.zipCode}
        </p>
      </div>

      {/* Property Details Grid */}
      <div className="px-4 py-3 grid grid-cols-2 gap-3 border-t border-gray-100">
        {/* Bedrooms */}
        <div className="flex items-center space-x-2">
          <span className="text-lg">🛏️</span>
          <div>
            <p className="text-xs text-gray-600">Beds</p>
            <p className="font-semibold text-gray-900">{property.bedrooms || 'N/A'}</p>
          </div>
        </div>

        {/* Bathrooms */}
        <div className="flex items-center space-x-2">
          <span className="text-lg">🚿</span>
          <div>
            <p className="text-xs text-gray-600">Baths</p>
            <p className="font-semibold text-gray-900">{property.bathrooms || 'N/A'}</p>
          </div>
        </div>

        {/* Square Feet */}
        <div className="flex items-center space-x-2">
          <span className="text-lg">📐</span>
          <div>
            <p className="text-xs text-gray-600">SqFt</p>
            <p className="font-semibold text-gray-900">{property.squareFeetFormatted}</p>
          </div>
        </div>

        {/* Price per SqFt */}
        <div className="flex items-center space-x-2">
          <span className="text-lg">💰</span>
          <div>
            <p className="text-xs text-gray-600">$/SqFt</p>
            <p className="font-semibold text-gray-900">
              {property.pricePerSqFt ? `$${property.pricePerSqFt}` : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Property Type and Days on Market */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-gray-600">Type</p>
          <p className="text-sm font-medium text-gray-900 capitalize">{property.propertyType}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">On Market</p>
          <p className="text-sm font-medium text-gray-900">{property.daysOnMarketFormatted}</p>
        </div>
      </div>

      {/* Listing Link */}
      {property.listingUrl && (
        <div className="px-4 py-3 border-t border-gray-100">
          <a
            href={property.listingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full text-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
          >
            View Listing &rarr;
          </a>
        </div>
      )}
    </div>
  )
}
