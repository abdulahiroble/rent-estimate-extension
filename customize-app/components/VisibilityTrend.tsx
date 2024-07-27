import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { readData } from '../utilities/chromeStorage';

export const VisibilityTrend = ({ rentRangeHigh }) => {

    const [data, setData] = useState(null)
    const [isLoading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        setData(() => {
            if (rentRangeHigh) {
                setLoading(false)
                return rentRangeHigh
            } else {
                readData(async (data) => {
                    if (data) {
                        setLoading(false)
                        setData(`${data?.tasks.map((test) => test.result[0].items[0].metrics?.organic.impressions_etv.toFixed().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))}`)
                    }
                }
                )
            }
        })
    }, [rentRangeHigh])

    if (isLoading) return <SkeletonTheme baseColor="#275F86" highlightColor='#256C9B' height={100}>
        <>
            <Skeleton />
        </>
    </SkeletonTheme>
    if (!data) return <p>No profile data</p>


    return (
        <div className="p-5 pb-5 rounded-2xl" style={{ backgroundColor:  "#275F86"}}>
            <div className='text-2xl font-bold mb-2 text-gray-50'>High</div>
            <div className='text-2xl font-bold text-red-500'>{!rentRangeHigh ? `$${data}` : `$${rentRangeHigh}`}</div>
        </div>
    )
}
