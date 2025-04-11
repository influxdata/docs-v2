## Install Node.js

1. Install [Node.js](https://nodejs.org/en/download/package-manager/).

2. Ensure that InfluxDB is running and you can connect to it.
   For information about what URL to use to connect to your {{% product-name omit=" Clustered" %}} cluster, contact your InfluxData account representative.

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

Set environment variables or update `env.js` with your InfluxDB [database](/influxdb3/version/admin/databases/), organization (required, but ignored), [database token](/influxdb3/version/admin/tokens/#database-tokens), and cluster URL.

   ```sh
   export INFLUX_URL=https://{{< influxdb/host >}}
   export INFLUX_TOKEN=DATABASE_TOKEN
   export INFLUX_ORG=ORG_ID
   export INFLUX_DATABASE=DATABASE_NAME
   ```
   Replace the following:
   - **`DATABASE_TOKEN`**: InfluxDB database token
   - **`ORG_ID`**: An arbitrary string (InfluxDB ignores this credential, but the client library requires it)
   - **`DATABASE_NAME`**: InfluxDB database name

## Next steps

Once you've installed the client library and configured credentials, you're ready to [write data](/influxdb3/version/reference/client-libraries/v2/javascript/nodejs/write/) to InfluxDB.

{{< page-nav next="/influxdb3/version/reference/client-libraries/v2/javascript/nodejs/write/" keepTab=true >}}
