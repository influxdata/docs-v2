---
title: Install the InfluxDB v2 JavaScript client library
description: >
  Install the Node.js JavaScript client library to write data to InfluxDB Cloud Serverless.
menu:
  influxdb_cloud_serverless:
    name: Install
    parent: Node.js
influxdb/cloud-serverless/tags: [client libraries, JavaScript]
weight: 100
aliases:
  - /influxdb/cloud-serverless/reference/api/client-libraries/nodejs/install
---

{{% note %}}

Install the Node.js JavaScript client library to write data to InfluxDB {{% cloud-name %}}.

### Tools to execute queries

InfluxDB v2 client libraries use the InfluxDB API `/api/v2/query` endpoint.
This endpoint can't query an {{% cloud-name %}} cluster.

{{% cloud-name %}} supports many different tools for querying data, including:

- [InfluxDB v3 client libraries](/influxdb/cloud-serverless/reference/client-libraries/v3/)
- [Flight clients](/influxdb/cloud-serverless/reference/client-libraries/flight-sql/)
- [Superset](/influxdb/cloud-serverless/query-data/sql/execute-queries/superset/)
- [Grafana](/influxdb/cloud-serverless/query-data/sql/execute-queries/grafana/)
- [InfluxQL with InfluxDB v1 HTTP API](/influxdb/cloud-serverless/primers/api/v1/#query-using-the-v1-api)
- [Chronograf](/{{< latest "Chronograf" >}}/)

{{% /note %}}

## Install Node.js

1. Install [Node.js](https://nodejs.org/en/download/package-manager/).

2. Ensure that InfluxDB is running and you can connect to it.
   For information about what URL to use to connect to {{% cloud-name %}}, see [InfluxDB URLs](/influxdb/cloud-serverless/reference/urls/).

3. In your terminal, create a directory for your Node.js project and change to it.

   ```sh
   mkdir influx-node-app && cd $_
   ```

4. Enter the following command to generate an npm package for your project. 
   The `npm` package manager is included with Node.js.

   ```sh
   npm init -y
   ```

## Install TypeScript

Many of the client library examples use [TypeScript](https://www.typescriptlang.org/).
Follow these steps to initialize the TypeScript project:

1. Install TypeScript and type definitions for Node.js.

   ```sh
   npm i -g typescript && npm i --save-dev @types/node
   ```
2. Create a TypeScript configuration with default values.

   ```sh
   tsc --init
   ```
3. Run the TypeScript compiler. To recompile your code automatically as you make changes, pass the `watch` flag to the compiler.

   ```sh
   tsc -w -p
   ```

## Install dependencies

Use the `@influxdata/influxdb-client` JavaScript client library to write data in {{% cloud-name %}}.

Open a new terminal window and install the `@influxdata/influxdb-client` package for querying and writing data:

   ```sh
   npm i --save @influxdata/influxdb-client
   ```

The `@influxdata/influxdb-client-apis` client library package won't work with {{% cloud-name %}}.
It only works with InfluxDB v2 management APIs.

## Configure credentials

The client examples include an [`env`](https://github.com/influxdata/influxdb-client-js/blob/master/examples/env.js) module for accessing your InfluxDB properties from environment variables or from `env.js`.
The examples use these properties to interact with the InfluxDB API.

Set environment variables or update `env.js` with your InfluxDB [bucket](/influxdb/cloud-serverless/organizations/buckets/), [organization](/influxdb/cloud-serverless/organizations/), [token](/influxdb/cloud-serverless/security/tokens/), and [url](/influxdb/cloud-serverless/reference/urls/).

   ```sh
   export INFLUX_URL=https://cloud2.influxdata.com
   export INFLUX_TOKEN=API_TOKEN
   export INFLUX_ORG=ORG_ID
   export INFLUX_BUCKET=BUCKET_NAME
   ```

   Replace the following:
   
   - *`API_TOKEN`*: InfluxDB [API token](/influxdb/cloud-serverless/get-started/setup/#create-an-all-access-api-token) with _write_ permission to the bucket.
   - *`ORG_ID`*: InfluxDB [organization ID](/influxdb/cloud-serverless/admin/organizations/view-orgs/)
   - *`BUCKET_NAME`*: the name of the {{% cloud-name %}} bucket to write to

## Next steps

Once you've installed the client library and configured credentials, you're ready to [write data](/influxdb/cloud-serverless/api-guide/client-libraries/nodejs/write/).

{{< page-nav next="/influxdb/cloud-serverless/reference/client-libraries/v2/javascript/nodejs/write/" keepTab=true >}}
