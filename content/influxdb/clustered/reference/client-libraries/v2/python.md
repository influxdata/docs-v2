---
title: Python client library
seotitle: Use the InfluxDB Python client library
list_title: Python
description: >
  Use the InfluxDB Python client library to interact with InfluxDB.
menu:
  influxdb_clustered:
    name: Python
    parent: v2 client libraries
influxdb/clustered/tags: [client libraries, python]
aliases:
  - /influxdb/clustered/reference/api/client-libraries/python/
  - /influxdb/clustered/reference/api/client-libraries/python-cl-guide/
  - /influxdb/clustered/tools/client-libraries/python/
weight: 201
---

Use the [InfluxDB Python client library](https://github.com/influxdata/influxdb-client-python) to integrate InfluxDB into Python scripts and applications.

This guide presumes some familiarity with Python and InfluxDB.
If just getting started, see [Get started with InfluxDB](/influxdb/clustered/get-started/).

## Before you begin

You'll need the following prerequisites:

1. Install the InfluxDB Python library:

    ```sh
    pip install influxdb-client
    ```

2. InfluxDB cluster URL using the HTTPS protocol--for example:
    
    ```
    https://cluster-id.influxdb.io
    ```
3. Name of the [database](/influxdb/clustered/admin/databases/) to write to.
4. InfluxDB [database token](/influxdb/clustered/admin/tokens/) with permission to write to the database.
   _For security reasons, we recommend setting an environment variable to store your token and avoid exposing the raw token value in your script._

## Write data to InfluxDB with Python

Follow the steps to write [line protocol](/influxdb/clustered/reference/syntax/line-protocol/) data to an InfluxDB Clustered database.

1. In your editor, create a file for your Python program--for example: `write.py`.
2. In the file, import the InfluxDB client library.

   ```python
   import influxdb_client
   from influxdb_client.client.write_api import SYNCHRONOUS
   import os
   ```

3. Define variables for your [database name](/influxdb/clustered/admin/databases/), organization (required, but ignored), and [token](/influxdb/clustered/admin/tokens/).

   ```python
   database = "DATABASE_NAME"
   org = "ignored"
   # INFLUX_TOKEN is an environment variable you created for your database WRITE token
   token = os.getenv('INFLUX_TOKEN')
   url="https://cluster-id.influxdb.io"
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

6. Create a [point](/influxdb/clustered/reference/glossary/#point) object and write it to InfluxDB using the `write` method of the API writer object. The write method requires three parameters: `bucket`, `org`, and `record`.

   ```python
   p = influxdb_client.Point("my_measurement").tag("location", "Prague").field("temperature", 25.3)
   write_api.write(bucket=database, org=org, record=p)
   ```

### Complete example write script

```python
import influxdb_client
from influxdb_client.client.write_api import SYNCHRONOUS
import os

database = "DATABASE_NAME"
org = "ignored"
# INFLUX_TOKEN is an environment variable you created for your database WRITE token
token = os.getenv('INFLUX_TOKEN')
url="https://cluster-id.influxdb.io"

client = influxdb_client.InfluxDBClient(
    url=url,
    token=token,
    org=org
)

# Write script
write_api = client.write_api(write_options=SYNCHRONOUS)

p = influxdb_client.Point("my_measurement").tag("location", "Prague").field("temperature", 25.3)
write_api.write(bucket=database, org=org, record=p)
```
## Query data from InfluxDB with Python

The InfluxDB v2 Python client can't query InfluxDB Clustered.
To query your dedicated instance, use a Python [Flight SQL client with gRPC](/influxdb/clustered/reference/client-libraries/flight-sql/).
