---
title: Use pandas to analyze and visualize data
list_title: pandas
seotitle: Use Python and pandas to analyze and visualize data
description: >
  Use the [pandas](https://pandas.pydata.org/) Python data analysis library
  to analyze and visualize data stored in InfluxDB.
weight: 101
menu:
  influxdb_cloud_dedicated:
    parent: Analyze and visualize data
    name: Use pandas
    identifier: analyze-with-pandas
influxdb/cloud-dedicated/tags: [analysis, pandas, pyarrow, python, visualization]
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

The examples in this guide assume using a Python virtual environment and the Flight SQL library for Python.
Installing `flightsql-dbapi` also installs the [`pyarrow`](https://arrow.apache.org/docs/python/index.html) library that provides Python bindings for Apache Arrow.

For more information, see how to [get started querying InfluxDB with Python and flightsql-dbapi](/influxdb/cloud-dedicated/query-data/execute-queries/flight-sql/python/)

## Install pandas

To use pandas, you need to install and import the `pandas` library.

In your terminal, use `pip` to install `pandas` in your active [Python virtual environment](/influxdb/cloud-dedicated/query-data/execute-queries/flight-sql/python/#venv-install):

```sh
pip install pandas
```

## Use PyArrow to convert query results to pandas

The following steps use Python, `flightsql-dbapi`, and `pyarrow` to query InfluxDB and stream Arrow data to a pandas `DataFrame`.

1. In your editor, copy and paste the following code to a new file--for example, `pandas-example.py`:

    ```py
    # pandas-example.py

    from flightsql import FlightSQLClient
    import pandas

    client = FlightSQLClient(host='cluster-id.influxdb.io',
                            token='INFLUX_READ_WRITE_TOKEN',
                            metadata={'database': 'INFLUX_DATABASE'},
                            features={'metadata-reflection': 'true'})

    info = client.execute("SELECT * FROM home")

    reader = client.do_get(info.endpoints[0].ticket)

    # Read all record batches in the stream to a pandas DataFrame
    dataframe = reader.read_pandas()

    dataframe.info()
    ```

2. Replace the following configuration values:

    - **`INFLUX_READ_WRITE_TOKEN`**: Your InfluxDB token with read permissions on the databases you want to query.
    - **`INFLUX_DATABASE`**: The name of your InfluxDB database.

3. In your terminal, use the Python interpreter to run the file:

    ```sh
    python pandas-example.py
    ```

The `pyarrow.flight.FlightStreamReader` [`read_pandas()`](https://arrow.apache.org/docs/python/generated/pyarrow.flight.FlightStreamReader.html#pyarrow.flight.FlightStreamReader.read_pandas) method:

- Takes the same options as [`pyarrow.Table.to_pandas()`](https://arrow.apache.org/docs/python/generated/pyarrow.Table.html#pyarrow.Table.to_pandas).
- Reads all Arrow record batches in the stream to a `pyarrow.Table` and then converts the `Table` to a [`pandas.DataFrame`](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.html#pandas.DataFrame).

Next, [use pandas to analyze data](#use-pandas-to-analyze-data).

## Use pandas to analyze data

- [View data information and statistics](#view-data-information-and-statistics)
- [Downsample time series](#downsample-time-series)

### View data information and statistics

The following example uses the DataFrame `info()` and `describe()`
methods to print information about the DataFrame.

```py
# pandas-example.py

from flightsql import FlightSQLClient
import pandas

client = FlightSQLClient(host='cluster-id.influxdb.io',
                        token='INFLUX_READ_WRITE_TOKEN',
                        metadata={'database': 'INFLUX_DATABASE'},
                        features={'metadata-reflection': 'true'})

info = client.execute("SELECT * FROM home")

reader = client.do_get(info.endpoints[0].ticket)

dataframe = reader.read_pandas()

# Print information about the results DataFrame,
# including the index dtype and columns, non-null values, and memory usage.
dataframe.info()

# Calculate descriptive statistics that summarize the distribution of the results.
print(dataframe.describe())
```

### Downsample time series

The pandas library provides extensive features for working with time series data.

The [`pandas.DataFrame.resample()` method](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.resample.html) downsamples and upsamples data to time-based groups--for example:

```py
from flightsql import FlightSQLClient
import pandas

client = FlightSQLClient(host='cluster-id.influxdb.io',
                        token='INFLUX_READ_WRITE_TOKEN',
                        metadata={'database': 'INFLUX_DATABASE'},
                        features={'metadata-reflection': 'true'})

info = client.execute("SELECT * FROM home")

reader = client.do_get(info.endpoints[0].ticket)

dataframe = reader.read_pandas()

# Use the `time` column to generate a DatetimeIndex for the DataFrame
dataframe = dataframe.set_index('time')

# Print information about the index
print(dataframe.index)

# Downsample data into 1-hour groups based on the DatetimeIndex
resample = dataframe.resample("1H")

# Print a summary that shows the start time and average temp for each group
print(resample['temp'].mean())
```

{{< expand-wrapper >}}
{{% expand "View example results" %}}
```sh
time
1970-01-01 00:00:00    22.374138
1970-01-01 01:00:00          NaN
1970-01-01 02:00:00          NaN
1970-01-01 03:00:00          NaN
1970-01-01 04:00:00          NaN
                         ...    
2023-07-16 22:00:00          NaN
2023-07-16 23:00:00    22.600000
2023-07-17 00:00:00    22.513889
2023-07-17 01:00:00    22.208333
2023-07-17 02:00:00    22.300000
Freq: H, Name: temp, Length: 469323, dtype: float64
```
{{% /expand %}}
{{< /expand-wrapper >}}

For more detail and examples, see the [pandas documentation](https://pandas.pydata.org/docs/index.html).
