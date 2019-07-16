---
title: Query SQL data sources
seotitle: Query SQL data sources with InfluxDB
description: >
  placeholder
v2.0/tags: [query, flux, sql]
menu:
  v2_0:
    parent: How-to guides
weight: 207
---

The [Flux](/v2.0/reference/flux) `sql` package provides functions for working with SQL data sources.
[`sql.from()`](/v2.0/reference/flux/functions/sql/from/) lets you query SQL databases
like [PostgreSQL](https://www.postgresql.org/) and [MySQL](https://www.mysql.com/)
and use the results with InfluxDB dashboards, tasks, and other operations.

To query a SQL data source, import the `sql` package in your Flux query and use
the `sql.from()` function:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Postgres](#)
[MySQL](#)
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
{{< /code-tabs-wrapper >}}

_See the [`sql.from()` documentation](/v2.0/reference/flux/functions/sql/from/) for
information about required function parameters._

## Use cases

### Join SQL results with time series data
One of the primary benefits of querying SQL data sources from InfluxDB
is the ability to enrich query results with data stored outside of InfluxDB.

Using the [air sensor sample data](#sample-data) below, the following query
joins air sensor metrics stored in InfluxDB with sensor information stored in PostgreSQL.
The joined data lets you query and filter results based on sensor information
that isn't stored in InfluxDB.

```js
import "sql"

sensorInfo = sql.from(
  driverName: "postgres",
  dataSourceName: "postgresql://localhost?sslmode=disable",
  query: "SELECT * FROM sensors"
)

sensorMetrics = from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "airSensors")

join(tables: {metric: sensorMetrics, info: sensorInfo}, on: ["sensor_id"])
```

### Create dashboard variables using SQL results
Use `sql.from()` to [create dashboard variables](/v2.0/visualize-data/variables/create-variable/)
from SQL query results.
The following example uses the [air sensor sample data](#sample-data) below to
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

{{< img-hd src="/img/2-0-sql-dashboard-variable.png" alt="Dashboard variable from SQL query results" />}}

---

## Sample data
The [sample data generator](#sample-data-generator) and [sample sensor information](#sample-sensor-information)
simulate a group of sensors that measure temperature, humidity, and carbon monoxide
in rooms throughout a building.
Each collected data point is stored in InfluxDB with a `sensor_id` tag that identifies
the specific sensor it came from.

Observed sensor data is stored in the `airSensors` measurement which contains the following fields:

- temperature
- humidity
- co

Information about each sensor is stored in a `sensors` table in a Postgres database:

- sensor_id
- location
- model_number
- last_inspected

#### Sample data generator
`air-sensor-data` is a CLI that generates air sensor data and stores the data in InfluxDB.
To use `air-sensor-data`:

1. [Create a bucket](/v2.0/organizations/buckets/create-bucket/) to store the data.
2. Get your [authorization token](/v2.0/security/tokens/view-tokens/).
3. Download the sample data generator. _This tool requires **Ruby**._

    <a class="btn download" href="/downloads/air-sensor-data" download>Download Air Sensor Generator</a>

4. Give `air-sensor-data` executable permissions:

    ```sh
    chmod +x air-sensor-data
    ```

5. Start the generator. Specify your organization, bucket, and authorization token:

    ```sh
    ./air-sensor-data -o your-org -b your-bucket -t YOURAUTHTOKEN
    ```

    The generator begins to write data to InfluxDB.

    _**Note:** Use the `--help` flag to view other configuration options._

## Sample sensor information
1. [Download and install Postgres](https://www.postgresql.org/download/).
2. Download the sample sensor information CSV.

    <a class="btn download" href="/downloads/sample-sensor-info.csv" download>Download Sample Data</a>

3. Use a Postgres client (`psql` or a GUI) to create the `sensors` table:

    ```sql
    CREATE TABLE sensors (
      sensor_id character varying(50),
      location character varying(50),
      model_number character varying(50),
      last_inspected date
    );
    ```

4. Import the downloaded CSV sample data.
   _Update the `FROM` file path to the path of the downloaded CSV sample data._

    ```sql
    COPY sensors(sensor_id,location,model_number,last_inspected)
    FROM '/path/to/sample-sensor-info.csv' DELIMITER ',' CSV HEADER;
    ```

5. Query the table to ensure the data was imported correctly:

    ```sql
    SELECT * FROM sensors;
    ```

#### Sample dashboard
Download and import the Air Sensors dashboard to visualize the generated data:

<a class="btn download" href="/downloads/air_sensors_dashboard.json" download>Download Air Sensors dashboard</a>

_See [Create a dashboard](/v2.0/visualize-data/dashboards/create-dashboard/#create-a-new-dashboard)
for information about importing a dashboard._
