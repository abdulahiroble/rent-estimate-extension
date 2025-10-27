# ExtPay Payment Testing Checklist

## Pre-Testing Setup

- [ ] Extension registered at extensionpay.com with ID: `rentest2`
- [ ] Extension loaded in Chrome developer mode (`chrome://extensions/`)
- [ ] ExtPay.js file present in `/extension/` folder
- [ ] Manifest.json has content_scripts configured for extensionpay.com
- [ ] Background.js initializes ExtPay with correct ID

## Test Scenario 1: Free User Quota Enforcement

**Setup:** Fresh extension install (no payments)

- [ ] Open extension popup
- [ ] See "Monthly Lookups: 0/20" in UsageDisplay
- [ ] Perform a property search (simulates lookup)
- [ ] Verify lookup count increments
- [ ] Perform 19 more searches (total 20)
- [ ] Attempt 21st search - should be blocked
- [ ] See "Quota Exceeded" message
- [ ] See UpgradePrompt with "Upgrade to Pro" button

## Test Scenario 2: Quota Warning at 80%

**Setup:** Fresh extension install

- [ ] Perform 16 searches (80% of 20 quota)
- [ ] See UpgradePrompt appear with "Running Low" message
- [ ] See "Only 4 lookups left this month"
- [ ] Verify progress bar shows 80% filled
- [ ] Color should be yellow/warning

## Test Scenario 3: Test Payment Flow

**Setup:** Free user at quota limit

- [ ] Click "Upgrade to Pro" button
- [ ] Payment window opens in new tab
- [ ] Leave card fields blank
- [ ] Enter email used for extensionpay.com signup
- [ ] Click Pay
- [ ] Enter ExtensionPay password
- [ ] Click Pay again
- [ ] See success message
- [ ] Close payment tab

## Test Scenario 4: Premium User Access

**Setup:** After completing test payment

- [ ] Close and reopen extension popup
- [ ] See "⭐ Premium" in UsageDisplay
- [ ] See "Unlimited" instead of quota number
- [ ] No progress bar shown
- [ ] No UpgradePrompt shown
- [ ] Perform unlimited searches without restriction
- [ ] No quota warnings appear

## Test Scenario 5: Monthly Reset

**Setup:** Free user with some lookups used

- [ ] Perform 5 searches (5/20 used)
- [ ] Verify "5/20" shown in UsageDisplay
- [ ] Manually advance system date to 1st of next month
- [ ] Refresh extension
- [ ] Verify quota resets to "0/20"
- [ ] Can perform 20 new searches

## Test Scenario 6: Trial Signup (Optional)

**Setup:** Free user

- [ ] Look for trial signup option (if implemented)
- [ ] Click "Start Free Trial"
- [ ] Enter email
- [ ] Receive confirmation email
- [ ] Click link in email
- [ ] Verify trial activated
- [ ] Check `trialStartedAt` in user object

## Test Scenario 7: Login for Reactivation (Optional)

**Setup:** Paid user on different browser/profile

- [ ] Click "Login" button
- [ ] Enter email used for payment
- [ ] Receive magic login link
- [ ] Click link
- [ ] Verify premium status activated

## Browser Console Checks

- [ ] No errors in console
- [ ] `extpay.getUser()` returns user object with `paid: true/false`
- [ ] `getUserInfo()` returns correct payment status
- [ ] `getUsageStats()` returns correct quota info
- [ ] No CORS errors for extensionpay.com

## Dashboard Verification

- [ ] Log into extensionpay.com
- [ ] Go to extension settings
- [ ] See test payment in Recent Transactions
- [ ] See user email in Users list
- [ ] Can view payment details

## Edge Cases

- [ ] Uninstall and reinstall extension - quota resets
- [ ] Clear browser storage - quota resets
- [ ] Open extension in multiple tabs - quota syncs
- [ ] Switch between browsers - premium status persists (if logged in)
- [ ] Network offline - graceful error handling

## Performance Checks

- [ ] Extension popup loads in < 2 seconds
- [ ] No lag when checking payment status
- [ ] Payment page opens quickly
- [ ] No memory leaks after repeated opens

## Sign-Off

- [ ] All scenarios tested ✓
- [ ] No console errors ✓
- [ ] Dashboard shows correct data ✓
- [ ] Ready for production ✓

**Tested by:** _______________  
**Date:** _______________  
**Notes:** _______________
