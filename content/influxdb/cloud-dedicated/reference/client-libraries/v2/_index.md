---
title: InfluxDB v2 API client libraries
description: >
  InfluxDB v2 client libraries use InfluxDB `/api/v2` endpoints and work with [InfluxDB 2.0 API compatibility endpoints](/{{< latest "influxdb" "v1" >}}/tools/api/#influxdb-20-api-compatibility-endpoints).
  View the list of available client libraries.
weight: 101
menu:
  influxdb_cloud_dedicated:
    name: v2 client libraries
    parent: Client libraries
influxdb/cloud-dedicated/tags: [client libraries, API, developer tools]
---

## Client libraries for InfluxDB 2.x and 1.8+

InfluxDB client libraries are language-specific tools that integrate with InfluxDB APIs.
InfluxDB v2 client libraries use InfluxDB `/api/v2` endpoints and work with [InfluxDB 2.0 API compatibility endpoints](/{{< latest "influxdb" "v1" >}}/tools/api/#influxdb-20-api-compatibility-endpoints).

Functionality varies among client libraries.
InfluxDB client libraries are maintained by the InfluxDB community.
For specifics about a client library, see the library's GitHub repository.

{{% note %}}
### Tools to execute queries

InfluxDB v2 client libraries use the InfluxDB API `/api/v2/query` endpoint.
This endpoint can't query an {{% product-name omit=" Clustered" %}} cluster.

{{% product-name %}} supports many different tools for querying data, including:

- [InfluxDB v3 client libraries](/influxdb/cloud-dedicated/reference/client-libraries/v3/)
- [Flight clients](/influxdb/cloud-dedicated/reference/client-libraries/flight-sql/)
- [Superset](/influxdb/cloud-dedicated/query-data/sql/execute-queries/superset/)
- [Grafana](/influxdb/cloud-dedicated/query-data/sql/execute-queries/grafana/)
- [InfluxQL with InfluxDB v1 HTTP API](/influxdb/cloud-dedicated/primers/api/v1/#query-using-the-v1-api)
- [Chronograf](/{{< latest "Chronograf" >}}/)

{{% /note %}}


{{< children type="list" depth="999" >}}
