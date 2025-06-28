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
  - /influxdb/v2/query-data/execute-queries/influx-api/
  - /influxdb/v2/query-data/influxql
aliases:
  - /influxdb/v2/reference/api/influxdb-1x/query/
---

The `/query` 1.x compatibility endpoint queries InfluxDB {{< current-version >}} using **InfluxQL**.
Send an InfluxQL query in an HTTP `GET` or `POST` request to query data from the `/query` endpoint.


The `/query` compatibility endpoint uses the **database** and **retention policy**
specified in the query request to map the request to an InfluxDB bucket.
For more information, see [Database and retention policy mapping](/influxdb/v2/reference/api/influxdb-1x/dbrp).

{{% show-in "cloud,cloud-serverless" %}}

> [!Note]
> If you have an existing bucket that doesn't follow the **database/retention-policy** naming convention,
> you **must** [manually create a database and retention policy mapping](/influxdb/v2/query-data/influxql/dbrp/#create-dbrp-mappings)
> to query that bucket with the `/query` compatibility API.

{{% /show-in %}}

## Authentication

Use one of the following authentication methods:

- the 2.x `Authorization: Token` scheme in the header
- the v1-compatible `u` and `p` query string parameters
- the v1-compatible `Basic` authentication scheme in the header

For more information, see [Authentication for the 1.x compatibility API](/influxdb/v2/api-guide/influxdb-1x/).

## Query string parameters

### u
(Optional) The 1.x **username** to authenticate the request.
If you provide an API token as the password, `u` is required, but can be any value.
_See [query string authentication](/influxdb/v2/reference/api/influxdb-1x/#query-string-authentication)._

### p
(Optional) The 1.x **password** or the 2.x API token to authenticate the request.
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

{{% code-placeholders "INFLUX_USERNAME|INFLUX_PASSWORD_OR_TOKEN|API_TOKEN" %}}

##### Query using basic authentication

The following example:

- sends a `GET` request to the `/query` endpoint
- uses the `Authorization` header with the `Basic` scheme (compatible with InfluxDB 1.x) to provide username and password credentials
- uses the default retention policy for the database

{{% show-in "v2" %}}
<!--pytest.mark.skip-->

```sh
##############################################################################
# Use Basic authentication with an
# InfluxDB v1-compatible username and password
# to query the InfluxDB 1.x compatibility API.
#
# INFLUX_USERNAME: your v1-compatible username.
# INFLUX_PASSWORD_OR_TOKEN: your API token or v1-compatible password.
##############################################################################

curl --get "http://{{< influxdb/host >}}/query" \
  --user "INFLUX_USERNAME":"INFLUX_PASSWORD_OR_TOKEN" \
  --data-urlencode "db=BUCKET_NAME" \
  --data-urlencode "q=SELECT * FROM cpu_usage"
```
{{% /show-in %}}

{{% show-in "cloud,cloud-serverless" %}}

<!--pytest.mark.skip-->

```sh
{{% get-shared-text "api/v1-compat/auth/cloud/basic-auth.sh" %}}
```

{{% /show-in %}}

##### Query using an HTTP POST request

```bash
curl \
  --request POST \
  "http://{{< influxdb/host >}}/query?db=DATABASE_NAME&rp=RETENTION_POLICY" \
  --user "INFLUX_USERNAME":"INFLUX_PASSWORD_OR_TOKEN" \
  --header "Content-type: application/vnd.influxql" \
  --data "SELECT * FROM cpu_usage WHERE time > now() - 1h"
```

##### Query a non-default retention policy

The following example:

- sends a `GET` request to the `/query` endpoint
- uses the `Authorization` header with the `Token` scheme (compatible with InfluxDB 2.x) to provide the API token
- queries a custom retention policy mapped for the database

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
curl --get http://{{< influxdb/host >}}/query \
  --header "Authorization: Token API_TOKEN" \
  --data-urlencode "db=DATABASE_NAME" \
  --data-urlencode "rp=RETENTION_POLICY_NAME" \
  --data-urlencode "q=SELECT used_percent FROM mem WHERE host=host1"
```

##### Execute multiple queries

```sh
curl --get http://{{< influxdb/host >}}/query \
  --header "Authorization: Token API_TOKEN" \
  --data-urlencode "db=DATABASE_NAME" \
  --data-urlencode "q=SELECT * FROM mem WHERE host=host1;SELECT mean(used_percent) FROM mem WHERE host=host1 GROUP BY time(10m)"
```

##### Return query results with millisecond Unix timestamps
```sh
curl --get http://{{< influxdb/host >}}/query \
  --header "Authorization: Token API_TOKEN" \
  --data-urlencode "db=DATABASE_NAME" \
  --data-urlencode "rp=RETENTION_POLICY_NAME" \
  --data-urlencode "q=SELECT used_percent FROM mem WHERE host=host1" \
  --data-urlencode "epoch=ms"
```

##### Execute InfluxQL queries from a file
```sh
curl --get http://{{< influxdb/host >}}/query \
  --header "Authorization: Token API_TOKEN" \
  --data-urlencode "db=DATABASE_NAME" \
  --data-urlencode "q@path/to/influxql.txt"
```

##### Return a gzip-compressed response
```sh
curl --get http://{{< influxdb/host >}}/query \
  --header 'Accept-Encoding: gzip' \
  --header "Authorization: Token API_TOKEN" \
  --data-urlencode "db=DATABASE_NAME" \
  --data-urlencode "q=SELECT used_percent FROM mem WHERE host=host1"
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`API_TOKEN`{{% /code-placeholder-key %}}: your InfluxDB [API token](/influxdb/v2/admin/tokens/)
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the database to query.
In InfluxDB 2.x, databases and retention policies map to [buckets](/influxdb/v2/admin/buckets/).
- {{% code-placeholder-key %}}`RETENTION_POLICY_NAME`{{% /code-placeholder-key %}}: the name of the retention policy to query.
In InfluxDB 2.x, databases and retention policies map to [buckets](/influxdb/v2/admin/buckets/).

_For more information about the database and retention policy mapping, see [Database and retention policy mapping](/influxdb/v2/reference/api/influxdb-1x/dbrp)._