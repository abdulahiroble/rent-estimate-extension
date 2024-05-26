importScripts('ExtPay.js')

// To test payments, replace 'sample-extension' with the ID of
// the extension you registered on ExtensionPay.com. You may
// need to uninstall and reinstall the extension.
// And don't forget to change the ID in popup.js too!
var extpay = ExtPay('test1223');
extpay.startBackground(); // this line is required to use ExtPay in the rest of your extension

extpay.getUser().then(user => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        // 2. A page requested user data, respond with a copy of `user`
        if (message === 'get-user-data') {
            sendResponse(user);
        } else if (message === 'should-pay') {
            sendResponse(extpay.openPaymentPage());
            // Promise.resolve(extpay.openPaymentPage()).then(sendResponse);
        }
    });
})

// extpay.onPaid.addListener(user => {
//     chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//         if (message === 'has-paid') {
//             sendResponse(user);
//         }
//     });
// })


chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {

    extpay.onPaid.addListener(user => {
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (message === 'has-paid') {
                sendResponse(user);
            }
        });
    })

});



chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {

    const queryInfo = {
        active: true,
        currentWindow: true,
    };

    chrome?.tabs?.query(queryInfo, (tabs) => {
        const tab = tabs[0];
        const url = new URL(tab?.url);
        const domain = url?.hostname;

        // Get data from sync storage
        chrome?.storage?.sync.get(domain, (data) => {
            if (data[domain]?.tabId != tab.id) {
                // console.log(tab.id)
                chrome?.storage?.sync.remove(domain);
            }
        });

    });
});

// chrome.offscreen.createDocument({
//     url: 'offscreen.html',
//     reasons: [chrome.offscreen.Reason.GEOLOCATION || chrome.offscreen.Reason.DOM_SCRAPING],
//     justification: 'geolocation access',
// });

// const OFFSCREEN_DOCUMENT_PATH = '/offscreen.html';
// let creating; // A global promise to avoid concurrency issues

// chrome.runtime.onMessage.addListener(handleMessages);

// async function getGeolocation() {
//     await setupOffscreenDocument(OFFSCREEN_DOCUMENT_PATH);
//     const geolocation = await chrome.runtime.sendMessage({
//         type: 'get-geolocation',
//         target: 'offscreen'
//     });
//     await closeOffscreenDocument();
//     return geolocation;
// }

// async function hasDocument() {
//     // Check all windows controlled by the service worker to see if one
//     // of them is the offscreen document with the given path
//     const offscreenUrl = chrome.runtime.getURL(OFFSCREEN_DOCUMENT_PATH);
//     const matchedClients = await clients.matchAll();

//     return matchedClients.some(c => c.url === offscreenUrl)
// }

// async function setupOffscreenDocument(path) {
//     //if we do not have a document, we are already setup and can skip
//     if (!(await hasDocument())) {
//         // create offscreen document
//         if (creating) {
//             await creating;
//         } else {
//             creating = chrome.offscreen.createDocument({
//                 url: path,
//                 reasons: [chrome.offscreen.Reason.GEOLOCATION || chrome.offscreen.Reason.DOM_SCRAPING],
//                 justification: 'add justification for geolocation use here',
//             });

//             await creating;
//             creating = null;
//         }
//     }
// }