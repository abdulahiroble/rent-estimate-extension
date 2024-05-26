import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import OrganicKeywords from '../types/OrganicKeywords';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { readData } from '../utilities/chromeStorage';

interface Data {
    tasks: any;
    data: null | OrganicKeywords
}

export const DoughnutChart = ({ trafficData }) => {

    const [data, setData] = useState([])
    const [saveData, setSaveData] = useState([])
    const [isLoading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        setLoading(true)
        setData(() => {
            if (trafficData) {
                setLoading(false)
                let traffic = [];

                trafficData?.tasks.map((test) => test.result[0].items.filter((item) => {
                    const current = new Date();

                    // Get previous month
                    // console.log(`what month ${item.month}`)
                    // console.log(`what is previous month? ${current.getMonth()}`)

                    if (item.month === current.getMonth()) { // 9 is september
                        return traffic.push(item.metrics.organic.pos_2_3, item.metrics.organic.pos_4_10, item.metrics.organic.pos_4_10, item.metrics.organic.pos_11_20, item.metrics.organic.pos_31_40, item.metrics.organic.pos_51_60)
                    } else if (item.month === 3) {
                        // for testing
                        return traffic.push(item.metrics.organic.pos_2_3, item.metrics.organic.pos_4_10, item.metrics.organic.pos_4_10, item.metrics.organic.pos_11_20, item.metrics.organic.pos_31_40, item.metrics.organic.pos_51_60)
                    }
                }))

                setLoading(false)
                return traffic
            } else {
                readData(async (data) => {
                    if (data) {
                        setLoading(false)
                        let traffic = [];

                        data?.tasks.map((test) => test.result[0].items.filter((item) => {
                            const current = new Date();

                            // Get previous month
                            // console.log(`what month ${item.month}`)
                            // console.log(`what is previous month? ${current.getMonth()}`)

                            if (item.month === current.getMonth()) {
                                return traffic.push(item.metrics.organic.pos_2_3, item.metrics.organic.pos_4_10, item.metrics.organic.pos_4_10, item.metrics.organic.pos_11_20, item.metrics.organic.pos_31_40, item.metrics.organic.pos_51_60)
                            } else if (item.month === 3) {
                                // for testing
                                return traffic.push(item.metrics.organic.pos_2_3, item.metrics.organic.pos_4_10, item.metrics.organic.pos_4_10, item.metrics.organic.pos_11_20, item.metrics.organic.pos_31_40, item.metrics.organic.pos_51_60)
                            }

                        }))

                        setLoading(false)
                        setSaveData(traffic)
                        return traffic
                    }
                }
                )
            }
        })
    }, [trafficData])

    if (isLoading) return <SkeletonTheme baseColor="#21343F" highlightColor='#263F4D' height={100}>
        <>
            <Skeleton />
        </>
    </SkeletonTheme>

    ChartJS.register(ArcElement, Tooltip, Legend);

    const graph = {
        labels: ['1-3', '4-10', '11-20', '31-40', '51+'],
        datasets: [
            {
                label: 'Aktuelle rangeringer på søgeresultater',
                data: trafficData ? data : saveData,
                backgroundColor: [
                    '#0077c0',
                    '#06385D',
                    '#00498D',
                    '#02386E',
                    '#00264D',
                    '#00172D'
                ],
                borderColor: [
                    '#0077c0',
                    '#06385D',
                    '#00498D',
                    '#02386E',
                    '#00264D',
                    '#00172D'
                ],
                borderWidth: 1,
            },
        ],

    };

    return (
        <div>
            <Doughnut data={graph} />
        </div>

    )

}

export default DoughnutChart