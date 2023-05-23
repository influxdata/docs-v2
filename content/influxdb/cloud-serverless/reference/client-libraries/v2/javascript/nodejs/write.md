---
title: Write data with the InfluxDB v2 JavaScript client library
list_title: Write data
description: >
  Use the JavaScript client library to write data with the InfluxDB API in Node.js.
menu:
  influxdb_cloud_serverless:
    name: Write
    parent: Node.js
influxdb/cloud-serverless/tags: [client libraries, JavaScript]
weight: 101
aliases:
  - /influxdb/cloud-serverless/reference/api/client-libraries/nodejs/write/
related:
  - /influxdb/cloud-serverless/write-data/troubleshoot/
---

Use the [InfluxDB v2 Javascript client library](https://github.com/influxdata/influxdb-client-js) to write data from a Node.js environment to InfluxDB.

The Javascript client library includes the following convenient features for writing data to InfluxDB:
- Apply default tags to data points.
- Buffer points into batches to optimize data transfer.
- Automatically retry requests on failure.
- Set an optional HTTP proxy address for your network.

### Before you begin

- [Install the client library and other dependencies](/influxdb/cloud-serverless/api-guide/client-libraries/nodejs/install/).

### Write data with the client library

1. Instantiate a client by calling the `new InfluxDB()` constructor with your InfluxDB URL and API token (environment variables you already set in the [Install section](/influxdb/cloud-serverless/api-guide/client-libraries/nodejs/install/)).

   ```js
   import {InfluxDB, Point} from '@influxdata/influxdb-client'

   const influxDB = new InfluxDB({url: process.env.INFLUX_URL,
                                  token: process.env.INFLUX_TOKEN})
   ```

2. Use the `getWriteApi()` method of the client to create a **write client**.
   Provide your InfluxDB organization ID and bucket name.

   ```js
  const writeApi = influxDB.getWriteApi(process.env.INFLUX_ORG,
                                        process.env.INFLUX_BUCKET)
   ```

3. To apply one or more [tags](/influxdb/cloud-serverless/reference/glossary/#tag) to all points, use the `useDefaultTags()` method.
   Provide tags as an object of key/value pairs.

    ```js
    writeApi.useDefaultTags({region: 'west'})
    ```

4. Use the `Point()` constructor to create a [point](/influxdb/cloud-serverless/reference/glossary/#point).
   1. Call the constructor and provide a [measurement](/influxdb/cloud-serverless/reference/glossary/#measurement).
   2. To add one or more tags, chain the `tag()` method to the constructor.
      Provide a `name` and `value`.
   3. To add a field of type `float`, chain the `floatField()` method to the constructor.
      Provide a `name` and `value`.

    ```js
    const point1 = new Point('temperature')
      .tag('sensor_id', 'TLM010')
      .floatField('value', 24)
    ```

5. Use the `writePoint()` method to write the point to your InfluxDB bucket.
   Finally, use the `close()` method to flush all pending writes.
   The example logs the new data point followed by "WRITE FINISHED" to stdout.

    ```js
    writeApi.writePoint(point1)

    writeApi.close().then(() => {
      console.log('WRITE FINISHED')
    })
    ```

### Complete example

```js
'use strict'
/** @module write
 * Writes a data point to InfluxDB using the Javascript client library with Node.js.
**/

import {InfluxDB, Point} from '@influxdata/influxdb-client'

/**
 * Instantiate the InfluxDB client.
 * Provide your InfluxDB URL and API token.
 **/
const influxDB = new InfluxDB({url: process.env.INFLUX_URL,
                              token: process.env.INFLUX_TOKEN})

/**
 * Create a write client from the getWriteApi method.
 * Provide your org and bucket.
 **/
const writeApi = influxDB.getWriteApi(process.env.INFLUX_ORG,
                                      process.env.INFLUX_BUCKET)

/**
 * Apply default tags to all points.
 **/
writeApi.useDefaultTags({region: 'west'})

/**
 * Create a point and write it to the buffer.
 **/
const point1 = new Point('temperature')
  .tag('sensor_id', 'TLM01')
  .floatField('value', 24.0)
console.log(` ${point1}`)

writeApi.writePoint(point1)

/**
 * Flush pending writes and close writeApi.
 **/
writeApi.close().then(() => {
  console.log('WRITE FINISHED')
})
```

In your terminal with [environment variables or `env.js` set](/influxdb/cloud-serverless/reference/client-libraries/v2/javascript/nodejs/install/#configure-credentials), run the following command to execute the JavaScript file:

```sh
node write.js
```

### Response codes

_For information about **InfluxDB API response codes**, see
[InfluxDB API Write documentation](/influxdb/cloud-serverless/api/#operation/PostWrite)._
