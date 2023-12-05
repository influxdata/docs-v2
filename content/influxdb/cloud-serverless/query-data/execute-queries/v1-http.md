---
title: Use the InfluxDB v1 HTTP query API and InfluxQL
seotitle: Use InfluxQL and InfluxDB v1 HTTP query API
list_title: Use the v1 query API and InfluxQL
description: >
  Use the InfluxDB v1 HTTP query API to query data in InfluxDB Cloud Serverless
  with InfluxQL.
weight: 301
menu:
  influxdb_cloud_serverless:
    parent: Execute queries
    name: Use the v1 HTTP query API
influxdb/cloud-serverless/tags: [query, influxql, python]
metadata: [InfluxQL]
related:
  - /influxdb/cloud-serverless/guides/api-compatibility/v1/
aliases:
  - /influxdb/cloud-serverless/query-data/influxql/execute-queries/influxdb-v1-api/
  - /influxdb/cloud-serverless/query-data/execute-queries/influxdb-v1-api/
list_code_example: |
  ```sh
  curl https://{{< influxdb/host >}}/query \
    --header "Authorization: Token API_TOKEN" \
    --data-urlencode "db=BUCKET_NAME" \
    --data-urlencode "q=SELECT * FROM home"
  ```
---

Use the InfluxDB v1 HTTP API `/query` endpoint and InfluxQL to query data stored in {{< product-name >}} and return results in JSON or CSV format.
The `/query` endpoint provides compatibility for InfluxDB 1.x workloads that you bring to InfluxDB v3.

_Before you can use the v1 query API,
[databases and retention policies must be mapped to buckets](/influxdb/cloud-serverless/guides/api-compatibility/v1/#map-v1-databases-and-retention-policies-to-buckets)._

{{% note %}}
#### Flight queries don't use DBRP mappings

When using Flight RPC or Flight SQL to query InfluxDB, specify the **bucket name**.
Flight queries don't use DBRP mappings.
See how to [get started querying with Flight and SQL or InfluxQL](/influxdb/cloud-serverless/get-started/query/).
{{% /note %}}

- [Query the v1 /query endpoint](#query-the-v1-query-endpoint)
  - [Parameters](#parameters)
  - [Authorization](#authorization)
  - [Return results as JSON or CSV](#return-results-as-json-or-csv)
- [Tools for querying the v1 API](#tools-for-querying-the-v1-api)
  - [Interactive clients](#interactive-clients)
- [Troubleshoot failures](#troubleshoot-failures)
  - [Database not found](#database-not-found)
  - [Quota and limit errors](#quota-and-limit-errors)

## Query the v1 /query endpoint

To query using HTTP and InfluxQL, send a `GET` or `POST` request to the v1 `/query` endpoint.

{{< api-endpoint endpoint="https://{{< influxdb/host >}}/query" method="get" api-ref="/influxdb/cloud-serverless/api/#operation/GetLegacyQuery" >}}

### Parameters

For {{% product-name %}} v1 API `/query` requests, set parameters as listed in the following table:

Parameter   | Allowed in   | Ignored | Value
------------|--------------|---------|-------------------------------------------------------------------------
`chunked`   |              | Ignored | N/A _(Note that an unbounded query might return a large amount of data)_
`db`        | Query string | Honored | Database name [mapped to a bucket](/influxdb/cloud-serverless/guides/api-compatibility/v1/#map-v1-databases-and-retention-policies-to-buckets)
`epoch`     | Query string | Honored | [Timestamp precision](#timestamp-precision)
`pretty`    | Query string | Ignored | N/A
`rp`        | Query string | Honored | Retention policy [mapped to a bucket](/influxdb/cloud-serverless/guides/api-compatibility/v1/#map-v1-databases-and-retention-policies-to-buckets)
`q`         | Query string | Honored | [InfluxQL](/influxdb/cloud-serverless/query-data/influxql/)
[`Authorization` header or `u` and `p`](#authorization)  | | | [Token](#authorization)

{{% note %}}
When bringing v1 API workloads to {{% product-name %}}, you'll need to adjust request parameters in your client configuration or code.
{{% /note %}}

#### Timestamp precision

Use one of the following values for timestamp precision (`epoch`):

- `ns`: nanoseconds
- `us`: microseconds
- `ms`: milliseconds
- `s`: seconds
- `m`: minutes
- `h`: hours

### Authorization

To authorize a query request, include a [token](/influxdb/cloud-serverless/admin/tokens/) that has read permission for the bucket.
Use [`Token` authentication](/influxdb/cloud-serverless/guides/api-compatibility/v1/#authenticate-with-a-token-scheme) or v1-compatible [username and password authentication](/influxdb/cloud-serverless/guides/api-compatibility/v1/#authenticate-with-a-username-and-password-scheme) to include a token in the request.

### Return results as JSON or CSV

By default, the `/query` endpoint returns results in **JSON** format.

To return results in CSV format, include the `Accept` header
with the `application/csv` or `text/csv` MIME type--for example:

{{% code-placeholders "DATABASE_(NAME|TOKEN)" %}}
```sh
curl --get https://{{< influxdb/host >}}/query \
  --header "Authorization: Token DATABASE_TOKEN" \
  --header "Accept: application/csv" \
  --data-urlencode "db=DATABASE_NAME" \
  --data-urlencode "q=SELECT * FROM home"
```
{{% /code-placeholders %}}

## Tools for querying the v1 API

### Interactive clients

To test InfluxDB v1 API queries interactively from the command line, use common HTTP clients such as cURL and Postman.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Token Auth](#)
[Basic Auth](#)
[Query String Auth](#)
{{% /code-tabs %}}
{{% code-tab-content %}}

{{% code-placeholders "DATABASE_NAME|API_TOKEN" %}}
```sh
curl https://{{< influxdb/host >}}/query \
  --header "Authorization: Token API_TOKEN" \
  --data-urlencode "db=DATABASE_NAME" \
  --data-urlencode "q=SELECT * FROM home"
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  the [database name mapped to the bucket](/influxdb/cloud-serverless/guides/api-compatibility/v1/#map-v1-databases-and-retention-policies-to-buckets)
- {{% code-placeholder-key %}}`API_TOKEN`{{% /code-placeholder-key %}}:
  an [API token](/influxdb/cloud-serverless/admin/tokens/) with _read_ access to the specified database.

{{% /code-tab-content %}}
{{% code-tab-content %}}
{{% code-placeholders "DATABASE_(NAME|TOKEN)" %}}
```sh
curl --get https://{{< influxdb/host >}}/query \
  -user "":"API_TOKEN" \
  --data-urlencode "db=DATABASE_NAME" \
  --data-urlencode "q=SELECT * FROM home"
```
{{% /code-placeholders %}}
{{% /code-tab-content %}}

{{% code-tab-content %}}
{{% code-placeholders "DATABASE_(NAME|TOKEN)" %}}
```sh
curl --get https://{{< influxdb/host >}}/query \
  --data-urlencode "u=ignored" \
  --data-urlencode "p=DATABASE_TOKEN" \
  --data-urlencode "db=DATABASE_NAME" \
  --data-urlencode "q=SELECT * FROM home"
```
{{% /code-placeholders %}}
{{% /code-tab-content %}}

{{< /code-tabs-wrapper >}}

## Troubleshoot failures

Troubleshoot problems and errors encountered when using the HTTP API to query {{% product-name %}}.

### Database not found

If a DBRP doesn't exist for the `db=DATABASE_NAME` and `rp=RETENTION_POLICY_NAME` combination in the query request, the response body contains an error message, for example `"database not found:..."`.

### Quota and limit errors

HTTP API `/query` requests are subject to [usage quotas and limits](/influxdb/cloud-serverless/admin/billing/).
