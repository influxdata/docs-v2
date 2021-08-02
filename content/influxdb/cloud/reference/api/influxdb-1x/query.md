---
title: /query 1.x compatibility API
list_title: /query
description: >
  The `/query` 1.x compatibility endpoint queries InfluxDB Cloud using **InfluxQL**.
menu:
  influxdb_cloud_ref:
    name: /query
    parent: 1.x compatibility
weight: 301
influxdb/cloud/tags: [influxql, query]
products: [cloud]
list_code_example: |
  <pre>
  <span class="api get">GET</span> https://cloud2.influxdata.com/query
  </pre>
related:
  - /influxdb/cloud/query-data/influxql
---

The `/query` 1.x compatibility endpoint queries InfluxDB Cloud and InfluxDB OSS 2.0 using **InfluxQL**.
Use the `GET` request method to query data from the `/query` endpoint.

{{< api-endpoint method="get" endpoint="http://localhost:8086/query" >}}

The `/query` compatibility endpoint uses the **database** and **retention policy**
specified in the query request to map the request to an InfluxDB bucket.
For more information, see [Database and retention policy mapping](/{{% latest "influxdb" %}}/reference/api/influxdb-1x/dbrp).

{{% note %}}
If you have an existing bucket that doesn't follow the **database/retention-policy** naming convention,
you **must** [manually create a database and retention policy mapping](/influxdb/v2.0/query-data/influxql/#map-unmapped-buckets)
to query that bucket with the `/query` compatibility API.
{{% /note %}}

## Authentication
{{% api/v1-compat/cloud/authentication %}}

## Query string parameters
{{% api/url-encode-note %}}

### u
(Optional) The InfluxDB Cloud **username** to authenticate the request.
_See [query string authentication](/influxdb/cloud/reference/api/influxdb-1x/#query-string-authentication)._

### p
(Optional) The InfluxDB Cloud **authentication token** to authenticate the request.
_See [query string authentication](/influxdb/cloud/reference/api/influxdb-1x/#query-string-authentication)._

### db
({{< req >}}) The **database** to query data from.
This is mapped to an InfluxDB [bucket](/influxdb/v2.0/reference/glossary/#bucket).
_See [Database and retention policy mapping](/influxdb/v2.0/reference/api/influxdb-1x/dbrp/)._

### rp
The **retention policy** to query data from.
This is mapped to an InfluxDB [bucket](/influxdb/v2.0/reference/glossary/#bucket).
_See [Database and retention policy mapping](/influxdb/v2.0/reference/api/influxdb-1x/dbrp/)._

### q
({{< req >}}) The **InfluxQL** query to execute.
To execute multiple queries, delimit queries with a semicolon (`;`).

### epoch
Return results with [Unix timestamps](/influxdb/v2.0/reference/glossary/#unix-timestamp)
(also known as epoch timestamps) in the specified precision instead of
[RFC3339 timestamps](/influxdb/v2.0/reference/glossary/#rfc3339-timestamp) with nanosecond precision.
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

##### Query a non-default retention policy
```sh
curl --get http://localhost:8086/query \
  --header "Authorization: Token YourAuthToken" \
  --data-urlencode "db=mydb" \
  --data-urlencode "rp=customrp" \
  --data-urlencode "q=SELECT used_percent FROM mem WHERE host=host1"
```

##### Execute multiple queries
```sh
curl --get http://localhost:8086/query \
  --header "Authorization: Token YourAuthToken" \
  --data-urlencode "db=mydb" \
  --data-urlencode "q=SELECT * FROM mem WHERE host=host1;SELECT mean(used_percent) FROM mem WHERE host=host1 GROUP BY time(10m)"
```

##### Return query results with millisecond Unix timestamps
```sh
curl --get http://localhost:8086/query \
  --header "Authorization: Token YourAuthToken" \
  --data-urlencode "db=mydb" \
  --data-urlencode "rp=myrp" \
  --data-urlencode "q=SELECT used_percent FROM mem WHERE host=host1" \
  --data-urlencode "epoch=ms"
```

##### Execute InfluxQL queries from a file
```sh
curl --get http://localhost:8086/query \
  --header "Authorization: Token YourAuthToken" \
  --data-urlencode "db=mydb" \
  --form "q=@path/to/influxql.txt" \
  --form "async=true"
```
