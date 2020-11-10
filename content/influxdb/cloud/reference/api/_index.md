---
title: InfluxDB v2 API
description: >
  The InfluxDB v2 API provides a programmatic interface for interactions with InfluxDB.
  Access the InfluxDB API using the `/api/v2/` endpoint.
menu: influxdb_cloud_ref
weight: 3
influxdb/cloud/tags: [api]
---

The InfluxDB v2 API provides a programmatic interface for interactions with InfluxDB.
Access the InfluxDB API using the `/api/v2/` endpoint.

## Authentication
InfluxDB uses [authentication tokens](/influxdb/cloud/security/tokens/) to authorize API requests.
Include your authentication token as an `Authorization` header in each request.

```sh
curl --request POST https://cloud2.influxdata.com/api/v2/write \
  --header "Authorization: Token YOURAUTHTOKEN" \
  --data-urlencode "org=myorg" \
  --data-urlencode "bucket=example-bucket"
```

## InfluxDB v2 API Documentation
<a class="btn" href="/influxdb/cloud/api/">InfluxDB OSS 2.0 API documentation</a>

## InfluxDB v1 compatibility API documentation
The InfluxDB v2 API includes [InfluxDB 1.x compatibility endpoints](/influxdb/cloud/reference/api/influxdb-1x/)
that work with InfluxDB 1.x client libraries and third-party integrations like
[Grafana](https://grafana.com) and others.

<a class="btn" href="/influxdb/cloud/api/v1-compatibility/">View full v1 compatibility API documentation</a>

## InfluxDB client libraries
InfluxDB client libraries are language-specific packages that integrate with the InfluxDB v2 API.
For information about supported client libraries, see [InfluxDB client libraries](/influxdb/cloud/tools/client-libraries/).
