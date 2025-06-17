<!-- COMMENT TO ALLOW STARTING WITH SHORTCODE -->
{{% product-name %}} supports both native SQL and InfluxQL for querying data. InfluxQL is
an SQL-like query language designed for InfluxDB v1 and customized for time
series queries.

{{% show-in "core" %}}
{{< product-name >}} limits
query time ranges to approximately 72 hours (both recent and historical) to
ensure query performance. For more information about the 72-hour limitation, see
the [update on InfluxDB 3 Core’s 72-hour limitation](https://www.influxdata.com/blog/influxdb3-open-source-public-alpha-jan-27/).
{{% /show-in %}}

> [!Note]
> Flux, the language introduced in InfluxDB v2, is **not** supported in InfluxDB 3.

<!-- TOC -->

- [Query data with the influxdb3 CLI](#query-data-with-the-influxdb3-cli)
  - [Example queries](#example-queries)
- [Other tools for executing queries](#other-tools-for-executing-queries)
- [SQL vs InfluxQL](#sql-vs-influxql)
  - [SQL](#sql)
  - [InfluxQL](#influxql)
- [Optimize queries](#optimize-queries)
  - [Last values cache](#last-values-cache)
  - [Distinct values cache](#distinct-values-cache)
 {{% show-in "enterprise" %}}- [File indexes](#file-indexes){{% /show-in %}}

<!-- /TOC -->

## Query data with the influxdb3 CLI

To get started querying data in {{% product-name %}}, use the
[`influxdb3 query` command](/influxdb3/version/reference/cli/influxdb3/query/)
and provide the following:

- `-H`, `--host`: The host URL of the server _(default is `http://127.0.0.1:8181`)_
- `-d`, `--database`: _({{% req %}})_ The name of the database to query
- `-l`, `--language`: The query language of the provided query string
  - `sql` _(default)_
  - `influxql`
- SQL or InfluxQL query as a string

> [!Important]
> If the `INFLUXDB3_AUTH_TOKEN` environment variable defined in
> [Set up {{% product-name %}}](/influxdb3/version/get-started/setup/#set-your-token-for-authorization)
> is no longer set, reset the environment variable or provide your token using
> the `-t, --token` option in your command.

To query the home sensor sample data you wrote in
[Write data to {{% product-name %}}](/influxdb3/version/get-started/write/#write-data-using-the-cli),
run the following command:

{{% code-placeholders "DATABASE_NAME|AUTH_TOKEN" %}}

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[SQL](#)
[InfluxQL](#)
{{% /code-tabs %}}
{{% code-tab-content %}}

<!-- pytest.mark.skip -->
```bash
influxdb3 query \
  --database DATABASE_NAME \
  "SELECT * FROM home ORDER BY time"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!-- pytest.mark.skip -->
```bash
influxdb3 query \
  --database DATABASE_NAME \
  --language influxql \
  "SELECT * FROM home"
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

{{% /code-placeholders %}}

_Replace {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}
with the name of the database to query._

To query from a specific time range, use the `WHERE` clause to designate the
boundaries of your time range.

{{% code-placeholders "DATABASE_NAME|AUTH_TOKEN" %}}

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[SQL](#)
[InfluxQL](#)
{{% /code-tabs %}}
{{% code-tab-content %}}

<!-- pytest.mark.skip -->
```bash
influxdb3 query \
  --database DATABASE_NAME \
  "SELECT * FROM home WHERE time >= now() - INTERVAL '7 days' ORDER BY time"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!-- pytest.mark.skip -->
```bash
influxdb3 query \
  --database DATABASE_NAME \
  --language influxql \
  "SELECT * FROM home WHERE time >= now() - 7d"
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

{{% /code-placeholders %}}

### Example queries

{{< expand-wrapper >}}
{{% expand "List tables in a database" %}}

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[SQL](#)
[InfluxQL](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sql
SHOW TABLES
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sql
SHOW MEASUREMENTS
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

{{% /expand %}}
{{% expand "Return the average temperature of all rooms" %}}

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[SQL](#)
[InfluxQL](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sql
SELECT avg(temp) AS avg_temp FROM home
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sql
SELECT MEAN(temp) AS avg_temp FROM home
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

{{% /expand %}}
{{% expand "Return the average temperature of the kitchen" %}}

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[SQL](#)
[InfluxQL](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sql
SELECT avg(temp) AS avg_temp FROM home WHERE room = 'Kitchen'
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sql
SELECT MEAN(temp) AS avg_temp FROM home WHERE room = 'Kitchen'
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

{{% /expand %}}
{{% expand "Query data from an absolute time range" %}}

{{% influxdb/custom-timestamps %}}

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[SQL](#)
[InfluxQL](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sql
SELECT
  *
FROM
  home
WHERE
  time >= '2022-01-01T12:00:00Z'
  AND time <= '2022-01-01T18:00:00Z'
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sql
SELECT
  *
FROM
  home
WHERE
  time >= '2022-01-01T12:00:00Z'
  AND time <= '2022-01-01T18:00:00Z'
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

{{% /influxdb/custom-timestamps %}}

{{% /expand %}}
{{% expand "Query data from a relative time range" %}}

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[SQL](#)
[InfluxQL](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sql
SELECT
  *
FROM
  home
WHERE
  time >= now() - INTERVAL '7 days'
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sql
SELECT
  *
FROM
  home
WHERE
  time >= now() - 7d
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

{{% /expand %}}
{{% expand "Calculate average humidity in 3-hour windows per room" %}}

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[SQL](#)
[InfluxQL](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sql
SELECT
  date_bin(INTERVAL '3 hours', time) AS time,
  room,
  avg(hum) AS avg_hum
FROM
  home
GROUP BY
  1,
  room
ORDER BY
  room,
  1
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sql
SELECT
  MEAN(hum) AS avg_hum
FROM
  home
WHERE
  time >= '2022-01-01T08:00:00Z'
  AND time <= '2022-01-01T20:00:00Z'
GROUP BY
  time(3h),
  room
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

{{% /expand %}}
{{< /expand-wrapper >}}

## Other tools for executing queries

Other tools are available for querying data in {{% product-name %}}, including
the following:

{{< expand-wrapper >}}
{{% expand "Query using the API" %}}
#### Query using the API

InfluxDB 3 supports Flight (gRPC) APIs and an HTTP API.
To query your database using the HTTP API, send a request to the `/api/v3/query_sql` or `/api/v3/query_influxql` endpoints.
In the request, specify the database name in the `db` parameter
and a query in the `q` parameter.
You can pass parameters in the query string or inside a JSON object.

Use the `format` parameter to specify the response format: `pretty`, `jsonl`, `parquet`, `csv`, and `json`. Default is `json`.

##### Example: Query passing URL-encoded parameters

The following example sends an HTTP `GET` request with a URL-encoded SQL query:

{{% code-placeholders "DATABASE_NAME|AUTH_TOKEN" %}}
```bash
curl -G "http://{{< influxdb/host >}}/api/v3/query_sql" \
  --header 'Authorization: Bearer AUTH_TOKEN' \
  --data-urlencode "db=DATABASE_NAME" \
  --data-urlencode "q=select * from cpu limit 5"
```
{{% /code-placeholders %}}

Replace the following placeholders with your values:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the database to query 
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "database" %}}{{% show-in "enterprise" %}} with permission to query the specified database{{% /show-in %}}

##### Example: Query passing JSON parameters

The following example sends an HTTP `POST` request with parameters in a JSON payload:

{{% code-placeholders "DATABASE_NAME|AUTH_TOKEN" %}}
```bash
curl http://{{< influxdb/host >}}/api/v3/query_sql \
  --data '{"db": "DATABASE_NAME", "q": "select * from cpu limit 5"}'
```
{{% /code-placeholders %}}

Replace the following placeholders with your values:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the database to query 
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "database" %}}{{% show-in "enterprise" %}} with permission to query the specified database{{% /show-in %}}

{{% /expand %}}

{{% expand "Query using the Python client" %}}

#### Query using the Python client

Use the InfluxDB 3 Python library to interact with the database and integrate with your application.
We recommend installing the required packages in a Python virtual environment for your specific project.

To get started, install the `influxdb3-python` package.

```bash
pip install influxdb3-python
```

From here, you can connect to your database with the client library using just the **host** and **database name:

{{% code-placeholders "DATABASE_NAME|AUTH_TOKEN" %}}
```python
from influxdb_client_3 import InfluxDBClient3

client = InfluxDBClient3(
    token='AUTH_TOKEN',
    host='http://{{< influxdb/host >}}',
    database='DATABASE_NAME'
)
```
{{% /code-placeholders %}}

Replace the following placeholders with your values:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the database to query 
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "database" %}}{{% show-in "enterprise" %}} with permission to query the specified database{{% /show-in %}}

The following example shows how to query using SQL, and then
use PyArrow to explore the schema and process results.
To authorize the query, the example retrieves the {{% token-link "database" %}}
from the `INFLUXDB3_AUTH_TOKEN` environment variable.

```python
from influxdb_client_3 import InfluxDBClient3
import os

client = InfluxDBClient3(
    token=os.environ.get('INFLUXDB3_AUTH_TOKEN'),
    host='http://{{< influxdb/host >}}',
    database='servers'
)

# Execute the query and return an Arrow table
table = client.query(
    query="SELECT * FROM cpu LIMIT 10",
    language="sql"
)

print("\n#### View Schema information\n")
print(table.schema)

print("\n#### Use PyArrow to read the specified columns\n")
print(table.column('usage_active'))
print(table.select(['host', 'usage_active']))
print(table.select(['time', 'host', 'usage_active']))

print("\n#### Use PyArrow compute functions to aggregate data\n")
print(table.group_by('host').aggregate([]))
print(table.group_by('cpu').aggregate([('time_system', 'mean')]))
```

For more information about the Python client library, see the
[`influxdb3-python` repository](https://github.com/InfluxCommunity/influxdb3-python)
in GitHub.

{{% /expand %}}

{{% expand "Query using InfluxDB 3 Explorer" %}}

#### Query using InfluxDB 3 Explorer

You can use the InfluxDB 3 Explorer web-based interface to query and visualize data,
and administer your {{% product-name %}} instance.
For more information, see how to [install InfluxDB 3 Explorer](/influxdb3/explorer/install/)
using Docker and get started querying your data.

{{% /expand %}}
{{< /expand-wrapper >}}

## SQL vs InfluxQL

{{% product-name %}} supports two query languages--SQL and InfluxQL.
While these two query languages are similar, there are important differences to
consider.

### SQL

The InfluxDB 3 SQL implementation provides a full-featured SQL query engine
powered by [Apache DataFusion](https://datafusion.apache.org/). InfluxDB extends
DataFusion with additional time series-specific functionality and supports the
complex SQL queries, including queries that use joins, unions, window functions,
and more.

- [SQL query guides](/influxdb3/version/query-data/sql/)
- [SQL reference](/influxdb3/version/reference/sql/)
- [Apache DataFusion SQL reference](https://datafusion.apache.org/user-guide/sql/index.html)

### InfluxQL

InfluxQL is a SQL-like query language built for InfluxDB v1 and supported in
{{% product-name %}}. Its syntax and functionality is similar SQL, but specifically
designed for querying time series data. InfluxQL does not offer the full range
of query functionality that SQL does.

If you are migrating from previous versions of InfluxDB, you can continue to use
InfluxQL and the established InfluxQL-related APIs you have been using.

- [InfluxQL query guides](/influxdb3/version/query-data/influxql/)
- [InfluxQL reference](/influxdb3/version/reference/influxql/)
- [InfluxQL feature support](/influxdb3/version/reference/influxql/feature-support/)

## Optimize queries

{{% product-name %}} provides the following optimization options to improve
specific kinds of queries:

- [Last values cache](#last-value-cache)
- [Distinct values cache](#distinct-value-cache)
{{% show-in "enterprise" %}}- [File indexes](#file-indexes){{% /show-in %}}

### Last values cache

The {{% product-name %}} last values cache (LVC) stores the last N values in a
series or column hierarchy in memory. This gives the database the ability to
answer these kinds of queries in under 10 milliseconds.
For information about configuring and using the LVC, see:

- [Manage a last values cache](/influxdb3/version/admin/last-value-cache/)
- [Query the last values cache](/influxdb3/version/admin/last-value-cache/query/)

### Distinct values cache

The {{% product-name %}} distinct values cache (DVC) stores distinct values for
specified columns in a series or column hierarchy in memory.
This is useful for fast metadata lookups, which can return in under 30 milliseconds.
For information about configuring and using the DVC, see:

- [Manage a distinct values cache](/influxdb3/version/admin/distinct-value-cache/)
- [Query the distinct values cache](/influxdb3/version/admin/distinct-value-cache/query/)

{{% show-in "enterprise" %}}
### File indexes

{{% product-name %}} lets you customize how your data is indexed to help
optimize query performance for your specific workload, especially workloads that
include single-series queries. Define custom indexing strategies for databases
or specific tables. For more information, see
[Manage file indexes](/influxdb3/enterprise/admin/file-index/).

{{% /show-in %}}

{{% page-nav
  prev="/influxdb3/version/get-started/write/"
  prevText="Write data"
  next="/influxdb3/version/get-started/processing-engine/"
  nextText="Processing engine"
%}}
