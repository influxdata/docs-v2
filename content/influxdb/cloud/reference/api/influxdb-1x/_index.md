---
title: InfluxDB 1.x compatibility API
description: >
  The InfluxDB v2 API includes InfluxDB 1.x compatibility endpoints that work with
  InfluxDB 1.x client libraries and third-party integrations like [Grafana](https://grafana.com) and others.
menu:
  influxdb_cloud_ref:
    name: 1.x compatibility
    parent: InfluxDB v2 API
weight: 104
influxdb/cloud/tags: [influxql, query, write]
products: [cloud]
related:
  - /influxdb/cloud/query-data/influxql
---

The InfluxDB v2 API includes InfluxDB 1.x compatibility `/write` and `/query`
endpoints that work with InfluxDB 1.x client libraries and third-party integrations
like [Grafana](https://grafana.com) and others.

<a class="btn" href="/influxdb/cloud/api/v1-compatibility/">View full v1 compatibility API documentation</a>

## Authentication
InfluxDB Cloud all query and write requests to be authenticated using
[InfluxDB authentication tokens](/influxdb/cloud/security/tokens/).
Use the following authenication methods:

- [Token authentication](#token-authentication)
- [Basic authentication](#basic-authentication)

### Token authentication
Token authentication requires the following credential:

- **token**: InfluxDB [authentication token](/influxdb/cloud/security/tokens/)

Use the `Authorization` header with the `Token` scheme to provide your
authentication token to InfluxDB.

##### Token authentication with authorization header
```sh
# Header syntax
Authorization: Token <token>

# Header example
Authorization: Token mYSuP3rs3cREtT0k3N
```

### Basic authentication
Basic authentication requires the following credentials:

- **username**: arbitrary username
- **password**: InfluxDB [authentication token](/influxdb/cloud/security/tokens/)

```sh
# --user syntax
<username>:<password>
```

## InfluxQL support

The compatibility API supports InfluxQL, with the following caveats:

- The `INTO` clause (e.g. `SELECT ... INTO ...`) is not supported.
- With the exception of [`DELETE`](/{{< latest "influxdb" "v1" >}}/query_language/manage-database/#delete-series-with-delete) and
  [`DROP MEASUREMENT`](/{{< latest "influxdb" "v1" >}}/query_language/manage-database/#delete-measurements-with-drop-measurement) queries, which are still allowed,
  InfluxQL database management commands are not supported.

## Compatibility endpoints

{{< children readmore=true >}}
