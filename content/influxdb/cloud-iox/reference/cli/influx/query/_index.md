---
title: influx query
description: >
  The `influx query` command executes a literal Flux query provided as a string
  or a literal Flux query contained in a file by specifying the file prefixed with an '@' sign.
menu:
  influxdb_cloud_iox:
    name: influx query
    parent: influx
weight: 101
influxdb/cloud-iox/tags: [query]
related:
  - /influxdb/cloud/query-data/
  - /influxdb/cloud/query-data/execute-queries/influx-query/
  - /influxdb/cloud-iox/reference/cli/influx/#provide-required-authentication-credentials, influx CLI—Provide required authentication credentials
  - /influxdb/cloud-iox/reference/cli/influx/#provide-required-authentication-credentials, influx CLI—Provide required authentication credentials
metadata: [influx CLI 2.0.0+]
updated_in: CLI v2.0.5
---

{{% note %}}
#### Use SQL and Flux together

The `influx query` command and the InfluxDB `/api/v2/query` API endpoint it uses
only support Flux queries. To query an InfluxDB bucket powered by IOx with SQL,
Use the `iox.sql()` Flux function. For more information, see
[Use Flux and SQL to query data](/influxdb/cloud-iox/query-data/flux-sql/).
{{% /note %}}

{{< duplicate-oss >}}
