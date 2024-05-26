import throttle from "lodash.throttle"

/*--
- Docs: https://developer.chrome.com/docs/extensions/reference/storage/
- Use storage.sync to allow user to store customizations
--*/

/*
- Get storage with storage.sync
- k => "[key]" (String)
- Don't need to throttle
*/
export const getStorage = async (k) => {
  const promise = new Promise((resolve, _reject) => {
    chrome?.storage?.sync.get([k], (data) => {
      return resolve(data[k])
    })
  })
  return promise
}

/*--
- Set storage with storage.sync
- kv => {key: value} (Single key value pair)
- Throttle function to prevent hitting API limits
- The maximum number of set, remove, or clear operations = 120
  - 1 min = 60000 ms
  - 60000 ms / 120 operations = 500 ms/operation
--*/
export const setStorage = throttle(async (kv) => {
  const promise = new Promise((resolve, _reject) => {
    chrome?.storage?.local.set(kv, () => {
      return resolve(kv)
    })
  })
  return promise
}, 500)

export const saveCountry = throttle((country) => {
  chrome?.storage?.sync.set({ country: country }, () => {
    console.log(`Saved country: ${country.code}`)
  })
})

export const saveSubscription = throttle((subscription) => {
  chrome?.storage?.sync.set({ subscription: subscription }, () => {
    // console.log(subscription)
  })
})

export const getSubscription = async (callback: any) => {
  chrome?.storage?.sync.get({ subscription: [] }, (result) => {
    const subscription = result;
    // console.log(subscription)
    callback(subscription)
  });
}


export const getCountry = async (callback: any) => {
  chrome?.storage?.sync.get({ country: [] }, (result) => {
    const country = result.country;
    console.log(`Got country: ${country.code}`)
    callback(country)
  });
}

export const saveData = throttle((data) => {
  // console.log(`Saving to session storage: ${JSON.stringify(data)}`)

  const queryInfo = {
    active: true,
    currentWindow: true,
  };

  chrome?.tabs?.query(queryInfo, (tabs) => {
    const tab = tabs[0];
    const url = new URL(tab.url);
    const domain = tab.id

    chrome?.storage?.sync.set({ [domain]: data }, () => {
      // console.log(`Saved data for ${JSON.stringify(domain)}`)
    }
    );
  });

}, 500)

export const readData = async (callback: any) => {

  const queryInfo = {
    active: true,
    currentWindow: true,
  };

  chrome?.tabs?.query(queryInfo, (tabs) => {
    const tab = tabs[0];
    const url = new URL(tab.url);
    const domain = String(tab.id)

    // Get data from sync storage
    chrome?.storage?.sync.get(domain, (data) => {
      // console.log(`Read data for ${JSON.stringify(domain)}`)
      callback(data[domain])
    });

  });
}

export const saveUUID = throttle((newUUID) => {

  chrome?.storage?.sync.get({ key: [] }, (result) => {
    const existingUUIDs = result.key;

    existingUUIDs?.push(newUUID);

    chrome?.storage?.sync.set({ key: existingUUIDs }, () => {
      console.log(`UUID ${newUUID} added to array`);
    });
  });
}, 500);

export const getUUID = async (callback: any) => {
  chrome?.storage?.sync.get({ key: [] }, (result) => {
    const existingUUIDs = result.key;
    callback(existingUUIDs)
  });
}

export const saveCurrentDate = throttle((date) => {
  chrome.storage?.local.set({ key: date }, () => {
    console.log(`Saved current date: ${date}`)
  })
}, 500)

export const getCurrentDate = throttle((callback) => {
  chrome?.storage?.local.get({ key: [] }, (result) => {
    const existingUUIDs = result.key;
    callback(existingUUIDs)
  });
}, 500);

export const clearLocalStorage = (data) => {
  chrome?.storage?.local.clear()
  chrome?.storage?.sync.clear()
}

export const clearSyncStorage = (data) => {
  chrome?.storage?.sync.clear()
}

export const clearStorage = async () => {
  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    const queryInfo = {
      active: true,
      currentWindow: true,
    };

    chrome?.tabs?.query(queryInfo, (tabs) => {
      const tab = tabs[0];
      const url = new URL(tab.url);
      const domain = url.hostname;

      if (changeInfo.status == "complete") {
        chrome?.storage?.session.remove(domain);
      }
    });
  });
}

export const saveToSession = (data) => {
  const queryInfo = {
    active: true,
    currentWindow: true,
  };

  chrome?.tabs?.query(queryInfo, (tabs) => {
    const tab = tabs[0];
    const url = new URL(tab.url);
    const domain = url.hostname;
    localStorage.setItem(domain, JSON.stringify(data)) as any
  });

}

export const readFromSession = (callback: any) => {

  const queryInfo = {
    active: true,
    currentWindow: true,
  };

  chrome?.tabs?.query(queryInfo, (tabs) => {
    const tab = tabs[0];
    const url = new URL(tab.url);
    const domain = url.hostname;

    var user = JSON.parse(localStorage.getItem(domain) as any);
    // conssole.log(user)
    callback(user)
  });
}