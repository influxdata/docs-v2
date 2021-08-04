---
title: JavaScript client library for web browsers
seotitle: InfluxDB JavaScript client library for browsers
list_title: JavaScript (browser) 
description: >
  Use the JavaScript client library for web browsers to interact with InfluxDB.
menu:
  influxdb_2_0:
    name: JavaScript (browser) 
    parent: Client libraries
influxdb/v2.0/tags: [client libraries, JavaScript]
weight: 201
aliases:
  - /influxdb/v2.0/reference/api/client-libraries/nodejs/
  - /influxdb/v2.0/reference/api/client-libraries/js/  
---

Use the [InfluxDB JavaScript client library](https://github.com/influxdata/influxdb-client-js) to integrate InfluxDB into JavaScript scripts and applications. 
In this guide, you'll start a Node.js project from scratch and build interactions between the browser and the InfluxDB API.

{{% note %}}
This library supports browser and server-side (Node.js) Javascript environments.

If you target browser or [Deno](https://deno.land/) environments, use @influxdata/influxdb-client-browser. It is UMD-compatible for use with module loaders.

If you target Node.js server-side environments, use the @influxdata/influxdb-client module.
See [Node.js](/influxdb/v2.0/api-guide/client-libraries/nodejs) for more information.
{{% /note %}}

{{< children >}}

{{% api/v2dot0/nodejs/learn-more %}}
