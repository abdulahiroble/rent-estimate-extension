importScripts('ExtPay.js')

var extpay = ExtPay('rentest');
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