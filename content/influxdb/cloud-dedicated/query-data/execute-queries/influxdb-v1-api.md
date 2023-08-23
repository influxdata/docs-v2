---
title: Use the InfluxDB v1 HTTP query API and InfluxQL to query data
seotitle: Use InfluxQL and InfluxDB v1 HTTP query API
list_title: Use the v1 query API and InfluxQL
description: >
  Use the InfluxDB v1 HTTP query API to query data in InfluxDB Cloud Dedicated
  with InfluxQL.
weight: 401
menu:
  influxdb_cloud_dedicated:
    parent: Execute queries
    name: Use the v1 query API
influxdb/cloud-dedicated/tags: [query, influxql, python]
metadata: [InfluxQL]
related:
  - /influxdb/cloud-dedicated/api-compatibility/v1/
aliases:
  - /influxdb/cloud-dedicated/query-data/influxql/execute-queries/influxdb-v1-api/
list_code_example: |
  ```sh
  curl --get https://cluster-id.influxdb.io/query \
    --header "Authorization: Token DATABASE_TOKEN" \
    --data-urlencode "db=DATABASE_NAME" \
    --data-urlencode "q=SELECT * FROM home"
  ```
---

Use the InfluxDB v1 HTTP query API to query data in {{< cloud-name >}}
with InfluxQL.

The examples below use **cURL** to send HTTP requests to the InfluxDB v1 HTTP API,
but you can use any HTTP client.

{{% warn %}}
#### InfluxQL feature support

InfluxQL is being rearchitected to work with the InfluxDB IOx storage engine.
This process is ongoing and some InfluxQL features are still being implemented.
For information about the current implementation status of InfluxQL features,
see [InfluxQL feature support](/influxdb/cloud-dedicated/reference/influxql/feature-support/).
{{% /warn %}}

Use the v1 `/query` endpoint and the `GET` request method to query data with InfluxQL:

{{< api-endpoint endpoint="https://cluster-id.influxdb.io/query" method="get" api-ref="/influxdb/cloud-dedicated/api/#tag/Query" >}}

Provide the following with your request:

- **Headers:**
  - **Authorization:** `Bearer DATABASE_TOKEN`
- **Query parameters:**
  - **db**: the database to query
  - **rp**: Optional: the retention policy to query
  - **q**: URL-encoded InfluxQL query

{{% code-placeholders "DATABASE_(NAME|TOKEN)" %}}
```sh
curl --get https://cluster-id.influxdb.io/query \
  --header "Authorization: Bearer DATABASE_TOKEN" \
  --data-urlencode "db=DATABASE_NAME" \
  --data-urlencode "q=SELECT * FROM home"
```
{{% /code-placeholders %}}

Replace the following configuration values:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  the name of the [database](/influxdb/cloud-dedicated/admin/databases/) to query.
- {{% code-placeholder-key %}}`DATABASE_TOKEN`{{% /code-placeholder-key %}}:
  a [database token](/influxdb/cloud-dedicated/admin/tokens/) with _read_ access to the specified database.

{{% note %}}
#### Authenticate with username and password

If using basic authentication or query string authentication (username and password)
to interact with the v1 HTTP query API, provide the following credentials:

- **username**: an arbitrary string _({{< cloud-name >}} ignores the username)_
- **password**: a [database token](/influxdb/cloud-dedicated/admin/tokens/) with _read_ access to the specified database.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Basic Auth](#)
[Query String Auth](#)
{{% /code-tabs %}}

{{% code-tab-content %}}
{{% code-placeholders "DATABASE_(NAME|TOKEN)" %}}
```sh
curl --get https://cluster-id.influxdb.io/query \
  --header "Authorization: Basic ignored:DATABASE_TOKEN" \
  --data-urlencode "db=DATABASE_NAME" \
  --data-urlencode "q=SELECT * FROM home"
```
{{% /code-placeholders %}}
{{% /code-tab-content %}}

{{% code-tab-content %}}
{{% code-placeholders "DATABASE_(NAME|TOKEN)" %}}
```sh
curl --get https://cluster-id.influxdb.io/query \
  --data-urlencode "u=ignored" \
  --data-urlencode "p=DATABASE_TOKEN" \
  --data-urlencode "db=DATABASE_NAME" \
  --data-urlencode "q=SELECT * FROM home"
```
{{% /code-placeholders %}}
{{% /code-tab-content %}}

{{< /code-tabs-wrapper >}}
{{% /note %}}

## Return results as JSON or CSV

By default, the `/query` endpoint returns results in **JSON**, but it can also
return results in **CSV**. To return results as CSV, include the `Accept` header
with the `application/csv` or `text/csv` MIME type:

{{% code-placeholders "DATABASE_(NAME|TOKEN)" %}}
```sh
curl --get https://cluster-id.influxdb.io/query \
  --header "Authorization: Token DATABASE_TOKEN" \
  --header "Accept: application/csv" \
  --data-urlencode "db=DATABASE_NAME" \
  --data-urlencode "q=SELECT * FROM home"
```
{{% /code-placeholders %}}
