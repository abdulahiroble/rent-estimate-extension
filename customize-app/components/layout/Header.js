/*global chrome*/
import React, { useEffect, useState } from 'react';
import { sendMessageToBackground } from "../../utilities/chrometab";
import { getSubscription } from '../../utilities/chromeStorage';

const Header = ({ urlBar, state }) => {
  const [user, setUser] = useState(false);

  useEffect(() => {
    getSubscription((subscription) => {
      if (subscription?.subscription?.paid) {
        setUser(true);
      }
    });
  }, []);

  return (
    <header className="text-center">
      <div className="flex items-center justify-center">
        <h1 className="text-2xl font-extrabold text-rentestPrimary">
          RentEst
        </h1>
      </div>
      <div className="box-border bg-rentestBgLight border border-rentestBorder rounded-lg p-4 mx-auto my-3 max-w-md">
        {urlBar ? (
          <>
            <div className="flex text-sm mb-2">
              <div className="text-rentestText font-semibold">Address:</div>
              <div className="font-bold ml-2 text-rentestText">
                {urlBar}
              </div>
            </div>
            <div className="flex text-sm">
              <div className="text-rentestText font-semibold">State:</div>
              <div className="font-bold ml-2 text-rentestText">{state}</div>
            </div>
          </>
        ) : (
          <div className="flex text-sm">
            <div className="text-rentestText font-semibold">State:</div>
            <div className="font-bold ml-2 text-rentestText">{state}</div>
          </div>
        )}
        {user && (
          <div className="flex justify-end mt-3">
            <button
              onClick={() => sendMessageToBackground('should-pay')}
              className="px-3 py-1 bg-rentestPrimary text-white rounded hover:bg-rentestSecondary transition-colors text-sm"
              title="Manage Subscription"
            >
              ⭐ Pro
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;