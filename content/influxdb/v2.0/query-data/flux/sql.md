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
  - /influxdb/v2.0/reference/flux/stdlib/sql/
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
[`sql.from()`](/influxdb/v2.0/reference/flux/stdlib/sql/from/) lets you query SQL data sources
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

- [Get started with Flux](/influxdb/v2.0/query-data/get-started/) for a conceptual overview of Flux and parts of a Flux query.
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
see [SQL Server ADO authentication](/influxdb/v2.0/reference/flux/stdlib/sql/from/#sql-server-ado-authentication)._
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
see [Athena connection string](/influxdb/v2.0/reference/flux/stdlib/sql/from/#athena-connection-string)._
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
[BigQuery authentication parameters](/influxdb/v2.0/reference/flux/stdlib/sql/from/#bigquery-authentication-parameters)._
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

_See the [`sql.from()` documentation](/influxdb/v2.0/reference/flux/stdlib/sql/from/) for
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
- [your authentication token](/influxdb/v2.0/security/tokens/view-tokens/)
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
Import the `influxdata/influxdb/secrets` package and use [string interpolation](/influxdb/v2.0/reference/flux/language/string-interpolation/)
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
The [sample data generator](#download-and-run-the-sample-data-generator) and
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

### Import and generate sample sensor data

#### Download and run the sample data generator
`air-sensor-data.rb` is a script that generates air sensor data and stores the data in InfluxDB.
To use `air-sensor-data.rb`:

1. [Create a bucket](/influxdb/v2.0/organizations/buckets/create-bucket/) to store the data.
2. Download the sample data generator. _This tool requires [Ruby](https://www.ruby-lang.org/en/)._

    <a class="btn download" href="/downloads/air-sensor-data.rb" download>Download Air Sensor Generator</a>

3. Give `air-sensor-data.rb` executable permissions:

    ```
    chmod +x air-sensor-data.rb
    ```

4. Start the generator. Specify your organization, bucket, and authorization token.
  _For information about retrieving your token, see [View tokens](/influxdb/v2.0/security/tokens/view-tokens/)._

    ```
    ./air-sensor-data.rb -o your-org -b your-bucket -t YOURAUTHTOKEN
    ```

    The generator begins to write data to InfluxDB and will continue until stopped.
    Use `ctrl-c` to stop the generator.

    {{% note %}}
    Use the `--help` flag to view other configuration options.
    {{% /note %}}

5. [Query your target bucket](/influxdb/v2.0/query-data/execute-queries/) to ensure the
   generated data is writing successfully.
   The generator doesn't catch errors from write requests, so it will continue running
   even if data is not writing to InfluxDB successfully.

    ```
    from(bucket: "example-bucket")
       |> range(start: -1m)
       |> filter(fn: (r) => r._measurement == "airSensors")
    ```

#### Import the sample sensor information
1. [Download and install PostgreSQL](https://www.postgresql.org/download/).
2. Download the sample sensor information CSV.

    <a class="btn download" href="/downloads/sample-sensor-info.csv" download>Download Sample Data</a>

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

<a class="btn download" href="/downloads/air-sensors-dashboard.json" download>Download Air Sensors dashboard</a>

_For information about importing a dashboard, see [Create a dashboard](/influxdb/v2.0/visualize-data/dashboards/create-dashboard/#create-a-new-dashboard)._
