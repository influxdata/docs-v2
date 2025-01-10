---
title: Retrieve system information for a query
description: >
  Learn how to use the system.queries debug feature to retrieve system information for a query in InfluxDB Cloud Dedicated.
weight: 401
menu:
  influxdb3_cloud_dedicated:
    name: Retrieve system information
    parent: Troubleshoot and optimize queries
influxdb3/cloud-dedicated/tags: [query, observability]
related:
  - /influxdb3/cloud-dedicated/query-data/sql/
  - /influxdb3/cloud-dedicated/query-data/influxql/
  - /influxdb3/cloud-dedicated/reference/client-libraries/v3/
---

Learn how to retrieve system information for a query in {{% product-name %}}.

In addition to the SQL standard `information_schema`, {{% product-name %}} contains _system_ tables that provide access to
InfluxDB-specific information.
The information in each system table is scoped to the namespace you're querying;
you can only retrieve system information for that particular instance.

To get information about queries you've run on the current instance, use SQL to query the [`system.queries` table](/influxdb3/cloud-dedicated/reference/internals/system-tables/#systemqueries-measurement), which contains information from the Querier instance currently handling queries.

The `system.queries` table is an InfluxDB v3 **debug feature**.
To enable the feature and query `system.queries`, include an `"iox-debug"` header set to `"true"` and use SQL to query the table--for example:


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

  sql = "SELECT * FROM home WHERE time >= now() - INTERVAL '30 days'"

  try:
    client.query(sql)
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
    # To retrieve data about your query from the system.queries table, pass the following:
    #   - the iox-debug: true request header
    #   - an SQL query for system.queries
    reader = client.query(f'''SELECT compute_duration, query_type, query_text,
                          success
                          FROM system.queries
                          WHERE issue_time >= now() - INTERVAL '1 day'
                          ORDER BY issue_time DESC
                        ''',
                        headers=[(b"iox-debug", b"true")],
                        mode="reader")

    df = reader.read_all().to_pandas()
    if df.shape[0]:
      break
  # Adjust pandas display options to avoid truncating the output

  # Filter the DataFrame to get rows where the column contains the query text
  filtered_df = df[df['query_text'] == sql]

  assert filtered_df.shape[0] > 0, "filtered_df should have at least 1 row"

  # Specify system.queries columns to output
  columns_to_output = ['compute_duration', 'query_text']

  # Print row values for the specified columns
  print(filtered_df[columns_to_output])

get_query_information()
```

{{% /code-placeholders %}}

The output is similar to the following:

```
# Get query information
            compute_duration                                         query_text
3            0 days  SELECT * FROM home WHERE time >= now() - INTER...
4            0 days  SELECT * FROM home WHERE time >= now() - INTER...
```