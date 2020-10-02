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

In 1.x, data is stored in databases and retention policies. In 2.0, data is stored in buckets. To query a bucket with InfluxQL, the bucket must be mapped to a database and retention policy.

{{% note %}}
If data is written into InfluxDB 2.0 using the /write 1.x compatibility API, buckets were mapped automatically, so you can skip steps 1-2. For more information, see [Database and retention policy mapping service] (influxdb/v2.0/reference/api/influxdb-1x/dbrp/).
{{% /note %}}

## Verify 2.0 buckets have a mapping

1. Verify the buckets that you want to query are mapped to a database and retention policy using the [`GET DBRPs` CURL command](/influxdb/v2.0/api/#operation/GetDBRPs). Note that `orgID` is the only required parameter.:

```sh
curl -XPOST https://cloud2.influxdata.com/api/v2/dbrps \
  -H "Authorization: Token YourAuthToken" \
  -H 'Content-type: application/json' \
  -d '{
       "bucketID": "12ab34cd56ef",
       "database": "example-db",
       "default": true
       "org": "example-org",
       "orgID": "example-org",
       "retention_policy": "example-rp",
     }'
     ```

2. To map unmapped buckets to a database and retention policy, use the [`/api/v2/dbrps` API endpoint](/influxdb/v2.0/api/#tag/DBRPs). Provide the following:
- authentication token
- organization name or ID (organization or organization_id)
- target bucket ID (bucket_id)
- database to map
- retention policy to map

All parameters except `default` are required.


```sh
curl -XPOST https://cloud2.influxdata.com/api/v2/dbrps \
  -H "Authorization: Token YourAuthToken" \
  -H 'Content-type: application/json' \
  -d '{
       "bucketID": "12ab34cd56ef",
       "database": "example-db",
       "default": true
       "org": "example-org",
       "orgID": "example-org",
       "retention_policy": "example-rp",
      }'
```


After you've verified your 2.0 buckets are mapped, query a mapped bucket as described in the section below.

## Use the 1.x `/query` endpoint to query data with InfluxQL

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
