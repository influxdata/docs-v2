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
In InfluxDB Cloud, data is stored in [buckets](/influxdb/cloud/reference/glossary/#bucket).
Because InfluxQL uses the 1.x data model, a bucket must be mapped to a database and retention policy (DBRP) before it can be queried using InfluxQL.

{{% note %}}
#### InfluxQL reference documentation
For complete InfluxQL reference documentation, see
[Influx Query Language in the latest InfluxDB 1.x documentation](/{{< latest "influxdb" "v1" >}}/query_language/).
{{% /note %}}

**To use InfluxQL to query bucket data, complete the following steps:**

1. [Verify buckets have a mapping](#verify-buckets-have-a-mapping).
2. [Map unmapped buckets](#map-unmapped-buckets).
3. [Query a mapped bucket with InfluxQL](#query-a-mapped-bucket-with-influxql).

## Verify buckets have a mapping

{{% note %}}
When writing to an InfluxDB Cloud bucket using the `/write` 1.x compatibility API,
InfluxDB Cloud automatically creates a DBRP mapping for the bucket that matches the `db/rp` naming convention.
For more information, see [Database and retention policy mapping](/influxdb/cloud/reference/api/influxdb-1x/dbrp/).
If you're not sure how data was written into a bucket, verify the bucket has a mapping.
{{% /note %}}

Use the [`/api/v2/dbrps` API endpoint](/influxdb/cloud/api/#operation/GetDBRPs) to list DBRP mappings.
Include the following:

- **Request method:** `GET`
- **Headers:**
  - **Authorization:** `Token` schema with your InfluxDB [authentication token](/influxdb/cloud/security/tokens/)
- **Query parameters:**  
  {{< req type="key" >}}
  - {{< req "\*" >}} **organization_id:** [organization ID](/influxdb/cloud/organizations/view-orgs/#view-your-organization-id)
  - **bucket_id:** [bucket ID](/influxdb/cloud/organizations/buckets/view-buckets/) _(to list DBRP mappings for a specific bucket)_
  - **database:** database name _(to list DBRP mappings with a specific database name)_
  - **retention_policy:** retention policy name _(to list DBRP mappings with a specific retention policy name)_
  - **id:** DBRP mapping ID _(to list a specific DBRP mapping)_

##### View all DBRP mappings
```sh
curl --request GET \
  https://cloud2.influxdata.com/api/v2/dbrps?organization_id=00oxo0oXx000x0Xo \
  --header "Authorization: Token YourAuthToken"
```

##### Filter DBRP mappings by database
```sh
curl --request GET \
  https://cloud2.influxdata.com/api/v2/dbrps?organization_id=00oxo0oXx000x0Xo&database=example-db \
  --header "Authorization: Token YourAuthToken"
```

##### Filter DBRP mappings by bucket ID
```sh
curl --request GET \
  https://cloud2.influxdata.com/api/v2/dbrps?organization_id=00oxo0oXx000x0Xo&bucket_id=00oxo0oXx000x0Xo \
  --header "Authorization: Token YourAuthToken"
```

If you **do not find a DBRP mapping for a bucket**, complete the next procedure to map the unmapped bucket.
_For more information on the DBRP mapping API, see the [`/api/v2/dbrps` endpoint documentation](/influxdb/cloud/api/#tag/DBRPs)._

## Map unmapped buckets
Use the [`/api/v2/dbrps` API endpoint](/influxdb/cloud/api/#operation/PostDBRP)
to create a new DBRP mapping for a bucket.
Include the following:

- **Request method:** `POST`
- **Headers:**
  - **Authorization:** `Token` schema with your InfluxDB [authentication token](/influxdb/cloud/security/tokens/)
  - **Content-type:** `application/json`
- **Request body:** JSON object with the following fields:  
  {{< req type="key" >}}
  - {{< req "\*" >}} **bucket_id:** [bucket ID](/influxdb/cloud/organizations/buckets/view-buckets/)
  - {{< req "\*" >}} **database:** database name
  - **default:** set the provided retention policy as the default retention policy for the database
  - {{< req "\*" >}} **organization** or **organization_id:** organization name or [organization ID](/influxdb/cloud/organizations/view-orgs/#view-your-organization-id)
  - {{< req "\*" >}} **retention_policy:** retention policy name

<!--  -->
```sh
curl --request POST https://cloud2.influxdata.com/api/v2/dbrps \
  --header "Authorization: Token YourAuthToken" \
  --header 'Content-type: application/json' \
  --data '{
        "bucket_id": "00oxo0oXx000x0Xo",
        "database": "example-db",
        "default": true,
        "organization_id": "00oxo0oXx000x0Xo",
        "retention_policy": "example-rp"
      }'
```

After you've verified the bucket is mapped, query the bucket using the `query` 1.x compatibility endpoint.

## Query a mapped bucket with InfluxQL

The [InfluxDB 1.x compatibility API](/influxdb/cloud/reference/api/influxdb-1x/) supports
all InfluxDB 1.x client libraries and integrations in InfluxDB Cloud.

To query a mapped bucket with InfluxQL, use the [`/query` 1.x compatibility endpoint](/influxdb/cloud/reference/api/influxdb-1x/query/).
Include the following in your request:

- **Request method:** `GET`
- **Headers:**
  - **Authorization:** _See [compatibility API authentication](/influxdb/cloud/reference/api/influxdb-1x/#authentication)_
- **Query parameters:**
  - **db**: 1.x database to query
  - **rp**: 1.x retention policy to query _(if no retention policy is specified, InfluxDB uses the default retention policy for the specified database)_
  - **q**: URL-encoded InfluxQL query

{{% api/url-encode-note %}}

```sh
curl --get https://cloud2.influxdata.com/query?db=example-db \
  --header "Authorization: Token YourAuthToken" \
  --data-urlencode "q=SELECT used_percent FROM example-db.example-rp.example-measurement WHERE host=host1"
```

By default, the `/query` compatibility endpoint returns results in **JSON**.
To return results as **CSV**, include the `Accept: application/csv` header.

## InfluxQL support

InfluxDB Cloud supports InfluxQL **read-only** queries. See supported and unsupported queries below.
To learn more about InfluxQL, see [Influx Query Language (InfluxQL)](/{{< latest "influxdb" "v1" >}}/query_language/).

{{< flex >}}
{{< flex-content >}}
{{% note %}}
##### Supported InfluxQL queries

- `DELETE`*
- `DROP MEASUREMENT`*
- `EXPLAIN ANALYZE`
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
