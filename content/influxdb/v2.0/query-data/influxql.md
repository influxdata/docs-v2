---
title: Query data with InfluxQL
description: >
  Use the [InfluxDB 1.x `/query` compatibility endpoint](/influxdb/v2.0/reference/api/influxdb-1x/query)
  to query data in InfluxDB 2.0 with **InfluxQL**.
weight: 102
influxdb/v2.0/tags: [influxql, query]
menu:
  influxdb_2_0:
    name: Query with InfluxQL
    parent: Query data
products: [cloud]
related:
  - /influxdb/v2.0/reference/api/influxdb-1x/
  - /influxdb/v2.0/reference/api/influxdb-1x/query
  - /influxdb/v2.0/reference/api/influxdb-1x/dbrp
---

Use the [InfluxDB 1.x `/query` compatibility endpoint](/influxdb/v2.0/reference/api/influxdb-1x/query)
to query data in InfluxDB 2.0 with **InfluxQL**.
The [InfluxDB 1.x compatibility API](/influxdb/v2.0/reference/api/influxdb-1x/) supports
all InfluxDB 1.x client libraries and integrations in InfluxDB 2.0.

Provide the following:

- InfluxDB [authentication token](/influxdb/v2.0/security/tokens/)
  _(See [compatibility API authentication](/influxdb/v2.0/reference/api/influxdb-1x/#authentication))_
- **db query parameter**: 1.x database to query
- **rp query parameter**: 1.x retention policy to query
- **q query parameter**: InfluxQL query

{{% note %}}
**URL-encode** the InfluxQL query to ensure it's formatted correctly when submitted to InfluxDB.
{{% /note %}}

```sh
curl -G https://cloud2.influxdata.com/query?db=db&rp=rp \
  -H "Authorization: Token YourAuthToken" \
  --data-urlencode "q=SELECT used_percent FROM mem WHERE host=host1"
```

By default, the `/query` compatibility endpoint returns results in **JSON**.
To return results as **CSV**, include the `Accept: application/csv` header.

## Map a bucket to a database and retention policy

If you have an existing bucket that does't follow the **database/retention-policy**
naming convention, you **must** manually create a database and retention policy
mapping to query that bucket with the `/query` compatibility API.
Use the using the [`/api/v2/dbrps` API endpoint](/influxdb/v2.0/api/#tag/DBRPs) to
manually create and manage DBRP mappings.

**To manually create a DBRP mapping, provide the following:**

- authentication token
- organization name or ID (organization or organization_id)
- target bucket ID (bucket_id)
- database to map
- retention policy to map

<!--  -->
```sh
curl -XPOST https://cloud2.influxdata.com/api/v2/dbrps \
  -H "Authorization: Token YourAuthToken" \
  -H 'Content-type: application/json' \
  -d '{
        "organization": "example-org",
        "bucket_id": "12ab34cd56ef",
        "database": "example-db",
        "retention_policy": "example-rp",
        "default": true
      }'
```

_For more information, see the [`/api/v2/dbrps` endpoint documentation](/influxdb/v2.0/api/#tag/DBRPs)._


InfluxDB 2.0 combines the 1.x concept of [databases](/influxdb/v1.8/concepts/glossary/#database)
and [retention policies](/influxdb/v1.8/concepts/glossary/#retention-policy-rp)
into [buckets](/influxdb/v2.0/reference/glossary/#bucket).
To support InfluxDB 1.x query and write patterns in InfluxDB 2.0, databases and retention
policies are mapped to buckets using the **database and retention policy (DBRP) mapping service**.
_See [DBRP mapping](/influxdb/v2.0/reference/api/influxdb-1x/dbrp/) for more information._

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

- [Create and manage buckets](/influxdb/v2.0/organizations/buckets/)
- [Manage users in InfluxDB Cloud](/influxdb/v2.0/account-management/multi-user/)
- [Delete data](/influxdb/v2.0/reference/cli/influx/delete/)
