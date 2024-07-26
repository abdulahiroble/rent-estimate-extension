import React, { useEffect, useState } from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { readData, saveData } from '../utilities/chromeStorage'
interface RentProps {
    rentRangeLow: any
}

export const OrganicKeywords: React.FunctionComponent<RentProps> = ({ rentRangeLow }) => {
    console.log(`rentRangeLow`, rentRangeLow)
    const [data, setData] = useState([])
    const [isLoading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        setData(() => {
            if (rentRangeLow) {
                setLoading(false)
                return rentRangeLow
            } else {
                readData(async (data) => {
                    if (data) {
                        setLoading(false)
                        setData(data?.tasks?.map((test) => test.result[0].items[0].metrics?.organic.count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")))
                    }
                }
                )
            }
        })
    }, [rentRangeLow])

    if (isLoading) return <SkeletonTheme baseColor="#275F86" highlightColor='#256C9B' height={100}>
        <>
            <Skeleton />
        </>
    </SkeletonTheme>
    if (!data) return <p>No profile data</p>

    return (
        <div className="p-5 pb-5 rounded-2xl" style={{ backgroundColor:  "#275F86"}}>
            <div className='text-xl font-bold mb-2 text-gray-50'>Rent Low Range</div>
            <div className='text-2xl font-bold text-green-500'>{!rentRangeLow ? `$${data}` : `$${rentRangeLow}`}</div>
        </div>
    )


}

