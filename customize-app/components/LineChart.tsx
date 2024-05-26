import React, { useEffect, useState } from 'react';
import 'chart.js/auto';
import { Chart, ChartProps } from 'react-chartjs-2';
import LineChartGraphData from '../types/GraphData';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { readData } from '../utilities/chromeStorage';

export const LineChart = ({ monthAndYear, traffic }) => {

    const [data, setData] = useState([])
    const [saveData, setSaveData] = useState([])
    const [isLoading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        setLoading(true)
        setData(() => {
            if (monthAndYear && traffic) {
                setLoading(false)
                let monthAndYears = [];
                let traffics = [];
                monthAndYear?.tasks.map((test) => test.result[0].items.map((item) => {
                    const month = item.month

                    const currentYear = new Date();

                    let currentMonth = new Date();

                    currentMonth.setMonth(month - 1)

                    currentYear.setFullYear(item.year)

                    const year = currentYear.toLocaleString('default', { year: '2-digit' })

                    const previousMonth = currentMonth.toLocaleString('default', { month: 'short' })

                    return monthAndYears.push(`${previousMonth} ${year}`)
                }))

                traffic?.tasks.map((test) => test.result[0].items.map((item) => {
                    return traffics.push(item.metrics.organic.impressions_etv.toFixed())
                }))

                // const [monthAndYears, traffics] = await Promise.all([
                //     monthAndYear?.tasks.map((test) => test.result[0].items.map((item) => {
                //         const month = item.month

                //         const currentYear = new Date();

                //         let currentMonth = new Date();

                //         currentMonth.setMonth(month - 1)

                //         currentYear.setFullYear(item.year)

                //         const year = currentYear.toLocaleString('default', { year: '2-digit' })

                //         const previousMonth = currentMonth.toLocaleString('default', { month: 'short' })

                //         return monthAndYears.push(`${previousMonth} ${year}`)
                //     })),
                //     traffic?.tasks.map((test) => test.result[0].items.map((item) => {
                //         return item.metrics.organic.impressions_etv.toFixed();
                //     }))
                // ]);


                return [monthAndYears, traffics]
            } else {
                readData(async (data) => {
                    if (data) {
                        setLoading(false)
                        let monthAndYears = [];
                        let traffics = [];

                        data?.tasks.map((test) => test.result[0].items.map((item) => {
                            const month = item.month

                            const currentYear = new Date();

                            let currentMonth = new Date();

                            currentMonth.setMonth(month - 1)

                            currentYear.setFullYear(item.year)

                            const year = currentYear.toLocaleString('default', { year: '2-digit' })

                            const previousMonth = currentMonth.toLocaleString('default', { month: 'short' })

                            return monthAndYears.push(`${previousMonth} ${year}`)
                        }))

                        data?.tasks.map((test) => test.result[0].items.map((item) => {
                            return traffics.push(item.metrics.organic.impressions_etv.toFixed())
                        }))

                        setSaveData([monthAndYears, traffics])
                    }
                }
                )
            }
        })

    }, [monthAndYear, traffic])

    if (isLoading) return <SkeletonTheme baseColor="#21343F" highlightColor='#263F4D' height={100}>
        <>
            <Skeleton />
        </>
    </SkeletonTheme>

    // if (!data) return <p>No profile data</p>


    const graph = {
        labels: data ? data[0] : saveData[0],
        datasets: [
            {
                label: 'Organic Monthly Traffic',
                fill: true,
                lineTension: 0.1,
                borderColor: '#08C4C4',
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
                    gradient.addColorStop(0, "#3A6073");
                    gradient.addColorStop(1, "#16222A");
                    return gradient;
                },
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: '#08C4C4',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: '#08C4C4',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: data ? data[1] : saveData[1]
            },
        ] as any
    }


    return (
        <div>
            <Chart type='line' data={graph} />
        </div>

    )
}

export default LineChart