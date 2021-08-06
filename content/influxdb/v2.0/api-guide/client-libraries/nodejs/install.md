---
title: Install the JavaScript client library
description: >
  Install the Node.js JavaScript client library to interact with the InfluxDB API.
menu:
  influxdb_2_0:
    name: Install
    parent: Node.js
influxdb/v2.0/tags: [client libraries, JavaScript]
weight: 100
aliases:
  - /influxdb/v2.0/reference/api/client-libraries/nodejs/install
---


## Install

1. Install [Node.js](https://nodejs.org/en/download/package-manager/).

2. Ensure that InfluxDB is running and you can connect to it.
   For information about what URL to use to connect to InfluxDB OSS or InfluxDB Cloud, see [InfluxDB URLs](/influxdb/v2.0/reference/urls/).

3. Start a new Node.js project.
   The `npm` package manager is included with Node.js.

   ```sh
   npm init -y influx-node-app
   ```

## Install dependencies

The JavaScript client contains two packages. Add both as dependencies of your project.

1. Change to your project directory:

   ```sh
   cd influx-node-app
   ```

2. Install  `@influxdata/influxdb-client` for querying and writing data:

   ```sh
   npm install --save @influxdata/influxdb-client
   ```

3. Install `@influxdata/influxdb-client-apis` for access to the InfluxDB management APIs:

   ```sh
   npm install --save @influxdata/influxdb-client-apis
   ```

## Get started with examples 

{{% note %}}
The client examples include an [`env`](https://github.com/influxdata/influxdb-client-js/blob/master/examples/env.js) module for accessing your InfluxDB properties from environment variables or from `env.js`.
The examples will use these to interact with the InfluxDB API.
{{% /note %}}

1. Set environment variables or update `env.js` with your InfluxDB [bucket](/influxdb/v2.0/organizations/buckets/), [organization](/influxdb/v2.0/organizations/), [token](/influxdb/v2.0/security/tokens/), and [url](/influxdb/v2.0/urls).

   ```sh
   # Environment variables
   {{< api/v2dot0/env >}}
   ```

2. Run an example script.

   ```sh
   query.ts
   ```
{{% api/v2dot0/nodejs/learn-more %}}
