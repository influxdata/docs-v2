---
title: Install the InfluxDB v2 JavaScript client library
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

Open a new terminal window and install `@influxdata/influxdb-client`:

   ```sh
   npm i --save @influxdata/influxdb-client
   ```

The `@influxdata/influxdb-client-apis` client library package doesn't
work with InfluxDB v3.
It only works with InfluxDB v2 management APIs. 

## Configure credentials

The client examples include an [`env`](https://github.com/influxdata/influxdb-client-js/blob/master/examples/env.js) module for accessing your InfluxDB properties from environment variables or from `env.js`.
The examples use these properties to interact with the InfluxDB API.

Set environment variables or update `env.js` with your InfluxDB [database](/influxdb/cloud-dedicated/admin/databases/) (bucket), organization (required, but ignored), [token](/influxdb/cloud-dedicated/admin/tokens/), and cluster URL.

   ```sh
   export INFLUX_URL=https://cluster-id.influxdb.io
   export INFLUX_TOKEN=DATABASE_TOKEN
   export INFLUX_ORG=ORG_ID
   export INFLUX_DATABASE=DATABASE_NAME
   ```
   Replace the following:
   - **`DATABASE_TOKEN`**: InfluxDB database token
   - **`ORG_ID`**: An arbitrary string (InfluxDB ignores this credential, but the client library requires it)
   - **`DATABASE_NAME`**: InfluxDB database name

## Next steps

Once you've installed the client library and configured credentials, you're ready to [write data](/influxdb/cloud-dedicated/api-guide/client-libraries/nodejs/write/) to InfluxDB.

{{< page-nav next="/influxdb/cloud-dedicated/reference/client-libraries/v2/javascript/nodejs/write/" keepTab=true >}}
