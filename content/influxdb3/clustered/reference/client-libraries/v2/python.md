---
title: Python client library
seotitle: Use the InfluxDB Python client library
list_title: Python
description: >
  Use the InfluxDB Python client library to interact with InfluxDB.
menu:
  influxdb3_clustered:
    name: Python
    parent: v2 client libraries
influxdb3/clustered/tags: [client libraries, python]
aliases:
  - /influxdb3/clustered/reference/api/client-libraries/python/
  - /influxdb3/clustered/reference/api/client-libraries/python-cl-guide/
  - /influxdb3/clustered/tools/client-libraries/python/
weight: 201
prepend: |
   > [!WARNING]
   > ### Use InfluxDB 3 clients
   > 
   > The `/api/v2/query` API endpoint and associated tooling, such as InfluxDB v2 client libraries and the `influx` CLI, **can't** query an {{% product-name omit=" Clustered" %}} cluster.
   > 
   > [InfluxDB 3 client libraries](/influxdb3/{{% product-key %}}/client-libraries/v3/) are available that integrate with your code to write and query data stored in {{% product-name %}}.
   > 
   > InfluxDB 3 supports many different tools for [**writing**](/influxdb3/clustered/write-data/) and [**querying**](/influxdb3/clustered/query-data/) data.
   > [**Compare tools you can use**](/influxdb3/clustered/get-started/#tools-to-use) to interact with {{% product-name %}}.
---

Use the [InfluxDB Python client library](https://github.com/influxdata/influxdb-client-python) to integrate InfluxDB into Python scripts and applications.

This guide presumes some familiarity with Python and InfluxDB.
If just getting started, see [Get started with InfluxDB](/influxdb3/clustered/get-started/).

## Before you begin

You'll need the following prerequisites:

1. Install the InfluxDB Python library:

    ```sh
    pip install influxdb-client
    ```

2. InfluxDB cluster URL using the HTTPS protocol--for example:
    
    ```
    https://{{< influxdb/host >}}
    ```
3. The name of the [database](/influxdb3/clustered/admin/databases/) to write to.
4. A [database token](/influxdb3/clustered/admin/tokens/#database-tokens) with permission to write to the database.
   _For security reasons, we recommend setting an environment variable to store your token and avoid exposing the raw token value in your script._

## Write data to InfluxDB with Python

Follow the steps to write [line protocol](/influxdb3/clustered/reference/syntax/line-protocol/) data to an InfluxDB Clustered database.

1. In your editor, create a file for your Python program--for example: `write.py`.
2. In the file, import the InfluxDB client library.

   ```python
   import influxdb_client
   from influxdb_client.client.write_api import SYNCHRONOUS
   import os
   ```

3. Define variables for your [database name](/influxdb3/clustered/admin/databases/), organization (required, but ignored), and [database token](/influxdb3/clustered/admin/tokens/#database-tokens).

   ```python
   database = "DATABASE_NAME"
   org = "ignored"
   # INFLUX_TOKEN is an environment variable you created for your database WRITE token
   token = os.getenv('INFLUX_TOKEN')
   url="https://{{< influxdb/host >}}"
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

6. Create a [point](/influxdb3/clustered/reference/glossary/#point) object and write it to InfluxDB using the `write` method of the API writer object. The write method requires three parameters: `bucket`, `org`, and `record`.

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
url="https://{{< influxdb/host >}}"

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
To query your cluster, use a Python [Flight SQL client with gRPC](/influxdb3/clustered/reference/client-libraries/flight-sql/).
