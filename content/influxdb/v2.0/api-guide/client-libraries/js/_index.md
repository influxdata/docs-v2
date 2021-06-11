---
title: JavaScript client library
seotitle: InfluxDB JavaScript client library
list_title: JavaScript
description: >
  Use the Node.js JavaScript client library to interact with InfluxDB.
menu:
  influxdb_2_0:
    name: Node.js
    parent: Client libraries
influxdb/v2.0/tags: [client libraries, JavaScript]
weight: 201
aliases:
  - /influxdb/v2.0/reference/api/client-libraries/js/
---

Use the [InfluxDB JavaScript client library](https://github.com/influxdata/influxdb-client-js) to integrate InfluxDB into your Node.js application.

In this guide, you'll start a Node.js project from scratch and code some simple API operations. See the [client repo](https://github.com/influxdata/influxdb-client-js) for more [complete examples](https://github.com/influxdata/influxdb-client-js/tree/master/examples).

## Install

1. Install [Node.js](https://nodejs.org/en/download/package-manager/).

2. Ensure that InfluxDB is running and you can connect to it.
   For information about what URL to use to connect to InfluxDB OSS or InfluxDB Cloud, see [InfluxDB URLs](/influxdb/v2.0/reference/urls/).

3. Start a new Node.js project:

   ```sh
   npm init influx-node-app
   ```

   Answer or `Enter` through the prompts.

## Install dependencies
The JavaScript client contains two packages. Add both as dependencies of your project.

{{% note %}}
`npm` package manager is included with Node.js.
{{% /note %}}

1. Change to your project directory:

   ```sh
   cd influx-node-app
   ```

2. Install  `@influxdata/influxdb-client` for querying and writing data:

   ```sh
   npm install --save @influxdata/influxdb-client
   ```

3. Install `@influxdata/influxdb-client-apis` for access to the InfluxDB management APIs:

   ```sh
   npm install --save @influxdata/influxdb-client-apis
   ```



## Configure your environment
1. Configure environment variables. Update your `./env` with the name of your InfluxDB [bucket](/influxdb/v2.0/organizations/buckets/), [organization](/influxdb/v2.0/organizations/), [token](/influxdb/v2.0/security/tokens/), and [url](/influxdb/v2.0/urls).

## Write data to InfluxDB with JavaScript
Use the Javascript library to write data to InfluxDB in a Node.js environment.

{{% note %}}
This library supports browser and server-side (Node.js) Javascript environments. Use `@influxdata/influxdb-client` in your Node.js project.
{{% /note %}}

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
