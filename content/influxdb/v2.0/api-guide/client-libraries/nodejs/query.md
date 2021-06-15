---
title: Query data with the JavaScript client library
description: >
  Use the Node.js JavaScript client library to query data with the InfluxDB API.
menu:
  influxdb_2_0:
    name: Query
    parent: Node.js
influxdb/v2.0/tags: [client libraries, JavaScript]
weight: 201
aliases:
  - /influxdb/v2.0/reference/api/client-libraries/nodejs/query
---

Use the Javascript library to query data from InfluxDB.

1. Use the `getQueryApi` method of the `InfluxDB` client to create a new **query client**. Provide your InfluxDB `org`.

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

```js
// performs query and receive line table metadata and rows
// https://v2.docs.influxdata.com/v2.0/reference/syntax/annotated-csv/
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

{{% api/v2dot0/nodejs/learn-more %}}
