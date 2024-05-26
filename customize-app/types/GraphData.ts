export default interface LineChartGraphData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor: string
    borderColor: string
    borderWidth: number
    fill: boolean
    lineTension: number
    borderCapStyle: CanvasLineCap
    borderDash: number[]
    borderDashOffset: number
    borderJoinStyle: CanvasLineJoin
    pointBorderColor: string
    pointBackgroundColor: string
    pointBorderWidth: number
    pointRadius: number
    pointHoverRadius: number
    pointHitRadius: number
    pointHoverBackgroundColor: string
    pointHoverBorderColor: string
    pointHoverBorderWidth: number
    pointStyle: string
    showLine: boolean
  }[]
}
