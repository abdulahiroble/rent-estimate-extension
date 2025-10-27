import throttle from "lodash.throttle"

// get current tab url
export const getCurrentTabUrl = (callback: (url: string) => void) => {
  const queryInfo = {
    active: true,
    currentWindow: true,
  };

  chrome?.tabs?.query(queryInfo, async (tabs) => {
    try {
      const tab = tabs[0];
      if (!tab || !tab.url) {
        callback(''); // Return empty string if no tab or URL
        return;
      }
      
      // Skip chrome://, edge://, firefox://, and other browser internal pages
      if (tab.url.startsWith('chrome://') || 
          tab.url.startsWith('edge://') || 
          tab.url.startsWith('firefox://') ||
          tab.url.startsWith('moz-extension://') ||
          tab.url.startsWith('chrome-extension://')) {
        callback(''); // Return empty string for browser internal pages
        return;
      }
      
      const url = new URL(tab.url);
      const domain = url.hostname;

      if (domain.includes("www.")) {
        callback(domain.slice(4));
      } else {
        callback(domain);
      }
    } catch (error) {
      console.log('Error getting current tab URL:', error.message);
      callback(''); // Return empty string on error
    }
  });
};

export const getCurrentTabId = (callback: (url: string) => void) => {
  const queryInfo = {
    active: true,
    currentWindow: true,
  };

  chrome?.tabs?.query(queryInfo, (tabs) => {
    const tab = tabs[0];
    const tabId = tab.id as any;
    callback(tabId);
  });
};

export const removeStorageAfterRefresh = () => {
  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status == "complete") {
      // chrome.storage.local.remove(["currentTabUrl", "currentTabId"]);
      chrome?.storage.local.clear()
    }
  });
}
export const handleMessagesFromBackground = () => {
  chrome.runtime.onMessage.addListener(handleMessages);
}

export const sendMessageToBackground = (message: any, callback: any) => {
  try {
    chrome?.runtime?.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        console.log('Message error:', chrome.runtime.lastError.message);
        // Handle the error gracefully, maybe return null or a default response
        callback(null);
        return;
      }
      // console.log(response)
      callback(response);
    });
  } catch (error) {
    console.log('Error sending message to background:', error.message);
    callback(null);
  }

  // // 1. Send a message to the service worker requesting the user's data
  // chrome.runtime.sendMessage('get-user-data', (response) => {
  //   // 3. Got an asynchronous response with the data from the service worker
  //   callback(response);
  // });
}

function handleMessages(message, sender, sendResponse) {
  // Return early if this message isn't meant for the offscreen document.
  if (message.target !== 'offscreen') {
    return;
  }

  if (message.type !== 'get-geolocation') {
    console.warn(`Unexpected message type received: '${message.type}'.`);
    return;
  }

  // You can directly respond to the message from the service worker with the
  // provided `sendResponse()` callback. But in order to be able to send an async
  // response, you need to explicitly return `true` in the onMessage handler
  // As a result, you can't use async/await here. You'd implicitly return a Promise.
  getLocation().then((loc) => sendResponse(loc));

  return true;
}


// getCurrentPosition() returns a prototype-based object, so the properties
// end up being stripped off when sent to the service worker. To get
// around this, create a deep clone.
function clone(obj) {
  const copy = {};
  // Return the value of any non true object (typeof(null) is "object") directly.
  // null will throw an error if you try to for/in it. Just return
  // the value early.
  if (obj === null || !(obj instanceof Object)) {
    return obj;
  } else {
    for (const p in obj) {
      copy[p] = clone(obj[p]);
    }
  }
  return copy;
}

export async function getLocation() {
  // Use a raw Promise here so you can pass `resolve` and `reject` into the
  // callbacks for getCurrentPosition().
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (loc) => resolve(clone(loc)),
      // in case the user doesnt have/is blocking `geolocation`
      (err) => reject(err)
    );
  });
}

export const handleMsg = () => {
  chrome.runtime.onMessage.addListener(function (response, sendResponse) {
    console.log(response);
  });
}