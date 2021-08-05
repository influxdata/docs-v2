---
title: Install the JavaScript client library for browsers
seotitle: Install the InfluxDB JavaScript client library for web browsers
list_title:  Install the JavaScript client library for browsers
description: >
  Install the JavaScript client library for web browsers. Get started with the example app to interact with InfluxDB.
menu:
  influxdb_2_0:
    name: Install 
    identifier: client_js_browser_get_started
    parent: JavaScript (browser)
influxdb/v2.0/tags: [client libraries, JavaScript]
weight: 200
aliases:
  - /influxdb/v2.0/reference/api/client-libraries/browserjs/
---

Install and get started with the JavaScript client library in web browsers, Deno, and UMD module loaders.

This guide presumes some familiarity with JavaScript, browser environments, and InfluxDB.
If you're just getting started with InfluxDB, see [Get started with InfluxDB](/influxdb/v2.0/get-started/).

* [Before you begin](#before-you-begin)
* [Install the client library](#install-the-client-library)
* [Get started with the example app](#get-started-with-the-example-app)

## Before you begin

1. Install [NodeJS](https://nodejs.org/en/download/package-manager/).

2. Ensure that InfluxDB is running and you can connect to it.
   For information about what URL to use to connect to InfluxDB OSS or InfluxDB Cloud, see [InfluxDB URLs](/influxdb/v3.0/reference/urls/).

## Install the client library

{{% note %}}
{{% api/v2dot0/browserjs/install %}}
{{% /note %}}

Clone the [influxdb-client-js](https://github.com/influxdata/influxdb-client-js) repo.

## Get started with the example app

This library includes an example browser app that queries from and writes to your InfluxDB instance. `index.html` loads
`env_browser.js` and the client library module @influxdata/influxdb-client-browser in the browser. 

1. Navigate to the `examples` directory:
    ```js
    cd examples
    ```

3. Install dependencies with `yarn` or `npm`:
    ```js
    yarn install
    npm install
    ```

5. Update `./env_browser.js` with your InfluxDB [url](/influxdb/v2.0/reference/urls/), [bucket](/influxdb/v2.0/organizations/buckets/), [organization](/influxdb/v2.0/organizations/), and [token](/influxdb/v2.0/security/tokens/)

  {{% warn %}}
  #### Tokens in production applications
  {{% api/browser-token-warning %}}
  {{% /warn %}}

6. Run the following command to start the application at [http://localhost:3001/examples/index.html]()
    ```sh
    npm run browser
    ```
