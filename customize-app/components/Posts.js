import React, {useEffect, useState} from 'react'
import {clearStorage, readData, readFromSession, saveData, saveToSession, test, testData} from '../utilities/chromeStorage';
import {getCurrentTabId, getCurrentTabUrl} from '../utilities/chrometab';
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export const Posts = () => {
    const [data, setData] = useState([]);
    const [isLoading, setLoading] = useState(false)

    useEffect(() => {
        readData(async (data) => {
            if (data) {
                setData(data)
            } else {
                getCurrentTabUrl(async (url) => {

                    setLoading(true)
                    fetch('https://jsonplaceholder.typicode.com/posts', {
                        method: 'POST',
                        body: JSON.stringify({
                            title: `${url}`,
                            body: 'bar',
                            tabId: await getCurrentTabId()
                        }),
                        headers: {
                            "Content-type": "application/json; charset=UTF-8"
                        }
                    })
                        .then(response => response.json())
                        .then(json => {
                            saveData(json)
                            setData(json)
                            setLoading(false)
                        })
                })
            }
        })

    }, [])

    if (isLoading) return <SkeletonTheme baseColor="#21343F" highlightColor='#263F4D' height={100}>
        <>
            <Skeleton />
        </>
    </SkeletonTheme>
    if (!data) return <p>No profile data</p>

    return (
        <div className="p-5 pb-5 dark:bg-twitterBgTwoDark bg-twitterBgTwo rounded-2xl">
            {/* <div className='text-lg mb-2'>{data}</div> */}
            <div className='text-lg mb-2'>{data?.title}</div>
            <div className='text-2xl font-bold text-sky-400'>{data?.body}</div>
            <div className='text-2xl font-bold text-sky-400'>{data?.tabId}</div>
        </div>
    )
}
