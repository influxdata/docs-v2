---
title: Summarize query results and data distribution
description: >
  Query data stored in InfluxDB and use tools like pandas to summarize the results schema and distribution.
menu:
  influxdb3_cloud_serverless:
    name: Summarize data
    parent: Process & visualize data
weight: 101
influxdb3/cloud-serverless/tags: [analysis, pandas, pyarrow, python, schema]
related:
  - /influxdb3/cloud-serverless/query-data/execute-queries/client-libraries/python/
---

Query data stored in InfluxDB and use tools like pandas to summarize the results schema and distribution.

> [!Note]
> #### Sample data
> 
> The following examples use the sample data written in the
> [Get started writing data guide](/influxdb3/cloud-serverless/get-started/write/).
> To run the example queries and return results,
> [write the sample data](/influxdb3/cloud-serverless/get-started/write/#write-line-protocol-to-influxdb)
> to your {{% product-name %}} bucket before running the example queries.

### View data information and statistics

#### Using Python and pandas

The following example uses the [InfluxDB client library for Python](/influxdb3/cloud-serverless/reference/client-libraries/v3/python/) to query an {{% product-name %}} bucket,
and then uses pandas [`DataFrame.info()`](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.info.html) and [`DataFrame.describe()`](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.describe.html) methods to summarize the schema and distribution of the data.

1.  In your editor, create a file (for example, `pandas-example.py`) and enter the following sample code:
    <!-- tabs-wrapper allows code-placeholders to work when indented -->
    {{% tabs-wrapper %}}
{{% code-placeholders "API_TOKEN|BUCKET_NAME" %}}
```py
# pandas-example.py

import influxdb_client_3 as InfluxDBClient3
import pandas

client = InfluxDBClient3.InfluxDBClient3(token='API_TOKEN',
                      host='{{< influxdb/host >}}',
                      database='BUCKET_NAME',
                      org="",
                      write_options=SYNCHRONOUS)

table = client.query("select * from home where room like '%'")
dataframe = table.to_pandas()

# Print information about the results DataFrame,
# including the index dtype and columns, non-null values, and memory usage.
dataframe.info()

# Calculate descriptive statistics that summarize the distribution of the results.
print(dataframe.describe())
```
{{% /code-placeholders %}}
    {{% /tabs-wrapper %}}

2.  Enter the following command in your terminal to execute the file using the Python interpreter:

    ```sh
    python pandas-example.py
    ```

    The output is similar to the following:

    ```sh
    <class 'pandas.core.frame.DataFrame'>
    RangeIndex: 411 entries, 0 to 410
    Data columns (total 8 columns):
    #   Column     Non-Null Count  Dtype         
    ---  ------     --------------  -----         
    0   co         405 non-null    float64       
    1   host       2 non-null      object        
    2   hum        406 non-null    float64       
    3   room       411 non-null    object        
    4   sensor     1 non-null      object        
    5   sensor_id  2 non-null      object        
    6   temp       411 non-null    float64       
    7   time       411 non-null    datetime64[ns]
    dtypes: datetime64[ns](1), float64(3), object(4)
    memory usage: 25.8+ KB

                  co         hum        temp                           time
    count  405.000000  406.000000  411.000000                            411
    mean     5.320988   35.860591   23.803893  2008-06-12 13:33:49.074302208
    min      0.000000   20.200000   18.400000     1970-01-01 00:00:01.641024
    25%      0.000000   35.900000   22.200000  1970-01-01 00:00:01.685054600
    50%      1.000000   36.000000   22.500000            2023-03-21 05:46:40
    75%      9.000000   36.300000   22.800000            2023-07-15 21:34:10
    max     26.000000   80.000000   74.000000            2023-07-17 02:07:00
    std      7.640154    3.318794    8.408807                            NaN
    ```
