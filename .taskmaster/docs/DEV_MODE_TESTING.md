# Development Mode Testing Guide

## Overview
This guide explains how to test the extension in development mode with bypasses for API calls and paywall restrictions.

## Environment Variables

### 1. Mock API Mode (`NEXT_PUBLIC_USE_MOCK_API`)
Bypasses real RentCast API calls and uses mock data instead.

**Purpose:** Test UI and features without consuming API quota or requiring API key.

**Usage:**
```bash
# In .env.local
NEXT_PUBLIC_USE_MOCK_API=true
```

**What it does:**
- Returns mock rent estimate data
- No real API calls to RentCast
- Doesn't consume API quota
- Useful for UI/UX testing

### 2. Paywall Bypass Mode (`NEXT_PUBLIC_BYPASS_PAYWALL`)
Simulates a paid/premium user without requiring ExtensionPay subscription.

**Purpose:** Test premium features and unlimited usage without going through ExtensionPay payment flow.

**Usage:**
```bash
# In .env.local
NEXT_PUBLIC_BYPASS_PAYWALL=true
```

**What it does:**
- Simulates `isPremium = true`
- Bypasses quota enforcement
- Shows "Unlimited" in usage display
- Hides upgrade prompts
- Doesn't track lookups against quota
- Logs `[Dev Mode]` messages in console

## Testing Scenarios

### Scenario 1: Test Free Tier Experience
```bash
# .env.local
NEXT_PUBLIC_USE_MOCK_API=false
NEXT_PUBLIC_BYPASS_PAYWALL=false
```
**Tests:**
- Real API calls (consumes quota)
- Quota tracking and enforcement
- Upgrade prompts at 50%, 80%, 100%
- Quota exceeded blocking

### Scenario 2: Test Premium User Experience
```bash
# .env.local
NEXT_PUBLIC_USE_MOCK_API=false
NEXT_PUBLIC_BYPASS_PAYWALL=true
```
**Tests:**
- Real API calls (no quota tracking)
- Unlimited usage
- Premium UI indicators
- No upgrade prompts

### Scenario 3: Test UI/UX Without API
```bash
# .env.local
NEXT_PUBLIC_USE_MOCK_API=true
NEXT_PUBLIC_BYPASS_PAYWALL=false
```
**Tests:**
- Mock data responses
- Free tier quota enforcement
- Upgrade prompt behavior
- Usage tracking

### Scenario 4: Full Development Mode
```bash
# .env.local
NEXT_PUBLIC_USE_MOCK_API=true
NEXT_PUBLIC_BYPASS_PAYWALL=true
```
**Tests:**
- Mock data responses
- Premium user experience
- No quota limits
- No API consumption

## Console Logging

When bypass modes are enabled, you'll see console logs:

```javascript
// Paywall bypass
[Dev Mode] Paywall bypassed - simulating paid user

// Quota bypass
[Dev Mode] Quota check bypassed - allowing lookup
```

## Production Configuration

**IMPORTANT:** For production builds, ensure both flags are set to `false` or removed:

```bash
# .env.local (Production)
NEXT_PUBLIC_USE_MOCK_API=false
NEXT_PUBLIC_BYPASS_PAYWALL=false
```

Or simply remove these lines to use default values.

## Troubleshooting

### Bypass not working?
1. Check `.env.local` file exists in `customize-app/` directory
2. Verify values are exactly `true` (lowercase, no quotes)
3. Rebuild extension: `./build-extension.sh`
4. Reload extension in Chrome: `chrome://extensions/`

### Still seeing upgrade prompts with bypass enabled?
1. Check console for `[Dev Mode]` logs
2. Verify `NEXT_PUBLIC_BYPASS_PAYWALL=true` in `.env.local`
3. Clear browser cache and reload extension
4. Check that `.env.local` is in the correct directory

### Mock API not returning data?
1. Check `NEXT_PUBLIC_USE_MOCK_API=true` in `.env.local`
2. Verify mock data exists in `services/rentcastApi.js`
3. Check console for errors
4. Rebuild and reload extension

## Best Practices

1. **Never commit `.env.local`** - It's in `.gitignore`
2. **Use `.env.local.example`** as template
3. **Test both modes** before production release
4. **Document any changes** to environment variables
5. **Reset to production values** before building for release

## Example Workflow

### Testing New Feature
```bash
# 1. Enable full dev mode
echo "NEXT_PUBLIC_USE_MOCK_API=true" >> .env.local
echo "NEXT_PUBLIC_BYPASS_PAYWALL=true" >> .env.local

# 2. Build and test
./build-extension.sh

# 3. Test with real API
sed -i '' 's/NEXT_PUBLIC_USE_MOCK_API=true/NEXT_PUBLIC_USE_MOCK_API=false/' .env.local
./build-extension.sh

# 4. Test free tier experience
sed -i '' 's/NEXT_PUBLIC_BYPASS_PAYWALL=true/NEXT_PUBLIC_BYPASS_PAYWALL=false/' .env.local
./build-extension.sh
```

## Related Files

- `.env.local` - Your local environment variables
- `.env.local.example` - Template with all options
- `hooks/useUsageTracking.js` - Paywall bypass logic
- `utils/quotaEnforcement.js` - Quota bypass logic
- `services/rentcastApi.js` - Mock API logic
