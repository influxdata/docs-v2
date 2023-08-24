---
title: InfluxDB v2 JavaScript client library for web browsers
list_title: JavaScript for browsers
description: >
  Use the InfluxDB v2 JavaScript client library in browsers and front-end clients to write data to an InfluxDB Cloud Serverless bucket.
menu:
  influxdb_cloud_serverless:
    name: Browsers and web clients
    identifier: client_js_browsers
    parent: JavaScript
influxdb/cloud-serverless/tags: [client libraries, JavaScript]
weight: 201
aliases:
  - /influxdb/cloud-serverless/api-guide/client-libraries/browserjs/write
  - /influxdb/cloud-serverless/api-guide/client-libraries/browserjs/query
related:
  - /influxdb/cloud-serverless/api-guide/client-libraries/nodejs/write/
  - /influxdb/cloud-serverless/api-guide/client-libraries/nodejs/query/
---

Use the [InfluxDB v2 JavaScript client library](https://github.com/influxdata/influxdb-client-js) in browsers and front-end clients to write data to an {{% product-name %}} bucket.

{{% note %}}

### Tools to execute queries

InfluxDB v2 client libraries use the InfluxDB API `/api/v2/query` endpoint.
This endpoint can't query an {{% product-name omit=" Clustered" %}} cluster.

{{% product-name %}} supports many different tools for querying data, including:

- [InfluxDB v3 client libraries](/influxdb/cloud-serverless/reference/client-libraries/v3/)
- [Flight clients](/influxdb/cloud-serverless/reference/client-libraries/flight-sql/)
- [Superset](/influxdb/cloud-serverless/query-data/sql/execute-queries/superset/)
- [Grafana](/influxdb/cloud-serverless/query-data/sql/execute-queries/grafana/)
- [InfluxQL with InfluxDB v1 HTTP API](/influxdb/cloud-serverless/primers/api/v1/#query-using-the-v1-api)
- [Chronograf](/{{< latest "Chronograf" >}}/)

{{% /note %}}

This library supports both front-end and server-side environments and provides the following distributions:
* ECMAScript modules (ESM) and CommonJS modules (CJS)
* Bundled ESM
* Bundled UMD 

This guide presumes some familiarity with JavaScript, browser environments, and InfluxDB.
If you're just getting started with InfluxDB, see [Get started with InfluxDB](/{{% latest "influxdb" %}}/get-started/).

{{% warn %}}
### Tokens in production applications
{{% api/browser-token-warning %}}
{{% /warn %}}

* [Before you begin](#before-you-begin)
* [Use with module bundlers](#use-with-module-bundlers)
* [Use bundled distributions with browsers and module loaders](#use-bundled-distributions-with-browsers-and-module-loaders)
* [Get started with the example app](#get-started-with-the-example-app)

## Before you begin

1. Install [Node.js](https://nodejs.org/en/download/package-manager/) to serve your front-end app.

2. Ensure that InfluxDB is running and you can connect to it.

## Use with module bundlers

If you use a module bundler like Webpack or Parcel, install `@influxdata/influxdb-client-browser`.

## Use bundled distributions with browsers and module loaders 

1. Configure InfluxDB properties for your script.

   ```html
   <script>
     window.INFLUX_ENV = {
       url: 'https://{{< influxdb/host >}}',
       token: 'API_TOKEN'
     }
   </script>
   ```
   Replace the following:

    - **`API_TOKEN`**: An InfluxDB token with WRITE permission to the bucket.

2. Import modules from the latest client library browser distribution.
`@influxdata/influxdb-client-browser` exports bundled ESM and UMD syntaxes. 

   {{< code-tabs-wrapper >}}
   {{% code-tabs %}}
   [ESM](#import-esm)
   [UMD](#import-umd)
   {{% /code-tabs %}}
   {{% code-tab-content %}}
   ```html
   <script type="module">
     import {InfluxDB, Point} from 'https://unpkg.com/@influxdata/influxdb-client-browser/dist/index.browser.mjs'

     const influxDB = new InfluxDB({INFLUX_ENV.url, INFLUX_ENV.token})
   </script>
   ```
   {{% /code-tab-content %}}
   {{% code-tab-content %}}
   ```html
   <script src="https://unpkg.com/@influxdata/influxdb-client-browser"></script>
   <script>
     const Influx = window['@influxdata/influxdb-client']

     const InfluxDB = Influx.InfluxDB
     const influxDB = new InfluxDB({INFLUX_ENV.url, INFLUX_ENV.token})
   </script>
   ```
   {{% /code-tab-content %}}
   {{< /code-tabs-wrapper >}}

After you've imported the client library, you're ready to [get started writing data with the example app](#get-started-with-the-example-app).

## Get started with the example app

The client library includes an example browser app that writes to your InfluxDB instance.

1. Clone the [influxdb-client-js](https://github.com/influxdata/influxdb-client-js) repository.

2. Navigate to the `examples` directory:

    ```js
    cd examples
    ```

3. Update `./env_browser.js` with your {{% product-name %}} region URL, your [bucket](/influxdb/cloud-serverless/admin/buckets/), an arbitrary string as `org`, and your [API token](/influxdb/cloud-serverless/admin/tokens/).

4. Run the following command to start the application at [http://localhost:3001/examples/index.html]()

    ```sh
    npm run browser
    ```

    `index.html` loads the `env_browser.js` configuration, the client library ESM modules, and the application in your browser.

For more examples, see how to [write data using the JavaScript client library for Node.js](/influxdb/cloud-serverless/reference/client-libraries/v2/javascript/nodejs/write/).
