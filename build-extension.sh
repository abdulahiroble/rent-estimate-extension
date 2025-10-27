#!/bin/bash

# Build and copy extension files
echo "🔨 Building Next.js app..."
cd customize-app
npm run build

echo "📁 Copying built files to extension folder..."
cd ..
rm -rf extension/_*.js extension/_*.json extension/chunks/pages/_error-*.js
find extension -name "*.nft.json" -delete
cp -r customize-app/.next/static/* extension/
cp -r customize-app/.next/server/pages/* extension/

echo "🧹 Cleaning up system files..."
rm -f extension/_*.js extension/_*.json
find extension -name "*.nft.json" -delete
rm -f extension/chunks/pages/_error-*.js

echo "✅ Extension built successfully!"
echo "📂 Extension folder: $(pwd)/extension"
echo "🔄 Reload extension in Chrome: chrome://extensions/"
