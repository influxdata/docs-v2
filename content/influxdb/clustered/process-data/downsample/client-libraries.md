---
title: Downsample data with client libraries
description: >
  Use InfluxDB client libraries to query and downsample time series data stored
  in InfluxDB then write the downsampled data back to InfluxDB.
menu:
  influxdb_clustered:
    name: Use client libraries
    parent: Downsample data
    identifier: downsample-client-libs
weight: 201
related:
  - /influxdb/clustered/query-data/sql/aggregate-select/, Aggregate or apply selector functions to data (SQL)
---

Query and downsample time series data stored in InfluxDB and write the
downsampled data back to InfluxDB.

This guide uses [Python](https://www.python.org/) and the
[InfluxDB v3 Python client library](https://github.com/InfluxCommunity/influxdb3-python),
but you can use your runtime of choice and any of the available
[InfluxDB v3 client libraries](/influxdb/clustered/reference/client-libraries/v3/).
This guide also assumes you have already
[setup your Python project and virtual environment](/influxdb/clustered/query-data/execute-queries/client-libraries/python/#create-a-python-virtual-environment).

- [Install dependencies](#install-dependencies)
- [Prepare InfluxDB databases](#prepare-influxdb-databases)
- [Create InfluxDB clients](#create-influxdb-clients)
- [Query InfluxDB](#query-influxdb)
  - [Define a query that performs time-based aggregations](#define-a-query-that-performs-time-based-aggregations)
  - [Execute the query](#execute-the-query)
- [Write the downsampled data back to InfluxDB](#write-the-downsampled-data-back-to-influxdb)
- [Full downsampling script](#full-downsampling-script)

## Install dependencies

Use `pip` to install the following dependencies:

- `influxdb_client_3`
- `pandas`

```sh
pip install influxdb3-python pandas
```

## Prepare InfluxDB databases

The downsampling process involves two InfluxDB databases.
Each bucket has a [retention period](/influxdb/clustered/reference/glossary/#retention-period)
that specifies how long data persists in the database before it expires and is deleted.
By using two buckets, you can store unmodified, high-resolution data in a bucket
with a shorter retention period and then downsampled, low-resolution data in a
bucket with a longer retention period.

Ensure you have a bucket for each of the following:

- One to query unmodified data from
- The other to write downsampled data to

For information about creating buckets, see
[Create a bucket](/influxdb/cloud-serverless/admin/buckets/create-bucket/).

## Create InfluxDB clients

Use the `InfluxDBClient3` function in the `influxdb_client_3` module to 
instantiate two InfluxDB clients:

- One configured to connect to your InfluxDB bucket with _unmodified_ data.
- The other configured to connect to the InfluxDB bucket that you want to
  write _downsampled_ data to.

Provide the following credentials for each client:

- **host**: [{{< product-name >}} region URL](/influxdb/cloud-serverless/reference/regions)
  _(without the protocol)_
- **org**: InfluxDB organization name
- **token**: InfluxDB API token with read and write permissions on the buckets you
  want to query and write to.
- **database**: InfluxDB bucket name

{{% code-placeholders "(API|(RAW|DOWNSAMPLED)_BUCKET|ORG)_(NAME|TOKEN)" %}}
```py
from influxdb_client_3 import InfluxDBClient3
import pandas

# Instantiate an InfluxDBClient3 client configured for your unmodified bucket
influxdb_raw = InfluxDBClient3(
    host='{{< influxdb/host >}}',
    token='API_TOKEN',
    database='RAW_BUCKET_NAME'
)

# Instantiate an InfluxDBClient3 client configured for your downsampled database.
# When writing, the org= argument is required by the client (but ignored by InfluxDB).
influxdb_downsampled = InfluxDBClient3(
    host='{{< influxdb/host >}}',
    token='API_TOKEN',
    database='DOWNSAMPLED_BUCKET_NAME',
    org=''
)
```
{{% /code-placeholders %}}

## Query InfluxDB

### Define a query that performs time-based aggregations

The most common method used to downsample time series data is to perform aggregate
or selector operations on intervals of time. For example, return the average value
for each hour in the queried time range.

Use either SQL or InfluxQL to downsample data by applying aggregate or selector
functions to time intervals.

{{< tabs-wrapper >}}
{{% tabs "medium" %}}
[SQL](#)
[InfluxQL](#)
{{% /tabs %}}

<!--------------------------------- BEGIN SQL --------------------------------->
{{% tab-content %}}

1.  In the `SELECT` clause:

    - Use [`DATE_BIN`](/influxdb/cloud-serverless/reference/sql/functions/time-and-date/#date_bin)
      to assign each row to an interval based on the row's timestamp and update
      the `time` column with the assigned interval timestamp.
      You can also use [`DATE_BIN_GAPFILL`](/influxdb/cloud-serverless/reference/sql/functions/time-and-date/#date_bin_gapfill) 
      to fill any gaps created by intervals with no data
      _(see [Fill gaps in data with SQL](/influxdb/cloud-serverless/query-data/sql/fill-gaps/))_.
    - Apply an [aggregate](/influxdb/cloud-serverless/reference/sql/functions/aggregate/)
      or [selector](/influxdb/cloud-serverless/reference/sql/functions/selector/)
      function to each queried field.

2.  Include a `GROUP BY` clause that groups by intervals returned from the `DATE_BIN`
    function in your `SELECT` clause and any other queried tags.
    The example below uses `GROUP BY 1` to group by the first column in the
    `SELECT` clause.
3.  Include an `ORDER BY` clause that sorts data by `time`.

_For more information, see
[Aggregate data with SQL - Downsample data by applying interval-based aggregates](/influxdb/cloud-serverless/query-data/sql/aggregate-select/#downsample-data-by-applying-interval-based-aggregates)._

```sql
SELECT
  DATE_BIN(INTERVAL '1 hour', time) AS time,
  room,
  AVG(temp) AS temp,
  AVG(hum) AS hum,
  AVG(co) AS co
FROM home
--In WHERE, time refers to <source_table>.time
WHERE time >= now() - INTERVAL '24 hours'
--1 refers to the DATE_BIN column
GROUP BY 1, room
ORDER BY time
```
{{% /tab-content %}}
<!---------------------------------- END SQL ---------------------------------->

<!------------------------------- BEGIN INFLUXQL ------------------------------>
{{% tab-content %}}

1.  In the `SELECT` clause, apply an
    [aggregate](/influxdb/cloud-serverless/reference/influxql/functions/aggregates/)
    or [selector](/influxdb/cloud-serverless/reference/influxql/functions/selectors/)
    function to queried fields.

2.  Include a `GROUP BY` clause that groups by `time()` at a specified interval.


```sql
SELECT
  MEAN(temp) AS temp,
  MEAN(hum) AS hum,
  MEAN(co) AS co
FROM home
WHERE time >= now() - 24h
GROUP BY time(1h)
```
{{% /tab-content %}}
<!-------------------------------- END INFLUXQL ------------------------------->
{{< /tabs-wrapper >}}

### Execute the query

1.  Assign the query string to a variable.
2.  Use the `query` method of your [instantiated client](#create-an-influxdb-client)
    to query raw data from InfluxDB. Provide the following arguments.

    - **query**: Query string to execute
    - **language**: `sql` or `influxql`

3.  Use the `to_pandas` method to convert the returned Arrow table to a Pandas DataFrame.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[SQL](#)
[InfluxQL](#)
{{% /code-tabs %}}

<!--------------------------------- BEGIN SQL --------------------------------->
{{% code-tab-content %}}
```py
# ...

query = '''
SELECT
  DATE_BIN(INTERVAL '1 hour', time) AS time,
  room,
  AVG(temp) AS temp,
  AVG(hum) AS hum,
  AVG(co) AS co
FROM home
--In WHERE, time refers to <source_table>.time
WHERE time >= now() - INTERVAL '24 hours'
--1 refers to the DATE_BIN column
GROUP BY 1, room
ORDER BY 1
'''

table = influxdb_raw.query(query=query, language="sql")
data_frame = table.to_pandas()
```
{{% /code-tab-content %}}
<!---------------------------------- END SQL ---------------------------------->

<!------------------------------- BEGIN INFLUXQL ------------------------------>
{{% code-tab-content %}}
```py
# ...

query = '''
SELECT
  MEAN(temp) AS temp,
  MEAN(hum) AS hum,
  MEAN(co) AS co
FROM home
WHERE time >= now() - 24h
GROUP BY time(1h)
'''

table = influxdb_raw.query(query=query, language="influxql")
data_frame = table.to_pandas()
```
{{% /code-tab-content %}}
<!-------------------------------- END INFLUXQL ------------------------------->\

{{< /code-tabs-wrapper >}}

## Write the downsampled data back to InfluxDB

1.  _For InfluxQL query results_, delete (`drop`) the `iox::measurement` column _before_ writing data back to InfluxDB.
    You'll avoid measurement name conflicts when querying your downsampled data later. 
2.  Use the `sort_values` method to sort data in the Pandas DataFrame by `time`
    to ensure writing back to InfluxDB is as performant as possible.
2.  Use the `write` method of your [instantiated downsampled client](#create-an-influxdb-client)
    to write the query results back to your InfluxDB bucket for downsampled data.
    Include the following arguments:

    - **record**: Pandas DataFrame containing downsampled data
    - **data_frame_measurement_name**: Destination measurement name
    - **data_frame_timestamp_column**: Column containing timestamps for each point
    - **data_frame_tag_columns**: List of [tag](/influxdb/cloud-serverless/reference/glossary/#tag)
      columns 
      
    {{% note %}}
Columns not listed in the **data_frame_tag_columns** or **data_frame_timestamp_column**
arguments are written to InfluxDB as [fields](/influxdb/cloud-serverless/reference/glossary/#field).
    {{% /note %}}

```py
# ...

data_frame = data_frame.sort_values(by="time")

influxdb_downsampled.write(
    record=data_frame,
    data_frame_measurement_name="home_ds",
    data_frame_timestamp_column="time",
    data_frame_tag_columns=['room']
)
```

## Full downsampling script

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[SQL](#)
[InfluxQL](#)
{{% /code-tabs %}}

<!--------------------------------- BEGIN SQL --------------------------------->
{{% code-tab-content %}}

{{% code-placeholders "(API|(RAW|DOWNSAMPLED)_BUCKET|ORG)_(NAME|TOKEN)" %}}
```py
from influxdb_client_3 import InfluxDBClient3
import pandas

influxdb_raw = InfluxDBClient3(
    host='{{< influxdb/host >}}',
    token='API_TOKEN',
    database='RAW_BUCKET_NAME'
)

# When writing, the org= argument is required by the client (but ignored by InfluxDB).
influxdb_downsampled = InfluxDBClient3(
    host='{{< influxdb/host >}}',
    token='API_TOKEN',
    database='DOWNSAMPLED_BUCKET_NAME',
    org=''
)

query = '''
SELECT
  DATE_BIN(INTERVAL '1 hour', time) AS time,
  room,
  AVG(temp) AS temp,
  AVG(hum) AS hum,
  AVG(co) AS co
FROM home
--In WHERE, time refers to <source_table>.time
WHERE time >= now() - INTERVAL '24 hours'
--1 refers to the DATE_BIN column
GROUP BY 1, room
ORDER BY 1
'''

table = influxdb_raw.query(query=query, language="sql")
data_frame = table.to_pandas()
data_frame = data_frame.sort_values(by="time")

influxdb_downsampled.write(
    record=data_frame,
    data_frame_measurement_name="home_ds",
    data_frame_timestamp_column="time",
    data_frame_tag_columns=['room']
)
```
{{% /code-placeholders %}}

{{% /code-tab-content %}}
<!---------------------------------- END SQL ---------------------------------->

<!------------------------------- BEGIN INFLUXQL ------------------------------>
{{% code-tab-content %}}

{{% code-placeholders "(API|(RAW|DOWNSAMPLED)_BUCKET|ORG)_(NAME|TOKEN)" %}}
```py
from influxdb_client_3 import InfluxDBClient3
import pandas

influxdb_raw = InfluxDBClient3(
    host='{{< influxdb/host >}}',
    org='ORG_NAME',
    token='API_TOKEN',
    database='RAW_BUCKET_NAME'
)

# When writing, the org= argument is required by the client (but ignored by InfluxDB).
influxdb_downsampled = InfluxDBClient3(
    host='{{< influxdb/host >}}',
    token='API_TOKEN',
    database='DOWNSAMPLED_BUCKET_NAME',
    org=''
)

query = '''
SELECT
  MEAN(temp) AS temp,
  MEAN(hum) AS hum,
  MEAN(co) AS co
FROM home
WHERE time >= now() - 24h
GROUP BY time(1h)
'''

# To prevent naming conflicts when querying downsampled data,
# drop the iox::measurement column before writing the data
# with the new measurement.
data_frame = data_frame.drop(columns=['iox::measurement'])

table = influxdb_raw.query(query=query, language="influxql")
data_frame = table.to_pandas()
data_frame = data_frame.sort_values(by="time")

influxdb_downsampled.write(
    record=data_frame,
    data_frame_measurement_name="home_ds",
    data_frame_timestamp_column="time",
    data_frame_tag_columns=['room']
)
```
{{% /code-placeholders %}}

{{% /code-tab-content %}}
<!-------------------------------- END INFLUXQL ------------------------------->
{{< /code-tabs-wrapper >}}

