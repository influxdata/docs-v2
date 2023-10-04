---
title: Optimize queries
description: >
  Optimize your SQL and InfluxQL queries to improve performance and reduce their memory and compute (CPU) requirements.
weight: 401
menu:
  influxdb_clustered:
    name: Optimize queries
    parent: Execute queries
influxdb/clustered/tags: [query, sql, influxql]
related:
  - /influxdb/clustered/query-data/sql/
  - /influxdb/clustered/query-data/influxql/
  - /influxdb/clustered/query-data/execute-queries/troubleshoot/
  - /influxdb/clustered/reference/client-libraries/v3/
---

## Troubleshoot query performance

Use the following tools to help you identify performance bottlenecks and troubleshoot problems in queries:

<!-- TOC -->

- [Troubleshoot query performance](#troubleshoot-query-performance)
  - [EXPLAIN and ANALYZE](#explain-and-analyze)
  - [Enable trace logging](#enable-trace-logging)
    - [Extract a trace ID](#extract-a-trace-id)
  - [Retrieve system information](#retrieve-system-information)
    - [Retrieve query instance information](#retrieve-query-instance-information)

<!-- /TOC -->

### EXPLAIN and ANALYZE

To view the query engine's execution plan and metrics for an SQL query, prepend [`EXPLAIN`](/influxdb/clustered/reference/sql/explain/) or [`EXPLAIN ANALYZE`](/influxdb/clustered/reference/sql/explain/#explain-analyze) to the query.
The report can reveal query bottlenecks such as a large number of table scans or parquet files, and can help triage the question, "Is the query slow due to the amount of work required or due to a problem with the schema, compactor, etc.?"

The following example shows how to use the InfluxDB v3 Python client library and pandas to view `EXPLAIN` and `EXPLAIN ANALYZE` results for a query:

<!-- Import for tests and hide from users.
```python
import os
```
-->
<!--pytest-codeblocks:cont-->
{{% code-placeholders "DATABASE_(NAME|TOKEN)|APP_REQUEST_ID" %}}
```python
from influxdb_client_3 import InfluxDBClient3
import pandas as pd
import tabulate # Required for pandas.to_markdown()

def explain_and_analyze():
  print('Use SQL EXPLAIN and ANALYZE to view query plan information.')

  # Instantiate an InfluxDB client.
  client = InfluxDBClient3(token = f"DATABASE_TOKEN",
                          host = f"{{< influxdb/host >}}",
                          database = f"DATABASE_NAME")

  sql_explain = '''EXPLAIN SELECT *
        FROM home
        WHERE time >= now() - INTERVAL '90 days'
        ORDER BY time'''

  table = client.query(sql_explain)
  df = table.to_pandas()

  sql_explain_analyze = '''EXPLAIN ANALYZE SELECT *
      FROM home
      WHERE time >= now() - INTERVAL '90 days'
      ORDER BY time'''

  table = client.query(sql_explain_analyze)

  # Combine the Dataframes and output the plan information.
  df = pd.concat([df, table.to_pandas()])

  assert df.shape == (3, 2) and df.columns.to_list() == ['plan_type', 'plan']
  print(df[['plan_type', 'plan']].to_markdown(index=False))

  client.close()

explain_and_analyze()
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: your {{% product-name %}} database
- {{% code-placeholder-key %}}`DATABASE_TOKEN`{{% /code-placeholder-key %}}: a [database token](/influxdb/clustered/admin/tokens/) with sufficient permissions to the specified database

The output is similar to the following:

```markdown
| plan_type         | plan                                                                                                                                         |
|:------------------|:---------------------------------------------------------------------------------------------------------------------------------------------|
| logical_plan      | Sort: home.time ASC NULLS LAST                                                                                                               |
|                   |   TableScan: home projection=[co, hum, room, sensor, temp, time], full_filters=[home.time >= TimestampNanosecond(1688491380936276013, None)] |
| physical_plan     | SortExec: expr=[time@5 ASC NULLS LAST]                                                                                                       |
|                   |   EmptyExec: produce_one_row=false                                                                                                           |
| Plan with Metrics | SortExec: expr=[time@5 ASC NULLS LAST], metrics=[output_rows=0, elapsed_compute=1ns, spill_count=0, spilled_bytes=0]                         |
|                   |   EmptyExec: produce_one_row=false, metrics=[]
```

## Enable trace logging

Use query tracing in {{% product-name %}} to get observability into a slow query.
The tracing system follows the [OpenTelemetry traces](https://opentelemetry.io/docs/concepts/signals/traces/) model for providing observability into a request.

To enable tracing for your query, include the `influx-debug-id` header and a unique string value that identifies your query.
With tracing enabled, InfluxDB generates a _trace ID_ that uniquely identifies the trace and propagates through the system.
InfluxDB Support can then use the ID you provide and the associated trace ID to filter and correlate related log entries for the query.

{{% note %}}
When you request help from InfluxDB Support, provide the unique identifier that you sent in the `influx-debug-id` header.
When troubleshooting the query, InfluxDB Support uses the identifier you provide and the associated trace ID to filter and correlate related log entries.
{{% /note %}}

The following examples show how to pass the `influx-debug-id` header in a query request:

{{< tabs-wrapper >}}
{{% tabs %}}
[Python with FlightCallOptions](#)
[Python with FlightClientMiddleware](#)
{{% /tabs %}}
{{% tab-content %}}
<!---- BEGIN PYTHON WITH FLIGHTCALLOPTIONS ---->
Use the `InfluxDBClient3` InfluxDB Python client and pass the `headers` argument in the
`query()` method.

<!-- Import for tests and hide from users.
```python
import os
```
-->
<!--pytest-codeblocks:cont-->
{{% code-placeholders "DATABASE_(NAME|TOKEN)|APP_REQUEST_ID" %}}
```python
from influxdb_client_3 import InfluxDBClient3

def query_with_flightcalloptions():
  print('# Use FlightCallOptions to send the tracing header.')
  client = InfluxDBClient3(token = f"DATABASE_TOKEN",
                      host = f"{{< influxdb/host >}}",
                      database = f"DATABASE_NAME")

  client.query('''SELECT * FROM home
                  WHERE time >= now() - INTERVAL '30 days'
                ''',
                headers=[(b"influx-debug-id", b"APP_REQUEST_ID")])

query_with_flightcalloptions()
```
{{% /code-placeholders %}}
<!---- END PYTHON WITH FLIGHTCALLOPTIONS ---->
{{% /tab-content %}}
{{% tab-content %}}
<!---- BEGIN PYTHON WITH MIDDLEWARE ---->
Use the `InfluxDBClient3` InfluxDB Python client and `flight.ClientMiddleware` to pass headers.

<!-- Import for tests and hide from users.
```python
import os
```
-->
<!--pytest-codeblocks:cont-->
{{% code-placeholders "DATABASE_(NAME|TOKEN)|APP_REQUEST_ID" %}}
```python
# Define a custom middleware factory that returns a middleware instance.
import pyarrow.flight as flight
from influxdb_client_3 import InfluxDBClient3

class TracingClientMiddleWareFactory(flight.ClientMiddleware):
  def __init__(self):
      self.traces  = []

  def addTrace(self, traceid):
      self.traces.append(traceid)

  def start_call(self, info):
      return TracingClientMiddleware(info.method, self)

# Define the middleware with client event callbacks.
# We've added __init__ to accept callback and method.
class TracingClientMiddleware(flight.ClientMiddleware):
  def __init__(self, method, callback_obj):
      self._method = method
      self.callback = callback_obj

  def sending_headers(self):
      request_id="APP_REQUEST_ID"
      print(f"Enable tracing for query {request_id}")
      return {"influx-debug-id": request_id,}

def query_with_middleware():
  print('# Use FlightClientMiddleware to send the tracing header.')
  # Define the factory to use.
  res = TracingClientMiddleWareFactory()

  # Invoke the client, passing the middleware in, with the callback class
  client = InfluxDBClient3(token = f"DATABASE_TOKEN",
                      host = f"{{< influxdb/host >}}",
                      database = f"DATABASE_NAME",
                      flight_client_options={"middleware": (res,)})

  client.query("SELECT * FROM home WHERE time >= now() - INTERVAL '30 days'")

query_with_middleware()
```
{{% /code-placeholders %}}
<!---- END PYTHON WITH  MIDDLEWARE ---->
{{% /tab-content %}}
{{< /tabs-wrapper >}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: your {{% product-name %}} database
- {{% code-placeholder-key %}}`DATABASE_TOKEN`{{% /code-placeholder-key %}}: a [database token](/influxdb/clustered/admin/tokens/) with sufficient permissions to the specified database
- {{% code-placeholder-key %}}`APP_REQUEST_ID`{{% /code-placeholder-key %}}: a unique identifier you provide to associate with the trace logging.

With tracing enabled, the response contains the `trace-id` header with the 128-bit unique _trace ID_ generated by the tracing system.

#### Extract a trace ID

Extract the trace ID to verify tracing is enabled and to [retrieve information about the query instance](#retrieve-query-instance-information).
To extract the trace ID from the InfluxDB query response, inject `FlightClientMiddleware` with a `received_headers()` event callback into the request.
When the client receives InfluxDB response headers, it invokes the callback function you defined for the event.

The following example shows how to use Python with `pyarrow.flight.FlightClientMiddleware` to extract the `trace-id` from the response:

<!-- Import for tests and hide from users.
```python
import os
```
-->
<!--pytest-codeblocks:cont-->
{{% code-placeholders "DATABASE_(NAME|TOKEN)|APP_REQUEST_ID" %}}
```python
# Define a custom middleware factory that returns a middleware instance.
import pyarrow.flight as flight
from influxdb_client_3 import InfluxDBClient3

class TracingClientMiddleWareFactory(flight.ClientMiddleware):
  # Creates an array to store the trace ID.
  def __init__(self):
      self.traces  = []

  # Appends the trace ID to the traces array.
  def addTrace(self, traceid):
      self.traces.append(traceid)

  # Call the defined middleware, passing in the method and factory.
  def start_call(self, info):
      return TracingClientMiddleware(info.method, self)

# Define the middleware with client event callback functions.
# __init__ accepts a Flight action and a callback event.
class TracingClientMiddleware(flight.ClientMiddleware):
  def __init__(self, method, callback_obj):
      self._method = method
      self.callback = callback_obj

  def sending_headers(self):
      request_id="APP_REQUEST_ID"
      print(f"Enabling tracing with request identifier {request_id}")
      return {"influx-debug-id": request_id,}

  def received_headers(self, headers):
      print(f"Received headers from {self._method}")
      # If the action is DO_GET,
      # extract the generated trace ID from the response header
      # and add it to the traces array.
      if str(self._method) == "FlightMethod.DO_GET" and "trace-id" in headers:
          trace_id = headers["trace-id"][0]
          self.callback.addTrace(trace_id)

def query_with_middleware():
  print('''Use FlightClientMiddleware to send request headers
          and extract response headers.''')
  # Instantiate the middleware factory that returns an instance of the middleware
  # with event callbacks.
  res = TracingClientMiddleWareFactory()

  # Invoke the client, passing in the middleware instance.
  client = InfluxDBClient3(token = f"DATABASE_TOKEN",
                      host = f"{{< influxdb/host >}}",
                      database = f"DATABASE_NAME",
                      flight_client_options={"middleware": (res,)})

  client.query("SELECT * FROM home WHERE time >= now() - INTERVAL '30 days'")

  # Access the trace ID that the the middleware collected.
  assert res.traces[0]
  print(f"Received generated trace-id: {res.traces[0]}")

query_with_middleware()
```
{{% /code-placeholders %}}

### Retrieve system information

In addition to the SQL standard `information_schema`, {{% product-name %}} contains _system_ tables that provide access to
InfluxDB-specific information.
The information in each system table is scoped to the namespace you're querying;
you can only retrieve system information for that particular instance.

#### Retrieve query instance information

To get information about queries you've run on the current instance, use SQL to query the [`system.queries` table](/influxdb/clustered/reference/internals/system-tables/#systemqueries-measurement).
`system.queries` contains information about queries run against the IOx instance that is currently handling queries.
If you [enabled trace logging for the query](#enable-trace-logging-for-a-query), the `trace-id` appears in the `system.queries.trace_id` column for the query run.

The `system.queries` table is an InfluxDB v3 **debug feature**.
To enable the feature and query `system.queries`, include an `"iox-debug"` header set to `"true"` and use SQL to query the table.

The following sample code shows how to use the Python client library to do the following:

1.  Enable tracing for a query.
2.  Extract the trace ID from the response headers.
3.  Use the trace ID to retrieve information about the traced query.

<!-- Import for tests and hide from users.
```python
import os
```
-->
<!--pytest-codeblocks:cont-->
{{% code-placeholders "DATABASE_(NAME|TOKEN)|APP_REQUEST_ID" %}}
```python
import pyarrow.flight as flight
from influxdb_client_3 import InfluxDBClient3
import time
import pandas as pd

class TracingClientMiddleWareFactory(flight.ClientMiddleware):
  def __init__(self):
      self.traces  = []

  def addTrace(self, traceid):
      self.traces.append(traceid)

  def start_call(self, info):
      return TracingClientMiddleware(info.method, self)

# Define the middleware with client event callbacks.
# We've added __init__ to accept callback and method
class TracingClientMiddleware(flight.ClientMiddleware):
  def __init__(self, method, callback_obj):
      self._method = method
      self.callback = callback_obj

  def received_headers(self, headers):
      print(f"Received headers {headers} from {self._method}")
      # If the method is DO_GET,
      # extract the generated trace-id from the response headers.
      if str(self._method) == "FlightMethod.DO_GET" and "trace-id" in headers:
          trace_id = headers["trace-id"][0]
          self.callback.addTrace(trace_id)

def get_query_info():
  print('Get system query information')
  # Instantiate the middleware.
  res = TracingClientMiddleWareFactory()

  # Instantiate the client, passing in the middleware.
  client = InfluxDBClient3(token = f"DATABASE_TOKEN",
                          host = f"{{< influxdb/host >}}",
                          database = f"DATABASE_NAME",
                          flight_client_options={"middleware": (res,)})

  sql = "SELECT * FROM home WHERE time >= now() - INTERVAL '30 days'"
  client.query(sql,
              headers=[(b"influx-debug-id", b"APP_TRACE_ID")])
  client.close()

  system_sql = f'''
                SELECT *
                FROM system.queries
                WHERE issue_time >= now() - INTERVAL '1 day'
                AND trace_id = '{res.traces[0]}'
                '''
  # Instantiate a new client (without middleware) that passes the header to enable
  # querying system tables.
  client = InfluxDBClient3(token = f"DATABASE_TOKEN",
                      host = f"{{< influxdb/host >}}",
                      database = f"DATABASE_NAME")

  df = pd.DataFrame()

  for i in range(0,3):
    table = client.query(system_sql,
                      language='sql',
                      headers=[(b"iox-debug", b"true")])
    df = table.to_pandas()
    if df.empty:
      time.sleep(1)
    else:
      break
  assert df.at[0, 'query_text'] == sql
  print(df.at[0, 'completed_duration'])

get_query_info()
```
{{% /code-placeholders %}}

The output is similar to the following:

```
0 days 00:00:00.002062389
```
