---
title: Query data with the InfluxDB v2 JavaScript client library
description: >
  Use the InfluxDB v2 JavaScript client library to query data stored in an InfluxDB Cloud Serverless bucket.
  Learn how to use Flux with SQL in an InfluxDB v2 client library.
menu:
  influxdb_cloud_serverless:
    name: Query
    parent: Node.js
influxdb/cloud-serverless/tags: [client libraries, JavaScript]
weight: 201
aliases:
  - /influxdb/cloud-serverless/reference/api/client-libraries/nodejs/query/
---

Use the [InfluxDB v2 JavaScript client library](https://github.com/influxdata/influxdb-client-js) in a Node.js environment to query data stored in an InfluxDB Cloud Serverless bucket.

The InfluxDB v2 JavaScript client library uses Flux and the InfluxDB API [`/api/v2/query` endpoint](/influxdb/cloud-serverless/api/#operation/PostQuery) to query data.

{{< api-endpoint endpoint="http://localhost:8086/api/v2/query" method="post" api-ref="/influxdb/cloud-serverless/api/#operation/PostQuery" >}}

The following example sends a Flux-wrapped SQL query to an InfluxDB bucket, and then uses RxJS with an observer to process response data.

## Before you begin

- [Install the client library and other dependencies](/influxdb/cloud-serverless/reference/client-libraries/v2/javascript/nodejs/install/).

## Query InfluxDB

1. Change to your new project directory and create a file for your query module.

   ```sh
   cd influx-node-app && touch query.js
   ```

2. In `query.js`:
    1.  Import `InfluxDB` from `@influxdata/influxdb-client`.
    2.  Define an [SQL query](/influxdb/cloud-serverless/reference/sql/) as a string. Assign a variable to the query.
    3.  Define a Flux script as a string that contains the following:
        - `import` statement for the `experimental/iox` library.
        - `iox.sql(bucket:, query:)` function call with your bucket name and the SQL query from the preceding step.

        Assign a variable to the script.

        {{% warn %}}
To prevent SQL injection attacks, avoid concatenating unsafe user input with queries.
        {{% /warn %}}
    4.  Call the `new InfluxDB({url, token})` constructor to instantiate an `InfluxDB` API client. Provide your InfluxDB URL and API token (environment variables you already set in the [Install section](/influxdb/cloud-serverless/reference/client-libraries/v2/javascript/nodejs/install/)).
    5.  Call the client's `getQueryApi()` method with your InfluxDB organization ID to create a `QueryApi` query client configured for your organization.
    6.  Define an [RxJS **Observer**](http://reactivex.io/rxjs/manual/overview.html#observer) with a `next()` callback that will process data and table metadata for each row in the result.
    7.  Call the query client's `queryRows(query, consumer)` method.
        Provide the Flux script and the observer as arguments.
        The `queryRows` method sends the request, and then subscribes the `observer` to the response data.

### Complete example

```js
import {InfluxDB} from '@influxdata/influxdb-client';

// Define the SQL to query data in your bucket.
const sql=`
  SELECT DATE_BIN(INTERVAL '2 hours', time, '1970-01-01T00:00:00Z'::TIMESTAMP) AS time,
    sensor_id,
    AVG(value) AS 'average temp'
  FROM temperature
  GROUP BY DATE_BIN(INTERVAL '2 hours', time, '1970-01-01T00:00:00Z'::TIMESTAMP),
    sensor_id
  ORDER BY sensor_id, time
`;

// Define a Flux script that uses iox.sql() to execute the SQL against the bucket.
const fluxQuery = `
  import "experimental/iox"
  iox.sql(
    bucket: "${process.env.INFLUX_BUCKET}",
    query: "${sql}"
  )
`;

// Instantiate a query client permisssioned to query the bucket in your organization.
const queryApi = new InfluxDB({url: process.env.INFLUX_URL,
                            token: process.env.INFLUX_TOKEN})
                  .getQueryApi(process.env.INFLUX_ORG);

console.log('*** QueryRows ***');

// Define an RxJS observer that handles notifications and processes your data.
const observer = {
  next: (row, tableMeta) => {
    // From each row, create an object with column names as keys.
    const o = tableMeta.toObject(row)
    // Process data--for example, output columns to the console.
    console.log(
      `${o.time}: sensor: ${o['sensor_id']}, temp: ${o['average temp']}`
    )
  },
  error: (error) => {
    console.error(error)
    console.log('\nQueryRows ERROR')
  },
  complete: () => {
    console.log('\nQueryRows SUCCESS')
  },
};

// Send the request and subscribe the observer to the response data.
queryApi.queryRows(fluxQuery, observer);
```

In your terminal with [environment variables or `env.js` set](/influxdb/cloud-serverless/reference/client-libraries/v2/javascript/nodejs/install/#configure-credentials), run the following command to execute the JavaScript file:

```sh
node query.js
```

If successful, the observer receives a `next` notification for each row and outputs data to the terminal.

{{< page-nav prev="/influxdb/cloud-serverless/reference/client-libraries/v2/javascript/nodejs/write/" keepTab=true >}}
