importScripts('ExtPay.js')

// To test payments, replace 'sample-extension' with the ID of
// the extension you registered on ExtensionPay.com. You may
// need to uninstall and reinstall the extension.
// And don't forget to change the ID in popup.js too!
var extpay = ExtPay('rentest2');
extpay.startBackground(); // this line is required to use ExtPay in the rest of your extension

extpay.getUser().then(user => {
  console.log(user)
})

extpay.onPaid.addListener(user => {
  console.log('[ExtPay] User has paid for premium features:', user);
  // You can update user features or notify content scripts here
});

extpay.onTrialStarted.addListener(user => {
  console.log('[ExtPay] User has started a free trial:', user);
  // You can update trial status or notify content scripts here
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Handle get user data
  if (message === 'get-user-data') {
    extpay.getUser().then(user => {
      sendResponse(user);
    }).catch(error => {
      console.error('Error getting user:', error);
      sendResponse(null);
    });
    return true; // Keep message channel open for async response
  } 
  
  // Handle open payment page
  else if (message === 'should-pay') {
    extpay.openPaymentPage();
    sendResponse({ success: true });
  } 
  
  // Handle open trial page
  else if (message && message.action === 'open-trial') {
    extpay.openTrialPage(message.period);
    sendResponse({ success: true });
  } 
  
  // Handle open login page
  else if (message === 'open-login') {
    extpay.openLoginPage();
    sendResponse({ success: true });
  } 
  
  // Handle has-paid check
  else if (message === 'has-paid') {
    extpay.getUser().then(user => {
      sendResponse(user);
    }).catch(error => {
      console.error('Error getting user:', error);
      sendResponse(null);
    });
    return true; // Keep message channel open for async response
  }
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    // Only run when the page is fully loaded
    if (changeInfo.status !== 'complete') {
        return;
    }

    const queryInfo = {
        active: true,
        currentWindow: true,
    };

    chrome?.tabs?.query(queryInfo, (tabs) => {
        try {
            const activeTab = tabs[0];
            if (!activeTab || !activeTab.url) {
                return; // Exit if no tab or URL
            }
            
            // Skip chrome://, edge://, firefox://, and other browser internal pages
            if (activeTab.url.startsWith('chrome://') || 
                activeTab.url.startsWith('edge://') || 
                activeTab.url.startsWith('firefox://') ||
                activeTab.url.startsWith('moz-extension://') ||
                activeTab.url.startsWith('chrome-extension://')) {
                return;
            }
            
            const url = new URL(activeTab.url);
            const domain = url?.hostname;

            // Get data from sync storage
            chrome?.storage?.sync.get(domain, (data) => {
                if (data[domain]?.tabId != activeTab.id) {
                    // console.log(activeTab.id)
                    chrome?.storage?.sync.remove(domain);
                }
            });
        } catch (error) {
            console.log('Error handling tab URL:', error.message);
            // Silently handle URL parsing errors
        }
    });
});