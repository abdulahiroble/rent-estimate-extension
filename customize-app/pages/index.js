import React, { useState, useEffect } from 'react';
import Container from "../components/layout/Container";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import Main from "../components/layout/Main";
import { getUUID, readData, saveData, saveUUID, clearLocalStorage, saveCurrentDate, getCurrentDate, getTabUrl, clearSyncStorage, saveSubscription, getSubscription } from "../utilities/chromeStorage";
import axios from 'axios';
import { getCurrentTabId, getCurrentTabUrl, getLocation, handleMsg, sendMessageToBackground } from "../utilities/chrometab";
import * as moment from 'moment';
import countriesList from "../components/CountriesList.json" assert { type: "json" };
import FrontdoorPage from '../components/FrontdoorPage';

const IndexPage = () => {
  const [data, setData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showFrontdoor, setShowFrontdoor] = useState(true);
  const currentDate = moment();
  const formattedDate = currentDate.format("MMM DD, YYYY");

  const handleSelectOption = async (option, query) => {
    setShowFrontdoor(false);
    if (option === 'currentLocation') {
      // Fetch rent estimate based on current location
      const location = await getLocation();
      // Add your fetch logic here
    } else if (option === 'search') {
      // Fetch rent estimate based on input search
      try {
        const response = await fetch(`https://rent-estimate-newyork.onrender.com/?location=${query}`, {
          method: 'GET',
          headers: new Headers({ 'Content-Type': 'application/json' }),
          credentials: 'same-origin'
        });
        const data = await response.json();
        setData(data);
      } catch (error) {
        setErrorMessage('Failed to fetch rent estimate.');
      }
    }
  };

  useEffect(() => {
    if (!showFrontdoor) {
      readData(async (data) => {
        if (data) {
          setData(data);
        } else {
          // define your callback function
          const handleResponse = (response) => {
            saveSubscription(response);

            getSubscription((subscription) => {
              if (subscription?.subscription?.paid) {
                console.log("User has paid! 🎉");

                getUUID(async (uuid) => {
                  if (uuid.length < 999) {
                    fetch('https://rent-estimate-newyork.onrender.com/', {
                      method: 'GET',
                      headers: new Headers({ 'Content-Type': 'application/json' }),
                      credentials: 'same-origin'
                    })
                      .then((res) => res.json())
                      .then((data) => {
                        saveData(data);
                        getCurrentTabId((tabId) => saveUUID(tabId));
                        setData({
                          rent: data?.rent
                        });
                      });
                  }
                });
              } else {
                console.log("User has not paid! 😢");
                saveSubscription(response);

                getUUID(async (uuid) => {
                  if (uuid.length < 10) {
                    fetch('https://rent-estimate-newyork.onrender.com/', {
                      method: 'GET',
                      headers: new Headers({ 'Content-Type': 'application/json' }),
                      credentials: 'same-origin'
                    })
                      .then((res) => res.json())
                      .then((data) => {
                        saveData(data);
                        console.log(data);
                        getCurrentTabId((tabId) => saveUUID(tabId));
                        setData({
                          rent: data?.rent,
                          rentRangeLow: data?.rentRangeLow,
                          rentRangeHigh: data?.rentRangeHigh,
                          listings: data?.comparables
                        });
                      });
                  } else {
                    setErrorMessage(
                      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                        The amount of requests has been exceeded for today.
                        Please try again tomorrow or upgrade your plan to get unlimited reports and access to premium features like downloadable reports and more.
                        <br />
                        <div className="text-center">
                          <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center mx-auto h-12 m-2 text-lg"
                            onClick={() => sendMessageToBackground('should-pay')}>Upgrade Plan  🚀
                          </button>
                        </div>
                      </div>
                    );
                  }
                  getCurrentDate((currentTime) => {
                    if (!currentTime) {
                      saveCurrentDate(formattedDate);
                    } else {
                      if (currentTime == formattedDate) {
                        console.log("same day");
                      } else {
                        clearLocalStorage();
                        saveCurrentDate(formattedDate);
                      }
                    }
                  });
                });
              }
            });
          };

          // Call the function
          sendMessageToBackground('has-paid', handleResponse);
        }
      });
    }
  }, [showFrontdoor]);

  if (showFrontdoor) {
    return (
      <Container>
        <FrontdoorPage onSelectOption={handleSelectOption} />
        <Footer />
      </Container>
    );
  }

  return (
    <Container>
      <Header />
      {errorMessage && <div>{errorMessage}</div>}
      <Main props={data} />
      <Footer />
    </Container>
  );
};

export default IndexPage;