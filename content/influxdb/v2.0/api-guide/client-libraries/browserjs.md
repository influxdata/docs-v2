---
title: Get started with the JavaScript client library for web browsers
seotitle: Get started with the InfluxDB JavaScript client library for web browsers
list_title: JavaScript for browsers
description: >
  Use the JavaScript client library example app to interact with the InfluxDB API in web browsers.
menu:
  influxdb_2_0:
    name: JavaScript for browsers
    identifier: client_js_browsers
    parent: Client libraries
    influxdb/v2.0/tags: [client libraries, JavaScript]
weight: 201
aliases:
  - /influxdb/v2.0/reference/api/client-libraries/browserjs/
  - /influxdb/v2.0/api-guide/client-libraries/browserjs/write
  - /influxdb/v2.0/api-guide/client-libraries/browserjs/query
related:
  - /influxdb/v2.0/api-guide/client-libraries/nodejs/write/
  - /influxdb/v2.0/api-guide/client-libraries/nodejs/query/
---

Use the [InfluxDB JavaScript client library](https://github.com/influxdata/influxdb-client-js) to interact with the InfluxDB API in browsers and front-end clients. This library supports both front-end and server-side environments and provides the following distributions:
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
* [Use bundled distributions with browsers and module loaders 
](#use-bundled-distributions-with-browsers-and-module-loaders)
* [Get started with the example app](#get-started-with-the-example-app)

## Before you begin

1. Install [Node.js](https://nodejs.org/en/download/package-manager/) to serve your front-end app.

2. Ensure that InfluxDB is running and you can connect to it.
   For information about what URL to use to connect to InfluxDB OSS or InfluxDB Cloud, see [InfluxDB URLs](/{{% latest "influxdb" %}}/reference/urls/).

## Use with module bundlers

If you use a module bundler like Webpack or Parcel, install `@influxdata/influxdb-client`. For more information and examples, see [Node.js](/{{% latest "influxdb" %}}/api-guide/client-libraries/nodejs/).  

## Use bundled distributions with browsers and module loaders 

1. Configure InfluxDB properties for your script.

   ```html
   <script>
     window.INFLUX_ENV = {
       url: 'http://localhost:8086',
       token: 'YOUR_AUTH_TOKEN'
     }
   </script>
   ```

2. Import modules from the latest client library browser distribution.
If you need bundled ESM for modern browsers and clients, use the `@influxdata/influxdb-client` browser distribution.
If you need UMD compatibility for browsers and module loaders, use `@influxdata/influxdb-client-browser`.

   {{< code-tabs-wrapper >}}
   {{% code-tabs %}}
   [ESM](#import-esm)
   [UMD](#import-umd)
   {{% /code-tabs %}}
   {{% code-tab-content %}}
   ```html
   <script type="module">
     import {InfluxDB, Point} from 'https://unpkg.com/@influxdata/influxdb-client/dist/index.browser.mjs'

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

After you've imported the client library, you're ready to [write data](/{{% latest "influxdb" %}}/api-guide/client-libraries/nodejs/write/?t=nodejs) to InfluxDB.

## Get started with the example app

This library includes an example browser app that queries from and writes to your InfluxDB instance.

1. Clone the [influxdb-client-js](https://github.com/influxdata/influxdb-client-js) repo.

2. Navigate to the `examples` directory:
    ```js
    cd examples
    ```

3. Update `./env_browser.js` with your InfluxDB [url](/{{% latest "influxdb" %}}/reference/urls/), [bucket](/{{% latest "influxdb" %}}/organizations/buckets/), [organization](/{{% latest "influxdb" %}}/organizations/), and [token](/{{% latest "influxdb" %}}/security/tokens/)

4. Run the following command to start the application at [http://localhost:3001/examples/index.html]()

    ```sh
    npm run browser
    ```

    `index.html` loads the `env_browser.js` configuration, the client library ESM modules, and the application in your browser.

