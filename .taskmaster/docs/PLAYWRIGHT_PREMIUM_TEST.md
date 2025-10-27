# Playwright Premium Features Test Guide

## Why Playwright Can't Test Chrome Extensions Directly

Playwright cannot:
- Load unpacked Chrome extensions via URL
- Access `chrome://extensions/` page
- Interact with extension popups directly
- Access Chrome extension APIs

**Reason:** Chrome extensions run in a special sandboxed context that Playwright cannot access.

---

## Manual Testing Steps (Using Chrome DevTools)

Since Playwright can't automate extension testing, follow these manual steps:

### Step 1: Load Extension in Chrome

```bash
# 1. Open Chrome
# 2. Go to: chrome://extensions/
# 3. Enable "Developer mode" (top right toggle)
# 4. Click "Load unpacked"
# 5. Navigate to and select:
#    /Users/abdulahiroble/Documents/iCollections/Developer/rent-est-extension/extension
# 6. Click "Open"
```

**Verify:**
- Extension appears in list
- Status shows "Enabled"
- No errors shown

### Step 2: Open Extension Popup

```bash
# 1. Click extension icon in Chrome toolbar
# 2. Popup window opens showing RentEst interface
```

### Step 3: Verify Premium Mode is Active

**Check 1: Usage Display**
```
Expected: "Unlimited" (not "0/20")
Location: Scroll down to "Monthly Lookups" section
```

**Check 2: Console Logs**
```bash
# 1. Press F12 in the popup
# 2. Go to Console tab
# 3. Look for:
#    [Dev Mode] Paywall bypassed - simulating paid user
```

**Check 3: No Upgrade Prompts**
```
Expected: No blue upgrade prompts visible
If visible: Bypass not working
```

---

## Test Cases

### Test 1: Premium Status Indicator

**Steps:**
1. Open extension popup
2. Look at usage display section
3. Check console for dev mode logs

**Expected Results:**
```
✅ Usage shows "Unlimited"
✅ Console shows: [Dev Mode] Paywall bypassed - simulating paid user
✅ No quota numbers displayed
✅ No progress bar
```

**Pass/Fail:** ___________

---

### Test 2: Unlimited Searches

**Steps:**
1. Enter address: "123 Main Street"
2. Enter city: "New York"
3. Enter state: "NY"
4. Click "Get Rent Estimate"
5. Repeat 5+ times

**Expected Results:**
```
✅ All searches succeed
✅ No "quota exceeded" errors
✅ Results display correctly
✅ Console shows: [Dev Mode] Quota check bypassed - allowing lookup
```

**Pass/Fail:** ___________

---

### Test 3: No Upgrade Prompts

**Steps:**
1. Perform multiple searches (10+)
2. Watch for any blue upgrade prompts

**Expected Results:**
```
✅ No "Running Low" prompts
✅ No "Halfway There" prompts
✅ No "Quota Exceeded" prompts
✅ No "Upgrade to Unlimited" buttons
```

**Pass/Fail:** ___________

---

### Test 4: Premium Persists After Reload

**Steps:**
1. Perform a search
2. Close popup (click X)
3. Reopen popup (click extension icon)
4. Check usage display

**Expected Results:**
```
✅ Still shows "Unlimited"
✅ No prompts appear
✅ Premium status maintained
```

**Pass/Fail:** ___________

---

### Test 5: Mock API Works

**Steps:**
1. Verify `.env.local` has `NEXT_PUBLIC_USE_MOCK_API=true`
2. Perform a search
3. Check console

**Expected Results:**
```
✅ Results appear instantly (no delay)
✅ Console shows: [RentCast API] Mode: 🧪 MOCK (Testing)
✅ Same data returned each time
```

**Pass/Fail:** ___________

---

## Console Log Checklist

When testing, you should see these logs in the console:

```javascript
// On popup load:
[Dev Mode] Paywall bypassed - simulating paid user

// On search:
[Dev Mode] Quota check bypassed - allowing lookup
[RentCast API] Mode: 🧪 MOCK (Testing)

// On successful search:
[RentCast API] Mock data returned for: 123 Main Street, New York, NY
```

---

## Troubleshooting

### Issue: Still seeing "0/20" quota
**Solution:**
- Check `.env.local` has `NEXT_PUBLIC_BYPASS_PAYWALL=true`
- Rebuild: `./build-extension.sh`
- Reload extension: `chrome://extensions/` → Click refresh

### Issue: Upgrade prompts still showing
**Solution:**
- Check console for `[Dev Mode]` logs
- If not present, bypass isn't enabled
- Verify `.env.local` location and content
- Rebuild and reload

### Issue: No console logs appearing
**Solution:**
- Make sure you opened DevTools in the popup (F12)
- Check you're in the Console tab
- Perform a search to trigger logs
- Look for any errors in red

---

## Switching Test Modes

### To Test Free Tier (with quota):
```bash
# Edit .env.local
NEXT_PUBLIC_BYPASS_PAYWALL=false

# Rebuild
./build-extension.sh

# Reload extension in Chrome
```

**Expected:** Shows "0/20", upgrade prompts appear

### To Test Premium (unlimited):
```bash
# Edit .env.local
NEXT_PUBLIC_BYPASS_PAYWALL=true

# Rebuild
./build-extension.sh

# Reload extension in Chrome
```

**Expected:** Shows "Unlimited", no prompts

---

## Test Results Summary

| Test | Expected | Actual | Pass/Fail |
|------|----------|--------|-----------|
| Premium Status | "Unlimited" | __________ | __________ |
| Unlimited Searches | All succeed | __________ | __________ |
| No Upgrade Prompts | None visible | __________ | __________ |
| Premium Persists | Still unlimited | __________ | __________ |
| Mock API Works | Instant results | __________ | __________ |

---

## Why Playwright Can't Test This

**Chrome Extension Limitations:**
1. Extensions run in isolated sandbox
2. Playwright can't access `chrome://` URLs
3. No direct API to load/interact with extensions
4. Extension popups aren't standard web pages

**Workaround:**
- Use manual testing with Chrome DevTools
- Use Chrome extension testing libraries (not Playwright)
- Use Selenium with Chrome extension support (complex setup)

---

## Alternative: Automated Testing with Puppeteer

If you need automated extension testing, consider:

```javascript
// Puppeteer can load extensions (more complex than Playwright)
const browser = await puppeteer.launch({
  args: [
    `--load-extension=/path/to/extension`,
    '--disable-extensions-except=/path/to/extension'
  ]
});
```

But this requires:
- Puppeteer instead of Playwright
- Complex setup
- Still limited extension API access

---

## Conclusion

**For Chrome extension testing:**
- ✅ Manual testing with DevTools is most reliable
- ✅ Follow the test cases above
- ✅ Check console logs for verification
- ❌ Playwright cannot automate extension testing

**Next Steps:**
1. Load extension in Chrome
2. Follow test cases above
3. Document results in this file
4. Switch between modes to verify both work

---

**Note:** This is a known limitation of browser automation tools with Chrome extensions. The manual testing approach above is the standard industry practice for extension testing.
