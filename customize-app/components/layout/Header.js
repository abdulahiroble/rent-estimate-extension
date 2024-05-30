/*global chrome*/
import React, { useEffect, useState } from 'react'
import { queryTabs, getCurrentTab, getCurrentTabUrl, getCurrentTabId, getLocation, sendMessageToBackground } from "../../utilities/chrometab"
import starIcon from "../../public/resources/star-icon.svg"
import Image from "next/image"
import { getCountry, getSubscription, saveCountry, saveData, saveSubscription, saveTabUrl } from '../../utilities/chromeStorage'
import axios from 'axios'
import { Button, Tooltip } from '@chakra-ui/react'
import StarIconComponent from '../StarIconComponent'

const Header = () => {

  const [urlBar, setUrlBar] = useState('');
  const [location, setLocation] = useState('');
  const [user, setUser] = useState(false)

  useEffect(() => {

    getSubscription((subscription) => {
      if (subscription?.subscription?.paid) {
        setUser(true)
      }
    })

    getCurrentTabUrl(async (url) => {

      setUrlBar(url)
      getCountry(async (country) => {
        if (country.length === 0) {
          const location = await getLocation()
          const latitude = location.coords.latitude
          const longitude = location.coords.longitude
          const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`;
          const response = await axios.get(apiUrl);
          const country_code = await response?.data?.address?.country_code.toUpperCase()

          const countries = `https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/index.json`;
          const countriesResponse = await axios.get(countries);

          countriesResponse?.data.map((country) => {
            if (country.code === country_code) {
              saveCountry(country)
              setLocation(country)

              return country.name
            }
          })
        } else {
          console.log('Country from storage', country.code)
          setLocation(country)
        }
      })

    })

  }, [])

  return (
    <header className="text-center">
      <div className="flex items-center justify-center">
        <h1 className="text-xl font-extrabold">
          <span className='text-white'>RentEst</span>
        </h1>
      </div>
      <div className="box-border h-20 w-96 mx-auto p-3 border-2 my-3">
        <div className="flex text-lg">
          <div className="text-white">Address:</div>
          <div className="font-bold ml-2 text-white flex justify-start">
            {urlBar}
          </div>
        </div>
        <div className="flex text-lg">
          <div className="mt-1 text-white">Location:</div>
          <div className="font-bold ml-2 mt-1 pr-2 text-white">{location?.name}</div>
          {location?.image && <Image src={location?.image} alt="Country Flag" width={30} height={30} />}
        </div>
        {user && <div className='flex justify-end -mt-16' >
          <Tooltip hasArrow label='Manage Subscription' bg='blue.600'>
            <Button onClick={() => sendMessageToBackground('should-pay')} colorScheme="blue" variant="link" size="sm">
              ⭐
            </Button>
          </Tooltip>
        </div>}
        {/* <div className='flex justify-end -mt-16' >
          <Tooltip hasArrow label='Manage Subscription' bg='blue.600'>
            <Button onClick={() => sendMessageToBackground('should-pay')} colorScheme="blue" variant="link" size="sm">
              <Image src={starIcon} alt="Premium member" width={15} height={15} />
            </Button>
          </Tooltip>
        </div> */}
      </div>
    </header >
  )
}

export default Header