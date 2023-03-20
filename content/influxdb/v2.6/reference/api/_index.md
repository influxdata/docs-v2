---
title: InfluxDB v2 API
description: >
  The InfluxDB v2 API provides a programmatic interface for interactions with InfluxDB.
  Access the InfluxDB API using the `/api/v2/` endpoint.
menu: influxdb_2_6_ref
weight: 3
influxdb/v2.6/tags: [api]
aliases:
  - /influxdb/v2.6/concepts/api/
related:
  - /influxdb/v2.6/api-guide/
---

The InfluxDB v2 API provides a programmatic interface for interactions with InfluxDB.
Access the InfluxDB API using the `/api/v2/` endpoint.

{{% oss-only %}}

## InfluxDB v2 API documentation
<a class="btn" href="/influxdb/v2.6/api/">InfluxDB OSS {{< current-version >}} API documentation</a>

#### View InfluxDB API documentation locally
InfluxDB API documentation is built into the `influxd` service and represents
the API specific to the current version of InfluxDB.
To view the API documentation locally, [start InfluxDB](/influxdb/v2.6/get-started/#start-influxdb)
and visit the `/docs` endpoint in a browser ([localhost:8086/docs](http://localhost:8086/docs)).

{{% /oss-only %}}

{{% cloud-only %}}

## InfluxDB v2 API documentation
<a class="btn" href="/influxdb/cloud/api/">InfluxDB {{< current-version >}} API documentation</a>

{{% /cloud-only %}}

## InfluxDB v1 compatibility API documentation
The InfluxDB v2 API includes [InfluxDB 1.x compatibility endpoints](/influxdb/v2.6/reference/api/influxdb-1x/)
that work with InfluxDB 1.x client libraries and third-party integrations like
[Grafana](https://grafana.com) and others.

<a class="btn" href="/influxdb/v2.6/api/v1-compatibility/">View full v1 compatibility API documentation</a>
