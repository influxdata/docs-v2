---
title: InfluxDB HTTP API
description: >
  The InfluxDB HTTP API provides a programmatic interface for interactions with InfluxDB, such as writing and querying data,
  and managing resources within an InfluxDB instance.
  Access the InfluxDB API using the `/api/v2/` or InfluxDB v1 endpoints.
menu:
  influxdb_v2:
    parent: Reference
    name: InfluxDB HTTP API
weight: 3
influxdb/v2/tags: [api]
aliases:
  - /influxdb/v2/concepts/api/
---

The InfluxDB HTTP API provides a programmatic interface for interactions such as writing and querying data, and managing resources in {{% product-name %}}.

Access the InfluxDB HTTP API using the `/api/v2/` endpoint or InfluxDB v1 endpoints
for {{% product-name %}}

## InfluxDB v2 API documentation

<a class="btn" href="/influxdb/v2/api/">InfluxDB {{< current-version >}} API</a>

{{% oss-only %}}

#### View InfluxDB API documentation locally

InfluxDB API documentation is built into the `influxd` service and represents
the API specific to your version of InfluxDB.
To view the API documentation locally, [start InfluxDB](/influxdb/v2/get-started/#start-influxdb)
and visit the `/docs` endpoint in a browser ([localhost:8086/docs](http://localhost:8086/docs)).

{{% /oss-only %}}

## InfluxDB v1 Compatibility API reference documentation

<a class="btn" href="/influxdb/v2/api/v1-compatibility/">InfluxDB v1 API for {{% product-name %}}</a>

The InfluxDB HTTP API includes [InfluxDB v1 compatibility endpoints](/influxdb/v2/reference/api/influxdb-1x/)
that work with InfluxDB 1.x client libraries and third-party integrations like
[Grafana](https://grafana.com) and others.
