---
title: Write data with the JavaScript client library
description: >
  Use the Node.js JavaScript client library to write data with the InfluxDB API.
menu:
  influxdb_2_0:
    name: Write
    parent: Node.js
influxdb/v2.0/tags: [client libraries, JavaScript]
weight: 201
aliases:
  - /influxdb/v2.0/reference/api/client-libraries/js/nodejs/write
---

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
