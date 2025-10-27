# ExtPay Test Mode Guide for RentEst

## How to Enable Test Mode

ExtPay automatically runs in **test mode** when your extension is installed in **developer mode** in Chrome. No special configuration needed!

### Step 1: Install Extension in Developer Mode

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top right)
3. Click **Load unpacked**
4. Navigate to `/extension` folder in your project
5. Select and load the extension

### Step 2: Test Payments in Test Mode

1. Click the RentEst extension icon in Chrome toolbar
2. Click **"Upgrade to Pro"** or **"Upgrade to Unlimited"** button
3. A payment window will appear
4. **Leave the card fields blank** (don't enter real card info)
5. Enter the **email you signed up with** on extensionpay.com
6. Click **Pay**
7. You'll be prompted for your **ExtensionPay password**
8. Enter your password and click **Pay**

### Step 3: Verify Test Payment

After completing the test payment:
- Close and reopen the extension popup
- You should see **"⭐ Premium"** status instead of quota display
- The `UsageDisplay` component will show "Unlimited" lookups
- `UpgradePrompt` will no longer appear

## Test Mode Features

✅ **No real charges** - Test payments don't charge your card  
✅ **Password required** - Prevents accidental payments  
✅ **Instant activation** - Test payments activate immediately  
✅ **Full feature access** - All premium features work in test mode  
✅ **Dashboard access** - View test payments in extensionpay.com dashboard  

## Stripe Test Cards (Optional)

If you want to test with Stripe test cards instead of password auth:

**Successful payment:**
- Card: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., 12/25)
- CVC: Any 3 digits (e.g., 123)

**Declined payment:**
- Card: `4000 0000 0000 0002`
- Expiry: Any future date
- CVC: Any 3 digits

## Switching to Production Mode

When you're ready to publish to Chrome Web Store:

1. Remove extension from developer mode
2. Submit to Chrome Web Store
3. Once approved and installed by users, ExtPay automatically switches to **production mode**
4. Real payments are required (no password bypass)
5. Payments appear in your Stripe dashboard

## Troubleshooting

**Payment window doesn't appear:**
- Verify ExtPay.js is loaded in manifest.json content_scripts
- Check browser console for errors
- Ensure extension is in developer mode

**"User already paid" but can't access premium:**
- Refresh the extension popup
- Check that `getUserInfo()` is returning `paid: true`
- Verify ExtPay ID matches in background.js and paymentService.js

**Can't see test payments in dashboard:**
- Log into extensionpay.com
- Go to your extension settings
- Check "Recent Transactions" or "Users" section
- Test payments may take a few seconds to appear

## Files Involved

- `extension/background.js` - ExtPay initialization
- `customize-app/services/paymentService.js` - Payment API wrapper
- `customize-app/hooks/useUsageTracking.js` - Premium status check
- `extension/manifest.json` - Content script configuration

## Next Steps

1. Test the payment flow end-to-end
2. Verify quota enforcement works for free users
3. Confirm premium users see unlimited access
4. Test monthly quota reset on 1st of month
5. Set up Stripe account for production payments
