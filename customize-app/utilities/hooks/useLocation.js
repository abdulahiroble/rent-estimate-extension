import React from 'react'

const useLocation = async () => {

    const location = await getLocation()
    const latitude = location.coords.latitude
    const longitude = location.coords.longitude
    const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`;
    const response = await axios.get(apiUrl);
    const country_code = await response?.data?.address?.country_code.toUpperCase()

    const countries = await axios.get('https://countries-qbz7.onrender.com/');

    const country = countries?.data?.filter((country) => {
        if (country.country_iso_code === country_code) {
            return country
        }
    })

    return country
}

export default useLocation