import React from 'react'
import RentEstimateContainer from './RentEstimateContainer'

const FrontdoorPage = ({ onSelectOption }) => {
  return (
    <div className="flex flex-col items-center justify-center bg-rentestBgLight p-4">
      <div className="w-full max-w-md mb-8">
        <h1 className="text-4xl font-bold mb-2 text-center text-rentestPrimary">RentEst</h1>
        <p className="text-rentestText text-center text-sm">
          Get instant rental price estimates for any property in the US
        </p>
      </div>

      <RentEstimateContainer />
    </div>
  )
}

export default FrontdoorPage