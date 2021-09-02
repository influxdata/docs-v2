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

Use the [InfluxDB Javascript client library](https://github.com/influxdata/influxdb-client-js) to write data from a Node.js environment to InfluxDB.

The Javascript client library includes the following convenient features for writing data to InfluxDB:
- Apply default tags to data points.
- Buffer points into batches to optimize data transfer.
- Automatically retry requests on failure.
- Set an optional HTTP proxy address for your network.

### Before you begin

- [Install the client library](/{{% latest "influxdb" %}}/v2.0/api-guide/client-libraries/nodejs/install.md).

### Write data with the client library

1. Instantiate an `InfluxDB` client. Provide your InfluxDB `url` and `token`.

2. Use the `getWriteApi()` method of the instantiated InfluxDB client to create a **write client**. Provide your InfluxDB `org` and `bucket`.
    ```js
    import {InfluxDB, Point} from '@influxdata/influxdb-client'

    const influxDB = new InfluxDB({url, token})
    const writeApi = influxDB.getWriteApi(org, bucket)
    ```

3. To instruct the client to use default tags when writing points, call the `useDefaultTags()` method.
    ```js
    writeApi.useDefaultTags({region: 'west'})
    ```

4. Create a [point](/influxdb/v2.0/reference/glossary/#point) and write it to InfluxDB using the `writePoint()` method.
   The `tag()` and `floatField()` methods add key value pairs for the tags and fields, respectively.
   Finally, use the `close()` method to flush all pending writes and finish.
   The example logs the new data point followed by "WRITE FINISHED" to the terminal. 

    ```js
    const point1 = new Point('temperature')
      .tag('sensor_id', 'TLM010')
      .floatField('value', 24)
    console.log(`${point1}`)

    writeApi.writePoint(point1)

    writeApi.close().then(() => {
      console.log('WRITE FINISHED')
    })
    ```

### Complete example

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Curl](#curl)
[Node.js](#nodejs)
{{% /code-tabs %}}
{{% code-tab-content %}}

```sh
{{< get-shared-text "api/v2.0/write/write.sh" >}}
```
{{% /code-tab-content %}}
{{% code-tab-content %}}

```js
{{< get-shared-text "api/v2.0/write/write.mjs" >}}
```

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

### Response codes
_For information about **InfluxDB API response codes**, see
[InfluxDB API Write documentation](/influxdb/cloud/api/#operation/PostWrite)._
