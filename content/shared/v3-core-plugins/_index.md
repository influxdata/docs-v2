> [!Important]
> #### Processing engine only works with Docker
> 
> The Processing engine is currently supported only in Docker x86 environments. Non-Docker support is coming soon. The engine, API, and developer experience are actively evolving and may change. Join our [Discord](https://discord.gg/9zaNCW2PRT) for updates and feedback.

InfluxDB 3 has an embedded Python VM for dynamically loading plugins that can execute code in the database. There are four types of plugins that can be triggered by the following events in the database:

* **WAL flush**: Triggered when the write-ahead log (WAL) is flushed to object store (once a second by default)
* **Parquet persistenc (coming soon)**: Triggered when data is persisted to object store in Parquet format
* **Scheduled tasks**: Triggered by a schedule, specified in cron sytnax
* **On Request**: Bind to a specific endpoint under `/api/v3/engine` and trigger when GET or POST requests are made

Each plugin type has a different trigger configuration, which will be described in the section on each plugin type.

When starting the server, the argument `--plugin-dir` must be provided that specifies what directory plugins are located in. There is also a public Github repository of example plugins that can be referenced when creating a trigger. The repository at [https://github.com/influxdata/influxdb3_plugins](https://github.com/influxdata/influxdb3_plugins) contans example plugins and contributions from the community.

## Shared API

Within any of the plugin types, a shared API is available to interact with the database. The shared API provides access to the following:
* `LineBuilder` to create Line Protocol lines that can be written to the database
* `query` to query data from any database
* `info`, `warn`, and `error` to log messages to the database log, which will be output in the server logs and captured in system tables queryable by SQL

### Line Builder

The `LineBuilder` is a simple API for building lines of Line Protocol to write into the database. Writes are buffered while the plugin runs and are flushed when the plugin completes. The `LineBuilder` API is available in all plugin types. Here are some examples of using the `LineBuilder` API:

```python
line = LineBuilder("weather")
    .tag("location", "us-midwest")
    .float64_field("temperature", 82.5)
    .time_ns(1627680000000000000)
influxdb3_local.write(line)

# to output it as a string: "weather,location=us-midwest temperature=82.5 1627680000000000000"
line_str = line.build()

# or build incrementally
line = LineBuilder("weather")
line.tag("location", "us-midwest")
line.float64_field("temperature", 82.5)
line.time_ns(1627680000000000000)
influxdb3_local.write(line)
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
The `query` function on the API will execute a SQL query with optional parameters (through a parameterized query) and return the results as a `List` of `Dict[String, Any]` where the key is the column name and the value is the value for that column.  The `query` function is available in all plugin types.

Some examples:

```python
influxdb3_local.query("SELECT * from foo where bar = 'baz' and time > now() - 'interval 1 hour'")

# or using parameterized queries
args = {"bar": "baz"}
influxdb3_local.query("SELECT * from foo where bar = $bar and time > now() - 'interval 1 hour'", args)
```

### Logging
The `info`, `warn`, and `error` functions on the API will log messages to the database log, which will be output in the server logs and captured in system tables queryable by SQL. The `info`, `warn`, and `error` functions are available in all plugin types. The functions take an arbitrary number of arguments and will convert them to strings and join them into a single message separated by a space. Examples:

```python
ifluxdb3_local.info("This is an info message")
influxdb3_local.warn("This is a warning message")
influxdb3_local.error("This is an error message")

obj_to_log = {"hello": "world"}
influxdb3_local.info("This is an info message with an object", obj_to_log)
```

### Trigger arguments
Every plugin type can receive arguments from the configuration of the trigger. This is useful for passing configuration to the plugin. This can drive behavior like things to monitor for or it could be connection information to third party services that the plugin will interact with. The arguments are passed as a `Dict[str, str]` where the key is the argument name and the value is the argument value. Here's an example of how to use arguments in a WAL plugin:

```python
def process_writes(influxdb3_local, table_batches, args=None):
    if args and "threshold" in args:
        threshold = int(args["threshold"])
        influxdb3_local.info(f"Threshold is {threshold}")
    else:
        influxdb3_local.warn("No threshold provided")
```

The `args` parameter is optional and can be omitted from the trigger definitions if the plugin does not need to use arguments.

## Imports
The Python plugins run using the system Python in the Docker container. Pip is installed in the container and can be used to install any dependencies. 
You will need to start up the server with the `PYTHONPATH` set to the location of your site packages for your virtual environment. For example: `PYTHONPATH=myenvl/lib/python3.13/site-packages`

## WAL Flush Plugin
When a WAL flush plugin is triggered, the plugin will receive a list of `table_batches` that have matched the plugin trigger (either all tables in the database or a specific table). Here's an example of a simple WAL flush plugin

```python
def process_writes(influxdb3_local, table_batches, args=None):
    for table_batch in table_batches:
        # Skip if table_name is write_reports
        if table_batch["table_name"] == "write_reports":
            continue

        row_count = len(table_batch["rows"])

        # Double row count if table name matches args table_name
        if args and "double_count_table" in args and table_batch["table_name"] == args["double_count_table"]:
            row_count *= 2

        line = LineBuilder("write_reports")\
            .tag("table_name", table_batch["table_name"])\
            .int64_field("row_count", row_count)
        influxdb3_local.write(line)

    influxdb3_local.info("wal_plugin.py done")
```

### WAL Flush Trigger Configuration

Every trigger is associated with a specific database. The best reference for the arguments for trigger definition can be accessed through the CLI help:

```shell
influxdb3 create trigger help
```

For the WAL plugin, the `trigger-spec` can be either `all-tables` which will trigger on any write to the assoicated database or `table:<table_name>` which will call the `process_writes` function only with the writes for the given table. The trigger-spec is what the server uses to determine which plugin type the plugin-filename points to.

The `args` parameter can be used to pass configuration to the plugin.

For example, if creating a trigger of WAL flush from the examples repo:

```shell
influxdb3 create trigger --trigger-spec "table:foo" --plugin-filename "gh:examples/wal_plugin/wal_plugin.py" --database mydb foo-trigger
```

Without the `gh:` at the start of the filename, the server will look for the file in its plugin directory.

## Schedule Plugin
Schedule plugins run on a schedule specified in cron syntax. The plugin will receive the local API, the time of the trigger, and any arguments passed in the trigger definition. Here's an example of a simple schedule plugin:

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

### Schedule Trigger Configuration
Schedule plugins are set with a `trigger-spec` of `schedule:<cron_expression>` or `every:<duration>`. The `args` parameter can be used to pass configuration to the plugin. For example, if we wanted to use the system-metrics example from the Github repo and have it collect every 10 seconds we could use the following trigger definition:

```shell
influxdb3 create trigger --trigger-spec "every:10s" --plugin-filename "gh:examples/schedule/system_metrics/system_metrics.py" --database mydb system-metrics
```

## On Request Plugin
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

### On Request Trigger Configuration
On Request plugins are set with a `trigger-spec` of `request:<endpoint>`. The `args` parameter can be used to pass configuration to the plugin. For example, if we wanted the above plugin to run on the endpoint `/api/v3/engine/my_plugin`, we would use `request:my_plugin` as the `trigger-spec`.

Trigger specs must be unique across all configured plugins, regardless of which database they are tied to, given the path is the same. Here's an example to create a request trigger tied to the "hello-world' path using a plugin in the plugin-dir:

```shell
influxdb3 create trigger --trigger-spec "request:hello-world" --plugin-filename "hellp/hello_world.py" --database mydb hello-world
```