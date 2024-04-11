---
title: sample.data() function
description: >
  `sample.data()` downloads a specified InfluxDB sample dataset.
menu:
  flux_v0_ref:
    name: sample.data
    parent: influxdata/influxdb/sample
    identifier: influxdata/influxdb/sample/data
weight: 301
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/influxdata/influxdb/sample/sample.flux#L110-L120

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`sample.data()` downloads a specified InfluxDB sample dataset.



##### Function type signature

```js
(set: string) => stream[A] where A: Record
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### set
({{< req >}})
Sample data set to download and output.

Valid datasets:
- **airSensor**: Simulated temperature, humidity, and CO data from an office building.
- **birdMigration**: 2019 African bird migration data from [Movebank: Animal Tracking](https://www.kaggle.com/pulkit8595/movebank-animal-tracking).
- **bitcoin**: Bitcoin price data from the last 30 days _([Powered by CoinDesk](https://www.coindesk.com/price/bitcoin))_.
- **noaa**: Latest observations from the [NOAA National Data Buoy Center (NDBC)](https://www.ndbc.noaa.gov/).
- **machineProduction**: States and metrics reported from four automated grinding wheel stations on a production line.
- **noaaWater**: Water level observations from two stations reported by the NOAA Center for Operational Oceanographic Products and Services between 2019-08-17 and 2019-09-17.
- **usgs**: USGS earthquake data from the last week.

