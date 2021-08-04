---
title: Get started with the JavaScript client library for web browsers
seotitle: InfluxDB JavaScript client library for web browsers
list_title: JavaScript (browser)
description: >
  Use the JavaScript client library for web browsers to interact with InfluxDB.
menu:
  influxdb_2_0:
    name: Javascript (Browser)
    parent: Client libraries
influxdb/v2.0/tags: [client libraries, JavaScript]
weight: 201
aliases:
  - /influxdb/v2.0/reference/api/client-libraries/browserjs/
---

The InfluxDB Javascript client library includes a working example browser app that queries from and writes to
your InfluxDB instance.

This guide presumes some familiarity with JavaScript, browser environments, and InfluxDB.
If you're just getting started with InfluxDB, see [Get started with InfluxDB](/influxdb/v2.0/get-started/).

* [Before you begin](#before-you-begin)
* [Install the examples](#install-the-examples)
* [Configure and start your app](#configure-and-start-your-app)

## Before you begin

1. Install [NodeJS](https://nodejs.org/en/download/package-manager/).

2. Ensure that InfluxDB is running and you can connect to it.
   For information about what URL to use to connect to InfluxDB OSS or InfluxDB Cloud, see [InfluxDB URLs](/i
nfluxdb/v2.0/reference/urls/).

## Install the examples
1. Clone the [examples directory](https://github.com/influxdata/influxdb-client-js/tree/master/examples) in the [influxdb-client-js](https://github.com/influxdata/influxdb-client-js) repo.
2. Navigate to the `examples` directory:
    ```js
    cd examples
    ```

3. Install `yarn` or `npm` dependencies as needed:
    ```js
    yarn install
    npm install
    ```

## Configure and start your app
  {{% warn %}}
  #### Tokens in production applications
  {{% api/browser-token-warning %}}
  {{% /warn %}}

The client examples include an [`env`](https://github.com/influxdata/influxdb-client-js/blob/master/examples/env.js) module for conveniently accessing environment variables.

1. Update `./env` with your InfluxDB [url](/influxdb/v2.0/reference/urls/).

2. Update `./env_browser.js` with the name of your InfluxDB [bucket](/influxdb/v2.0/organizations/buckets/), [organization](/influxdb/v2.0/organizations/), and [token](/influxdb/v2.0/security/tokens/)

3. Run the following command to start the application at [http://localhost:3001/examples/index.html]()
    ```sh
    npm run browser
    ```
