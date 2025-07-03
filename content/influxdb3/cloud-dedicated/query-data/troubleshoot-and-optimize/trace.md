---
title: Enable trace logging
description: >
  Enable trace logging for a query in InfluxDB Cloud Dedicated.
weight: 401
menu:
  influxdb3_cloud_dedicated:
    name: Enable trace logging
    parent: Troubleshoot and optimize queries
influxdb3/cloud-dedicated/tags: [query, observability]
related:
  - /influxdb3/cloud-dedicated/query-data/sql/
  - /influxdb3/cloud-dedicated/query-data/influxql/
  - /influxdb3/cloud-dedicated/reference/client-libraries/v3/
draft: true
---

<!-- For draft status details, see https://github.com/influxdata/DAR/issues/453 -->

Learn how to enable trace logging to help you identify performance bottlenecks and troubleshoot problems in queries.

When you enable trace logging for a query, InfluxDB propagates your _trace ID_ through system processes and collects additional log information.
InfluxData Support can then use the trace ID that you provide to filter, collate, and analyze log information for the query run.
The tracing system follows the [OpenTelemetry traces](https://opentelemetry.io/docs/concepts/signals/traces/) model for providing observability into a request.

> [!Warning]
> 
> #### Avoid unnecessary tracing
> 
> Only enable tracing for a query when you need to request troubleshooting help from InfluxDB Support.
> To manage resources, InfluxDB has an upper limit for the number of trace requests.
> Too many traces can cause InfluxDB to evict log information.

To enable tracing for a query, include the `influx-trace-id` header in your query request.

#### Syntax

Use the following syntax for the `influx-trace-id` header:

```http
influx-trace-id: TRACE_ID:1112223334445:0:1
```

In the header value, replace the following:

- `TRACE_ID`: a unique string, 8-16 bytes long, encoded as hexadecimal (32 maximum hex characters).
  The trace ID should uniquely identify the query run.
- `:1112223334445:0:1`: InfluxDB constant values (required, but ignored)

#### Example

The following examples show how to create and pass a trace ID to enable query tracing in InfluxDB:

{{< tabs-wrapper >}}
{{% tabs %}}
[Python with FlightCallOptions](#)
[Python with FlightClientMiddleware](#python-with-flightclientmiddleware)
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

{{% code-placeholders "DATABASE_(NAME|TOKEN)|APP_REQUEST_ID" %}}

<!--pytest-codeblocks:cont-->

```python
from influxdb_client_3 import InfluxDBClient3
import secrets

def use_flightcalloptions_trace_header():
  print('# Use FlightCallOptions to enable tracing.')
  client = InfluxDBClient3(token=f"DATABASE_TOKEN",
                          host=f"{{< influxdb/host >}}",
                          database=f"DATABASE_NAME")

  # Generate a trace ID for the query:
  # 1.  Generate a random 8-byte value as bytes.
  # 2.  Encode the value as hexadecimal.
  random_bytes = secrets.token_bytes(8)
  trace_id = random_bytes.hex()

  # Append required constants to the trace ID.
  trace_value = f"{trace_id}:1112223334445:0:1"

  # Encode the header key and value as bytes.
  # Create a list of header tuples.
  headers = [((b"influx-trace-id", trace_value.encode('utf-8')))]

  sql = "SELECT * FROM home WHERE time >= now() - INTERVAL '30 days'"
  influxql = "SELECT * FROM home WHERE time >= -90d"

  # Use the query() headers argument to pass the list as FlightCallOptions.
  client.query(sql, headers=headers)

  client.close()

use_flightcalloptions_trace_header()
```

{{% /code-placeholders %}}
<!---- END PYTHON WITH FLIGHTCALLOPTIONS ---->
{{% /tab-content %}}
{{% tab-content %}}
<!---- BEGIN PYTHON WITH MIDDLEWARE ---->
Use the `InfluxDBClient3` InfluxDB Python client and `flight.ClientMiddleware` to pass and inspect headers.

#### Tracing response header

With tracing enabled and a valid trace ID in the request, InfluxDB's `DoGet` action response contains a header with the trace ID that you sent.

##### Trace response header syntax

```http
trace-id: TRACE_ID
```

#### Inspect Flight response headers

To inspect Flight response headers when using a client library, pass a `FlightClientMiddleware` instance
that defines a middleware callback function for the `onHeadersReceived` event (the particular function name you use depends on the client library language).

The following example uses Python client middleware that adds request headers and extracts the trace ID from the `DoGet` response headers:

<!-- Import for tests and hide from users.
```python
import os
```
-->

{{% code-placeholders "DATABASE_(NAME|TOKEN)|APP_REQUEST_ID" %}}

<!--pytest-codeblocks:cont-->

```python
import pyarrow.flight as flight

class TracingClientMiddleWareFactory(flight.ClientMiddleware):
  # Defines a custom middleware factory that returns a middleware instance.
    def __init__(self):
        self.request_headers = []
        self.response_headers = []
        self.traces  = []

    def addRequestHeader(self, header):
        self.request_headers.append(header)

    def addResponseHeader(self, header):
        self.response_headers.append(header)

    def addTrace(self, traceid):
        self.traces.append(traceid)

    def createTrace(self, traceid):
      # Append InfluxDB constants to the trace ID.
      trace = f"{traceid}:1112223334445:0:1"

      # To the list of request headers,
      # add a tuple with the header key and value as bytes.
      self.addRequestHeader((b"influx-trace-id", trace.encode('utf-8')))

    def start_call(self, info):
        return TracingClientMiddleware(info.method, self)

class TracingClientMiddleware(flight.ClientMiddleware):
  # Defines middleware with client event callback methods.
    def __init__(self, method, callback_obj):
        self._method = method
        self.callback = callback_obj

    def call_completed(self, exception):
      print('callback: call_completed')
      if(exception):
        print(f"  ...with exception: {exception}")

    def sending_headers(self):
      print('callback: sending_headers: ', self.callback.request_headers)
      if len(self.callback.request_headers) > 0:
        return dict(self.callback.request_headers)

    def received_headers(self, headers):
      self.callback.addResponseHeader(headers)
      # For the DO_GET action, extract the trace ID from the response headers.
      if str(self._method) == "FlightMethod.DO_GET" and "trace-id" in headers:
          trace_id = headers["trace-id"][0]
          self.callback.addTrace(trace_id)

from influxdb_client_3 import InfluxDBClient3
import secrets

def use_middleware_trace_header():
  print('# Use Flight client middleware to enable tracing.')

  # Instantiate the middleware.
  res = TracingClientMiddleWareFactory()

  # Instantiate the client, passing in the middleware instance that provides
  # event callbacks for the request.
  client = InfluxDBClient3(token=f"DATABASE_TOKEN",
                          host=f"{{< influxdb/host >}}",
                          database=f"DATABASE_NAME",
                          flight_client_options={"middleware": (res,)})

  # Generate a trace ID for the query:
  # 1.  Generate a random 8-byte value as bytes.
  # 2.  Encode the value as hexadecimal.
  random_bytes = secrets.token_bytes(8)
  trace_id = random_bytes.hex()

  res.createTrace(trace_id)

  sql = "SELECT * FROM home WHERE time >= now() - INTERVAL '30 days'"

  client.query(sql)
  client.close()
  assert trace_id in res.traces[0], "Expect trace ID in DoGet response."

use_middleware_trace_header()
```

{{% /code-placeholders %}}
<!---- END PYTHON WITH  MIDDLEWARE ---->
{{% /tab-content %}}
{{< /tabs-wrapper >}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: your {{% product-name %}} [database](/influxdb3/cloud-dedicated/admin/databases/)
- {{% code-placeholder-key %}}`DATABASE_TOKEN`{{% /code-placeholder-key %}}:
  a [database token](/influxdb3/cloud-dedicated/admin/tokens/#database-tokens)
  with sufficient permissions to the specified database

> [!Note]
> Store or log your query trace ID to ensure you can provide it to InfluxData Support for troubleshooting.

After you run your query with tracing enabled, do the following:

- Remove the tracing header from subsequent runs of the query (to [avoid unnecessary tracing](#avoid-unnecessary-tracing)).
- Provide the trace ID in a request to InfluxData Support.

### Retrieve system information for a query

If you enable trace logging for a query, the `trace-id` appears in the [`system.queries` table](/influxdb3/cloud-dedicated/query-data/troubleshoot-and-optimize/system-information).
