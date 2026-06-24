---
title: Python client library for InfluxDB 3
list_title: Python
description: The InfluxDB 3 `influxdb3-python` Python client library integrates with Python scripts and applications to write and query data stored in an InfluxDB Core database.
menu:
  influxdb3_core:
    name: Python
    parent: v3 client libraries
    identifier: influxdb3-python
influxdb3/core/tags: [Flight API, python, gRPC, SQL, client libraries]
metadata: [influxdb3-python v0.10.0]
weight: 201
aliases:
  - /influxdb3/core/reference/client-libraries/v3/pyinflux3/
related:
  - /influxdb3/core/query-data/execute-queries/troubleshoot/
list_code_example: |

  <!--Hide setup
  ```python
  import os
  from influxdb_client_3 import InfluxDBClient3

  client = InfluxDBClient3(host=f"{{< influxdb/host >}}",
      database=f"DATABASE_NAME", token=f"AUTH_TOKEN")  
  ```
  -->
  <!--pytest-codeblocks:cont-->

  ```python
  # Example: Write and query data

  # Write sensor data in batches from a CSV file to a database
  client.write_file(file='./data/home-sensor-data.csv',
      timestamp_column='time',
      tag_columns=["room"])

  # Execute a query and retrieve data from the last 90 days
  table = client.query(
      '''SELECT *
         FROM home
         WHERE time >= now() - INTERVAL '90 days'
         ORDER BY time''')

  # This script assumes the client object is correctly configured
  # with your database name, token, and host URL. 
  # After the script runs, the table variable contains the data
  # formatted as a PyArrow table.
  ```
source: /shared/influxdb-client-libraries-reference/v3/python.md
---

<!-- The content for this page is at
// SOURCE content/shared/influxdb-client-libraries-reference/v3/python.md
-->