The {{% product-name %}} HTTP API provides a programmatic interface for interactions with
InfluxDB, such as writing and querying data, as well as compatibility with
InfluxDB v1 and v2 workloads.

## InfluxDB 3 write API endpoints

{{% api-endpoint endpoint="http://{{< influxdb/host >}}/api/v3/write" method="post" %}}

### Request parameters

- `request body`: Line protocol data

## InfluxDB 3 query API endpoints

{{% api-endpoint endpoint="http://{{< influxdb/host >}}/api/v3/query_sql" method="post" %}}

### Request parameters

- `db`: The name of the database to query
- `q`: The query text

#### Query using SQL

{{% api-endpoint endpoint="http://{{< influxdb/host >}}/api/v3/query_influxql" method="post" %}}

{{% code-tabs-wrapper %}}
{{% code-tabs %}}
[Query string](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
{{% code-placeholders "DATABASE_NAME|SQL_QUERY" %}}
```bash
curl "http://{{< influxdb/host >}}/api/v3/query_sql?db=DATABASE_NAME&q=SQL_QUERY"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```bash
curl http://{{< influxdb/host >}}/api/v3/query_sql
  --data '{"db": "DATABASE_NAME", "q": "SQL_QUERY"}
```
{{% /code-tab-content %}}
{{% code-tabs-wrapper %}}

#### Query using InfluxQL

{{% api-endpoint endpoint="http://{{< influxdb/host >}}/api/v3/query_influxql" method="post" %}}

{{% code-tabs-wrapper %}}
{{% code-tabs %}}
[Query string](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
{{% code-placeholders "DATABASE_NAME|INFLUXQL_QUERY" %}}
```bash
curl "http://{{< influxdb/host >}}/api/v3/query_sql?db=DATABASE_NAME&q=INFLUXQL_QUERY"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```bash
curl http://{{< influxdb/host >}}/api/v3/query_sql
  --data '{"db": "DATABASE_NAME", "q": "INFLUXQL_QUERY"}
```
{{% /code-tab-content %}}
{{% code-tabs-wrapper %}}

### InfluxDB v1 compatibility API

{{% product-name %}} provides the following HTTP API endpoints that work with
InfluxDB 1.x client libraries and third-party integrations:

Write line protocol to an InfluxDB 3 database using the v1-compatible endpoint:

{{% api-endpoint endpoint="http://{{< influxdb/host >}}/write" method="post" %}}

#### Request parameters

- `request body`: Line protocol data

Query data from an InfluxDB 3 database using the v1-compatible endpoint:

{{% api-endpoint endpoint="http://{{< influxdb/host >}}/query" method="post" %}}

### InfluxDB v2 compatibility

{{% product-name %}} provides an InfluxDB v2-compatible endpoint for writing
data to an InfluxDB 3 database.
The endpoint is compatible with v2 clients--for example, using Telegraf's InfluxDB v2 input plugin to write line protocol to an
InfluxDB 3 database.

{{% api-endpoint endpoint="http://{{< influxdb/host >}}/api/v2/write" method="post" %}}

#### Request parameters

- `request body`: Line protocol data
