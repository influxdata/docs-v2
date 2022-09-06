---
title: /query 1.x compatibility API
list_title: /query
description: >
  The `/query` 1.x compatibility endpoint queries InfluxDB Cloud and InfluxDB OSS 2.x using **InfluxQL**.
menu:
  influxdb_2_4_ref:
    name: /query
    parent: 1.x compatibility
weight: 301
influxdb/v2.4/tags: [influxql, query]
list_code_example: |
  <pre>
  <span class="api get">GET</span> http://localhost:8086/query
  </pre>
related:
  - /influxdb/v2.4/query-data/influxql
---

The `/query` 1.x compatibility endpoint queries InfluxDB {{< current-version >}} using **InfluxQL**.
Use the `GET` request method to query data from the `/query` endpoint.

<pre>
<span class="api get">GET</span> http://localhost:8086/query
</pre>

The `/query` compatibility endpoint uses the **database** and **retention policy**
specified in the query request to map the request to an InfluxDB bucket.
For more information, see [Database and retention policy mapping](/influxdb/v2.4/reference/api/influxdb-1x/dbrp).

{{% cloud-only %}}

{{% note %}}
If you have an existing bucket that doesn't follow the **database/retention-policy** naming convention,
you **must** [manually create a database and retention policy mapping](/influxdb/v2.4/query-data/influxql/dbrp/#create-dbrp-mappings)
to query that bucket with the `/query` compatibility API.
{{% /note %}}

{{% /cloud-only %}}

## Authentication

Use one of the following authentication methods:
* **token authentication**
* **basic authentication with username and password**
* **query string authentication with username and password**

_For more information, see [Authentication](/influxdb/v2.4/reference/api/influxdb-1x/#authentication)._

## Query string parameters

### u
(Optional) The 1.x **username** to authenticate the request.
_See [query string authentication](/influxdb/v2.4/reference/api/influxdb-1x/#query-string-authentication)._

### p
(Optional) The 1.x **password** to authenticate the request.
_See [query string authentication](/influxdb/v2.4/reference/api/influxdb-1x/#query-string-authentication)._

### db
({{< req >}}) The **database** to query data from.
This is mapped to an InfluxDB [bucket](/influxdb/v2.4/reference/glossary/#bucket).
_See [Database and retention policy mapping](/influxdb/v2.4/reference/api/influxdb-1x/dbrp/)._

### rp
The **retention policy** to query data from.
This is mapped to an InfluxDB [bucket](/influxdb/v2.4/reference/glossary/#bucket).
_See [Database and retention policy mapping](/influxdb/v2.4/reference/api/influxdb-1x/dbrp/)._

### q
({{< req >}}) The **InfluxQL** query to execute.
To execute multiple queries, delimit queries with a semicolon (`;`).

### epoch
Return results with [Unix timestamps](/influxdb/v2.4/reference/glossary/#unix-timestamp)
(also known as epoch timestamps) in the specified precision instead of
[RFC3339 timestamps](/influxdb/v2.4/reference/glossary/#rfc3339-timestamp) with nanosecond precision.
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

##### Query using basic authentication

{{% oss-only %}}

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[curl](#curl)
[Node.js](#nodejs)
{{% /code-tabs %}}
{{% code-tab-content %}}
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

{{% /oss-only %}}

{{% cloud-only %}}

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[curl](#curl)
[Node.js](#nodejs)
{{% /code-tabs %}}
{{% code-tab-content %}}
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


{{% /cloud-only %}}

##### Query a non-default retention policy
```sh
curl --get http://localhost:8086/query \
  --header "Authorization: Token INFLUX_API_TOKEN" \
  --data-urlencode "db=mydb" \
  --data-urlencode "rp=customrp" \
  --data-urlencode "q=SELECT used_percent FROM mem WHERE host=host1"
```

##### Execute multiple queries
```sh
curl --get http://localhost:8086/query \
  --header "Authorization: Token INFLUX_API_TOKEN" \
  --data-urlencode "db=mydb" \
  --data-urlencode "q=SELECT * FROM mem WHERE host=host1;SELECT mean(used_percent) FROM mem WHERE host=host1 GROUP BY time(10m)"
```

##### Return query results with millisecond Unix timestamps
```sh
curl --get http://localhost:8086/query \
  --header "Authorization: Token INFLUX_API_TOKEN" \
  --data-urlencode "db=mydb" \
  --data-urlencode "rp=myrp" \
  --data-urlencode "q=SELECT used_percent FROM mem WHERE host=host1" \
  --data-urlencode "epoch=ms"
```

##### Execute InfluxQL queries from a file
```sh
curl --get http://localhost:8086/query \
  --header "Authorization: Token INFLUX_API_TOKEN" \
  --data-urlencode "db=mydb" \
  --data-urlencode "q@path/to/influxql.txt" \
  --data-urlencode "async=true"
```

Replace the following:
- *`INFLUX_API_TOKEN`*: InfluxDB API token
