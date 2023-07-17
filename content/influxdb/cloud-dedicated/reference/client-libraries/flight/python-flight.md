---
title: Python Flight client
description: The Python Flight client integrates with Python scripts and applications to query data stored in InfluxDB.
menu:
  influxdb_cloud_dedicated:
    name: Python
    parent: Arrow Flight clients
    identifier: python-flight-client
influxdb/cloud-dedicated/tags: [Python, gRPC, SQL, Flight SQL, client libraries]
aliases:
  - /influxdb/cloud-dedicated/reference/client-libraries/flight-sql/python-flightsql/
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
        '1970-01-01T00:00:00Z'::TIMESTAMP) AS _time,
      room,
      selector_max(temp, time)['value'] AS 'max temp',
      selector_min(temp, time)['value'] AS 'min temp',
      avg(temp) AS 'average temp'
    FROM home
    GROUP BY
      _time,
      room
    ORDER BY room, _time"""
    
  flight_ticket = Ticket(json.dumps({
    "namespace_name": "DATABASE_NAME",
    "sql_query": sql,
    "query_type": "sql"
  }))

  token = (b"authorization", bytes(f"Bearer DATABASE_TOKEN".encode('utf-8')))
  options = FlightCallOptions(headers=[token])
  client = FlightClient(f"grpc+tls://cluster-id.influxdb.io:443")

  reader = client.do_get(flight_ticket, options)
  arrow_table = reader.read_all()
  ```
---

[Apache Arrow Python bindings](https://arrow.apache.org/docs/python/index.html) integrate with Python scripts and applications to query data stored in InfluxDB.

The following examples show how to use the `pyarrow.flight` and `pandas` Python modules to query and format data stored in an {{% cloud-name %}} database:

{{% code-tabs-wrapper %}}
{{% code-tabs %}}
[InfluxQL](#influxql-python)
[SQL](#sql-python)
{{% /code-tabs %}}
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
client = FlightClient(f"grpc+tls://cluster-id.influxdb.io:443")

reader = client.do_get(flight_ticket, options)
arrow_table = reader.read_all()
# Use pyarrow and pandas to view and analyze data
data_frame = arrow_table.to_pandas()
print(data_frame.to_markdown())
```
{{% /code-placeholders %}}
<!-- END INFLUXQL -->
{{% /code-tab-content %}}
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
  SELECT DATE_BIN(INTERVAL '2 hours', time),
    room,
    selector_max(temp, time)['value'] AS 'max temp',
    selector_min(temp, time)['value'] AS 'min temp',
    avg(temp) AS 'average temp'
  FROM home
  GROUP BY
    1,
    room
  ORDER BY room, time"""
  
flight_ticket = Ticket(json.dumps({
  "namespace_name": "DATABASE_NAME",
  "sql_query": sql,
  "query_type": "sql"
}))

token = (b"authorization", bytes(f"Bearer DATABASE_TOKEN".encode('utf-8')))
options = FlightCallOptions(headers=[token])
client = FlightClient(f"grpc+tls://cluster-id.influxdb.io:443")

reader = client.do_get(flight_ticket, options)
arrow_table = reader.read_all()
# Use pyarrow and pandas to view and analyze data
data_frame = arrow_table.to_pandas()
print(data_frame.to_markdown())
```
{{% /code-placeholders %}}
<!-- END SQL -->
{{% /code-tab-content %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: your {{% cloud-name %}} database
- {{% code-placeholder-key %}}`DATABASE_TOKEN`{{% /code-placeholder-key %}}: a [database token](/influxdb/cloud-dedicated/admin/tokens/) with sufficient permissions to the database

{{% /code-tabs-wrapper %}}
