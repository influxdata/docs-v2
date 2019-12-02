---
title: Python client library
description: >
  Get started with the InfluxDB Python client library
weight: 103
menu:
  v2_0_ref:
    name: Python client library
    parent: InfluxDB v2 API
v2.0/tags: [client libraries]
---

The [InfluxDB Python client libary](https://github.com/influxdata/influxdb-client-python) can be used to integrate InfluxDB into Python scripts and applications.

This guide is for programmers with some experience with Python and InfluxDB, but perhaps little experience using API libraries.

## Before you begin

1. Read the getting started guide.
2. Install Python library.

   ```sh
   pip install influxdb-client
   ```
3. Ensure that InfluxDB is running.

## Writing data to InfluxDB with Python

We are going to write a single line of line protocol using the Python library.

The first line of our program will import the InfluxDB library:

```python
import influxdb_client
```

Next, we'll define a few variables with the name of your bucket, organization, and token.

```python
import influxdb_client

bucket = "my-bucket"
org = "my-bucket"
token = "my-bucket"
```

We will create a few objects: a client, and a writer.
The InfluxDBClient object takes three named parameters: `url`, `org`, and `token`.
Here we simply pass the three variable we already defined.

```python
client = InfluxDBClient(url="http://localhost:9999", token="my-token", org="my-org")
write_api = client.write_api()
```

The `InfluxDBClient` object has a `write_api` method, which is for configuration.
Let's create an INSTANCE...

We need to give the writer some information about configuration.

```python
write_api = client.write_api(write_options=SYNCHRONOUS)
```

If we were to run the file now, we'd get an error telling us `'SYNCHRONOUS' is not defined`.
So in order to do this we need to add another line at the top of the file

```python
from influxdb_client.client.write_api import SYNCHRONOUS
```

We need two more lines to have a program that can write data.
We'll define a Point object.
[LINK TO POINT IN GLOSSARY.]

```python
p = influxdb_client.Point("my_measurement").tag("location", "Prague").field("temperature", 25.3)
write_api.write(bucket=bucket, org=org, record=p)
```

### Example:

The complete script:

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

## Querying data
