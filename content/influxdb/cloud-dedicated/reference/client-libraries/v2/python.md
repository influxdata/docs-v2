---
title: Python client library
seotitle: Use the InfluxDB Python client library
list_title: Python
description: >
  Use the InfluxDB Python client library to interact with InfluxDB.
menu:
  influxdb_cloud_dedicated:
    name: Python
    parent: v2 client libraries
influxdb/cloud-dedicated/tags: [client libraries, python]
aliases:
  - /influxdb/cloud-dedicated/reference/api/client-libraries/python/
  - /influxdb/cloud-dedicated/reference/api/client-libraries/python-cl-guide/
  - /influxdb/cloud-dedicated/tools/client-libraries/python/
weight: 201
---

Use the [InfluxDB Python client library](https://github.com/influxdata/influxdb-client-python) to integrate InfluxDB into Python scripts and applications.

This guide presumes some familiarity with Python and InfluxDB.
If just getting started, see [Get started with InfluxDB](/influxdb/cloud-dedicated/get-started/).

## Before you begin

1. Install the InfluxDB Python library:

    ```sh
    pip install influxdb-client
    ```

2. Ensure that InfluxDB is running.
   If running InfluxDB locally, visit http://localhost:8086.
   (If using InfluxDB Cloud, visit the URL of your InfluxDB Cloud UI.
   For example: https://us-west-2-1.aws.cloud2.influxdata.com.)

## Write data to InfluxDB with Python

We are going to write some data in [line protocol](/influxdb/cloud-dedicated/reference/syntax/line-protocol/) using the Python library.

1. In your Python program, import the InfluxDB client library and use it to write data to InfluxDB.

   ```python
   import influxdb_client
   from influxdb_client.client.write_api import SYNCHRONOUS
   ```

2. Define a few variables with the name of your [database](/influxdb/cloud-dedicated/admin/databases/) (bucket), organization (required, but ignored), and [token](/influxdb/cloud-dedicated/admin/tokens/).

   ```python
   bucket = "DATABASE_NAME"
   org = "ignored"
   token = "DATABASE_TOKEN"
   # Store the URL of your InfluxDB instance
   url="https://cluster-id.influxdb.io"
   ```

3. Instantiate the client. The `InfluxDBClient` object takes three named parameters: `url`, `org`, and `token`. Pass in the named parameters.

   ```python
   client = influxdb_client.InfluxDBClient(
      url=url,
      token=token,
      org=org
   )
   ```
    The `InfluxDBClient` object has a `write_api` method used for configuration.

4. Instantiate a **write client** using the `client` object and the `write_api` method. Use the `write_api` method to configure the writer object.

   ```python
   write_api = client.write_api(write_options=SYNCHRONOUS)
   ```

5. Create a [point](/influxdb/cloud-dedicated/reference/glossary/#point) object and write it to InfluxDB using the `write` method of the API writer object. The write method requires three parameters: `bucket`, `org`, and `record`.

   ```python
   p = influxdb_client.Point("my_measurement").tag("location", "Prague").field("temperature", 25.3)
   write_api.write(bucket=bucket, org=org, record=p)
   ```

### Complete example write script

```python
import influxdb_client
from influxdb_client.client.write_api import SYNCHRONOUS

bucket = "DATABASE_NAME"
org = "ignored"
token = "DATABASE_TOKEN"
# Store the URL of your InfluxDB instance
url="https://cluster-id.influxdb.io"

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

The InfluxDB v2 Python client cannot query InfluxDB Cloud Dedicated.
To query your dedicated instance, use a Flight SQL client with gRPC.
