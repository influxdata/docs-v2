---
title: /query 1.x compatibility API
list_title: /query
description: >
  The `/query` 1.x compatibility endpoint queries InfluxDB Cloud and InfluxDB OSS 2.x using **InfluxQL**.
menu:
  influxdb_v2:
    name: /query
    parent: v1 compatibility
weight: 301
influxdb/v2/tags: [influxql, query]
list_code_example: |
  <pre>
  <span class="api get">GET</span> http://localhost:8086/query
  </pre>
related:
  - /influxdb/v2/query-data/influxql
aliases:
  - /influxdb/v2/reference/api/influxdb-1x/query/
---

The `/query` 1.x compatibility endpoint queries InfluxDB {{< current-version >}} using **InfluxQL**.
Use the `GET` request method to query data from the `/query` endpoint.

<pre>
<span class="api get">GET</span> http://localhost:8086/query
</pre>

The `/query` compatibility endpoint uses the **database** and **retention policy**
specified in the query request to map the request to an InfluxDB bucket.
For more information, see [Database and retention policy mapping](/influxdb/v2/reference/api/influxdb-1x/dbrp).

{{% show-in "cloud,cloud-serverless" %}}

{{% note %}}
If you have an existing bucket that doesn't follow the **database/retention-policy** naming convention,
you **must** [manually create a database and retention policy mapping](/influxdb/v2/query-data/influxql/dbrp/#create-dbrp-mappings)
to query that bucket with the `/query` compatibility API.
{{% /note %}}

{{% /show-in %}}

## Authentication

Use one of the following authentication methods:
* **token authentication**
* **basic authentication with username and password**
* **query string authentication with username and password**

_For more information, see [Authentication](/influxdb/v2/reference/api/influxdb-1x/#authentication)._

## Query string parameters

### u
(Optional) The 1.x **username** to authenticate the request.
_See [query string authentication](/influxdb/v2/reference/api/influxdb-1x/#query-string-authentication)._

### p
(Optional) The 1.x **password** to authenticate the request.
_See [query string authentication](/influxdb/v2/reference/api/influxdb-1x/#query-string-authentication)._

### db
({{< req >}}) The **database** to query data from.
This is mapped to an InfluxDB [bucket](/influxdb/v2/reference/glossary/#bucket).
_See [Database and retention policy mapping](/influxdb/v2/reference/api/influxdb-1x/dbrp/)._

### rp
The **retention policy** to query data from.
This is mapped to an InfluxDB [bucket](/influxdb/v2/reference/glossary/#bucket).
_See [Database and retention policy mapping](/influxdb/v2/reference/api/influxdb-1x/dbrp/)._

### q
({{< req >}}) The **InfluxQL** query to execute.
To execute multiple queries, delimit queries with a semicolon (`;`).

### epoch
Return results with [Unix timestamps](/influxdb/v2/reference/glossary/#unix-timestamp)
(also known as epoch timestamps) in the specified precision instead of
[RFC3339 timestamps](/influxdb/v2/reference/glossary/#rfc3339-timestamp) with nanosecond precision.
The following precisions are available:

- `ns` - nanoseconds
- `u` or `µ` - microseconds
- `ms` - milliseconds
- `s` - seconds
- `m` - minutes
- `h` - hours

## Query examples

- [Query using basic authentication](#query-using-basic-authentication)
- [Query a non-default retention policy](#query-a-non-default-retention-policy)
- [Execute multiple queries](#execute-multiple-queries)
- [Return query results with millisecond Unix timestamps](#return-query-results-with-millisecond-unix-timestamps)
- [Execute InfluxQL queries from a file](#execute-influxql-queries-from-a-file)

{{% code-placeholders "API_TOKEN" %}}

##### Query using basic authentication

{{% show-in "v2" %}}

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[curl](#curl)
[Node.js](#nodejs)
{{% /code-tabs %}}
{{% code-tab-content %}}

<!--pytest.mark.skip-->

```sh
{{% get-shared-text "api/v1-compat/auth/oss/basic-auth.sh" %}}
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```js
{{% get-shared-text "api/v1-compat/auth/oss/basic-auth.js" %}}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

{{% /show-in %}}

{{% show-in "cloud,cloud-serverless" %}}

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[curl](#curl)
[Node.js](#nodejs)
{{% /code-tabs %}}
{{% code-tab-content %}}

<!--pytest.mark.skip-->

```sh
{{% get-shared-text "api/v1-compat/auth/cloud/basic-auth.sh" %}}
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```js
{{% get-shared-text "api/v1-compat/auth/cloud/basic-auth.js" %}}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}


{{% /show-in %}}

##### Query a non-default retention policy

<!--test:setup
```sh
service influxdb start && \
influx setup \
  --username USERNAME \
  --token API_TOKEN \
  --org ORG_NAME \
  --bucket BUCKET_NAME \
  --force || true
```
-->

```sh
curl --get http://localhost:8086/query \
  --header "Authorization: Token API_TOKEN" \
  --data-urlencode "db=mydb" \
  --data-urlencode "rp=customrp" \
  --data-urlencode "q=SELECT used_percent FROM mem WHERE host=host1"
```

##### Execute multiple queries

```sh
curl --get http://localhost:8086/query \
  --header "Authorization: Token API_TOKEN" \
  --data-urlencode "db=mydb" \
  --data-urlencode "q=SELECT * FROM mem WHERE host=host1;SELECT mean(used_percent) FROM mem WHERE host=host1 GROUP BY time(10m)"
```

##### Return query results with millisecond Unix timestamps
```sh
curl --get http://localhost:8086/query \
  --header "Authorization: Token API_TOKEN" \
  --data-urlencode "db=mydb" \
  --data-urlencode "rp=myrp" \
  --data-urlencode "q=SELECT used_percent FROM mem WHERE host=host1" \
  --data-urlencode "epoch=ms"
```

##### Execute InfluxQL queries from a file
```sh
curl --get http://localhost:8086/query \
  --header "Authorization: Token API_TOKEN" \
  --data-urlencode "db=mydb" \
  --data-urlencode "q@path/to/influxql.txt" \
  --data-urlencode "async=true"
```

{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`API_TOKEN`{{% /code-placeholder-key %}}: your InfluxDB [API token](/influxdb/v2/admin/tokens/)
