---
title: Write data with the InfluxDB JavaScript client library
description: >
  Use the JavaScript client library to write data with the InfluxDB API in Node.js.
menu:
  influxdb_2_0:
    name: Write
    parent: Node.js
influxdb/v2.0/tags: [client libraries, JavaScript]
weight: 101
aliases:
  - /influxdb/v2.0/reference/api/client-libraries/nodejs/write
related:
  - /influxdb/v2.0/write-data/troubleshoot/
---

Use the [InfluxDB Javascript client library](https://github.com/influxdata/influxdb-client-js) to write data from a Node.js environment to InfluxDB.

The Javascript client library includes the following convenient features for writing data to InfluxDB:
- Apply default tags to data points.
- Buffer points into batches to optimize data transfer.
- Automatically retry requests on failure.
- Set an optional HTTP proxy address for your network.

### Before you begin

- [Install the client library](/influxdb/v2.0/api-guide/client-libraries/nodejs/install.md).

### Write data with the client library

1. Instantiate an `InfluxDB` client. Provide your InfluxDB URL and API token.

   ```js
   import {InfluxDB, Point} from '@influxdata/influxdb-client'

   const influxDB = new InfluxDB({YOUR_INFLUX_URL, YOUR_INFLUX_TOKEN})
   ```

2. Use the `getWriteApi()` method of the client to create a **write client**.
   Provide your InfluxDB org ID and bucket name.

   ```js
   import {InfluxDB, Point} from '@influxdata/influxdb-client'

   const influxDB = new InfluxDB({YOUR_INFLUX_URL, YOUR_INFLUX_TOKEN})
   const writeApi = influxDB.getWriteApi(YOUR_INFLUX_ORG, YOUR_INFLUX_BUCKET)
   ```
   Replace the following:
   - *`YOUR_INFLUX_URL`*: the URL of your InfluxDB instance.
   - *`YOUR_INFLUX_TOKEN`*: your InfluxDB API token.
   - *`YOUR_INFLUX_ORG`*: the ID of your InfluxDB organization.
   - *`YOUR_INFLUX_BUCKET`*: the name of your InfluxDB bucket.

3. To apply one or more [tags](/influxdb/v2.0/reference/glossary/#tag) to all points, use the `useDefaultTags()` method.
   Provide an object of tag key/value pairs.

    ```js
    writeApi.useDefaultTags({region: 'west'})
    ```

4. Use the `Point()` constructor to create a [point](/influxdb/v2.0/reference/glossary/#point).
   1. Call the constructor and provide a [measurement](/influxdb/v2.0/reference/glossary/#measurement). 
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

To run the example from a file, set your InfluxDB environment variables and use `node` to execute the JavaScript file.

```sh
export INFLUX_URL=https://cloud2.influxdata.com && \
export INFLUX_TOKEN=YOUR_INFLUX_TOKEN && \
export INFLUX_ORG=YOUR_INFLUX_ORG && \
export INFLUX_BUCKET=YOUR_INFLUX_BUCKET && \
node write.js
```

### Response codes
_For information about **InfluxDB API response codes**, see
[InfluxDB API Write documentation](/influxdb/cloud/api/#operation/PostWrite)._
