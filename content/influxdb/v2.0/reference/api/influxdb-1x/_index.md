---
title: InfluxDB 1.x compatibility API
description: >
  The InfluxDB v2 API includes InfluxDB 1.x compatibility endpoints that work with
  InfluxDB 1.x client libraries and third-party integrations like [Grafana](https://grafana.com) and others.
menu:
  influxdb_2_0_ref:
    name: 1.x compatibility
    parent: InfluxDB v2 API
weight: 104
influxdb/v2.0/tags: [influxql, query, write]
related:
  - /influxdb/v2.0/query-data/influxql
  - /influxdb/v2.0/upgrade/v1-to-v2/
---

The InfluxDB v2 API includes InfluxDB 1.x compatibility endpoints that work with
InfluxDB 1.x client libraries and third-party integrations like [Grafana](https://grafana.com) and others.

<a class="btn" href="/influxdb/v2.0/api/v1-compatibility/">View full v1 compatibility API documentation</a>

## Authentication
InfluxDB 2.0 requires all query and write requests to be authenticated.
Use **1.x-compatible authorizations** or **token authentication** to authenticate
requests to InfluxDB 1.x compatibility endpoints.

### 1.x-compatible authorizations
1.x-compatible authorizations include the following credentials:

- **username**: InfluxDB username
- **password**: InfluxDB [authentication token](/influxdb/v2.0/security/tokens/)

For information about creating and managing 1.x-compatible authorizations, see:

- [influx v1 auth](/influxdb/v2.0/reference/cli/influx/v1/auth/)
- [Manually upgrade – 1.x-compatible authorizations](/influxdb/v2.0/upgrade/v1-to-v2/manual-upgrade/#1x-compatible-authorizations)

There are multiple ways to provide 1.x-compatible authorization credentials to InfluxDB 2.0.
The example below uses the `Authorization` header with the `Basic` scheme to
provide the required 1.x-compatible username and password:

##### Basic authentication with authorization header
```sh
# Header syntax
Authorization: Basic <username>:<password>

# Header example
Authorization: Basic admin:mYSuP3rs3cREtT0k3N
```

### Token Authentication
Token authentication requires the following credential:

- **token**: InfluxDB [authentication token](/influxdb/v2.0/security/tokens/)

Use the `Authorization` header with the `Token` scheme to provide your
authentication token to InfluxDB.

##### Token authentication with authorization header
```sh
# Header syntax
Authorization: Token <token>

# Header example
Authorization: Token mYSuP3rs3cREtT0k3N
```

##### InfluxQL support

The compatibility API supports InfluxQL, with the following caveats:

- The `INTO` clause (e.g. `SELECT ... INTO ...`) is not supported.
- With the exception of [`DELETE`](/influxdb/v1.8/query_language/manage-database/#delete-series-with-delete) and
  [`DROP MEASUREMENT`](/influxdb/v1.8/query_language/manage-database/#delete-measurements-with-drop-measurement) queries, which are still allowed,
  InfluxQL database management commands are not supported.

## Compatibility endpoints

{{< children readmore=true >}}
