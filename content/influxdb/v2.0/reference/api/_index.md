---
title: InfluxDB v2 API
description: >
  The InfluxDB v2 API provides a programmatic interface for interactions with InfluxDB.
  Access the InfluxDB API using the `/api/v2/` endpoint.
menu: influxdb_2_0_ref
weight: 3
influxdb/v2.0/tags: [api]
---

The InfluxDB v2 API provides a programmatic interface for interactions with InfluxDB.
Access the InfluxDB API using the `/api/v2/` endpoint.

## Authentication
InfluxDB uses [authentication tokens](/influxdb/v2.0/security/tokens/) to authorize API requests.
Include your authentication token as an `Authorization` header in each request.

```sh
curl --request POST \
  http://localhost:8086/api/v2/write?org=my-org&bucket=example-bucket \
  --header "Authorization: Token YOURAUTHTOKEN"
```

## View InfluxDB v2 API Documentation
<a class="btn" href="/v2.0/api/">InfluxDB v2.0 API documentation</a>

### View InfluxDB API documentation locally
InfluxDB API documentation is built into the `influxd` service and represents
the API specific to the current version of InfluxDB.
To view the API documentation locally, [start InfluxDB](/influxdb/v2.0/get-started/#start-influxdb)
and visit the `/docs` endpoint in a browser ([localhost:8086/docs](http://localhost:8086/docs)).

## InfluxDB client libraries
InfluxDB client libraries are language-specific packages that integrate with the InfluxDB v2 API.
For information about supported client libraries, see [InfluxDB client libraries](/influxdb/v2.0/tools/client-libraries/).
