---
title: Python Flight client
description: The Python Flight client integrates with Python scripts and applications to query data stored in InfluxDB.
menu:
  influxdb3_cloud_dedicated:
    name: Python
    parent: Arrow Flight clients
    identifier: python-flight-client
influxdb3/cloud-dedicated/tags: [Flight client, Python, gRPC, SQL, Flight SQL, client libraries]
aliases:
  - /influxdb3/cloud-dedicated/reference/client-libraries/flight-sql/python-flightsql/
weight: 201
list_code_example: |
  ```py
  from pyarrow.flight import FlightClient, Ticket, FlightCallOptions 
  import json
  import pandas
  import tabulate

  # Downsampling query groups data into 2-hour bins
  sql="""
    SELECT DATE_BIN(INTERVAL '2 hours',
        time,
        '1970-01-01T00:00:00Z') AS time,
      room,
      selector_max(temp, time)['value'] AS 'max temp',
      selector_min(temp, time)['value'] AS 'min temp',
      avg(temp) AS 'average temp'
    FROM home
    GROUP BY
      1,
      room
    ORDER BY room, 1"""
    
  flight_ticket = Ticket(json.dumps({
    "namespace_name": "DATABASE_NAME",
    "sql_query": sql,
    "query_type": "sql"
  }))

  token = (b"authorization", bytes(f"Bearer DATABASE_TOKEN".encode('utf-8')))
  options = FlightCallOptions(headers=[token])
  client = FlightClient(f"grpc+tls://{{< influxdb/host >}}:443")

  reader = client.do_get(flight_ticket, options)
  arrow_table = reader.read_all()
  ```
---

[Apache Arrow Python bindings](https://arrow.apache.org/docs/python/index.html) integrate with Python scripts and applications to query data stored in InfluxDB.

> [!Note]
> #### Use InfluxDB 3 client libraries
> 
> We recommend using the [`influxdb3-python` Python client library](/influxdb3/cloud-dedicated/reference/client-libraries/v3/python/) for integrating InfluxDB 3 with your Python application code.
> 
> [InfluxDB 3 client libraries](/influxdb3/cloud-dedicated/reference/client-libraries/v3/) wrap Apache Arrow Flight clients
> and provide convenient methods for [writing](/influxdb3/cloud-dedicated/get-started/write/#write-line-protocol-to-influxdb), [querying](/influxdb3/cloud-dedicated/get-started/query/#execute-an-sql-query), and processing data stored in {{% product-name %}}.
> Client libraries can query using SQL or InfluxQL.

The following examples show how to use the `pyarrow.flight` and `pandas` Python modules to query and format data stored in an {{% product-name %}} database:

{{% code-tabs-wrapper %}}
{{% code-tabs %}}
[SQL](#sql-python)
[InfluxQL](#influxql-python)
{{% /code-tabs %}}

{{% code-tab-content %}}
<!-- BEGIN SQL -->
{{% code-placeholders "DATABASE_NAME|DATABASE_TOKEN" %}}
```py
# Using pyarrow>=12.0.0 FlightClient
from pyarrow.flight import FlightClient, Ticket, FlightCallOptions 
import json
import pandas
import tabulate

# Downsampling query groups data into 2-hour bins
sql="""
  SELECT DATE_BIN(INTERVAL '2 hours', time) AS time,
    room,
    selector_max(temp, time)['value'] AS 'max temp',
    selector_min(temp, time)['value'] AS 'min temp',
    avg(temp) AS 'average temp'
  FROM home
  GROUP BY
    1,
    room
  ORDER BY room, 1"""
  
flight_ticket = Ticket(json.dumps({
  "namespace_name": "DATABASE_NAME",
  "sql_query": sql,
  "query_type": "sql"
}))

token = (b"authorization", bytes(f"Bearer DATABASE_TOKEN".encode('utf-8')))
options = FlightCallOptions(headers=[token])
client = FlightClient(f"grpc+tls://{{< influxdb/host >}}:443")

reader = client.do_get(flight_ticket, options)
arrow_table = reader.read_all()
# Use pyarrow and pandas to view and analyze data
data_frame = arrow_table.to_pandas()
print(data_frame.to_markdown())
```
{{% /code-placeholders %}}
<!-- END SQL -->
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!-- BEGIN INFLUXQL -->
{{% code-placeholders "DATABASE_NAME|DATABASE_TOKEN" %}}
```py
# Using pyarrow>=12.0.0 FlightClient
from pyarrow.flight import FlightClient, Ticket, FlightCallOptions 
import json
import pandas
import tabulate

# Downsampling query groups data into 2-hour bins
influxql="""
  SELECT FIRST(temp)
  FROM home 
  WHERE room = 'kitchen'
    AND time >= now() - 100d
    AND time <= now() - 10d
  GROUP BY time(2h)"""
  
flight_ticket = Ticket(json.dumps({
  "namespace_name": "DATABASE_NAME",
  "sql_query": influxql,
  "query_type": "influxql"
}))

token = (b"authorization", bytes(f"Bearer DATABASE_TOKEN".encode('utf-8')))
options = FlightCallOptions(headers=[token])
client = FlightClient(f"grpc+tls://{{< influxdb/host >}}:443")

reader = client.do_get(flight_ticket, options)
arrow_table = reader.read_all()
# Use pyarrow and pandas to view and analyze data
data_frame = arrow_table.to_pandas()
print(data_frame.to_markdown())
```
{{% /code-placeholders %}}
<!-- END INFLUXQL -->
{{% /code-tab-content %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: your {{% product-name %}} database
- {{% code-placeholder-key %}}`DATABASE_TOKEN`{{% /code-placeholder-key %}}:
  a [database token](/influxdb3/cloud-dedicated/admin/tokens/#database-tokens)
  with sufficient permissions to the specified database

{{% /code-tabs-wrapper %}}
