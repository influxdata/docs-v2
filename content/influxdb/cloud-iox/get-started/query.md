---
title: Get started querying data
seotitle: Query data | Get started with InfluxDB
list_title: Query data
description: >
  Get started querying data in InfluxDB by learning about Flux and InfluxQL and
  using tools like the InfluxDB UI, `influx` CLI, and InfluxDB API.
menu:
  influxdb_cloud_iox:
    name: Query data
    parent: Get started
    identifier: get-started-query-data
weight: 102
metadata: [3 / 3]
related:
  - /influxdb/cloud-iox/query-data/
  - /influxdb/cloud-iox/query-data/sql/
  - /influxdb/cloud-iox/query-data/execute-queries/
---

InfluxDB Cloud backed by InfluxDB IOx supports multiple query languages:

- **SQL**: Traditional SQL powered by the [Apache Arrow DataFusion](https://arrow.apache.org/datafusion/)
  query engine. The supported SQL syntax is similar to PostgreSQL.
- **Flux**: A functional scripting language designed to query and process data
  from InfluxDB and other data sources.
<!-- - **InfluxQL**: A SQL-like query language designed to query time series data from
  InfluxDB. -->

This tutorial walks you through the fundamentals of querying data in InfluxDB and
**focuses on using SQL** to query your time series data.
<!-- For information about using InfluxQL and Flux, see
[Query data in InfluxDB](/influxdb/cloud-iox/query-data/). -->

{{% note %}}
The examples in this section of the tutorial query the data from written in the
[Get started writing data](/influxdb/cloud-iox/get-started/write/#write-line-protocol-to-influxdb) section.
{{% /note %}}

## Tools to execute queries

InfluxDB supports many different tools for querying data, including:

{{< req type="key" text="Covered in this tutorial" >}}

- [InfluxDB user interface (UI)](?t=InfluxDB+UI#execute-a-sql-query){{< req "\*  " >}}
- [InfluxDB HTTP API](?t=InfluxDB+API#execute-a-sql-query){{< req "\*  " >}}
- [`influx` CLI](?t=influx+CLI#execute-a-sql-query){{< req "\*  " >}}
- [Superset](https://superset.apache.org/)
- [Grafana](/influxdb/cloud-iox/tools/grafana/)
- [Chronograf](/{{< latest "Chronograf" >}}/)
- InfluxDB client libraries

## SQL query basics

InfluxDB Cloud's SQL implementation is powered by the [Apache Arrow DataFusion](https://arrow.apache.org/datafusion/)
query engine which provides a SQL syntax similar to PostgreSQL.

{{% note %}}
This is a brief introduction to writing SQL queries for InfluxDB.
For more in-depth details, see the [SQL reference documentation](/influxdb/cloud-iox/reference/sql/).
{{% /note %}}

InfluxDB SQL queries most commonly include the following clauses:

{{< req type="key" >}}

- {{< req "\*">}} `SELECT`: Identify specific fields and tags to query from a
  measurement or use the wild card alias (`*`) to select all fields and tags
  from a measurement.
- {{< req "\*">}} `FROM`: Identify the measurement to query.
  If coming from a SQL background, an InfluxDB measurement is the equivalent 
  of a relational table.
- `WHERE`: Only return data that meets defined conditions such as falling within
  a time range, containing specific tag values, etc.
- `GROUP BY`: Group data into SQL partitions and apply an aggregate or selector
  function to each group.

{{% influxdb/custom-timestamps %}}
```sql
-- Return the average temperature and humidity from each room
SELECT
  mean(temp),
  mean(hum),
  room
FROM
  home
WHERE
  time >= '2022-01-01T08:00:00Z'
  AND time <= '2022-01-01T20:00:00Z'
GROUP BY
  room
```
{{% /influxdb/custom-timestamps %}}

##### Example SQL queries

{{< expand-wrapper >}}
{{% expand "Select all data in a measurement" %}}
```sql
SELECT * FROM measurement
```
{{% /expand %}}

{{% expand "Select all data in a measurement within time bounds" %}}
```sql
SELECT
  *
FROM
  measurement
WHERE
  time >= '2022-01-01T08:00:00Z'
  AND time <= '2022-01-01T20:00:00Z'
```
{{% /expand %}}

{{% expand "Select a specific field within relative time bounds" %}}
```sql
SELECT field1 FROM measurement WHERE time >= now() - INTERVAL '1 day'
```
{{% /expand %}}

{{% expand "Select specific fields and tags from a measurement" %}}
```sql
SELECT field1, field2, tag1 FROM measurement
```
{{% /expand %}}

{{% expand "Select data based on tag value" %}}
```sql
SELECT * FROM measurement WHERE tag1 = 'value1'
```
{{% /expand %}}

{{% expand "Select data based on tag value within time bounds" %}}
```sql
SELECT
  *
FROM
  measurement
WHERE
  time >= '2022-01-01T08:00:00Z'
  AND time <= '2022-01-01T20:00:00Z'
  AND tag1 = 'value1'
```
{{% /expand %}}

{{% expand "Downsample data by applying interval-based aggregates" %}}
```sql
SELECT
  DATE_BIN(INTERVAL '1 hour', time, '2022-01-01T00:00:00Z'::TIMESTAMP) as time,
  mean(field1),
  sum(field2),
  tag1
FROM
  home
GROUP BY
  time,
  tag1
```
{{% /expand %}}
{{< /expand-wrapper >}}


### Execute a SQL query

Use the **InfluxDB UI**, **`influx` CLI**, or **InfluxDB API** to execute SQL queries.
For this example, use the following query to select all the data written to the
**get-started** bucket between
{{% influxdb/custom-timestamps-span %}}
**2022-01-01T08:00:00Z** and **2022-01-01T20:00:00Z**.
{{% /influxdb/custom-timestamps-span %}}

{{% influxdb/custom-timestamps %}}
```sql
SELECT
  *
FROM
  home
WHERE
  time >= '2022-01-01T08:00:00Z'
  AND time <= '2022-01-01T20:00:00Z'
```
{{% /influxdb/custom-timestamps %}}

{{< tabs-wrapper >}}
{{% tabs %}}
[InfluxDB UI](#influxdb-ui)
[influx CLI](#influx-cli)
[InfluxDB API](#influxdb-http-api)
{{% /tabs %}}

{{% tab-content %}}
<!--------------------------- BEGIN FLUX UI CONTENT --------------------------->

1.  Go to
    {{% oss-only %}}[localhost:8086](http://localhost:8086){{% /oss-only %}}
    {{% cloud-only %}}[cloud2.influxdata.com](https://cloud2.influxdata.com){{% /cloud-only %}}
    in a browser to log in and access the InfluxDB UI.

2.  In the left navigation bar, click **Data Explorer**.

{{< nav-icon "data-explorer" "v4" >}}

3.  In the schema browser on the left, select the **get-started** bucket from the
    **bucket** drop-down menu.
    The displayed measurements and fields are read-only and are meant to show
    you the schema of data stored in the selected bucket.

4.  Enter the SQL query in the text editor.

5.  Click **{{< icon "play" >}} {{% caps %}}Run{{% /caps %}}**.

Results are displayed under the text editor.

See [Query in the Data Explorer](/influxdb/cloud-iox/query-data/execute-queries/data-explorer/) to learn more.

<!---------------------------- END FLUX UI CONTENT ---------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!-------------------------- BEGIN FLUX CLI CONTENT --------------------------->

The [`influx query` command](/influxdb/cloud-iox/reference/cli/influx/query/)
uses the InfluxDB `/api/v2/query` endpoint to query InfluxDB.
This endpoint only accepts Flux queries. To use SQL with the `influx` CLI, wrap
your SQL query in Flux and use [`iox.sql()`](/flux/v0.x/stdlib/experimental/iox/)
to query the InfluxDB IOx storage engine with SQL.
Provide the following:

- **Bucket name** with the `bucket` parameter
- **SQL query** with the `query` parameter

{{< expand-wrapper >}}
{{% expand "View `iox.sql()` Flux example" %}}
```js
import "experimental/iox"

iox.sql(
    bucket: "example-bucket",
    query: "SELECT * FROM measurement'"
)
```
{{% /expand %}}
{{< /expand-wrapper >}}

1.  If you haven't already, [download, install, and configure the `influx` CLI](/influxdb/cloud-iox/tools/influx-cli/).
2.  Use the [`influx query` command](/influxdb/cloud-iox/reference/cli/influx/query/)
    to query InfluxDB using Flux.
    
    **Provide the following**:

    - String-encoded Flux query that uses `iox.sql()` to query the InfluxDB IOx
      storage engine with SQL.
    - [Connection and authentication credentials](/influxdb/cloud-iox/get-started/setup/?t=influx+CLI#configure-authentication-credentials)

{{% influxdb/custom-timestamps %}}
```sh
influx query "
import \"experimental/iox\"

iox.sql(
    bucket: \"get-started\",
    query: \"
        SELECT
          *
        FROM
          home
        WHERE
          time >= '2022-01-01T08:00:00Z'
          AND time <= '2022-01-01T20:00:00Z'
    \",
)"
```
{{% /influxdb/custom-timestamps %}}

<!--------------------------- END FLUX CLI CONTENT ---------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!-------------------------- BEGIN FLUX API CONTENT --------------------------->

To query data from InfluxDB using SQL and the InfluxDB HTTP API, send a request
to the InfluxDB API [`/api/v2/query` endpoint](/influxdb/cloud-iox/api/#operation/PostQuery)
using the `POST` request method.

{{< api-endpoint endpoint="http://localhost:8086/api/v2/query" method="post" >}}

The `/api/v2/query` endpoint only accepts Flux queries.
To query data with SQL, wrap your SQL query in Flux and use [`iox.sql()`](/flux/v0.x/stdlib/experimental/iox/)
to query the InfluxDB IOx storage engine with SQL.
Provide the following:

- **Bucket name** with the `bucket` parameter
- **SQL query** with the `query` parameter

{{< expand-wrapper >}}
{{% expand "View `iox.sql()` Flux example" %}}
```js
import "experimental/iox"

iox.sql(
    bucket: "example-bucket",
    query: "SELECT * FROM measurement'"
)
```
{{% /expand %}}
{{< /expand-wrapper >}}

Include the following with your request:

- **Headers**:
  - **Authorization**: Token <INFLUX_TOKEN>
  - **Content-Type**: application/vnd.flux
  - **Accept**: application/csv
  - _(Optional)_ **Accept-Encoding**: gzip
- **Request body**: Flux query as plain text. In the Flux query, use `iox.sql()`
  and provide your bucket name and your SQL query.

The following example uses cURL and the InfluxDB API to query data with Flux:


{{% influxdb/custom-timestamps %}}
```sh
curl --request POST \
"$INFLUX_HOST/api/v2/query" \
  --header "Authorization: Token $INFLUX_TOKEN" \
  --header "Content-Type: application/vnd.flux" \
  --header "Accept: application/csv" \
  --data "
    import \"experimental/iox\"

    iox.sql(
        bucket: \"get-started\",
        query: \"
            SELECT
              *
            FROM
              home
            WHERE
              time >= '2022-01-01T08:00:00Z'
              AND time <= '2022-01-01T20:00:00Z'
        \",
    )"
```
{{% /influxdb/custom-timestamps %}}


{{% note %}}
The InfluxDB `/api/v2/query` endpoint returns query results in
[annotated CSV](/influxdb/cloud-iox/reference/syntax/annotated-csv/).
{{% /note %}}

<!--------------------------- END FLUX API CONTENT ---------------------------->
{{% /tab-content %}}
{{< /tabs-wrapper >}}

### Query results
{{< expand-wrapper >}}
{{% expand "View query results" %}}

{{% influxdb/custom-timestamps %}}
| time                 | room        |  co |  hum | temp |
| :------------------- | :---------- | --: | ---: | ---: |
| 2022-01-01T08:00:00Z | Kitchen     |   0 | 35.9 |   21 |
| 2022-01-01T09:00:00Z | Kitchen     |   0 | 36.2 |   23 |
| 2022-01-01T10:00:00Z | Kitchen     |   0 | 36.1 | 22.7 |
| 2022-01-01T11:00:00Z | Kitchen     |   0 |   36 | 22.4 |
| 2022-01-01T12:00:00Z | Kitchen     |   0 |   36 | 22.5 |
| 2022-01-01T13:00:00Z | Kitchen     |   1 | 36.5 | 22.8 |
| 2022-01-01T14:00:00Z | Kitchen     |   1 | 36.3 | 22.8 |
| 2022-01-01T15:00:00Z | Kitchen     |   3 | 36.2 | 22.7 |
| 2022-01-01T16:00:00Z | Kitchen     |   7 |   36 | 22.4 |
| 2022-01-01T17:00:00Z | Kitchen     |   9 |   36 | 22.7 |
| 2022-01-01T18:00:00Z | Kitchen     |  18 | 36.9 | 23.3 |
| 2022-01-01T19:00:00Z | Kitchen     |  22 | 36.6 | 23.1 |
| 2022-01-01T20:00:00Z | Kitchen     |  26 | 36.5 | 22.7 |
| 2022-01-01T08:00:00Z | Living Room |   0 | 35.9 | 21.1 |
| 2022-01-01T09:00:00Z | Living Room |   0 | 35.9 | 21.4 |
| 2022-01-01T10:00:00Z | Living Room |   0 |   36 | 21.8 |
| 2022-01-01T11:00:00Z | Living Room |   0 |   36 | 22.2 |
| 2022-01-01T12:00:00Z | Living Room |   0 | 35.9 | 22.2 |
| 2022-01-01T13:00:00Z | Living Room |   0 |   36 | 22.4 |
| 2022-01-01T14:00:00Z | Living Room |   0 | 36.1 | 22.3 |
| 2022-01-01T15:00:00Z | Living Room |   1 | 36.1 | 22.3 |
| 2022-01-01T16:00:00Z | Living Room |   4 |   36 | 22.4 |
| 2022-01-01T17:00:00Z | Living Room |   5 | 35.9 | 22.6 |
| 2022-01-01T18:00:00Z | Living Room |   9 | 36.2 | 22.8 |
| 2022-01-01T19:00:00Z | Living Room |  14 | 36.3 | 22.5 |
| 2022-01-01T20:00:00Z | Living Room |  17 | 36.4 | 22.2 |
{{% /influxdb/custom-timestamps %}}

{{% /expand %}}
{{< /expand-wrapper >}}

**Congratulations!** You've learned the basics of querying data in InfluxDB with SQL.
For a deep dive into all the ways you can query InfluxDB, see the
[Query data in InfluxDB](/influxdb/cloud-iox/query-data/) section of documentation.

{{< page-nav prev="/influxdb/cloud-iox/get-started/write/" keepTab=true >}}
