# Premium Features Testing Checklist

## Pre-Test Setup ✅

- [x] Extension built with `./build-extension.sh`
- [x] `.env.local` has `NEXT_PUBLIC_BYPASS_PAYWALL=true`
- [x] All files present in `/extension/`:
  - [x] `manifest.json` (1.2K)
  - [x] `background.js` (3.3K)
  - [x] `customize.html` (4.0K)
  - [x] `ExtPay.js` (51K)

## Loading Extension in Chrome

### Step 1: Open Chrome Extensions Page
```
1. Open Chrome
2. Go to: chrome://extensions/
3. Enable "Developer mode" (toggle in top right)
```

### Step 2: Load Unpacked Extension
```
1. Click "Load unpacked"
2. Navigate to: /Users/abdulahiroble/Documents/iCollections/Developer/rent-est-extension/extension
3. Select the "extension" folder
4. Click "Open"
```

**Expected Result:**
- Extension appears in list
- Status shows "Enabled"
- No errors in "Errors" section

### Step 3: Verify Extension Loaded
```
1. Look for "RentEst" extension in the list
2. Note the extension ID (e.g., "abc123def456...")
3. Click extension icon in toolbar
4. Popup should open
```

---

## Testing Premium Features

### Test 1: Usage Display Shows "Unlimited"

**Steps:**
1. Click extension icon to open popup
2. Scroll down to "Monthly Lookups" section
3. Check usage display

**Expected Results:**
- ✅ Shows "Unlimited" text (not "0/20")
- ✅ No progress bar
- ✅ No quota numbers

**Console Check:**
- Open DevTools (F12) in popup
- Look for: `[Dev Mode] Paywall bypassed - simulating paid user`

---

### Test 2: No Upgrade Prompts

**Steps:**
1. Open popup
2. Perform multiple searches (5+)
3. Check for upgrade prompts

**Expected Results:**
- ✅ No "Running Low" prompts
- ✅ No "Halfway There" prompts
- ✅ No "Quota Exceeded" prompts
- ✅ No "Upgrade to Unlimited" buttons

---

### Test 3: Unlimited Searches

**Steps:**
1. Enter address: "123 Main Street"
2. Enter city: "New York"
3. Enter state: "NY"
4. Click "Get Rent Estimate"
5. Repeat 10+ times

**Expected Results:**
- ✅ All searches succeed
- ✅ No "quota exceeded" errors
- ✅ No blocking messages
- ✅ Results display correctly

**Console Check:**
- Look for: `[Dev Mode] Quota check bypassed - allowing lookup`

---

### Test 4: Mock API Works (if enabled)

**Steps:**
1. Verify `.env.local` has `NEXT_PUBLIC_USE_MOCK_API=true`
2. Perform a search
3. Check results

**Expected Results:**
- ✅ Results appear instantly (no API delay)
- ✅ Console shows: `[RentCast API] Mode: 🧪 MOCK (Testing)`
- ✅ Same data returned each time (mock data)

---

### Test 5: Premium Status Persists

**Steps:**
1. Perform search
2. Close popup (click X or click elsewhere)
3. Reopen popup (click extension icon)
4. Check usage display

**Expected Results:**
- ✅ Still shows "Unlimited"
- ✅ No prompts appear
- ✅ Premium status maintained

---

### Test 6: Console Logs Verify Bypass

**Steps:**
1. Open popup
2. Press F12 to open DevTools
3. Go to Console tab
4. Perform a search
5. Check console output

**Expected Logs:**
```
[Dev Mode] Paywall bypassed - simulating paid user
[Dev Mode] Quota check bypassed - allowing lookup
[RentCast API] Mode: 🧪 MOCK (Testing)
```

---

## Troubleshooting

### Issue: Extension won't load
**Solution:**
- Check `.env.local` exists in `customize-app/` directory
- Run `./build-extension.sh` again
- Verify extension folder path is correct

### Issue: Still seeing "0/20" quota
**Solution:**
- Verify `NEXT_PUBLIC_BYPASS_PAYWALL=true` in `.env.local`
- Rebuild: `./build-extension.sh`
- Reload extension: `chrome://extensions/` → Click refresh icon

### Issue: Upgrade prompts still showing
**Solution:**
- Check console for `[Dev Mode]` logs
- If not present, bypass isn't enabled
- Verify `.env.local` is in correct location
- Rebuild and reload

### Issue: Chrome runtime errors
**Solution:**
- Make sure you're testing in the Chrome extension (not `file://` or `localhost`)
- Open popup by clicking extension icon
- Check that extension is enabled in `chrome://extensions/`

---

## Switching Between Modes

### Test Free Tier (with quota)
```bash
# Edit .env.local
NEXT_PUBLIC_BYPASS_PAYWALL=false

# Rebuild
./build-extension.sh

# Reload extension in Chrome
```

### Test Premium (unlimited)
```bash
# Edit .env.local
NEXT_PUBLIC_BYPASS_PAYWALL=true

# Rebuild
./build-extension.sh

# Reload extension in Chrome
```

### Test with Real API
```bash
# Edit .env.local
NEXT_PUBLIC_USE_MOCK_API=false

# Rebuild
./build-extension.sh

# Reload extension in Chrome
```

---

## Success Criteria

All of the following should be true:

- [x] Extension loads without errors
- [x] Usage shows "Unlimited"
- [x] No upgrade prompts appear
- [x] Unlimited searches work
- [x] Console shows `[Dev Mode]` logs
- [x] Premium status persists after reload
- [x] Can switch between modes by editing `.env.local`

---

## Next Steps

1. **Load extension in Chrome** following "Loading Extension in Chrome" section
2. **Run through all tests** in "Testing Premium Features" section
3. **Document any issues** in troubleshooting section
4. **Switch to free tier mode** to test quota enforcement
5. **Compare behavior** between premium and free tiers

---

## Files Involved

- `.env.local` - Configuration with bypass flags
- `extension/background.js` - ExtPay initialization
- `extension/manifest.json` - Extension configuration
- `customize-app/hooks/useUsageTracking.js` - Bypass logic
- `customize-app/utils/quotaEnforcement.js` - Quota bypass logic

---

## Quick Reference

| Mode | Config | Result |
|------|--------|--------|
| **Premium (Bypass)** | `NEXT_PUBLIC_BYPASS_PAYWALL=true` | Unlimited, no prompts |
| **Free Tier** | `NEXT_PUBLIC_BYPASS_PAYWALL=false` | 20/month quota |
| **Mock API** | `NEXT_PUBLIC_USE_MOCK_API=true` | Instant mock data |
| **Real API** | `NEXT_PUBLIC_USE_MOCK_API=false` | Real RentCast calls |
