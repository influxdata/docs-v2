---
title: Python client library
seotitle: Use the InfluxDB Python client library
list_title: Python
description: >
  Use the InfluxDB Python client library to interact with InfluxDB.
menu:
  influxdb_cloud_serverless:
    name: Python
    parent: v2 client libraries
influxdb/cloud-serverless/tags: [client libraries, python]
aliases:
  - /influxdb/cloud-serverless/reference/api/client-libraries/python/
  - /influxdb/cloud-serverless/reference/api/client-libraries/python-cl-guide/
  - /influxdb/cloud-serverless/tools/client-libraries/python/
weight: 201
---

Use the [InfluxDB Python client library](https://github.com/influxdata/influxdb-client-python) to integrate InfluxDB into Python scripts and applications.

This guide presumes some familiarity with Python and InfluxDB.
If just getting started, see [Get started with InfluxDB](/influxdb/cloud-serverless/get-started/).

## Before you begin

You'll need the following prerequisites:

1. Install the InfluxDB Python library:

    ```sh
    pip install influxdb-client
    ```

2. InfluxDB Cloud Serverless region URL using the HTTPS protocol--for example: https://cloud2.influxdata.com.
3. InfluxDB [organization](/influxdb/cloud-serverless/admin/organizations/) ID.
4. Name of the [bucket](/influxdb/cloud-serverless/admin/buckets/) to write to.
5. InfluxDB [API token](/influxdb/cloud-serverless/reference/glossary/#token) with permission to write to the bucket.
   _For security reasons, we recommend setting an environment variable to store your token and avoid exposing the raw token value in your script._

## Write data to InfluxDB with Python

Follow the steps to write [line protocol](/influxdb/cloud-serverless/reference/syntax/line-protocol/) data to an InfluxDB Cloud Serverless bucket.

1. In your editor, create a file for your Python program--for example: `write.py`.
2. In the file, import the InfluxDB client library.

   ```python
   import influxdb_client
   from influxdb_client.client.write_api import SYNCHRONOUS
   import os
   ```

3. Define variables for your [bucket name](/influxdb/cloud-serverless/admin/buckets/), [organization](/influxdb/cloud-serverless/admin/organizations/), and [token](/influxdb/cloud-serverless/reference/glossary/#token).

   ```python
   bucket = "BUCKET_NAME"
   org = "INFLUX_ORG"
   # INFLUX_TOKEN is an environment variable you created for your API WRITE token
   token = os.getenv('INFLUX_TOKEN')
   url="https://cloud2.influxdata.com"
   ```

4. To instantiate the client, call the `influxdb_client.InfluxDBClient()` method with the following keyword arguments: `url`, `org`, and `token`.

   ```python
   client = influxdb_client.InfluxDBClient(
      url=url,
      token=token,
      org=org
   )
   ```
    The `InfluxDBClient` object has a `write_api` method used for configuration.

5. Instantiate a **write client** by calling the `client.write_api()` method with write configuration options.

   ```python
   write_api = client.write_api(write_options=SYNCHRONOUS)
   ```

6. Create a [point](/influxdb/cloud-serverless/reference/glossary/#point) object and write it to InfluxDB using the `write` method of the API writer object. The write method requires three parameters: `bucket`, `org`, and `record`.

   ```python
   p = influxdb_client.Point("my_measurement").tag("location", "Prague").field("temperature", 25.3)
   write_api.write(bucket=bucket, org=org, record=p)
   ```

### Complete example write script

```python
import influxdb_client
from influxdb_client.client.write_api import SYNCHRONOUS
import os

bucket = "BUCKET_NAME"
org = "INFLUX_ORG"
# INFLUX_TOKEN is an environment variable you created for your API WRITE token
token = os.getenv('INFLUX_TOKEN')
url="https://cloud2.influxdata.com"

client = influxdb_client.InfluxDBClient(
    url=url,
    token=token,
    org=org
)

# Write script
write_api = client.write_api(write_options=SYNCHRONOUS)

p = influxdb_client.Point("my_measurement").tag("location", "Prague").field("temperature", 25.3)
write_api.write(bucket=bucket, org=org, record=p)
```

## Query data from InfluxDB with Python

To use query your InfluxDB Cloud Serverless bucket, use a Python [Flight SQL client with gRPC](/influxdb/cloud-dedicated/reference/client-libraries/flight-sql/).
