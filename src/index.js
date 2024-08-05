/*
 * LightningChart JS Example that showcases using origin with Axis TickStrategies.
 */
// Import LightningChartJS
const lcjs = require('@lightningchart/lcjs')

// Import xydata
const xydata = require('@lightningchart/xydata')

// Extract required parts from LightningChartJS.
const { lightningChart, AxisTickStrategies, Themes } = lcjs

// Import data-generator from 'xydata'-library.
const { createProgressiveTraceGenerator } = xydata

// Create Dashboard.
// NOTE: Using `Dashboard` is not recommended for new applications. Find latest recommendations here: https://lightningchart.com/js-charts/docs/basic-topics/grouping-charts/
const db = lightningChart({
            resourcesBaseUrl: new URL(document.head.baseURI).origin + new URL(document.head.baseURI).pathname + 'resources/',
        }).Dashboard({
    theme: Themes[new URLSearchParams(window.location.search).get('theme') || 'darkGold'] || undefined,
    numberOfRows: 2,
    numberOfColumns: 1,
})
// Create two XY-charts.
const chartDefaultOrigin = db.createChartXY({
    columnIndex: 0,
    rowIndex: 0,
    columnSpan: 1,
    rowSpan: 1,
})
const chartModifiedOrigin = db.createChartXY({
    columnIndex: 0,
    rowIndex: 1,
    columnSpan: 1,
    rowSpan: 1,
})

// Use the DateTime Axis TickStrategy with the default origin.
chartDefaultOrigin.getDefaultAxisX().setTickStrategy(AxisTickStrategies.DateTime)

// Use the DateTime Axis TickStrategy with the origin set to current day.
// Decide on an origin for DateTime axis.
const dateOrigin = new Date(2000, 1, 1)
const dateOriginTime = dateOrigin.getTime()
chartModifiedOrigin.getDefaultAxisX().setTickStrategy(AxisTickStrategies.DateTime, (tickStrategy) => tickStrategy.setDateOrigin(dateOrigin))
// Setup the charts.
chartDefaultOrigin.setTitle('Default origin').getDefaultAxisY().setTitle('Value')
chartModifiedOrigin.setTitle('Modified origin').getDefaultAxisY().setTitle('Value')

// Create line series for both charts.
const series1 = chartDefaultOrigin.addLineSeries()
const series2 = chartModifiedOrigin.addLineSeries()

// Generate traced points using 'xydata'-library.
createProgressiveTraceGenerator()
    .setNumberOfPoints(1000)
    .generate()
    .toPromise()
    .then((data) => {
        // Use same data on both Series for demonstration purposes.
        series1.add(data)
        series2.add(data)
        chartDefaultOrigin.getDefaultAxisX().fit()
        chartModifiedOrigin.getDefaultAxisX().fit()
    })
