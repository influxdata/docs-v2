---
title: Query data with InfluxQL
description: >
  Use the [InfluxDB 1.x `/query` compatibility endpoint](/influxdb/cloud/reference/api/influxdb-1x/query)
  to query data in InfluxDB Cloud with **InfluxQL**.
weight: 102
influxdb/cloud/tags: [influxql, query]
menu:
  influxdb_cloud:
    name: Query with InfluxQL
    parent: Query data
related:
  - /influxdb/cloud/reference/api/influxdb-1x/
  - /influxdb/cloud/reference/api/influxdb-1x/query
  - /influxdb/cloud/reference/api/influxdb-1x/dbrp
---

In InfluxDB 1.x, data is stored in [databases](/{{< latest "influxdb" "v1" >}}/concepts/glossary/#database)
and [retention policies](/{{< latest "influxdb" "v1" >}}/concepts/glossary/#retention-policy-rp).
In InfluxDB Cloud, data is stored in [buckets](/influxdb/v2.0/reference/glossary/#bucket).
Because InfluxQL uses the 1.x data model, before querying in InfluxQL, a bucket must be mapped to a database and retention policy (DBRP).

**Complete the following steps:**

1. [Verify buckets have a mapping](#verify-buckets-have-a-mapping).
2. [Map unmapped buckets](#map-unmapped-buckets).
3. [Query a mapped bucket with InfluxQL](#query-a-mapped-bucket-with-influxql).

## Verify buckets have a mapping

Use the [`/api/v2/dbrps` API endpoint](/influxdb/v2.0/api/#operation/GetDBRPs) to list DBRP mappings.
Include the following:

- **Request method:** `GET`
- **Headers:**
  - **Authorization:** `Token` schema with your InfluxDB [autorization token](/influxdb/v2.0/security/tokens/)
  - **Content-type:** `application/json`
- **Query parameters:**
  - **organization_id:** [organization ID](/influxdb/v2.0/organizations/view-orgs/#view-your-organization-id) <span class="req">Required</span>
  - **bucket_id:** [bucket ID](/influxdb/v2.0/organizations/buckets/view-buckets/) _(to list DBRP mappings for a specific bucket)_
  - **database:** database name _(to list DBRP mappings with a specific database name)_
  - **retention_policy:** database name _(to list DBRP mappings with a specific retention policy name)_
  - **id:** DBRP mapping ID _(to list a specific DBRP mapping)_

##### View all DBRP mappings
```sh
curl --request GET \
  http://localhost:8086/api/v2/dbrps?organization_id=example-org-id \
  --header "Authorization: Token YourAuthToken" \
  --header "Content-type: application/json"
```

##### Filter DBRP mappings by database
```sh
curl --request GET \
  http://localhost:8086/api/v2/dbrps?organization_id=example-org-id&database=example-db \
  --header "Authorization: Token YourAuthToken" \
  --header "Content-type: application/json"
```

If you **do not find a mapping ID (`id`) for a bucket**, complete the next procedure to map the unmapped bucket.
_For more information on the DBRP mapping API, see the [`/api/v2/dbrps` endpoint documentation](/influxdb/v2.0/api/#tag/DBRPs)._

## Map unmapped buckets
Use the [`/api/v2/dbrps` API endpoint](/influxdb/v2.0/api/#operation/PostDBRP) to create a new DBRP mapping.
Include the following:

- **Request method:** `POST`
- **Headers:**
  - **Authorization:** `Token` schema with your InfluxDB [autorization token](/influxdb/v2.0/security/tokens/)
  - **Content-type:** `application/json`
- **Request body:** JSON object with the following fields:
  - **bucket_id:** [bucket ID](/influxdb/v2.0/organizations/buckets/view-buckets/) <span class="req">Required</span>
  - **database:** database name <span class="req">Required</span>
  - **default:** set DBRP mapping to default
  - **organization** or **organization_id:** organization name or [organization ID](/influxdb/v2.0/organizations/view-orgs/#view-your-organization-id) <span class="req">Required</span>
  - **retention_policy:** retention policy name <span class="req">Required</span>

<!--  -->
```sh
curl --request POST http://localhost:8086/api/v2/dbrps \
  --header "Authorization: Token YourAuthToken" \
  --header 'Content-type: application/json' \
  --data '{
        "bucket_id": "00oxo0oXx000x0Xo",
        "database": "example-db",
        "default": true,
        "organization_id": "00oxo0oXx000x0Xo",
        "retention_policy": "example-rp",
      }'
```

After you've verified the bucket is mapped, query the bucket using the `query` 1.x compatibility endpoint.

## Query a mapped bucket with InfluxQL

The [InfluxDB 1.x compatibility API](/influxdb/v2.0/reference/api/influxdb-1x/) supports
all InfluxDB 1.x client libraries and integrations in InfluxDB Cloud and InfluxDB OSS 2.0.

To query a mapped bucket with InfluxQL, use the [`/query` 1.x compatibility endpoint](/influxdb/v2.0/reference/api/influxdb-1x/query/).
Include the following in your request:

- **Request method:** `GET`
- **Headers:**
  - **Authorization:** _See [compatibility API authentication](/influxdb/v2.0/reference/api/influxdb-1x/#authentication)
- **Query parameters:**
  - **db**: 1.x database to query
  - **rp**: 1.x retention policy to query _(if no retention policy is specified, InfluxDB uses the default retention policy for the specified database)_
  - **q**: InfluxQL query

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
To learn more about InfluxQL, see [Influx Query Language (InfluxQL)](/{{< latest "influxdb" "v1" >}}/query_language/).

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
- `DROP` _(limited support)_
- `GRANT`
- `KILL`
- `REVOKE`
{{% /warn %}}
{{< /flex-content >}}
{{< /flex >}}