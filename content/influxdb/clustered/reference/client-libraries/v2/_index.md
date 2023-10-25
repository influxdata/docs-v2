---
title: InfluxDB v2 API client libraries
description: >
  InfluxDB v2 client libraries use InfluxDB `/api/v2` endpoints and work with [InfluxDB 2.0 API compatibility endpoints](/influxdb/v1/tools/api/#influxdb-20-api-compatibility-endpoints).
  View the list of available client libraries.
weight: 101
menu:
  influxdb_clustered:
    name: v2 client libraries
    parent: Client libraries
influxdb/clustered/tags: [client libraries, API, developer tools]
---

## Client libraries for InfluxDB 2.x and 1.8+

InfluxDB client libraries are language-specific tools that integrate with InfluxDB APIs.
InfluxDB v2 client libraries use InfluxDB `/api/v2` endpoints and work with [InfluxDB 2.0 API compatibility endpoints](/influxdb/v1/tools/api/#influxdb-20-api-compatibility-endpoints).

Functionality varies among client libraries.
InfluxDB client libraries are maintained by the InfluxDB community.
For specifics about a client library, see the library's GitHub repository.

{{% note %}}
### Tools to execute queries

InfluxDB v2 client libraries use the InfluxDB API `/api/v2/query` endpoint.
This endpoint can't query an {{% product-name omit=" Clustered" %}} cluster.

{{% product-name %}} supports many different tools for querying data, including:

- [`influx3` data CLI](https://github.com/InfluxCommunity/influxdb3-python-cli)
- [InfluxDB v3 client libraries](/influxdb/clustered/reference/client-libraries/v3/)
- [Flight clients](/influxdb/clustered/reference/client-libraries/flight-sql/)
- [Superset](/influxdb/clustered/query-data/sql/execute-queries/superset/)
- [Grafana](/influxdb/clustered/query-data/sql/execute-queries/grafana/)
- [InfluxQL with InfluxDB v1 HTTP API](/influxdb/clustered/primers/api/v1/#query-using-the-v1-api)
- [Chronograf](/chronograf/v1/)

{{% /note %}}

{{% warn %}}

#### /api/v2/query not supported

The InfluxDB API `/api/v2/query` endpoint can't query an {{% product-name omit=" Clustered" %}} cluster.
The `/api/v2/query` API endpoint and associated tooling, such as the `influx` CLI and InfluxDB v2 client libraries, **aren’t** supported in {{% product-name %}}.

{{% /warn %}}

{{< children type="list" depth="999" >}}
