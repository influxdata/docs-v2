

## Install Node.js

1. Install [Node.js](https://nodejs.org/en/download/package-manager/).

2. Ensure that InfluxDB is running and you can connect to it.
   For information about what URL to use to connect to InfluxDB OSS or InfluxDB Cloud, see [InfluxDB URLs](/influxdb/version/reference/urls/).

3. Create a directory for your new Node.js project, and then change to the
   directory--for example, enter the following command into your terminal:

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

Once you've installed the JavaScript client library, you're ready to [write data](/influxdb/version/api-guide/client-libraries/nodejs/write/) to InfluxDB or [get started](#get-started-with-examples) with other examples from the client library.

## Get started with examples

{{% note %}}
The client examples include an [`env`](https://github.com/influxdata/influxdb-client-js/blob/master/examples/env.mjs) module for accessing your InfluxDB properties from environment variables or from `env.mjs`.
The examples use these properties to interact with the InfluxDB API.
{{% /note %}}

1. Set environment variables or update `env.mjs` with your InfluxDB [bucket](/influxdb/version/admin/buckets/), [organization](/influxdb/version/admin/organizations/), [token](/influxdb/version/admin/tokens/), and [URL](/influxdb/version/reference/urls/).

   ```sh
   export INFLUX_URL=http://localhost:8086
   export INFLUX_TOKEN=YOUR_API_TOKEN
   export INFLUX_ORG=YOUR_ORG
   export INFLUX_BUCKET=YOUR_BUCKET
   ```
   Replace the following:
   - *`YOUR_API_TOKEN`*: InfluxDB API token
   - *`YOUR_ORG`*: InfluxDB organization ID
   - *`YOUR_BUCKET`*: InfluxDB bucket name

2. Run one of the [`influxdb-client-js` example scripts](https://github.com/influxdata/influxdb-client-js/tree/master/examples/).

   <!--pytest.mark.skip-->

   ```sh
   query.ts
   ```
{{% api/v2dot0/nodejs/learn-more %}}
