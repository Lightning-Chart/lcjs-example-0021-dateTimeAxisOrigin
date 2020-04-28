/*
 * LightningChart JS Example that showcases using origin with Axis TickStrategies.
 */
// Import LightningChartJS
const lcjs = require('@arction/lcjs')
 
// Extract required parts from LightningChartJS.
const {
    lightningChart,
    AxisTickStrategies,
    DataPatterns
} = lcjs
 
// Import data-generator from 'xydata'-library.
const {
    createProgressiveTraceGenerator
} = require('@arction/xydata')

// Create Dashboard.
const db = lightningChart().Dashboard({
    numberOfRows: 2,
    numberOfColumns: 1
})
// Create two XY-charts.
const chartDefaultOrigin = db.createChartXY({
    columnIndex: 0,
    rowIndex: 0,
    columnSpan: 1,
    rowSpan: 1,
    // Use the DateTime Axis TickStrategy with the default origin.
    chartXYOptions: { defaultAxisXTickStrategy: AxisTickStrategies.DateTime() },
})
const chartModifiedOrigin = db.createChartXY({
    columnIndex: 0,
    rowIndex: 1,
    columnSpan: 1,
    rowSpan: 1,
    // Use the DateTime Axis TickStrategy with the origin set to current day.
    chartXYOptions: { defaultAxisXTickStrategy: AxisTickStrategies.DateTime(new Date())}
})
// Setup the charts. 
chartDefaultOrigin
    .setTitle('Default origin')
    .getDefaultAxisY()
        .setTitle('Value')
chartModifiedOrigin
    .setTitle('Modified origin')
    .getDefaultAxisY()
        .setTitle('Value')

// Create progressive line series for both charts.
// Using the DataPatterns object to select the horizontalProgressive pattern for the line series.
const series1 = chartDefaultOrigin.addLineSeries({ dataPattern: DataPatterns.horizontalProgressive })
const series2 = chartModifiedOrigin.addLineSeries({ dataPattern: DataPatterns.horizontalProgressive })

// Create a multiplier to set each point on X Axis correspond to 1 hour of time.
const dataFrequency = 1000 * 60 * 60

// Generate traced points using 'xydata'-library.
createProgressiveTraceGenerator()
    .setNumberOfPoints(1000)
    .generate()
    .toPromise()
    .then(data => {
        // Use same data on both Series for demonstration purposes.
        series1.add(data.map((point) => ({ x: point.x * dataFrequency, y: point.y })))
        series2.add(data.map((point) => ({ x: point.x * dataFrequency, y: point.y })))    
})
    