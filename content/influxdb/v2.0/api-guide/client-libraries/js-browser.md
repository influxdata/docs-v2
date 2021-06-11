---
title: JavaScript client library
seotitle: InfluxDB JavaScript client library
list_title: JavaScript
description: >
  Use the JavaScript client library for web browsers to interact with InfluxDB.
menu:
  influxdb_2_0:
    name: Javascript (Browser)
    parent: Client libraries
influxdb/v2.0/tags: [client libraries, JavaScript]
weight: 201
aliases:
  - /influxdb/v2.0/reference/api/client-libraries/js/
---

Use the [InfluxDB JavaScript client library](https://github.com/influxdata/influxdb-client-js) to integrate InfluxDB into JavaScript scripts and applications. This client supports both client-side (browser) and server-side (NodeJS) environments.

This guide presumes some familiarity with JavaScript, browser environments, and InfluxDB.
If just getting started, see [Get started with InfluxDB](/influxdb/v2.0/get-started/).

## Before you begin

1. Install [NodeJS](https://nodejs.org/en/download/package-manager/).

2. Ensure that InfluxDB is running and you can connect to it.
   For information about what URL to use to connect to InfluxDB OSS or InfluxDB Cloud, see [InfluxDB URLs](/influxdb/v2.0/reference/urls/).

## Easiest way to get started
1. Clone the [examples directory](https://github.com/influxdata/influxdb-client-js/tree/master/examples) in the [influxdb-client-js](https://github.com/influxdata/influxdb-client-js) repo.
2. Navigate to the `examples` directory:

  ```js
    cd examples
  ```
3. Install `yarn` or `npm` dependencies as needed:

```js
   yarn install
   npm install
```

3. Update your `./env` and `index.html` with the name of your InfluxDB [bucket](/influxdb/v2.0/organizations/buckets/), [organization](/influxdb/v2.0/organizations/), [token](/influxdb/v2.0/security/tokens/), and `proxy` which relies upon proxy to forward requests to the target InfluxDB.
4. Run the following command to run the application at [http://localhost:3001/examples/index.html]()

    ```sh
    npm run browser
    ```

## Boilerplate for the InfluxDB Javascript client library  
Use the Javascript library to write data to and query data from InfluxDB in a browser.

1. To write a data point to InfluxDB using the JavaScript library, import the latest InfluxDB Javascript library in your script.

   ```js
   import {InfluxDB, Point} from 'https://unpkg.com/@influxdata/influxdb-client/dist/index.browser.mjs'
   ```

2. Define constants for your InfluxDB [bucket](/influxdb/v2.0/organizations/buckets/), [organization](/influxdb/v2.0/organizations/), [token](/influxdb/v2.0/security/tokens/), and `proxy` which relies on a proxy to forward requests to the target InfluxDB instance.

   ```js
   const proxy = '/influx'
   const token = 'example-token'
   const org = 'example-org'
   const bucket = 'example-bucket'
   ```

3. Instantiate the InfluxDB JavaScript client and pass in the `proxy` and `token` parameters.

   ```js
   const influxDB = new InfluxDB({proxy, token})
   ```

## Write data to InfluxDB with JavaScript
Use the Javascript library to write data to InfluxDB in a Node.js environment.

1. Instantiate an `InfluxDB` client. Provide your InfluxDB `url` and `token`.
2. Use the `getWriteApi` method of the instantiated InfluxDB client to create a **write client**. Provide your InfluxDB `org` and `bucket`.

  ```js
  import {InfluxDB, Point} from '@influxdata/influxdb-client'

  const influxDB = new InfluxDB({url, token})
  const writeApi = influxDB.getWriteApi(org, bucket)
  ```

   The `useDefaultTags` method instructs the write api to use default tags when writing points. Create a [point](/influxdb/v2.0/reference/glossary/#point) and write it to InfluxDB using the `writePoint` method. The `tag` and `floatField` methods add key value pairs for the tags and fields, respectively.  Close the client to flush all pending writes and finish.

   ```js
   writeApi.useDefaultTags({location: 'browser'})
   const point1 = new Point('temperature')
       .tag('example', 'index.html')
       .floatField('value', 24)
   console.log(`${point1}`)

   writeApi.writePoint(point1)
   writeApi.close()
   ```

### Complete example write script

```js
const influxDB = new InfluxDB({proxy, token})
const writeApi = influxDB.getWriteApi(org, bucket)

// setup default tags for all writes through this API
writeApi.useDefaultTags({location: 'browser'})
const point1 = new Point('temperature')
  .tag('example', 'index.html')
  .floatField('value', 24)
console.log(` ${point1}`)

writeApi.writePoint(point1)

// flush pending writes and close writeApi
writeApi
  .close()
  .then(() => {
    console.log('WRITE FINISHED')
  })
```

## Query data from InfluxDB with JavaScript
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

For more information, see the [JavaScript client README on GitHub](https://github.com/influxdata/influxdb-client-js).
