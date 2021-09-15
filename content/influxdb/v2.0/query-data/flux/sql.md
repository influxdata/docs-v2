---
title: Query SQL data sources
seotitle: Query SQL data sources with InfluxDB
list_title: Query SQL data
description: >
  The Flux `sql` package provides functions for working with SQL data sources.
  Use `sql.from()` to query SQL databases like PostgreSQL, MySQL, Snowflake,
  SQLite, Microsoft SQL Server, Amazon Athena, and Google BigQuery.
influxdb/v2.0/tags: [query, flux, sql]
menu:
  influxdb_2_0:
    parent: Query with Flux
    list_title: SQL data
weight: 220
aliases:
  - /influxdb/v2.0/query-data/guides/sql/
related:
  - /{{< latest "flux" >}}/stdlib/sql/
list_code_example: |
  ```js
  import "sql"

  sql.from(
    driverName: "postgres",
    dataSourceName: "postgresql://user:password@localhost",
    query: "SELECT * FROM example_table"
  )
  ```
---

The [Flux](/influxdb/v2.0/reference/flux) `sql` package provides functions for working with SQL data sources.
[`sql.from()`](/{{< latest "flux" >}}/stdlib/sql/from/) lets you query SQL data sources
like [PostgreSQL](https://www.postgresql.org/), [MySQL](https://www.mysql.com/),
[Snowflake](https://www.snowflake.com/), [SQLite](https://www.sqlite.org/index.html),
[Microsoft SQL Server](https://www.microsoft.com/en-us/sql-server/default.aspx),
[Amazon Athena](https://aws.amazon.com/athena/) and [Google BigQuery](https://cloud.google.com/bigquery)
and use the results with InfluxDB dashboards, tasks, and other operations.

- [Query a SQL data source](#query-a-sql-data-source)
- [Join SQL data with data in InfluxDB](#join-sql-data-with-data-in-influxdb)
- [Use SQL results to populate dashboard variables](#use-sql-results-to-populate-dashboard-variables)
- [Use secrets to store SQL database credentials](#use-secrets-to-store-sql-database-credentials)
- [Sample sensor data](#sample-sensor-data)

If you're just getting started with Flux queries, check out the following:

- [Get started with Flux](/{{< latest "flux" >}}//get-started/) for a conceptual overview of Flux and parts of a Flux query.
- [Execute queries](/influxdb/v2.0/query-data/execute-queries/) to discover a variety of ways to run your queries.

## Query a SQL data source
To query a SQL data source:

1. Import the `sql` package in your Flux query
2. Use the `sql.from()` function to specify the driver, data source name (DSN),
   and query used to query data from your SQL data source:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[PostgreSQL](#)
[MySQL](#)
[Snowflake](#)
[SQLite](#)
[SQL Server](#)
[Athena](#)
[BigQuery](#)
{{% /code-tabs %}}

{{% code-tab-content %}}
```js
import "sql"

sql.from(
  driverName: "postgres",
  dataSourceName: "postgresql://user:password@localhost",
  query: "SELECT * FROM example_table"
)
```
{{% /code-tab-content %}}

{{% code-tab-content %}}
```js
import "sql"

sql.from(
  driverName: "mysql",
  dataSourceName: "user:password@tcp(localhost:3306)/db",
  query: "SELECT * FROM example_table"
)
```
{{% /code-tab-content %}}

{{% code-tab-content %}}
```js
import "sql"

sql.from(
  driverName: "snowflake",
  dataSourceName: "user:password@account/db/exampleschema?warehouse=wh",
  query: "SELECT * FROM example_table"
)
```
{{% /code-tab-content %}}

{{% code-tab-content %}}
```js
// NOTE: InfluxDB OSS and InfluxDB Cloud do not have access to
// the local filesystem and cannot query SQLite data sources.
// Use the Flux REPL to query an SQLite data source.

import "sql"

sql.from(
  driverName: "sqlite3",
  dataSourceName: "file:/path/to/test.db?cache=shared&mode=ro",
  query: "SELECT * FROM example_table"
)
```
{{% /code-tab-content %}}

{{% code-tab-content %}}
```js
import "sql"

sql.from(
  driverName: "sqlserver",
  dataSourceName: "sqlserver://user:password@localhost:1234?database=examplebdb",
  query: "GO SELECT * FROM Example.Table"
)
```

_For information about authenticating with SQL Server using ADO-style parameters,
see [SQL Server ADO authentication](/{{< latest "flux" >}}/stdlib/sql/from/#sql-server-ado-authentication)._
{{% /code-tab-content %}}

{{% code-tab-content %}}
```js
import "sql"
sql.from(
  driverName: "awsathena",
  dataSourceName: "s3://myorgqueryresults/?accessID=12ab34cd56ef&region=region-name&secretAccessKey=y0urSup3rs3crEtT0k3n",
  query: "GO SELECT * FROM Example.Table"
)
```

_For information about parameters to include in the Athena DSN,
see [Athena connection string](/{{< latest "flux" >}}/stdlib/sql/from/#athena-connection-string)._
{{% /code-tab-content %}}
{{% code-tab-content %}}
```js
import "sql"
sql.from(
  driverName: "bigquery",
  dataSourceName: "bigquery://projectid/?apiKey=mySuP3r5ecR3tAP1K3y",
  query: "SELECT * FROM exampleTable"
)
```

_For information about authenticating with BigQuery, see
[BigQuery authentication parameters](/{{< latest "flux" >}}/stdlib/sql/from/#bigquery-authentication-parameters)._
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

_See the [`sql.from()` documentation](/{{< latest "flux" >}}/stdlib/sql/from/) for
information about required function parameters._

## Join SQL data with data in InfluxDB
One of the primary benefits of querying SQL data sources from InfluxDB
is the ability to enrich query results with data stored outside of InfluxDB.

Using the [air sensor sample data](#sample-sensor-data) below, the following query
joins air sensor metrics stored in InfluxDB with sensor information stored in PostgreSQL.
The joined data lets you query and filter results based on sensor information
that isn't stored in InfluxDB.

```js
// Import the "sql" package
import "sql"

// Query data from PostgreSQL
sensorInfo = sql.from(
  driverName: "postgres",
  dataSourceName: "postgresql://localhost?sslmode=disable",
  query: "SELECT * FROM sensors"
)

// Query data from InfluxDB
sensorMetrics = from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "airSensors")

// Join InfluxDB query results with PostgreSQL query results
join(tables: {metric: sensorMetrics, info: sensorInfo}, on: ["sensor_id"])
```

## Use SQL results to populate dashboard variables
Use `sql.from()` to [create dashboard variables](/influxdb/v2.0/visualize-data/variables/create-variable/)
from SQL query results.
The following example uses the [air sensor sample data](#sample-sensor-data) below to
create a variable that lets you select the location of a sensor.

```js
import "sql"

sql.from(
    driverName: "postgres",
    dataSourceName: "postgresql://localhost?sslmode=disable",
    query: "SELECT * FROM sensors"
  )
  |> rename(columns: {location: "_value"})
  |> keep(columns: ["_value"])
```

Use the variable to manipulate queries in your dashboards.

{{< img-hd src="/img/influxdb/2-0-sql-dashboard-variable.png" alt="Dashboard variable from SQL query results" />}}

---

## Use secrets to store SQL database credentials
If your SQL database requires authentication, use [InfluxDB secrets](/influxdb/v2.0/security/secrets/)
to store and populate connection credentials.
By default, InfluxDB base64-encodes and stores secrets in its internal key-value store, BoltDB.
For added security, [store secrets in Vault](/influxdb/v2.0/security/secrets/use-vault/).

### Store your database credentials as secrets
Use the [InfluxDB API](/influxdb/v2.0/reference/api/) or the [`influx` CLI](/influxdb/v2.0/reference/cli/influx/secret/)
to store your database credentials as secrets.

{{< tabs-wrapper >}}
{{% tabs %}}
[InfluxDB API](#)
[influx CLI](#)
{{% /tabs %}}
{{% tab-content %}}
```sh
curl --request PATCH http://localhost:8086/api/v2/orgs/<org-id>/secrets \
  --header 'Authorization: Token YOURAUTHTOKEN' \
  --header 'Content-type: application/json' \
  --data '{
  "POSTGRES_HOST": "http://example.com",
  "POSTGRES_USER": "example-username",
  "POSTGRES_PASS": "example-password"
}'
```

**To store secrets, you need:**

- [your organization ID](/influxdb/v2.0/organizations/view-orgs/#view-your-organization-id)  
- [your API token](/influxdb/v2.0/security/tokens/view-tokens/)
{{% /tab-content %}}
{{% tab-content %}}
```sh
# Syntax
influx secret update -k <secret-key>

# Example
influx secret update -k POSTGRES_PASS
```

**When prompted, enter your secret value.**

{{% warn %}}
You can provide the secret value with the `-v`, `--value` flag, but the **plain text
secret may appear in your shell history**.

```sh
influx secret update -k <secret-key> -v <secret-value>
```
{{% /warn %}}
{{% /tab-content %}}
{{< /tabs-wrapper >}}

### Use secrets in your query
Import the `influxdata/influxdb/secrets` package and use [string interpolation](/{{< latest "flux" >}}/spec/string-interpolation/)
to populate connection credentials with stored secrets in your Flux query.

```js
import "sql"
import "influxdata/influxdb/secrets"

POSTGRES_HOST = secrets.get(key: "POSTGRES_HOST")
POSTGRES_USER = secrets.get(key: "POSTGRES_USER")
POSTGRES_PASS = secrets.get(key: "POSTGRES_PASS")

sql.from(
  driverName: "postgres",
  dataSourceName: "postgresql://${POSTGRES_USER}:${POSTGRES_PASS}@${POSTGRES_HOST}",
  query: "SELECT * FROM sensors"
)
```

---

## Sample sensor data
The [air sensor sample data](#download-sample-air-sensor-data) and
[sample sensor information](#import-the-sample-sensor-information) simulate a
group of sensors that measure temperature, humidity, and carbon monoxide
in rooms throughout a building.
Each collected data point is stored in InfluxDB with a `sensor_id` tag that identifies
the specific sensor it came from.
Sample sensor information is stored in PostgreSQL.

**Sample data includes:**

- Simulated data collected from each sensor and stored in the `airSensors` measurement in **InfluxDB**:
  - temperature
  - humidity
  - co

- Information about each sensor stored in the `sensors` table in **PostgreSQL**:
  - sensor_id
  - location
  - model_number
  - last_inspected

#### Download sample air sensor data

1.  [Create a bucket](/influxdb/v2.0/organizations/buckets/create-bucket/) to store the data.
2.  [Create an InfluxDB task](/influxdb/v2.0/process-data/manage-tasks/create-task/)
    and use the [`sample.data()` function](/{{< latest "flux" >}}/stdlib/influxdata/influxdb/sample/data/)
    to download sample air sensor data every 15 minutes.
    Write the downloaded sample data to your new bucket:

    ```js
    import "influxdata/influxdb/sample"

    option task = {
      name: "Collect sample air sensor data",
      every: 15m
    }

    sample.data(set: "airSensor")
      |> to(
        org: "example-org",
        bucket: "example-bucket"
      )
    ```

3.  [Query your target bucket](/influxdb/v2.0/query-data/execute-queries/) after
    the first task run to ensure the sample data is writing successfully.

    ```js
    from(bucket: "example-bucket")
       |> range(start: -1m)
       |> filter(fn: (r) => r._measurement == "airSensors")
    ```

#### Import the sample sensor information
1. [Download and install PostgreSQL](https://www.postgresql.org/download/).
2. Download the sample sensor information CSV.

    <a class="btn download" href="https://influx-testdata.s3.amazonaws.com/sample-sensor-info.csv" download>Download sample sensor information</a>

3. Use a PostgreSQL client (`psql` or a GUI) to create the `sensors` table:

    ```
    CREATE TABLE sensors (
      sensor_id character varying(50),
      location character varying(50),
      model_number character varying(50),
      last_inspected date
    );
    ```

4. Import the downloaded CSV sample data.
   _Update the `FROM` file path to the path of the downloaded CSV sample data._

    ```
    COPY sensors(sensor_id,location,model_number,last_inspected)
    FROM '/path/to/sample-sensor-info.csv' DELIMITER ',' CSV HEADER;
    ```

5. Query the table to ensure the data was imported correctly:

    ```
    SELECT * FROM sensors;
    ```

#### Import the sample data dashboard
Download and import the Air Sensors dashboard to visualize the generated data:

<a class="btn github" href="https://raw.githubusercontent.com/influxdata/influxdb2-sample-data/master/air-sensor-data/air-sensors-dashboard.json" target="_blank">View Air Sensors dashboard JSON</a>

_For information about importing a dashboard, see [Create a dashboard](/influxdb/v2.0/visualize-data/dashboards/create-dashboard)._
