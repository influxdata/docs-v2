---
title: Query data with InfluxQL
description: >
  Use the [InfluxDB 1.x `/query` compatibility endpoint](/influxdb/v2.0/reference/api/influxdb-1x/query)
  to query data in InfluxDB Cloud and InfluxDB OSS 2.0 with **InfluxQL**.
weight: 102
influxdb/v2.0/tags: [influxql, query]
menu:
  influxdb_2_0:
    name: Query with InfluxQL
    parent: Query data
related:
  - /influxdb/v2.0/reference/api/influxdb-1x/
  - /influxdb/v2.0/reference/api/influxdb-1x/query
  - /influxdb/v2.0/reference/api/influxdb-1x/dbrp
---

In InfluxDB 1.x, data is stored in [databases](/influxdb/v1.8/concepts/glossary/#database) and [retention policies](/influxdb/v1.8/concepts/glossary/#retention-policy-rp). In InfluxDB Cloud and InfluxDB OSS 2.0, data is stored in [buckets](/influxdb/v2.0/reference/glossary/#bucket). Because InfluxQL uses the 1.x data model, before querying in InfluxQL, a bucket must be mapped to a database and retention policy.

**Complete the following steps:**

1. [Verify buckets have a mapping](#verify-buckets-have-a-mapping).
{{% note %}}
If data is written into a bucket using the `/write` 1.x compatibility API, the bucket automatically has a mapping. For more information, see [Database and retention policy mapping](/influxdb/v2.0/reference/api/influxdb-1x/dbrp/).
If you're not sure how data was written into a bucket, we recommend verifying the bucket has a mapping.
{{% /note %}}

2. [Map unmapped buckets](#map-unmapped-buckets).
3. [Query a mapped bucket with InfluxQL](#query-a-mapped-bucket-with-influxql).

## Verify buckets have a mapping

Verify the buckets that you want to query are mapped to a database and retention policy using the [`GET /dbrps` API request](/influxdb/v2.0/api/#operation/GetDBRPs) (see CURL example below). **Include the following in your request**:

- `orgID`(**required**). If this is the only parameter included in the request, a list of all database retention policy mappings for the specified organization is returned.
- To find a specific bucket (`bucketID`), database (`database`), retention policy (`rp`), or mapping ID (`id`), include the query parameter in your request.

<!--  -->
##### View all DBRP mappings
```sh
curl --request GET \
  http://localhost:8086/api/v2/dbrps?orgID=example-org-id \
  --header "Authorization: Token YourAuthToken" \
  --header "Content-type: application/json"
```

##### Filter DBRP mappings by database
```sh
curl --request GET \
  http://localhost:8086/api/v2/dbrps?orgID=example-org-id&db=example-db \
  --header "Authorization: Token YourAuthToken" \
  --header "Content-type: application/json"
```

If you **do not find a mapping ID (`id`) for a bucket**, complete the next procedure to map the unmapped bucket.
_For more information on the DBRP mapping API, see the [`/api/v2/dbrps` endpoint documentation](/influxdb/v2.0/api/#tag/DBRPs)._

## Map unmapped buckets

To map an unmapped bucket to a database and retention policy, use the [`POST /dbrps` API request](/influxdb/v2.0/api/#operation/PostDBRP) (see CURL example below).

 You must include an **authorization token** with [basic or token authentication](/influxdb/v2.0/reference/api/influxdb-1x/#authentication) in your request header and the following **required parameters** in your request body:

 - organization (`organization` or `organization_id`)
 - target bucket (`bucket_id`)
 - database and retention policy to map to bucket (`database` and `retention_policy`)

```sh
curl --request POST http://localhost:8086/api/v2/dbrps \
  --header "Authorization: Token YourAuthToken" \
  --header 'Content-type: application/json' \
  --data '{
       "bucketID": "12ab34cd56ef",
       "database": "example-db",
       "default": true,
       "org": "example-org",
       "orgID": "example-org-id",
       "retention_policy": "example-rp",
      }'
```

After you've verified the bucket is mapped, query the bucket using the `query` 1.x compatibility endpoint.

## Query a mapped bucket with InfluxQL

The [InfluxDB 1.x compatibility API](/influxdb/v2.0/reference/api/influxdb-1x/) supports
all InfluxDB 1.x client libraries and integrations in InfluxDB Cloud and InfluxDB OSS 2.0.

To query a mapped bucket with InfluxQL, use the `/query` 1.x compatibility endpoint (see CURL example below), and include the following in your request:

- InfluxDB [authentication token](/influxdb/v2.0/security/tokens/)
  _(See [compatibility API authentication](/influxdb/v2.0/reference/api/influxdb-1x/#authentication))_
- **db query parameter**: 1.x database to query
- **rp query parameter**: 1.x retention policy to query; if no retention policy is specified, InfluxDB uses the default retention policy for the specified database.
- **q query parameter**: InfluxQL query

{{% note %}}
**URL-encode** the InfluxQL query to ensure it's formatted correctly when submitted to InfluxDB.
{{% /note %}}

```sh
curl --request GET http://localhost:8086/query?db=example-db \
  --header "Authorization: Token YourAuthToken" \
  --data-urlencode "q=SELECT used_percent FROM example-db.example-rp.example-measurement WHERE host=host1"
```

By default, the `/query` compatibility endpoint returns results in **JSON**.
To return results as **CSV**, include the `Accept: application/csv` header.

## InfluxQL support

InfluxDB Cloud and InfluxDB OSS 2.0 support InfluxQL **read-only** queries. See supported and unsupported queries below.
To learn more about InfluxQL, see [Influx Query Language (InfluxQL)](/influxdb/v1.8/query_language/).

{{< flex >}}
{{< flex-content >}}
{{% note %}}
##### Supported InfluxQL queries

- `DELETE`*
- `DROP MEASUREMENT`*
- `SELECT` _(read-only)_
- `SHOW DATABASES`
- `SHOW MEASUREMENTS`
- `SHOW TAG KEYS`
- `SHOW TAG VALUES`
- `SHOW FIELD KEYS`

\* These commands delete data.
{{% /note %}}
{{< /flex-content >}}
{{< flex-content >}}
{{% warn %}}

##### Unsupported InfluxQL queries

- `SELECT INTO`
- `ALTER`
- `CREATE`
- `DROP` (see above)
- `GRANT`
- `KILL`
- `REVOKE`
{{% /warn %}}
{{< /flex-content >}}
{{< /flex >}}
