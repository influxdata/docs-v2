---
title: Develop with the InfluxDB API
seotitle: Use the InfluxDB API
description: Interact with InfluxDB 2.0 using a rich API for writing and querying data and more.
weight: 4
menu:
  influxdb_2_0:
    name: Develop with the API
influxdb/v2.0/tags: [api]
---

The InfluxDB v2 API provides a programmatic interface for interactions with InfluxDB.
Access the InfluxDB API using the `/api/v2/` endpoint.

## InfluxDB client libraries
InfluxDB client libraries are language-specific packages that integrate with the InfluxDB v2 API.
For information about supported client libraries, see [InfluxDB client libraries](/{{< latest "influxdb" >}}/api-guide/client-libraries/).

## InfluxDB v2 API documentation
<a class="btn" href="/influxdb/v2.0/api/">InfluxDB OSS 2.0 API documentation</a>

#### View InfluxDB API documentation locally
InfluxDB API documentation is built into the `influxd` service and represents
the API specific to the current version of InfluxDB.
To view the API documentation locally, [start InfluxDB](/influxdb/v2.0/get-started/#start-influxdb)
and visit the `/docs` endpoint in a browser ([localhost:8086/docs](http://localhost:8086/docs)).

## InfluxDB v1 compatibility API documentation
The InfluxDB v2 API includes [InfluxDB 1.x compatibility endpoints](/influxdb/v2.0/reference/api/influxdb-1x/)
that work with InfluxDB 1.x client libraries and third-party integrations like
[Grafana](https://grafana.com) and others.

<a class="btn" href="/influxdb/v2.0/api/v1-compatibility/">View full v1 compatibility API documentation</a>
