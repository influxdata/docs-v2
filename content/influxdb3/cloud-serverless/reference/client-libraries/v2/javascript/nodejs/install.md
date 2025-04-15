---
title: Install the InfluxDB v2 JavaScript client library
description: >
  Install the Node.js JavaScript client library to write data to InfluxDB Cloud Serverless.
menu:
  influxdb3_cloud_serverless:
    name: Install
    parent: Node.js
influxdb3/cloud-serverless/tags: [client libraries, JavaScript]
weight: 100
aliases:
  - /influxdb3/cloud-serverless/reference/api/client-libraries/nodejs/install
prepend: |
   > [!WARNING]
   > ### Use InfluxDB 3 clients
   > 
   > The `/api/v2/query` API endpoint and associated tooling, such as InfluxDB v2 client libraries and the `influx` CLI, **can't** query an {{% product-name omit=" Clustered" %}} cluster.
   > 
   > [InfluxDB 3 client libraries](/influxdb3/{{% product-key %}}/client-libraries/v3/) are available that integrate with your code to write and query data stored in {{% product-name %}}.
   > 
   > InfluxDB 3 supports many different tools for [**writing**](/influxdb3/cloud-serverless/write-data/) and [**querying**](/influxdb3/cloud-serverless/query-data/) data.
   > [**Compare tools you can use**](/influxdb3/cloud-serverless/get-started/#tools-to-use) to interact with {{% product-name %}}.
---

Install the Node.js JavaScript client library to write data to InfluxDB {{% product-name %}}.

## Install Node.js

1. Install [Node.js](https://nodejs.org/en/download/package-manager/).

2. Ensure that InfluxDB is running and you can connect to it.
   For information about what URL to use to connect to {{% product-name %}}, see [InfluxDB URLs](/influxdb3/cloud-serverless/reference/urls/).

3. In your terminal, create a directory for your Node.js project and change to it.

   ```sh
   mkdir influx-node-app && cd influx-node-app
   ```

4. Enter the following command to generate an npm package for your project. 
   
   - `npm`: the package manager included with Node.js
   - `-y`: uses defaults for the package and bypasses prompts

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

2. Enter the following command to create a TypeScript configuration
   (`tsconfig.json`) with default values:

   ```sh
   tsc --init
   ```

3. Run the TypeScript compiler.
   To recompile your code automatically as you make changes, pass the `--watch, -w` flag to the compiler.

   <!--pytest.mark.skip-->
   
   ```sh
   tsc --watch
   ```

## Install dependencies

Use the `@influxdata/influxdb-client` JavaScript client library to write data in {{% product-name %}}.

Open a new terminal window and install the `@influxdata/influxdb-client` package for querying and writing data:

   ```sh
   npm i --save @influxdata/influxdb-client
   ```

The `@influxdata/influxdb-client-apis` client library package won't work with {{% product-name %}}.
It only works with InfluxDB v2 management APIs.

## Configure credentials

The client examples include an [`env`](https://github.com/influxdata/influxdb-client-js/blob/master/examples/env.js) module for accessing your InfluxDB properties from environment variables or from `env.js`.
The examples use these properties to interact with the InfluxDB API.

Set environment variables or update `env.js` with your InfluxDB [bucket](/influxdb3/cloud-serverless/organizations/buckets/), [organization](/influxdb3/cloud-serverless/organizations/), [token](/influxdb3/cloud-serverless/security/tokens/), and [URL](/influxdb3/cloud-serverless/reference/urls/).

   ```sh
   export INFLUX_URL=https://{{< influxdb/host >}}
   export INFLUX_TOKEN=API_TOKEN
   export INFLUX_ORG=ORG_ID
   export INFLUX_BUCKET=BUCKET_NAME
   ```

   Replace the following:
   
   - *`API_TOKEN`*: InfluxDB [API token](/influxdb3/cloud-serverless/get-started/setup/#create-an-all-access-api-token) with _write_ permission to the bucket.
   - *`ORG_ID`*: InfluxDB [organization ID](/influxdb3/cloud-serverless/admin/organizations/view-orgs/)
   - *`BUCKET_NAME`*: the name of the {{% product-name %}} bucket to write to

## Next steps

Once you've installed the client library and configured credentials, you're ready to [write data](/influxdb3/cloud-serverless/reference/client-libraries/v2/javascript/nodejs/write/).

{{< page-nav next="/influxdb3/cloud-serverless/reference/client-libraries/v2/javascript/nodejs/write/" keepTab=true >}}
