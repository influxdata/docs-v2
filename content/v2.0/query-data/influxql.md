---
title: Query data with InfluxQL
description: >
  Use the [InfluxDB 1.x `/query` compatibility endpoint](/v2.0/reference/api/influxdb-1x/query)
  to query data in InfluxDB 2.0 with **InfluxQL**.
weight: 102
v2.0/tags: [influxql, query]
menu:
  v2_0:
    name: Query with InfluxQL
    parent: Query data
products: [cloud]
related:
  - /v2.0/reference/api/influxdb-1x/
  - /v2.0/reference/api/influxdb-1x/query
  - /v2.0/reference/api/influxdb-1x/dbrp
---

Use the [InfluxDB 1.x `/query` compatibility endpoint](/v2.0/reference/api/influxdb-1x/query)
to query data in InfluxDB 2.0 with **InfluxQL**.
The [InfluxDB 1.x compatibility API](/v2.0/reference/api/influxdb-1x/) supports
all InfluxDB 1.x client libraries and integrations in InfluxDB 2.0.

Provide the following:

- InfluxDB [authentication token](/v2.0/security/tokens/)
  _(See [compatibility API authentication](/v2.0/reference/api/influxdb-1x/#authentication))_
- **db query parameter**: 1.x database to query
- **rp query parameter**: 1.x retention policy to query
- **q query parameter**: InfluxQL query

{{% note %}}
**URL-encode** the InfluxQL query to ensure it's formatted correctly when submitted to InfluxDB.
{{% /note %}}

```sh
curl -XGET http://localhost:9999/query?db=db&rp=rp \
  -H "Authorization: Token YourAuthToken" \
  --data-urlencode "q=SELECT used_percent FROM mem WHERE host=host1"
```

By default, the `/query` compatibility endpoint returns results in **JSON**.
To return results as **CSV**, include the `Accept: application/csv` header.

## Database and retention policy mapping
InfluxDB 2.0 combines the 1.x concept of [databases](https://docs.influxdata.com/influxdb/v1.8/concepts/glossary/#database)
and [retention policies](https://docs.influxdata.com/influxdb/v1.8/concepts/glossary/#retention-policy-rp)
into [buckets](/v2.0/reference/glossary/#bucket).
To support InfluxDB 1.x query and write patterns in InfluxDB 2.0, databases and retention
policies are mapped to buckets using the **database and retention policy (DBRP) mapping service**.
_See [DBRP mapping](/v2.0/reference/api/influxdb-1x/dbrp/) for more information._

## InfluxQL support
InfluxQL in InfluxDB 2.0 supports **read-only** queries.

{{< flex >}}
{{< flex-content >}}
{{% note %}}
##### Supported InfluxQL queries

- `SELECT` _(read-only)_
- `SHOW DATABASES`
- `SHOW MEASUREMENTS`
- `SHOW TAG KEYS`
- `SHOW TAG VALUES`
- `SHOW FIELD KEYS`
{{% /note %}}
{{< /flex-content >}}
{{< flex-content >}}
{{% warn %}}
##### Unsupported InfluxQL queries

- `SELECT INTO`
- `ALTER`
- `CREATE`
- `DELETE`
- `DROP`
- `GRANT`
- `KILL`
- `REVOKE`
{{% /warn %}}
{{< /flex-content >}}
{{< /flex >}}

Use the InfluxDB 2.0 UI, CLI, and API to perform the following actions:

- [Create and manage buckets](/v2.0/organizations/buckets/)
- [Manage users in InfluxDB Cloud](/v2.0/account-management/multi-user/)
- [Delete data](/v2.0/reference/cli/influx/delete/)
