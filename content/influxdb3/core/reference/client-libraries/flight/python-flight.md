---
title: Python Flight client
description: The Python Flight client integrates with Python scripts and applications to query data stored in InfluxDB.
menu:
  influxdb3_core:
    name: Python
    parent: Arrow Flight clients
    identifier: python-flight-client
influxdb3/core/tags: [Flight client, Python, gRPC, SQL, Flight SQL, client libraries]
aliases:
  - /influxdb3/core/reference/client-libraries/flight-sql/python-flightsql/
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
source: /shared/influxdb-client-libraries-reference/flight/python-flight.md
---

<!-- The content for this page is at
// SOURCE content/shared/influxdb-client-libraries-reference/flight/python-flight.md
-->