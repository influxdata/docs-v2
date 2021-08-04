---
title: Write data with the InfluxDB JavaScript client library for browsers
seotitle: Write data with the InfluxDB JavaScript client library for browsers
list_title: Write data
description: >
  Use the JavaScript client library for web browsers to write data to InfluxDB.
menu:
  influxdb_2_0:
    name: Write
    identifier: client_js_browser_write
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

### Write data to InfluxDB
  {{% warn %}}
  #### Tokens in production applications
  {{% api/browser-token-warning %}}
  {{% /warn %}}

Use the `getWriteApi` method of the InfluxDB client instance to create a **write client**. Provide your InfluxDB `org` and `bucket`.

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
const influxDB = new InfluxDB({url, token})
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

For more information, see the [JavaScript client README on GitHub](https://github.com/influxdata/influxdb-client-js).
