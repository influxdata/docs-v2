---
title: Write data with the JavaScript client library
description: >
  Use the Node.js JavaScript client library to write data with the InfluxDB API.
menu:
  influxdb_2_0:
    name: Write
    parent: Node.js
influxdb/v2.0/tags: [client libraries, JavaScript]
weight: 101
aliases:
  - /influxdb/v2.0/reference/api/client-libraries/nodejs/write
---

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

### Complete example

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Curl](#curl)
[Node.js](#nodejs)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
{{< api/v2dot0/curl/write >}}
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```js
{{< api/v2dot0/nodejs/write >}}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

### Response codes
_For information about **InfluxDB API response codes**, see
[InfluxDB API Write documentation](/influxdb/cloud/api/#operation/PostWrite)._

### Compressing data

To compress data when writing to InfluxDB, set the `Content-Encoding` header to `gzip`.
Compression reduces network bandwidth, but increases server-side load.

```sh
{{< api/v2dot0/curl/write-compressed >}}
```
