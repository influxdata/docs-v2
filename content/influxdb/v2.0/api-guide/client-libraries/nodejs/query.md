---
title: Query data with the InfluxDB JavaScript client library
description: >
  Use the JavaScript client library to query data with the InfluxDB API in Node.js.
menu:
  influxdb_2_0:
    name: Query
    parent: Node.js
influxdb/v2.0/tags: [client libraries, JavaScript]
weight: 201
aliases:
  - /influxdb/v2.0/reference/api/client-libraries/nodejs/query
---

Use the [InfluxDB JavaScript client library](https://github.com/influxdata/influxdb-client-js) in a Node.js environment to query InfluxDB.  

The following example sends a Flux query to an InfluxDB bucket and outputs rows from an observable table.

## Before you begin

- [Install the client library and other dependencies](/{{% latest "influxdb" %}}/v2.0/api-guide/client-libraries/nodejs/install.md).

## Query InfluxDB 

1. Change to your new project directory and create a file for your query module.

   ```sh
   cd influx-node-app && touch query.js
   ```

2. Instantiate an `InfluxDB` client. Provide your InfluxDB URL and API token.
   Use the `getQueryApi()` method of the client.
   Provide your InfluxDB org ID to create a configured **query client**.

   ```js
   import { InfluxDB, Point } from '@influxdata/influxdb-client'

   const queryApi = new InfluxDB({YOUR_INFLUX_URL, YOUR_INFLUX_TOKEN}).getQueryApi(YOUR_INFLUX_ORG)
   ```

   Replace the following:
   - *`YOUR_INFLUX_URL`*: the URL of your InfluxDB instance.
   - *`YOUR_INFLUX_TOKEN`*: your InfluxDB API token.
   - *`YOUR_INFLUX_ORG`*: the ID of your InfluxDB organization.

3. Create a Flux query for your InfluxDB bucket. Store the query as a string variable.
   {{% warn %}}
   To prevent SQL injection attacks, avoid concatenating unsafe user input with queries. 
   {{% /warn %}}

   ```js
   const fluxQuery =
     'from(bucket:YOUR_INFLUX_BUCKET)
     |> range(start: 0)
     |> filter(fn: (r) => r._measurement == "temperature")'
   ```
   Replace *`YOUR_INFLUX_BUCKET`* with the name of your InfluxDB bucket.

4. Use the `queryRows()` method of the query client to query InfluxDB.
   `queryRows()` takes a Flux query and an [RxJS **Observer**](http://reactivex.io/rxjs/manual/overview.html#observer) object.
   The client returns [table](/{{% latest "influxdb" %}}/reference/syntax/annotated-csv/#tables) metadata and rows as an  [RxJS **Observable**](http://reactivex.io/rxjs/manual/overview.html#observable).
   `queryRows()` subscribes your observer to the observable.
   Finally, the observer logs the rows from the response to the terminal.

   ```js
   const observer = {
     next(row, tableMeta) {
       const o = tableMeta.toObject(row)
       console.log(
         `${o._time} ${o._measurement} in '${o.location}' (${o.sensor_id}): ${o._field}=${o._value}`
       )
     }
   }

   queryApi.queryRows(fluxQuery, observer)

   ```

### Complete example

```js
{{% get-shared-text "api/v2.0/query/query.mjs" %}}
```

To run the example from a file, set your InfluxDB environment variables and use `node` to execute the JavaScript file.

```sh
export INFLUX_URL=https://cloud2.influxdata.com && \
export INFLUX_TOKEN=YOUR_INFLUX_TOKEN && \
export INFLUX_ORG=YOUR_INFLUX_ORG && \
node query.js
```

{{% api/v2dot0/nodejs/learn-more %}}
