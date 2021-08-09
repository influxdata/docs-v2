---
title: Get started with the JavaScript client library for browsers
seotitle: Get started with the InfluxDB JavaScript client library for browsers
list_title: Browser and client-side applications 
description: >
  Use the JavaScript client library example app to interact with the InfluxDB API in a web browser.
menu:
  influxdb_2_0:
    name: Browser & client-side applications
    identifier: client_js_browser_get_started
    parent: Node.js 
    influxdb/v2.0/tags: [client libraries, JavaScript]
weight: 210
aliases:
  - /influxdb/v2.0/reference/api/client-libraries/browserjs/
  - /influxdb/v2.0/api-guide/client-libraries/browserjs/
  - /influxdb/v2.0/api-guide/client-libraries/browserjs/write
  - /influxdb/v2.0/api-guide/client-libraries/browserjs/query
related:
  - /influxdb/v2.0/api-guide/client-libraries/nodejs/write/ 
  - /influxdb/v2.0/api-guide/client-libraries/nodejs/query/ 
---

Use the JavaScript client library example to interact with the InfluxDB API in a web browser.

{{% note %}}
{{% api/v2dot0/nodejs/modules %}}
{{% /note %}}

This guide presumes some familiarity with JavaScript, browser environments, and InfluxDB.
If you're just getting started with InfluxDB, see [Get started with InfluxDB](/influxdb/v2.0/get-started/).

* [Before you begin](#before-you-begin)
* [Import the client library](#import-the-client-library)
* [Get started with the example app](#get-started-with-the-example-app)

## Before you begin

1. Install [Node.js](https://nodejs.org/en/download/package-manager/). Node.js provides a web server to run your app.

2. Ensure that InfluxDB is running and you can connect to it.
   For information about what URL to use to connect to InfluxDB OSS or InfluxDB Cloud, see [InfluxDB URLs](/influxdb/v2.0/reference/urls/).

## Import the client library

Add `@influxdata/influxdb-client` to your module build or reference it in an HTML `script` tag.

  {{< code-tabs-wrapper >}}
  {{% code-tabs %}}
   [import ESM](#module-import)
   [script ESM](#module-script)
  {{% /code-tabs %}}
  {{% code-tab-content %}}
  ```js
    import {InfluxDB, Point} from '@influxdata/influxdb-client'
  ```
  {{% /code-tab-content %}}
  {{% code-tab-content %}}
  ```html
  <script type="module">
    /** Import latest release from npm repository. **/ 
    import {InfluxDB, Point} from "https://unpkg.com/@influxdata/influxdb-client/dist/index.browser.mjs"
    /** Add your module code here. **/
  </script>
  ```
  {{% /code-tab-content %}}
  {{< /code-tabs-wrapper >}}

After you've imported the client library, you're ready to [write data](/{{< latest "influxdb" >}}/api-guide/client-libraries/nodejs/write/) to InfluxDB.

## Get started with the example app

This library includes an example browser app that queries from and writes to your InfluxDB instance.

1. Clone the [influxdb-client-js](https://github.com/influxdata/influxdb-client-js) repo.

2. Navigate to the `examples` directory:
    ```js
    cd examples
    ```

3. Update `./env_browser.js` with your InfluxDB [url](/influxdb/v2.0/reference/urls/), [bucket](/influxdb/v2.0/organizations/buckets/), [organization](/influxdb/v2.0/organizations/), and [token](/influxdb/v2.0/security/tokens/)

   {{% warn %}}
   ### Tokens in production applications
   {{% api/browser-token-warning %}}
   {{% /warn %}}

4. Run the following command to start the application at [http://localhost:3001/examples/index.html]()

    ```sh
    npm run browser
    ```

    `index.html` loads the `env_browser.js` configuration, the client library ESM modules, and the application in the browser.

