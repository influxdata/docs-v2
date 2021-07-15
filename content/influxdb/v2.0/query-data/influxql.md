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

In InfluxDB 1.x, data is stored in [databases](/{{< latest "influxdb" "v1" >}}/concepts/glossary/#database)
and [retention policies](/{{< latest "influxdb" "v1" >}}/concepts/glossary/#retention-policy-rp).
In InfluxDB OSS 2.0, data is stored in [buckets](/influxdb/v2.0/reference/glossary/#bucket).
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
When [upgrading from InfluxDB 1.x to 2.0](/influxdb/v2.0/upgrade/v1-to-v2/),
database and retention policy combinations are mapped to InfluxDB 2.0 buckets.
For more information, see [Database and retention policy mapping](/influxdb/v2.0/reference/api/influxdb-1x/dbrp/).
If you're not sure how data was written into a bucket, verify the bucket has a mapping.
{{% /note %}}

Use the [`influx` CLI](/influxdb/v2.0/reference/cli/influx/) or the [InfluxDB API](/influxdb/v2.0/reference/api/)
to verify the buckets you want to query are mapped to a database and retention policy.

{{< tabs-wrapper >}}
{{% tabs %}}
[influx CLI](#)
[InfluxDB API](#)
{{% /tabs %}}
{{% tab-content %}}

Use the [`influx v1 dbrp list` command](/influxdb/v2.0/reference/cli/influx/v1/dbrp/list/) to list DBRP mappings.

{{% note %}}
The examples below assume that your organization and authentication token are
provided by the active [InfluxDB connection configuration](/influxdb/v2.0/reference/cli/influx/config/) in the `influx` CLI.
If not, include your organization (`--org`) and authentication token (`--token`) with each command.
{{% /note %}}

##### View all DBRP mappings
```sh
influx v1 dbrp list
```

##### Filter DBRP mappings by database
```sh
influx v1 dbrp list --db example-db
```

##### Filter DBRP mappings by bucket ID
```sh
influx v1 dbrp list --bucket-id 00oxo0oXx000x0Xo
```
{{% /tab-content %}}
{{% tab-content %}}
Use the [`/api/v2/dbrps` API endpoint](/influxdb/v2.0/api/#operation/GetDBRPs) to list DBRP mappings.
Include the following:

- **Request method:** `GET`
- **Headers:**
  - **Authorization:** `Token` schema with your InfluxDB [authentication token](/influxdb/v2.0/security/tokens/)
- **Query parameters:**  
  {{< req type="key" >}}
  - {{< req "\*" >}} **orgID:** [organization ID](/influxdb/v2.0/organizations/view-orgs/#view-your-organization-id)
  - **bucketID:** [bucket ID](/influxdb/v2.0/organizations/buckets/view-buckets/) _(to list DBRP mappings for a specific bucket)_
  - **database:** database name _(to list DBRP mappings with a specific database name)_
  - **rp:** retention policy name _(to list DBRP mappings with a specific retention policy name)_
  - **id:** DBRP mapping ID _(to list a specific DBRP mapping)_

##### View all DBRP mappings
```sh
curl --request GET \
  http://localhost:8086/api/v2/dbrps?orgID=00oxo0oXx000x0Xo \
  --header "Authorization: Token YourAuthToken"
```

##### Filter DBRP mappings by database
```sh
curl --request GET \
  http://localhost:8086/api/v2/dbrps?orgID=00oxo0oXx000x0Xo&db=example-db \
  --header "Authorization: Token YourAuthToken"
```

##### Filter DBRP mappings by bucket ID
```sh
curl --request GET \
  https://cloud2.influxdata.com/api/v2/dbrps?organization_id=00oxo0oXx000x0Xo&bucketID=00oxo0oXx000x0Xo \
  --header "Authorization: Token YourAuthToken"
```
{{% /tab-content %}}
{{% /tabs-wrapper %}}

If you **do not find a DBRP mapping for a bucket**, complete the next procedure to map the unmapped bucket.
_For more information on the DBRP mapping API, see the [`/api/v2/dbrps` endpoint documentation](/influxdb/v2.0/api/#tag/DBRPs)._

## Map unmapped buckets
Use the [`influx` CLI](/influxdb/v2.0/reference/cli/influx/) or the [InfluxDB API](/influxdb/v2.0/reference/api/)
to manually create DBRP mappings for unmapped buckets.

{{< tabs-wrapper >}}
{{% tabs %}}
[influx CLI](#)
[InfluxDB API](#)
{{% /tabs %}}
{{% tab-content %}}

Use the [`influx v1 dbrp create` command](/influxdb/v2.0/reference/cli/influx/v1/dbrp/create/)
to map an unmapped bucket to a database and retention policy.
Include the following:

{{< req type="key" >}}

- {{< req "\*" >}} **org** and **token** to authenticate. We recommend setting your organization and token to your active InfluxDB connection configuration in the influx CLI, so you don't have to add these parameters to each command. To set up your active InfluxDB configuration, see [`influx config set`](/influxdb/v2.0/reference/cli/influx/config/set/).
- {{< req "\*" >}} **database name** to map
- {{< req "\*" >}} **retention policy** name to map
- {{< req "\*" >}} [Bucket ID](/influxdb/v2.0/organizations/buckets/view-buckets/#view-buckets-in-the-influxdb-ui) to map to
- **Default flag** to set the provided retention policy as the default retention policy for the database

```sh
influx v1 dbrp create \
  --db example-db \
  --rp example-rp \
  --bucket-id 00oxo0oXx000x0Xo \
  --default
```

{{% /tab-content %}}
{{% tab-content %}}

Use the [`/api/v2/dbrps` API endpoint](/influxdb/v2.0/api/#operation/PostDBRP) to create a new DBRP mapping.
Include the following:

- **Request method:** `POST`
- **Headers:**
  - **Authorization:** `Token` schema with your InfluxDB [authentication token](/influxdb/v2.0/security/tokens/)
  - **Content-type:** `application/json`
- **Request body:** JSON object with the following fields:  
  {{< req type="key" >}}
  - {{< req "\*" >}} **bucketID:** [bucket ID](/influxdb/v2.0/organizations/buckets/view-buckets/)
  - {{< req "\*" >}} **database:** database name
  - **default:** set the provided retention policy as the default retention policy for the database
  - {{< req "\*" >}} **org** or **orgID:** organization name or [organization ID](/influxdb/v2.0/organizations/view-orgs/#view-your-organization-id)
  - {{< req "\*" >}} **retention_policy:** retention policy name

<!--  -->
```sh
curl --request POST http://localhost:8086/api/v2/dbrps \
  --header "Authorization: Token YourAuthToken" \
  --header 'Content-type: application/json' \
  --data '{
        "bucketID": "00oxo0oXx000x0Xo",
        "database": "example-db",
        "default": true,
        "orgID": "00oxo0oXx000x0Xo",
        "retention_policy": "example-rp"
      }'
```

{{% /tab-content %}}
{{< /tabs-wrapper >}}

After you've verified the bucket is mapped, query the bucket using the `query` 1.x compatibility endpoint.

## Query a mapped bucket with InfluxQL

The [InfluxDB 1.x compatibility API](/influxdb/v2.0/reference/api/influxdb-1x/) supports
all InfluxDB 1.x client libraries and integrations in InfluxDB OSS 2.0.

To query a mapped bucket with InfluxQL, use the [`/query` 1.x compatibility endpoint](/influxdb/v2.0/reference/api/influxdb-1x/query/).
Include the following in your request:

- **Request method:** `GET`
- **Headers:**
  - **Authorization:** _See [compatibility API authentication](/influxdb/v2.0/reference/api/influxdb-1x/#authentication)_
- **Query parameters:**
  - **db**: 1.x database to query
  - **rp**: 1.x retention policy to query _(if no retention policy is specified, InfluxDB uses the default retention policy for the specified database)_
  - **q**: URL-encoded InfluxQL query

{{% api/url-encode-note %}}

```sh
curl --get http://localhost:8086/query?db=example-db \
  --header "Authorization: Token YourAuthToken" \
  --data-urlencode "q=SELECT used_percent FROM example-db.example-rp.example-measurement WHERE host=host1"
```

By default, the `/query` compatibility endpoint returns results in **JSON**.
To return results as **CSV**, include the `Accept: application/csv` header.

## InfluxQL support

InfluxDB OSS 2.0 supports InfluxQL **read-only** queries. See supported and unsupported queries below.
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
