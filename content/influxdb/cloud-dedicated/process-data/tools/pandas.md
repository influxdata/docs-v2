---
title: Use pandas to analyze data
list_title: pandas
seotitle: Use Python and pandas to analyze and visualize data
description: >
  Use the [pandas](https://pandas.pydata.org/) Python data analysis library
  to analyze and visualize time series data stored in InfluxDB Cloud Dedicated.
weight: 101
menu:
  influxdb_cloud_dedicated:
    parent: Use data analysis tools
    name: Use pandas
    identifier: analyze-with-pandas
influxdb/cloud-dedicated/tags: [analysis, pandas, pyarrow, python]
aliases:
  - /influxdb/cloud-dedicated/visualize-data/pandas/
related:
  - /influxdb/cloud-dedicated/query-data/sql/execute-queries/python/
list_code_example: |
    ```py
    ...
    dataframe = reader.read_pandas()
    dataframe = dataframe.set_index('time')

    print(dataframe.index)

    resample = dataframe.resample("1H")

    resample['temp'].mean()
    ```
---

Use [pandas](https://pandas.pydata.org/), the Python data analysis library, to process, analyze, and visualize data
stored in InfluxDB.

> **pandas** is an open source, BSD-licensed library providing high-performance,
> easy-to-use data structures and data analysis tools for the Python programming language.
>
> {{% caption %}}[pandas documentation](https://pandas.pydata.org/docs/){{% /caption %}}

<!-- TOC -->

- [Install prerequisites](#install-prerequisites)
- [Install pandas](#install-pandas)
- [Use PyArrow to convert query results to pandas](#use-pyarrow-to-convert-query-results-to-pandas)
- [Use pandas to analyze data](#use-pandas-to-analyze-data)
  - [View data information and statistics](#view-data-information-and-statistics)
  - [Downsample time series](#downsample-time-series)

<!-- /TOC -->

## Install prerequisites

The examples in this guide assume using a Python virtual environment and the InfluxDB v3 [`influxdb3-python` Python client library](/influxdb/cloud-dedicated/reference/client-libraries/v3/python/).
For more information, see how to [get started using Python to query InfluxDB](/influxdb/cloud-dedicated/query-data/execute-queries/flight-sql/python/).

Installing `influxdb3-python` also installs the [`pyarrow`](https://arrow.apache.org/docs/python/index.html) library that provides Python bindings for Apache Arrow.

## Install pandas

To use pandas, you need to install and import the `pandas` library.

In your terminal, use `pip` to install `pandas` in your active [Python virtual environment](/influxdb/cloud-dedicated/query-data/execute-queries/flight-sql/python/#venv-install):

```sh
pip install pandas
```

## Use PyArrow to convert query results to pandas

The following steps use Python, `influxdb3-python`, and `pyarrow` to query InfluxDB and stream Arrow data to a pandas `DataFrame`.

1. In your editor, copy and paste the following code to a new file--for example, `pandas-example.py`:

    {{% tabs-wrapper %}}
{{% code-placeholders "DATABASE_NAME|DATABASE_TOKEN" %}}
```py
# pandas-example.py

from influxdb_client_3 import InfluxDBClient3
import pandas

# Instantiate an InfluxDB client configured for a database
client = InfluxDBClient3(
  "https://{{< influxdb/host >}}",
  database="DATABASE_NAME",
  token="DATABASE_TOKEN")

# Execute the query to retrieve all record batches in the stream
# formatted as a PyArrow Table.
table = client.query(
  '''SELECT *
    FROM home
    WHERE time >= now() - INTERVAL '90 days'
    ORDER BY time'''
)

client.close()

# Convert the PyArrow Table to a pandas DataFrame.
dataframe = table.to_pandas()

print(dataframe)
```
{{% /code-placeholders %}}
    {{% /tabs-wrapper %}}

2. Replace the following configuration values:

    - {{% code-placeholder-key %}}`DATABASE_TOKEN`{{% /code-placeholder-key %}}: An InfluxDB [token](/influxdb/cloud-dedicated/admin/tokens/) with read permissions on the databases you want to query.
    - {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: The name of the InfluxDB [database](/influxdb/cloud-dedicated/admin/databases/) to query.

3. In your terminal, use the Python interpreter to run the file:

    ```sh
    python pandas-example.py
    ```

The example calls the following methods:

- [`InfluxDBClient3.query()`](/influxdb/cloud-dedicated/reference/client-libraries/v3/python/#influxdbclient3query): sends the query request and returns a [`pyarrow.Table`](https://arrow.apache.org/docs/python/generated/pyarrow.Table.html) that contains all the Arrow record batches from the response stream.

- [`pyarrow.Table.to_pandas()`](https://arrow.apache.org/docs/python/generated/pyarrow.Table.html#pyarrow.Table.to_pandas): Creates a [`pandas.DataFrame`](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.html#pandas.DataFrame) from the data in the PyArrow `Table`.

{{% influxdb/custom-timestamps %}}
{{% expand-wrapper %}}
{{% expand "View example results" %}}
```sh
    co   hum         room  temp                time
0    0  35.9  Living Room  21.1 2022-01-02 11:46:40
1    0  35.9      Kitchen  21.0 2022-01-02 11:46:40
2    0  36.2      Kitchen  23.0 2022-01-02 12:46:40
3    0  35.9  Living Room  21.4 2022-01-02 12:46:40
4    0  36.1      Kitchen  22.7 2022-01-02 13:46:40
5    0  36.0  Living Room  21.8 2022-01-02 13:46:40
6    0  36.0      Kitchen  22.4 2022-01-02 14:46:40
7    0  36.0  Living Room  22.2 2022-01-02 14:46:40
8    0  36.0      Kitchen  22.5 2022-01-02 15:46:40
9    0  35.9  Living Room  22.2 2022-01-02 15:46:40
10   1  36.5      Kitchen  22.8 2022-01-02 16:46:40
11   0  36.0  Living Room  22.4 2022-01-02 16:46:40
12   1  36.3      Kitchen  22.8 2022-01-02 17:46:40
13   0  36.1  Living Room  22.3 2022-01-02 17:46:40
14   3  36.2      Kitchen  22.7 2022-01-02 18:46:40
15   1  36.1  Living Room  22.3 2022-01-02 18:46:40
16   7  36.0      Kitchen  22.4 2022-01-02 19:46:40
17   4  36.0  Living Room  22.4 2022-01-02 19:46:40
18   9  36.0      Kitchen  22.7 2022-01-02 20:46:40
19   5  35.9  Living Room  22.6 2022-01-02 20:46:40
20  18  36.9      Kitchen  23.3 2022-01-02 21:46:40
21   9  36.2  Living Room  22.8 2022-01-02 21:46:40
22  22  36.6      Kitchen  23.1 2022-01-02 22:46:40
23  14  36.3  Living Room  22.5 2022-01-02 22:46:40
24  26  36.5      Kitchen  22.7 2022-01-02 23:46:40
25  17  36.4  Living Room  22.2 2022-01-02 23:46:40
```
{{% /expand %}}
{{% /expand-wrapper %}}
{{% /influxdb/custom-timestamps %}}

Next, [use pandas to analyze data](#use-pandas-to-analyze-data).

## Use pandas to analyze data

- [View data information and statistics](#view-data-information-and-statistics)
- [Downsample time series](#downsample-time-series)

### View data information and statistics

The following example shows how to use pandas `DataFrame` methods to transform and summarize data stored in {{% product-name %}}.

{{% code-placeholders "DATABASE_NAME|DATABASE_TOKEN" %}}
```py
# pandas-example.py

from influxdb_client_3 import InfluxDBClient3
import pandas

# Instantiate an InfluxDB client configured for a database
client = InfluxDBClient3(
  "https://{{< influxdb/host >}}",
  database="DATABASE_NAME",
  token="DATABASE_TOKEN")

# Execute the query to retrieve all record batches in the stream
# formatted as a PyArrow Table.
table = client.query(
  '''SELECT *
    FROM home
    WHERE time >= now() - INTERVAL '90 days'
    ORDER BY time'''
)

client.close()

# Convert the PyArrow Table to a pandas DataFrame.
dataframe = table.to_pandas()

# Print information about the results DataFrame,
# including the index dtype and columns, non-null values, and memory usage.
dataframe.info()

# Calculate descriptive statistics that summarize the distribution of the results.
print(dataframe.describe())

# Extract a DataFrame column.
print(dataframe['temp'])

# Print the DataFrame in Markdown format.
print(dataframe.to_markdown())
```
{{% /code-placeholders %}}

Replace the following configuration values:

  - {{% code-placeholder-key %}}`DATABASE_TOKEN`{{% /code-placeholder-key %}}: An InfluxDB [token](/influxdb/cloud-dedicated/admin/tokens/) with read permissions on the databases you want to query.
  - {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: The name of the InfluxDB [database](/influxdb/cloud-dedicated/admin/databases/) to query.
  
### Downsample time series

The pandas library provides extensive features for working with time series data.

The [`pandas.DataFrame.resample()` method](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.resample.html) downsamples and upsamples data to time-based groups--for example:

```py
# pandas-example.py

...

# Use the `time` column to generate a DatetimeIndex for the DataFrame
dataframe = dataframe.set_index('time')

# Print information about the index
print(dataframe.index)

# Downsample data into 1-hour groups based on the DatetimeIndex
resample = dataframe.resample("1H")

# Print a summary that shows the start time and average temp for each group
print(resample['temp'].mean())
```

{{% influxdb/custom-timestamps %}}
{{< expand-wrapper >}}
{{% expand "View example results" %}}
```sh
time   
2023-07-16 22:00:00          NaN
2023-07-16 23:00:00    22.600000
2023-07-17 00:00:00    22.513889
2023-07-17 01:00:00    22.208333
2023-07-17 02:00:00    22.300000
...
Freq: H, Name: temp, Length: 469323, dtype: float64
```
{{% /expand %}}
{{< /expand-wrapper >}}
{{% /influxdb/custom-timestamps %}}

For more detail and examples, see the [pandas documentation](https://pandas.pydata.org/docs/index.html).
