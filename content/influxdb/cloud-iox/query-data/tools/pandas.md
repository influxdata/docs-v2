---
title: Use pandas to analyze and visualize data
seotitle: Use Python and pandas to analyze and visualize data
description: >
  Install and run [pandas](https://pandas.pydata.org/), the Python Data Analysis Library,
  to analyze and visualize data stored in a bucket powered by InfluxDB IOx.
weight: 101
menu:
  influxdb_cloud_iox:
    parent: Analyze and visualize data
    name: Use pandas
influxdb/cloud-iox/tags: [analysis, pandas, pyarrow, python, visualization]
---

Use [pandas](https://pandas.pydata.org/), the Python Data Analysis Library, to process, analyze, and visualize data
stored in an InfluxDB bucket powered by InfluxDB IOx.

> **pandas** is an open source, BSD-licensed library providing high-performance,
> easy-to-use data structures and data analysis tools for the Python programming language.
>
> {{% caption %}}[pandas documentation](https://pandas.pydata.org/docs/){{% /caption %}}

<!-- TOC -->

- [Install prerequisites](#install-prerequisites)
- [Install pyarrow](#install-pyarrow)
- [Install pandas](#install-pandas)
- [Use PyArrow to convert query result data to pandas](#use-pyarrow-to-convert-query-result-data-to-pandas)
- [Use pandas to analyze data](#use-pandas-to-analyze-data)
    - [View information and statistics for data](#view-information-and-statistics-for-data)
    - [Downsample time series](#downsample-time-series)

<!-- /TOC -->

## Install prerequisites

The examples in this guide assume using a Python virtual environment and the Flight SQL library for Python.
For more information, see how to [get started querying InfluxDB with Python and flightsql-dbapi](/influxdb/cloud-iox/query-data/execute-queries/flight-sql/python/)

## Install pyarrow

In order to read query results in Apache Arrow format and then convert them to pandas, you need to
install and import the `pyarrow` bindings:

- In your terminal, use `pip` to install `pyarrow` in your [Python virtual environment](/influxdb/cloud-iox/query-data/execute-queries/flight-sql/python/#create-a-project-virtual-environment):

    ```sh
    pip install pyarrow
    ```

- In your code, add an `import` statement for `pyarrow`:

    ```py
    import pyarrow
    ```

## Install pandas

To read and analyze data in a pandas **DataFrame**, you need to install and import `pandas`:

- In your terminal, use `pip` to install `pandas` in your [Python virtual environment](/influxdb/cloud-iox/query-data/execute-queries/flight-sql/python/#create-a-project-virtual-environment):

    ```sh
    pip install pandas
    ```

- In your code, add an `import` statement for `pandas`:

    ```py
    import pandas
    ```

## Use PyArrow to convert query results to pandas

The following Python sample code executes the query, retrieves data, and then reads the contents
of the Arrow data stream.
For more information about `FlightSQLClient`, see how to [get started using Python to query InfluxDB](/influxdb/cloud-iox/query-data/execute-queries/flight-sql/python/).

```py
from flightsql import FlightSQLClient
import pandas
import pyarrow

client = FlightSQLClient(host='INFLUXDB_DOMAIN',
    token='INFLUX_READ_WRITE_TOKEN',
    metadata={'bucket-name': 'jason-iox'},
    features={'metadata-reflection': 'true'})

query = client.execute("SELECT * FROM home")

reader = client.do_get(query.endpoints[0].ticket)

dataframe = reader.read_pandas()
```

- The `pyarrow.flight.FlightStreamReader` [`read_pandas()`](https://arrow.apache.org/docs/python/generated/pyarrow.flight.FlightStreamReader.html#pyarrow.flight.FlightStreamReader.read_pandas) method
reads all batches of query result data into a `pyarrow.Table` and then converts the `Table` to a [`pandas.DataFrame`](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.html#pandas.DataFrame).
- `read_pandas()` takes the same options as [`pyarrow.Table.to_pandas()`](https://arrow.apache.org/docs/python/generated/pyarrow.Table.html#pyarrow.Table.to_pandas).

## Use pandas to analyze data

pandas provides extensive features for working with time series data.

- [View information and statistics for data](#view-information-and-statistics-for-data)
- [Downsample time series](#downsample-time-series)

### View information and statistics for data

```py
...
dataframe = reader.read_pandas()

# Print a summary of the DataFrame to stdout
dataframe.info()

# Calculate summary statistics for the data
print(dataframe.describe())
```

### Downsample time series

You can use the [`pandas.DataFrame.resample()` method](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.resample.html) for downsampling and upsampling data to time-based groups--for example:

```py
...
dataframe = reader.read_pandas()

# Use the `time` column to generate a DatetimeIndex for the DataFrame
dataframe = dataframe.set_index('time')

# Print information about the index
print(dataframe.index)

# Downsample data into 5-minute groups based on the DatetimeIndex
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

See how to [run the sample code in the Python interpreter](/influxdb/cloud-iox/query-data/execute-queries/flight-sql/python/#run-code-with-the-python-interpreter).

For more detail and examples, see the [pandas documentation](https://pandas.pydata.org/docs/index.html).
