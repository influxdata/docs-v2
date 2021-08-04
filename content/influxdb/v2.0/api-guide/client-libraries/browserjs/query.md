---
title: Query data with the InfluxDB JavaScript client library for browsers
seotitle: Query data with the InfluxDB JavaScript client library for browsers
list_title: Query data
description: >
  Use the JavaScript client library for web browsers to query data from InfluxDB.
menu:
  influxdb_2_0:
    name: Query 
    identifier: client_js_browser_query
    parent: JavaScript (browser)
influxdb/v2.0/tags: [client libraries, JavaScript]
weight: 201
---

This guide presumes some familiarity with JavaScript, browser environments, and InfluxDB.
If just getting started, see [Get started with InfluxDB](/influxdb/v2.0/get-started/).

## Before you begin

1. Install [NodeJS](https://nodejs.org/en/download/package-manager/).

2. Ensure that InfluxDB is running and you can connect to it.
   For information about what URL to use to connect to InfluxDB OSS or InfluxDB Cloud, see [InfluxDB URLs](/influxdb/v2.0/reference/urls/).

## Query data from InfluxDB
Use the Javascript library to query data from InfluxDB.

1. Use the `getQueryApi` method of the `InfluxDB` client to create a new **query client**. Provide your Influ
xDB `org`.

   ```js
   const queryApi = influxDB.getQueryApi(org)
   ```

2. Create a Flux query (including your `bucket` parameter).

   ```js
   const fluxQuery =
     'from(bucket:"<my-bucket>")
     |> range(start: 0)
     |> filter(fn: (r) => r._measurement == "temperature")'
   ```

   The **query client** sends the Flux query to InfluxDB and returns line table metadata and rows.

3. Use the `next` method to iterate over the rows.

   ```js
   queryApi.queryRows(fluxQuery, {
     next(row: string[], tableMeta: FluxTableMetaData) {
       const o = tableMeta.toObject(row)
       // console.log(JSON.stringify(o, null, 2))
       console.log(
         `${o._time} ${o._measurement} in '${o.location}' (${o.example}): ${o._field}=${o._value}`
       )
     }
   }
   ```

### Complete example query script

The following example queries InfluxDB and prints table metadata and rows from [Annotated CSV](
https://v2.docs.influxdata.com/v2.0/reference/syntax/annotated-csv/)

```js
queryApi.queryRows(fluxQuery, {
  next(row: string[], tableMeta: FluxTableMetaData) {
    const o = tableMeta.toObject(row)
    // console.log(JSON.stringify(o, null, 2))
    console.log(
      '${o._time} ${o._measurement} in '${o.location}' (${o.example}): ${o._field}=${o._value}`
    )
  },
  error(error: Error) {
    console.error(error)
    console.log('\nFinished ERROR')
  },
  complete() {
    console.log('\nFinished SUCCESS')
  },
})
```
For more information, see the [JavaScript client README on GitHub](https://github.com/influxdata/influxdb-client-js).

