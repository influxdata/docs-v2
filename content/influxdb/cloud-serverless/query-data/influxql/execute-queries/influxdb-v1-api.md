---
title: Use the InfluxDB v1 HTTP query API to query with InfluxQL
seotitle: Use InfluxQL and InfluxDB v1 HTTP query API
description: >
  Use the InfluxDB v1 HTTP query API to query data in InfluxDB Cloud Serverless
  with InfluxQL.
weight: 401
menu:
  influxdb_cloud_serverless:
    parent: influxql-execute-queries
    name: Use the v1 query API
influxdb/cloud-serverless/tags: [query, influxql, python]
list_code_example: |
  ```sh
  curl --get https://cloud2.influxdata.com/query \
    --header "Authorization: Token API_TOKEN" \
    --data-urlencode "db=BUCKET_NAME" \
    --data-urlencode "q=SELECT * FROM home"
  ```
---

Use the InfluxDB v1 HTTP query API to query data in {{< cloud-name >}}
with InfluxQL.

The examples below use **cURL** to send HTTP requests to the InfluxDB v1 HTTP API,
but you can use any HTTP client.

{{% note %}}
#### Databases and retention policies map to InfluxDB buckets

InfluxQL **databases** and **retention policies** are used to route queries to
an InfluxDB **bucket** based on database and retention policy (DBRP) mappings.
For more information, see
[Map databases and retention policies to buckets](/influxdb/cloud-serverless/query-data/influxql/dbrp/).
{{% /note %}}

{{% warn %}}
#### InfluxQL feature support

InfluxQL is being rearchitected to work with the InfluxDB IOx storage engine.
This process is ongoing and some InfluxQL features are still being implemented.
For information about the current implementation status of InfluxQL features,
see [InfluxQL feature support](/influxdb/cloud-serverless/reference/influxql/feature-support/).
{{% /warn %}}

Use the v1 `/query` endpoint and the `GET` request method to query data with InfluxQL:

{{< api-endpoint endpoint="https://cloud2.influxdata.com/query" method="get" api-ref="/influxdb/cloud-serverless/api/#tag/Query" >}}

Provide the following with your request:

- **Headers:**
  - **Authorization:** `Bearer API_TOKEN`
- **Query parameters:**
  - **db**: Database to query
  - **rp**: _(Optional)_ Retention policy to query 
  - **q**: URL-encoded InfluxQL query

{{% code-placeholders "DATABASE_NAME|API_TOKEN" %}}
```sh
curl --get https://cloud2.influxdata.com/query \
  --header "Authorization: Token API_TOKEN" \
  --data-urlencode "db=DATABASE_NAME" \
  --data-urlencode "q=SELECT * FROM home"
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  Name of the database to query
- {{% code-placeholder-key %}}`API_TOKEN`{{% /code-placeholder-key %}}:
  InfluxDB token with read permissions on the databases you want to query.

{{% note %}}
#### Authenticate with username and password

If using basic authentication or query string authentication (username and password)
to interact with the v1 HTTP query API, provide the following credentials:

- **username**: Arbitrary string _({{< cloud-name >}} ignores the username)_
- **password**: [API token](/influxdb/cloud-serverless/admin/tokens/) with read permission
  on the database you want to query

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Basic Auth](#)
[Query String Auth](#)
{{% /code-tabs %}}

{{% code-tab-content %}}
{{% code-placeholders "DATABASE_(NAME|TOKEN)" %}}
```sh
curl --get https://cloud2.influxdata.com/query \
  --header "Authorization: Basic ignored:DATABASE_TOKEN" \
  --data-urlencode "db=DATABASE_NAME" \
  --data-urlencode "q=SELECT * FROM home"
```
{{% /code-placeholders %}}
{{% /code-tab-content %}}

{{% code-tab-content %}}
{{% code-placeholders "DATABASE_(NAME|TOKEN)" %}}
```sh
curl --get https://cloud2.influxdata.com/query \
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
curl --get https://cloud2.influxdata.com/query \
  --header "Authorization: Token DATABASE_TOKEN" \
  --header "Accept: application/csv" \
  --data-urlencode "db=DATABASE_NAME" \
  --data-urlencode "q=SELECT * FROM home"
```
{{% /code-placeholders %}}

<!-- 
TO-DO: Explain how DBRP mappings work with bucket names
-->
