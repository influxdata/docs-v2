
Use the {{% product-name %}} Processing engine to run code and perform tasks
for different database events.

{{% product-name %}} provides the InfluxDB 3 Processing engine, an embedded Python VM that can dynamically load and trigger Python plugins
in response to events in your database.

## Key Concepts

### Plugins

A Processing engine _plugin_ is Python code you provide to run tasks, such as
downsampling data, monitoring, creating alerts, or calling external services.

> [!Note]
> #### Contribute and use community plugins
>
> [influxdata/influxdb3_plugins](https://github.com/influxdata/influxdb3_plugins) is a public repository on GitHub where you can find
> and contribute example plugins.
> You can reference plugins from the repository directly within a trigger configuration.

### Triggers

A _trigger_ is an InfluxDB 3 resource you create to associate a database
event (for example, a WAL flush) with the plugin that should run.
When an event occurs, the trigger passes configuration details, optional arguments, and event data to the plugin.

The Processing engine provides four types of triggers—each type corresponds to an event type with event-specific configuration to let you handle events with targeted logic.

- **WAL Flush**: Triggered when the write-ahead log (WAL) is flushed to the object store (default is every second).
- **Scheduled Tasks**: Triggered on a schedule you specify using cron syntax.
- **On-request**: Triggered on a GET or POST request to the bound HTTP API endpoint at `/api/v3/engine/<CUSTOM_PATH>`.
<!--
- **Parquet Persistence (coming soon)**: Triggered when InfluxDB 3 persists data to object storage Parquet files.
-->

### Activate the Processing engine

To enable the Processing engine, start the {{% product-name %}} server with the `--plugin-dir` option and a path to your plugins directory. If the directory doesn’t exist, the server creates it. 

```bash
influxdb3 serve --node-id node0 --object-store [OBJECT STORE TYPE] --plugin-dir /path/to/plugins
```



## The Shared API

All plugin types provide the InfluxDB 3 _shared API_ for interacting with the database.
The shared API provides access to the following:

- `LineBuilder` to create Line Protocol lines for writing to the database
- `query` to query data from any database
- `info`, `warn`, and `error` to log messages to the database log, which is output in the server logs and captured in system tables queryable by SQL

### LineBuilder

The `LineBuilder` is a simple API for building lines of Line Protocol to write into the database. Writes are buffered while the plugin runs and are flushed when the plugin completes. The `LineBuilder` API is available in all plugin types.

The following example shows how to use the `LineBuilder` API:

```python
# Build line protocol incrementally
line = LineBuilder("weather")
line.tag("location", "us-midwest")
line.float64_field("temperature", 82.5)
line.time_ns(1627680000000000000)
influxdb3_local.write(line)

# Output line protocol as a string ("weather,location=us-midwest temperature=82.5 1627680000000000000")
line_str = line.build()
```

Here is the Python implementation of the `LineBuilder` API:

```python
from typing import Optional
from collections import OrderedDict

class InfluxDBError(Exception):
    """Base exception for InfluxDB-related errors"""
    pass

class InvalidMeasurementError(InfluxDBError):
    """Raised when measurement name is invalid"""
    pass

class InvalidKeyError(InfluxDBError):
    """Raised when a tag or field key is invalid"""
    pass

class InvalidLineError(InfluxDBError):
    """Raised when a line protocol string is invalid"""
    pass

class LineBuilder:
    def __init__(self, measurement: str):
        if ' ' in measurement:
            raise InvalidMeasurementError("Measurement name cannot contain spaces")
        self.measurement = measurement
        self.tags: OrderedDict[str, str] = OrderedDict()
        self.fields: OrderedDict[str, str] = OrderedDict()
        self._timestamp_ns: Optional[int] = None

    def _validate_key(self, key: str, key_type: str) -> None:
        """Validate that a key does not contain spaces, commas, or equals signs."""
        if not key:
            raise InvalidKeyError(f"{key_type} key cannot be empty")
        if ' ' in key:
            raise InvalidKeyError(f"{key_type} key '{key}' cannot contain spaces")
        if ',' in key:
            raise InvalidKeyError(f"{key_type} key '{key}' cannot contain commas")
        if '=' in key:
            raise InvalidKeyError(f"{key_type} key '{key}' cannot contain equals signs")

    def tag(self, key: str, value: str) -> 'LineBuilder':
        """Add a tag to the line protocol."""
        self._validate_key(key, "tag")
        self.tags[key] = str(value)
        return self

    def uint64_field(self, key: str, value: int) -> 'LineBuilder':
        """Add an unsigned integer field to the line protocol."""
        self._validate_key(key, "field")
        if value < 0:
            raise ValueError(f"uint64 field '{key}' cannot be negative")
        self.fields[key] = f"{value}u"
        return self

    def int64_field(self, key: str, value: int) -> 'LineBuilder':
        """Add an integer field to the line protocol."""
        self._validate_key(key, "field")
        self.fields[key] = f"{value}i"
        return self

    def float64_field(self, key: str, value: float) -> 'LineBuilder':
        """Add a float field to the line protocol."""
        self._validate_key(key, "field")
        # Check if value has no decimal component
        self.fields[key] = f"{int(value)}.0" if value % 1 == 0 else str(value)
        return self

    def string_field(self, key: str, value: str) -> 'LineBuilder':
        """Add a string field to the line protocol."""
        self._validate_key(key, "field")
        # Escape quotes and backslashes in string values
        escaped_value = value.replace('"', '\\"').replace('\\', '\\\\')
        self.fields[key] = f'"{escaped_value}"'
        return self

    def bool_field(self, key: str, value: bool) -> 'LineBuilder':
        """Add a boolean field to the line protocol."""
        self._validate_key(key, "field")
        self.fields[key] = 't' if value else 'f'
        return self

    def time_ns(self, timestamp_ns: int) -> 'LineBuilder':
        """Set the timestamp in nanoseconds."""
        self._timestamp_ns = timestamp_ns
        return self

    def build(self) -> str:
        """Build the line protocol string."""
        # Start with measurement name (escape commas only)
        line = self.measurement.replace(',', '\\,')

        # Add tags if present
        if self.tags:
            tags_str = ','.join(
                f"{k}={v}" for k, v in self.tags.items()
            )
            line += f",{tags_str}"

        # Add fields (required)
        if not self.fields:
            raise InvalidLineError(f"At least one field is required: {line}")

        fields_str = ','.join(
            f"{k}={v}" for k, v in self.fields.items()
        )
        line += f" {fields_str}"

        # Add timestamp if present
        if self._timestamp_ns is not None:
            line += f" {self._timestamp_ns}"

        return line
```

### Query

The shared API `query` function executes an SQL query with optional parameters (a [parameterized query](/influxdb3/version/query-data/sql/parameterized-queries/)) and returns results as a `List` of `Dict[String, Any]` where the key is the column name and the value is the column value.  The `query` function is available in all plugin types.

The following examples show how to use the `query` function:

```python
influxdb3_local.query("SELECT * from foo where bar = 'baz' and time > now() - 'interval 1 hour'")

# Or using parameterized queries
args = {"bar": "baz"}
influxdb3_local.query("SELECT * from foo where bar = $bar and time > now() - 'interval 1 hour'", args)
```

### Logging

The shared API `info`, `warn`, and `error` functions log messages to the database log, which is output in the server logs and captured in system tables queryable by SQL.
The `info`, `warn`, and `error` functions are available in all plugin types. Each function accepts multiple arguments, converts them to strings, and logs them as a single, space-separated message.

The following examples show how to use the `info`, `warn`, and `error` logging functions:

```python
influxdb3_local.info("This is an info message")
influxdb3_local.warn("This is a warning message")
influxdb3_local.error("This is an error message")

# Log a message that contains a data object
obj_to_log = {"hello": "world"}
influxdb3_local.info("This is an info message with an object", obj_to_log)
```

### Trigger arguments

Every plugin type can receive arguments from the configuration of the trigger that runs it.
You can use this to provide runtime configuration and drive behavior of a plugin—for example:

- threshold values for monitoring
- connection properties for connecting to third-party services

The arguments are passed as a `Dict[str, str]` where the key is the argument name and the value is the argument value.

The following example shows how to use an argument in a WAL plugin:

```python
def process_writes(influxdb3_local, table_batches, args=None):
    if args and "threshold" in args:
        threshold = int(args["threshold"])
        influxdb3_local.info(f"Threshold is {threshold}")
    else:
        influxdb3_local.warn("No threshold provided")
```

The `args` parameter is optional. If a plugin doesn’t require arguments, you can omit it from the trigger definition.

## Import plugin dependencies

Use the `influxdb3 install` command to download and install Python packages that your plugin depends on.

```bash
influxdb3 install package <PACKAGE_NAME>
```

### Use `influxdb3 install` with Docker

1. Start the server

   ```bash
   docker run \
   --name CONTAINER_NAME \
   -v /path/to/.influxdb3/data:/data \
   -v /path/to/.influxdb3/plugins:/plugins \
   quay.io/influxdb/influxdb3-{{< product-key >}}:latest \
   serve --node-id=node0 \
   --object-store=file \
   --data-dir=/data \
   --http-bind=localhost:8183 \
   --plugin-dir=/plugins
   ```

2. Use `docker exec` to run the `influxdb3 install` command:
   
   ```bash
   docker exec -it CONTAINER_NAME influxdb3 install package pandas
   ```

The result is an active Python virtual environment with the package installed in `<PLUGINS_DIR>/.venv`.
You can specify additional options to install dependencies from a `requirements.txt` file or a custom virtual environment path.
For more information, see the `influxdb3` CLI help:

```bash
influxdb3 install package --help
```

## Configure plugin triggers
Triggers define when and how plugins execute in response to database events. Each trigger type corresponds to a specific event, allowing precise control over automation within {{% product-name %}}.

### WAL flush trigger

When a WAL flush plugin is triggered, the plugin receives a list of `table_batches` filtered by the trigger configuration (either _all tables_ in the database or a specific table).

The following example shows a simple WAL flush plugin:

```python
def process_writes(influxdb3_local, table_batches, args=None):
    for table_batch in table_batches:
        # Skip the batch if table_name is write_reports
        if table_batch["table_name"] == "write_reports":
            continue

        row_count = len(table_batch["rows"])

        # Double the row count if table name matches args table_name
        if args and "double_count_table" in args and table_batch["table_name"] == args["double_count_table"]:
            row_count *= 2

        # Use the LineBuilder API to write data
        line = LineBuilder("write_reports")\
            .tag("table_name", table_batch["table_name"])\
            .int64_field("row_count", row_count)
        influxdb3_local.write(line)

    influxdb3_local.info("wal_plugin.py done")
```

#### WAL flush trigger configuration

When you create a trigger, you associate it with a database and provide configuration specific to the trigger type.

For a WAL flush trigger you specify a `trigger-spec`, which determines when the plugin is triggered (and what table data it receives):

- `all-tables`: triggers the plugin on every write to the associated database
- `table:<table_name>` triggers the plugin function only for writes to the specified table.

The following example creates a WAL flush trigger for the `gh:examples/wal_plugin/wal_plugin.py` plugin. 

```bash
influxdb3 create trigger \
  --trigger-spec "table:TABLE_NAME" \
  --plugin-filename "gh:examples/wal_plugin/wal_plugin.py" \
  --database DATABASE_NAME TRIGGER_NAME
```

The `gh:` prefix lets you fetch a plugin file directly from the [influxdata/influxdb3_plugins](https://github.com/influxdata/influxdb3_plugins) repository in GitHub.
Without the prefix, the server looks for the file inside of the plugins directory.

To provide additional configuration to your plugin, pass a list of key-value pairs in the `--trigger-arguments` option and, in your plugin, use the `args` parameter to receive the arguments.
For more information about trigger arguments, see the CLI help:

```bash
influxdb3 create trigger help
```

### Schedule trigger

Schedule plugins run on a schedule specified in cron syntax. The plugin receives the local API, the time of the trigger, and any arguments passed in the trigger definition. Here's an example of a simple schedule plugin:

```python
# see if a table has been written to in the last 5 minutes
def process_scheduled_call(influxdb3_local, time, args=None):
    if args and "table_name" in args:
        table_name = args["table_name"]
        result = influxdb3_local.query(f"SELECT * FROM {table_name} WHERE time > now() - 'interval 5m'")
        # write an error log if the result is empty
        if not result:
            influxdb3_local.error(f"No data in {table_name} in the last 5 minutes")
    else:
        influxdb3_local.error("No table_name provided for schedule plugin")
```

#### Schedule trigger configuration

Schedule plugins are set with a `trigger-spec` of `schedule:<cron_expression>` or `every:<duration>`. The `args` parameter can be used to pass configuration to the plugin. For example, if we wanted to use the system-metrics example from the Github repo and have it collect every 10 seconds we could use the following trigger definition:

```shell
influxdb3 create trigger \
  --trigger-spec "every:10s" \
  --plugin-filename "gh:examples/schedule/system_metrics/system_metrics.py" \
  --database mydb system-metrics
```

### On Request trigger

On Request plugins are triggered by a request to a specific endpoint under `/api/v3/engine`. The plugin will receive the local API, query parameters `Dict[str, str]`, request headers `Dict[str, str]`, request body (as bytes), and any arguments passed in the trigger definition. Here's an example of a simple On Request plugin:

```python
import json

def process_request(influxdb3_local, query_parameters, request_headers, request_body, args=None):
    for k, v in query_parameters.items():
        influxdb3_local.info(f"query_parameters: {k}={v}")
    for k, v in request_headers.items():
        influxdb3_local.info(f"request_headers: {k}={v}")

    request_data = json.loads(request_body)

    influxdb3_local.info("parsed JSON request body:", request_data)

    # write the data to the database
    line = LineBuilder("request_data").tag("tag1", "tag1_value").int64_field("field1", 1)
    # get a string of the line to return as the body
    line_str = line.build()

    influxdb3_local.write(line)

    return 200, {"Content-Type": "application/json"}, json.dumps({"status": "ok", "line": line_str})
```

#### On Request trigger configuration

On-request plugins are set with a `trigger-spec` of `request:<endpoint>`. The `args` parameter can be used to pass configuration to the plugin. For example, if we wanted the above plugin to run on the endpoint `/api/v3/engine/my_plugin`, we would use `request:my_plugin` as the `trigger-spec`.

Trigger specs must be unique across all configured plugins, regardless of which database they are tied to, given the path is the same. Here's an example to create a request trigger tied to the "hello-world' path using a plugin in the plugin-dir:

```shell
influxdb3 create trigger \
  --trigger-spec "request:hello-world" \
  --plugin-filename "hello/hello_world.py" \
  --database mydb hello-world
```
