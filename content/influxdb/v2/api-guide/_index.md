---
title: Develop with the InfluxDB API
seotitle: Use the InfluxDB API
description: Interact with InfluxDB using a rich API for writing and querying data and more.
weight: 4
menu:
  influxdb_v2:
    name: Develop with the API
influxdb/v2/tags: [api]
---

The InfluxDB v2 API provides a programmatic interface for interactions with InfluxDB.
Access the InfluxDB API using the `/api/v2/` endpoint.

## Developer guides

- [API Quick Start](/influxdb/v2/api-guide/api_intro/)

## InfluxDB client libraries

InfluxDB client libraries are language-specific packages that integrate with the InfluxDB v2 API.
For tutorials and information about client libraries, see [InfluxDB client libraries](/influxdb/v2/api-guide/client-libraries/).

## InfluxDB v2 API documentation

<a class="btn" href="/influxdb/v2/api/">InfluxDB OSS {{< current-version >}} API documentation</a>

### View InfluxDB API documentation locally

InfluxDB API documentation is built into the `influxd` service and represents
the API specific to the current version of InfluxDB.
To view the API documentation locally, [start InfluxDB](/influxdb/v2/get-started/#start-influxdb)
and visit the `/docs` endpoint in a browser ([localhost:8086/docs](http://localhost:8086/docs)).

## InfluxDB v1 compatibility API documentation

The InfluxDB v2 API includes [InfluxDB v1 compatibility endpoints and authentication](/influxdb/v2/api-guide/influxdb-1x/)
that work with InfluxDB 1.x client libraries and third-party integrations like
[Grafana](https://grafana.com) and others.

<a class="btn" href="/influxdb/v2/api/v2/#tag/Compatibility-endpoints">View full v1 compatibility API documentation</a>
