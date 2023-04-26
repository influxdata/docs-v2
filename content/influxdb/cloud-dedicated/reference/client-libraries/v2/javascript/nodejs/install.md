---
title: Install the InfluxDB JavaScript client library
seotitle: Install the InfluxDB Node.js JavaScript client library
description: >
  Install the Node.js JavaScript client library to interact with the InfluxDB v2 API.
menu:
  influxdb_cloud_dedicated:
    name: Install
    parent: Node.js
influxdb/cloud-dedicated/tags: [client libraries, JavaScript]
weight: 100
aliases:
  - /influxdb/cloud-dedicated/reference/api/client-libraries/nodejs/install
---


## Install Node.js

1. Install [Node.js](https://nodejs.org/en/download/package-manager/).

2. Ensure that InfluxDB is running and you can connect to it.
   For information about what URL to use to connect to your InfluxDB Cloud Dedicated cluster, contact your InfluxData account representative.

3. Start a new Node.js project.
  The `npm` package manager is included with Node.js.

  ```sh
  npm init -y influx-node-app
  ```

## Install TypeScript

Many of the client library examples use [TypeScript](https://www.typescriptlang.org/). Follow these steps to initialize the TypeScript project.

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

The JavaScript client library contains two packages: `@influxdata/influxdb-client` and `@influxdata/influxdb-client-apis`.
Add both as dependencies of your project.

1. Open a new terminal window and install  `@influxdata/influxdb-client` for querying and writing data:

   ```sh
   npm install --save @influxdata/influxdb-client
   ```

3. Install `@influxdata/influxdb-client-apis` for access to the InfluxDB management APIs:

   ```sh
   npm install --save @influxdata/influxdb-client-apis
   ```

## Next steps

Once you've installed the Javascript client library, you're ready to [write data](/influxdb/cloud-dedicated/api-guide/client-libraries/nodejs/write/) to InfluxDB or [get started](#get-started-with-examples) with other examples from the client library.

## Get started with examples

{{% note %}}
The client examples include an [`env`](https://github.com/influxdata/influxdb-client-js/blob/master/examples/env.js) module for accessing your InfluxDB properties from environment variables or from `env.js`.
The examples use these properties to interact with the InfluxDB API.
{{% /note %}}

1. Set environment variables or update `env.js` with your InfluxDB [database](/influxdb/cloud-dedicated/admin/databases/) (bucket), organization (required, but ignored), [token](/influxdb/cloud-dedicated/admin/tokens/), and cluster URL.

   ```sh
   export INFLUX_URL=https://cluster-id.influxdb.io
   export INFLUX_TOKEN=YOUR_API_TOKEN
   export INFLUX_ORG=YOUR_ORG
   export INFLUX_BUCKET=YOUR_BUCKET
   ```
   Replace the following:
   - *`YOUR_API_TOKEN`*: InfluxDB database token
   - *`YOUR_ORG`*: An arbitrary string (this credential is ignored)
   - *`YOUR_BUCKET`*: InfluxDB database name

2. Run an example script.

   ```sh
   query.ts
   ```
{{% api/v2dot0/nodejs/learn-more %}}
