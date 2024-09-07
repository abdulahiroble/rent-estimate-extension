/*global chrome*/
import React, { useEffect, useState } from 'react';
import { queryTabs, getCurrentTab, getCurrentTabUrl, getCurrentTabId, getLocation, sendMessageToBackground } from "../../utilities/chrometab";
import starIcon from "../../public/resources/star-icon.svg";
import Image from "next/image";
import { getCountry, getSubscription, saveCountry, saveData, saveSubscription, saveTabUrl } from '../../utilities/chromeStorage';
import axios from 'axios';
import { Button, Tooltip } from '@chakra-ui/react';
import StarIconComponent from '../StarIconComponent';

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
        <h1 className="text-xl font-extrabold">
          <span className='text-white'>RentEst</span>
        </h1>
      </div>
      <div className="box-border h-20 w-96 mx-auto p-3 border-2 my-3">
        {urlBar ? (
          <>
            <div className="flex text-lg">
              <div className="text-white">Address:</div>
              <div className="font-bold ml-2 text-white flex justify-start">
                {urlBar}
              </div>
            </div>
            <div className="flex text-lg">
              <div className="mt-1 text-white">State:</div>
              <div className="font-bold ml-2 mt-1 pr-2 text-white">{state}</div>
            </div>
          </>
        ) : (
          <div className="flex text-lg">
            <div className="mt-1 text-white">State:</div>
            <div className="font-bold ml-2 mt-1 pr-2 text-white">{state}</div>
          </div>
        )}
        {user && <div className='flex justify-end -mt-16'>
          <Tooltip hasArrow label='Manage Subscription' bg='blue.600'>
            <Button onClick={() => sendMessageToBackground('should-pay')} colorScheme="blue" variant="link" size="sm">
              ⭐
            </Button>
          </Tooltip>
        </div>}
      </div>
    </header>
  );
};

export default Header;