import { useEffect, useState } from "react"
import Container from "../components/layout/Container"
import Footer from "../components/layout/Footer"
import Header from "../components/layout/Header"
import Main from "../components/layout/Main"
import { getUUID, readData, saveData, saveUUID, clearLocalStorage, saveCurrentDate, getCurrentDate, getTabUrl, clearSyncStorage, saveSubscription, getSubscription } from "../utilities/chromeStorage"
import axios from 'axios'
import { getCurrentTabId, getCurrentTabUrl, getLocation, handleMsg, sendMessageToBackground } from "../utilities/chrometab"
import * as moment from 'moment';
import countriesList from "../components/CountriesList.json" assert { type: "json" };

const IndexPage = () => {
  const [data, setData] = useState(null)
  const [errorMessage, setErrorMessage] = useState('');
  const currentDate = moment();
  const formattedDate = currentDate.format("MMM DD, YYYY");

  useEffect(async () => {
    readData(async (data) => {
      if (data) {
        setData(data)
      } else {
        // define your callback function
        const handleResponse = (response) => {
          console.log('Received response:', response?.paid);

          saveSubscription(response)

          getSubscription((subscription) => {
            console.log('Subscription:', subscription?.subscription?.paid)
            if (subscription?.subscription?.paid) {
              console.log("User has paid! 🎉")

              getUUID(async (uuid) => {
                if (uuid.length < 999) {

                  fetch('https://rent-estimate-newyork.onrender.com/', {
                    method: 'GET',
                    headers: new Headers({ 'Content-Type': 'application/json' }),
                    credentials: 'same-origin'
                  })
                    .then((res) => res.json())
                    .then((data) => {
                      saveData(data)
                      getCurrentTabId((tabId) => saveUUID(tabId))
                      // setData({
                      //   organicKeywords: data?.tasks?.map((test) => test.result[0].items[0].metrics?.organic.count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")),
                      //   organicTraffic: data?.tasks.map((test) => test.result[0].items[0].metrics?.organic.etv.toFixed().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")),
                      //   visibility: data.tasks.map((test) => test.result[0].items[0].metrics?.organic.impressions_etv.toFixed().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")),
                      //   paidTraffic: `${data.tasks.map((test) => test.result[0].items[0].metrics?.organic.estimated_paid_traffic_cost.toFixed().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))}$`,

                      //   monthAndYear: data,
                      //   traffic: data
                      // })
                    })

                  // const location = await getLocation()
                  // const latitude = location.coords.latitude
                  // const longitude = location.coords.longitude
                  // const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`;
                  // const response = await axios.get(apiUrl);
                  // const country_code = await response?.data?.address?.country_code.toUpperCase()

                  // const country = countriesList?.filter((country) => {
                  //   if (country.country_iso_code === country_code) {
                  //     return country
                  //   }
                  // })

                  // if (country) {
                  //   try {
                  //     getCurrentTabUrl(async (url) => {
                  //       const post_array = [];

                  //       post_array.push({
                  //         "target": `${url}`,
                  //         "language_name": `${country.map((test) => test.language_name)}`,
                  //         "location_name": `${country.map((test) => test.location_name)}`,
                  //         "item_types": ["organic"],
                  //         "filters": [
                  //           ["keyword_data.keyword_info.search_volume", "<>", 0]
                  //         ],
                  //         "limit": 10
                  //       });

                  //       axios({
                  //         method: 'post',
                  //         url: 'https://api.dataforseo.com/v3/dataforseo_labs/google/historical_rank_overview/live',
                  //         auth: {
                  //           username: process.env.DATAFORSEO_USERNAME,
                  //           password: process.env.DATAFORSEO_API_PASSWORD
                  //         },
                  //         data: post_array,
                  //         headers: {
                  //           'content-type': 'application/json'
                  //         }
                  //       }).then(async function (response) {
                  //         console.log(response.data)
                  //         saveData(response.data)
                  //         saveUUID(uuid)
                  //         setData({
                  //           organicKeywords: response?.data.tasks.map((test) => test.result[0].items[0].metrics?.organic.count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")),
                  //           organicTraffic: response?.data.tasks.map((test) => test.result[0].items[0].metrics?.organic.etv.toFixed().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")),
                  //           visibility: response?.data.tasks.map((test) => test.result[0].items[0].metrics?.organic.impressions_etv.toFixed().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")),
                  //           paidTraffic: `${response?.data.tasks.map((test) => test.result[0].items[0].metrics?.organic.estimated_paid_traffic_cost.toFixed().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))}$`,

                  //           monthAndYear: response?.data,
                  //           traffic: response?.data
                  //         })
                  //       })
                  //     })
                  //   }
                  //   catch (error) {
                  //     console.log(error)
                  //   }
                  // }

                }
              })

            } else {
              console.log("User has not paid! 😢")
              saveSubscription(response)

              getUUID(async (uuid) => {
                if (uuid.length < 10) {

                  fetch('https://rent-estimate-newyork.onrender.com/', {
                    method: 'GET',
                    headers: new Headers({ 'Content-Type': 'application/json' }),
                    credentials: 'same-origin'
                  })
                    .then((res) => res.json())
                    .then((data) => {
                      saveData(data)
                      console.log(data)
                      getCurrentTabId((tabId) => saveUUID(tabId))
                      // setData({
                      //   organicKeywords: data?.tasks?.map((test) => test.result[0].items[0].metrics?.organic.count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")),
                      //   organicTraffic: data?.tasks.map((test) => test.result[0].items[0].metrics?.organic.etv.toFixed().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")),
                      //   visibility: data.tasks.map((test) => test.result[0].items[0].metrics?.organic.impressions_etv.toFixed().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")),
                      //   paidTraffic: `${data.tasks.map((test) => test.result[0].items[0].metrics?.organic.estimated_paid_traffic_cost.toFixed().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))}$`,

                      //   monthAndYear: data,
                      //   traffic: data
                      // })
                    })

                  // const location = await getLocation()
                  // const latitude = location.coords.latitude
                  // const longitude = location.coords.longitude
                  // const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`;
                  // const response = await axios.get(apiUrl);
                  // const country_code = await response?.data?.address?.country_code.toUpperCase()

                  // const country = countriesList?.filter((country) => {
                  //   if (country.country_iso_code === country_code) {
                  //     return country
                  //   }
                  // })

                  // if (country) {
                  //   try {
                  //     getCurrentTabUrl(async (url) => {
                  //       const post_array = [];

                  //       post_array.push({
                  //         "target": `${url}`,
                  //         "language_name": `${country.map((test) => test.language_name)}`,
                  //         "location_name": `${country.map((test) => test.location_name)}`,
                  //         "item_types": ["organic"],
                  //         "filters": [
                  //           ["keyword_data.keyword_info.search_volume", "<>", 0]
                  //         ],
                  //         "limit": 10
                  //       });

                  //       axios({
                  //         method: 'post',
                  //         url: 'https://api.dataforseo.com/v3/dataforseo_labs/google/historical_rank_overview/live',
                  //         auth: {
                  //           username: process.env.DATAFORSEO_USERNAME,
                  //           password: process.env.DATAFORSEO_API_PASSWORD
                  //         },
                  //         data: post_array,
                  //         headers: {
                  //           'content-type': 'application/json'
                  //         }
                  //       }).then(async function (response) {
                  //         console.log(response.data)
                  //         saveData(response.data)
                  //         saveUUID(uuid)
                  //         setData({
                  //           organicKeywords: response?.data.tasks.map((test) => test.result[0].items[0].metrics?.organic.count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")),
                  //           organicTraffic: response?.data.tasks.map((test) => test.result[0].items[0].metrics?.organic.etv.toFixed().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")),
                  //           visibility: response?.data.tasks.map((test) => test.result[0].items[0].metrics?.organic.impressions_etv.toFixed().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")),
                  //           paidTraffic: `${response?.data.tasks.map((test) => test.result[0].items[0].metrics?.organic.estimated_paid_traffic_cost.toFixed().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))}$`,

                  //           monthAndYear: response?.data,
                  //           traffic: response?.data
                  //         })
                  //       })
                  //     })
                  //   }
                  //   catch (error) {
                  //     console.log(error)
                  //   }
                  // }

                } else {
                  setErrorMessage(
                    <div
                      className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                    >
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
                    saveCurrentDate(formattedDate)
                  } else {
                    if (currentTime == formattedDate) {
                      console.log("same day")
                    } else {
                      clearLocalStorage()
                      saveCurrentDate(formattedDate)
                    }
                  }
                })
              })
            }
          })

        };

        // Call the function
        sendMessageToBackground('has-paid', handleResponse);
      }
    })

  }, [])

  return (
    <Container>
      <Header />
      {errorMessage && <div>{errorMessage}</div>}
      <Main props={data} />
      <Footer />
      {/* <Profile /> */}
    </Container>
  )
}

export default IndexPage
