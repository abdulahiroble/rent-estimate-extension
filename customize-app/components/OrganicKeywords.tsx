import React, { useEffect, useState } from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { readData, saveData } from '../utilities/chromeStorage'
interface OrganicKeywordsProps {
    organicKeywords: any
}

export const OrganicKeywords: React.FunctionComponent<OrganicKeywordsProps> = ({ organicKeywords }) => {
    const [data, setData] = useState([])
    const [isLoading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        setData(() => {
            if (organicKeywords) {
                setLoading(false)
                return organicKeywords
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
    }, [organicKeywords])

    if (isLoading) return <SkeletonTheme baseColor="#21343F" highlightColor='#263F4D' height={100}>
        <>
            <Skeleton />
        </>
    </SkeletonTheme>
    if (!data) return <p>No profile data</p>

    return (
        <div className="p-5 pb-5 bg-twitterBgTwoDark rounded-2xl">
            <div className='text-lg mb-2 text-white'>Organic Keywords</div>
            <div className='text-2xl font-bold text-sky-400'>{!organicKeywords ? data : organicKeywords}</div>
        </div>
    )


}

