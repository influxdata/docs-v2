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

1. Install the InfluxDB Python library:

    ```sh
    pip install influxdb-client
    ```

2. Visit your InfluxDB URL to ensure InfluxDB is running:
   
   ```http
   http://localhost:8086
   ```

## Write data to InfluxDB with Python

We are going to write some data in [line protocol](/influxdb/cloud-serverless/reference/syntax/line-protocol/) using the Python library.

1. In your Python program, import the InfluxDB client library and use it to write data to InfluxDB.

   ```python
   import influxdb_client
   from influxdb_client.client.write_api import SYNCHRONOUS
   ```

2. Define a few variables with the name of your [bucket](/influxdb/cloud-serverless/organizations/buckets/), [organization](/influxdb/cloud-serverless/organizations/), and [token](/influxdb/cloud-serverless/security/tokens/).

   ```python
   bucket = "INFLUX_BUCKET"
   org = "INFLUX_ORG"
   token = "INFLUX_TOKEN"
   url="http://localhost:8086"
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

5. Create a [point](/influxdb/cloud-serverless/reference/glossary/#point) object and write it to InfluxDB using the `write` method of the API writer object. The write method requires three parameters: `bucket`, `org`, and `record`.

   ```python
   p = influxdb_client.Point("my_measurement").tag("location", "Prague").field("temperature", 25.3)
   write_api.write(bucket=bucket, org=org, record=p)
   ```

### Complete example write script

```python
import influxdb_client
from influxdb_client.client.write_api import SYNCHRONOUS

bucket = "<my-bucket>"
org = "<my-org>"
token = "<my-token>"
# Store the URL of your InfluxDB instance
url="http://localhost:8086"

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
