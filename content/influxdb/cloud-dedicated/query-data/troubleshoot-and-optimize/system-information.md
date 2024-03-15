---
title: Retrieve system information for a query
description: >
  Learn how to use the system.queries debug feature to retrieve system information for a query in InfluxDB Cloud Dedicated.
weight: 401
menu:
  influxdb_cloud_dedicated:
    name: Retrieve system information
    parent: Troubleshoot and optimize queries
influxdb/cloud-dedicated/tags: [query, observability]
related:
  - /influxdb/cloud-dedicated/query-data/sql/
  - /influxdb/cloud-dedicated/query-data/influxql/
  - /influxdb/cloud-dedicated/reference/client-libraries/v3/
---

Learn how to retrieve system information for a query in {{% product-name %}}.

In addition to the SQL standard `information_schema`, {{% product-name %}} contains _system_ tables that provide access to
InfluxDB-specific information.
The information in each system table is scoped to the namespace you're querying;
you can only retrieve system information for that particular instance.

To get information about queries you've run on the current instance, use SQL to query the [`system.queries` table](/influxdb/cloud-dedicated/reference/internals/system-tables/#systemqueries-measurement), which contains information from the Querier instance currently handling queries.
If you [enabled trace logging](/influxdb/cloud-dedicated/query-data/troubleshoot-and-optimize/trace/) for the query, the `trace-id` appears in the `system.queries.trace_id` column for the query.

The `system.queries` table is an InfluxDB v3 **debug feature**.
To enable the feature and query `system.queries`, include an `"iox-debug"` header set to `"true"` and use SQL to query the table.

The following sample code shows how to use the Python client library to do the following:

1. Enable tracing for a query.
2. Retrieve the trace ID record from `system.queries`.

<!-- Import for tests and hide from users.
```python
import os
```
-->

{{% code-placeholders "DATABASE_(NAME|TOKEN)|APP_REQUEST_ID" %}}

<!--pytest-codeblocks:cont-->

```python
from influxdb_client_3 import InfluxDBClient3
import secrets
import pandas

def get_query_information():
  print('# Get query information')

  client = InfluxDBClient3(token = f"DATABASE_TOKEN",
                    host = f"{{< influxdb/host >}}",
                    database = f"DATABASE_NAME")

  random_bytes = secrets.token_bytes(16)
  trace_id = random_bytes.hex()
  trace_value = (f"{trace_id}:1112223334445:0:1").encode('utf-8')
  sql = "SELECT * FROM home WHERE time >= now() - INTERVAL '30 days'"

  try:
    client.query(sql, headers=[(b'influx-trace-id', trace_value)])
    client.close()
  except Exception as e:
    print("Query error: ", e)

  client = InfluxDBClient3(token = f"DATABASE_TOKEN",
                    host = f"{{< influxdb/host >}}",
                    database = f"DATABASE_NAME")

  import time
  df = pandas.DataFrame()

  for i in range(0, 5):
    time.sleep(1)
    # Use SQL
    # To query the system.queries table for your trace ID, pass the following:
    #   - the iox-debug: true request header
    #   - an SQL query for the trace_id column
    reader = client.query(f'''SELECT compute_duration, query_type, query_text,
                          success, trace_id
                          FROM system.queries
                          WHERE issue_time >= now() - INTERVAL '1 day'
                            AND trace_id = '{trace_id}'
                          ORDER BY issue_time DESC
                        ''',
                        headers=[(b"iox-debug", b"true")],
                        mode="reader")

    df = reader.read_all().to_pandas()
    if df.shape[0]:
      break

  assert df.shape == (1, 5), f"Expect a row for the query trace ID."
  print(df)

get_query_information()
```

{{% /code-placeholders %}}

The output is similar to the following:

```text
compute_duration query_type                        query_text  success  trace_id
          0 days        sql  SELECT compute_duration, quer...     True  67338...
```
