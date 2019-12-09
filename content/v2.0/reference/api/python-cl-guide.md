---
title: Python client library
description: >
  Use the Python client library to interact with InfluxDB
weight: 103
menu:
  v2_0_ref:
    name: Python client library
    parent: InfluxDB v2 API
v2.0/tags: [client libraries]
---

Use the [InfluxDB Python client libary](https://github.com/influxdata/influxdb-client-python) to integrate InfluxDB into Python scripts and applications.

This guide presumes some familiarity with Python and InfluxDB.
If you haven't, go ahead and read the [getting started](/v2.0/get-started/) guide.

## Before you begin

1. Install the InfluxDB Python library by running

    ```sh
    pip install influxdb-client
    ```

2. Ensure that InfluxDB is running.

## Writing data to InfluxDB with Python

We are going to write some data in [line protocol](/v2.0/reference/syntax/line-protocol/) using the Python library.

The first line of our program imports the InfluxDB library:

```python
import influxdb_client
```

Next, we define a few variables with the name of your bucket, organization, and token.

```python
import influxdb_client

bucket = "<my-bucket>"
org = "<my-org>"
token = "<my-token>"
```

In order to write data, we need to create a few objects: a client, and a writer.
The InfluxDBClient object takes three named parameters: `url`, `org`, and `token`.
Here we simply pass the three variable we have already defined.

```python
client = InfluxDBClient(
    url="http://localhost:9999",
    token="my-token",
    org="my-org"
)
```

The `InfluxDBClient` object has a `write_api` method, used for configuration.
We create and instance of the writer object using this method.

```
write_api = client.write_api()
```

Next we need to give the writer some information about configuration.

```python
write_api = client.write_api(write_options=SYNCHRONOUS)
```

If we were to run the file now, we'd get an error telling us `'SYNCHRONOUS' is not defined`.
So in order to do this we need to add another line at the top of the file:

```python
from influxdb_client.client.write_api import SYNCHRONOUS
```

We need two more lines to have a program that can write data.
Create a [point](/v2.0/reference/glossary/#point) object and write it to the database using the `write` method of the API writer object.

```python
p = influxdb_client.Point("my_measurement").tag("location", "Prague").field("temperature", 25.3)
write_api.write(bucket=bucket, org=org, record=p)
```

### Complete example write script

```python
import influxdb_client
from influxdb_client.client.write_api import SYNCHRONOUS

bucket = "<bucket>"
org = "<my-org>"
token = "<token>"
url = "http://localhost:9999"

client = influxdb_client.InfluxDBClient(url=url, token=token, org=org)
write_api = client.write_api(write_options=SYNCHRONOUS)

p = influxdb_client.Point("my_measurement").tag("location", "Prague").field("temperature", 25.3)
write_api.write(bucket=bucket, org=org, record=p)
```
