# RentEst - Instant Rent Estimates

A browser extension that provides instant rental price estimates for any property in the United States.

## Overview

RentEst is a powerful tool for real estate investors, landlords, and property managers who need quick, accurate rental pricing data. Get rent estimates, comparable properties, and market insights directly in your browser without visiting multiple websites.

**Powered by RentCast's 140M+ property database**

## Features

- 🏠 **Instant Rent Estimates** - Get accurate rent estimates for any property
- 📍 **Location-Based Search** - Search by address or use current location
- 🏘️ **Comparable Properties** - View nearby rental comps with details
- 📊 **Market Insights** - Local market statistics and historical trends
- 💾 **Save Favorites** - Keep track of properties you're interested in
- 📈 **Premium Features** - Unlimited lookups, detailed comps, PDF reports

## Installation

Coming soon to:
- Chrome Web Store
- Firefox Add-ons
- Microsoft Edge Add-ons

## Development

### Prerequisites
- Node.js 16+
- npm or yarn

### Setup

```bash
cd customize-app
npm install
npm run dev
```

### Build for Extension

```bash
npm run build
```

This will compile the Next.js app and copy the output to the `extension/` directory.

### Project Structure

```
rent-est-extension/
├── customize-app/          # Next.js frontend application
│   ├── components/         # React components
│   ├── pages/             # Next.js pages
│   ├── styles/            # CSS and Tailwind config
│   └── utilities/         # Chrome and storage utilities
├── extension/             # Chrome extension files
│   ├── manifest.json      # Extension manifest
│   ├── background.js      # Service worker
│   └── customize.html     # Built extension UI
└── .taskmaster/           # Project task management
```

## Technology Stack

- **Frontend**: Next.js 13, React 18, TypeScript
- **Styling**: Tailwind CSS 3
- **Extension**: Chrome Extension Manifest V3
- **API**: RentCast Property Data API
- **Payment**: ExtPay
- **Visualization**: Leaflet, Chart.js

## API Integration

RentEst uses the RentCast API to provide:
- Property rent estimates (AVM)
- Comparable rental properties
- Market statistics and trends
- Historical rent data
- 140M+ property records nationwide

## Pricing

- **Free Tier**: 20 lookups/month (resets monthly)
- **Premium Tier**: $29.99/month - Unlimited lookups + premium features
  - 14-day free trial
  - Cancel anytime
  - Includes comparable properties, market insights, and more

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Support

For issues, feature requests, or questions, please open an issue on GitHub.
