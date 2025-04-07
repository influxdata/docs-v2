Use the InfluxDB 3 Processing engine to run Python code directly in your
{{% product-name %}} database to automatically process data and respond to database events.

The Processing engine is an embedded Python VM that runs inside your InfluxDB 3 database and lets you:

- Process data as it's written to the database
- Run code on a schedule
- Create API endpoints that execute Python code
- Maintain state between executions with an in-memory cache

Learn how to create, configure, run, and extend Python plugins that execute when specific events occur.

1. [Set up the Processing engine](#set-up-the-processing-engine)
2. [Add a Processing engine plugin](#add-a-processing-engine-plugin)
   - [Get example plugins](#get-example-plugins)
   - [Create a plugin](#create-a-plugin)
3. [Create a trigger to run a plugin](#create-a-trigger-to-run-a-plugin)
   - [Create a trigger for data writes](#create-a-trigger-for-data-writes)
   - [Create a trigger for scheduled events](#create-a-trigger-for-scheduled-events)
   - [Create a trigger for HTTP requests](#create-a-trigger-for-http-requests)
   - [Use community plugins from GitHub](#use-community-plugins-from-github)
   - [Pass arguments to plugins](#pass-arguments-to-plugins)
   - [Control trigger execution](#control-trigger-execution)
   - [Configure error handling for a trigger](#configure-error-handling-for-a-trigger)
- [Extend plugins with API features and state management](#extend-plugins-with-api-features-and-state-management)
- [Install Python dependencies](#install-python-dependencies)

## Set up the Processing engine

To enable the Processing engine, start your InfluxDB server with the `--plugin-dir` option:

```bash
influxdb3 serve \
  --node-id node0 \
  --object-store [OBJECT_STORE_TYPE] \
  --plugin-dir /path/to/plugins
```

## Add a Processing engine plugin

A plugin is a Python file that contains a specific function signature that corresponds to a trigger type.
Plugins:

- Receive plugin-specific arguments (such as written data, call time, or an HTTP request)
- Can receive keyword arguments (as `args`) from _trigger arguments_
- Can access the `influxdb3_local` shared API for writing, querying, and managing state

Get started using example plugins or create your own:

- [Get example plugins](#get-example-plugins)
- [Create a plugin](#create-a-plugin)

### Get example plugins

InfluxData maintains a repository of contributed plugins that you can use as-is or as a starting point for your own plugin.

#### From local files

You can copy example plugins from the [influxdb3_plugins repository](https://github.com/influxdata/influxdb3_plugins) to your local plugin directory:

```bash
# Clone the repository
git clone https://github.com/influxdata/influxdb3_plugins.git

# Copy example plugins to your plugin directory
cp -r influxdb3_plugins/examples/wal_plugin/* /path/to/plugins/
```

#### Directly from GitHub

You can use plugins directly from GitHub without downloading them first by using the `gh:` prefix in the plugin filename:

```bash
# Use a plugin directly from GitHub
influxdb3 create trigger \
    --trigger-spec "every:1m" \
    --plugin-filename "gh:examples/schedule/system_metrics/system_metrics.py" \
    --database my_database \
    system_metrics
```

> [!Note]
> #### Find and contribute plugins
>
> The plugins repository includes examples for various use cases:
> 
> - **Data transformation**: Process and transform incoming data
> - **Alerting**: Send notifications based on data thresholds
> - **Aggregation**: Calculate statistics on time series data
> - **Integration**: Connect to external services and APIs
> - **System monitoring**: Track resource usage and health metrics
>
> Visit [influxdata/influxdb3_plugins](https://github.com/influxdata/influxdb3_plugins)
> to browse available plugins or contribute your own.

### Create a plugin

1. Create a `.py` file in your plugins directory
2. Define a function with one of the following signatures:

#### For data write events

```python
def process_writes(influxdb3_local, table_batches, args=None):
    # Process data as it's written to the database
    for table_batch in table_batches:
        table_name = table_batch["table_name"]
        rows = table_batch["rows"]
        
        # Log information about the write
        influxdb3_local.info(f"Processing {len(rows)} rows from {table_name}")
        
        # Write derived data back to the database
        line = LineBuilder("processed_data")
        line.tag("source_table", table_name)
        line.int64_field("row_count", len(rows))
        influxdb3_local.write(line)
```

#### For scheduled events

```python
def process_scheduled_call(influxdb3_local, call_time, args=None):
    # Run code on a schedule
    
    # Query recent data
    results = influxdb3_local.query("SELECT * FROM metrics WHERE time > now() - INTERVAL '1 hour'")
    
    # Process the results
    if results:
        influxdb3_local.info(f"Found {len(results)} recent metrics")
    else:
        influxdb3_local.warn("No recent metrics found")
```

#### For HTTP requests

```python
def process_request(influxdb3_local, query_parameters, request_headers, request_body, args=None):
    # Handle HTTP requests to a custom endpoint
    
    # Log the request parameters
    influxdb3_local.info(f"Received request with parameters: {query_parameters}")
    
    # Process the request body
    if request_body:
        import json
        data = json.loads(request_body)
        influxdb3_local.info(f"Request data: {data}")
    
    # Return a response (automatically converted to JSON)
    return {"status": "success", "message": "Request processed"}
```

After adding your plugin, you can [install Python dependencies](#install-python-dependencies) or learn how to [extend plugins with API features and state management](#extend-plugins-with-api-features-and-state-management).

## Create a trigger to run a plugin

A trigger connects your plugin to a specific database event.
The plugin function signature in your plugin file determines which _trigger specification_
you can choose for configuring and activating your plugin.

Create a trigger with the `influxdb3 create trigger` command.

> [!Note]
> When specifying a local plugin file, the `--plugin-filename` parameter
> _is relative to_ the `--plugin-dir` configured for the server.
> You don't need to provide an absolute path.

### Create a trigger for data writes

Use the `table:<TABLE_NAME>` or the `all_tables` trigger specification to configure
and run a [plugin for data write events](#for-data-write-events)--for example:

```bash
# Trigger on writes to a specific table
# The plugin file must be in your configured plugin directory
influxdb3 create trigger \
  --trigger-spec "table:sensor_data" \
  --plugin-filename "process_sensors.py" \
  --database my_database \
  sensor_processor

# Trigger on writes to all tables
influxdb3 create trigger \
  --trigger-spec "all_tables" \
  --plugin-filename "process_all_data.py" \
  --database my_database \
  all_data_processor
```

The trigger runs when the database flushes ingested data for the specified tables
to the Write-Ahead Log (WAL) in the Object store (default is every second).

The plugin receives the written data and table information.

### Create a trigger for scheduled events

Use the `every:<DURATION>` or the `cron:<CRONTAB_EXPRESSION>` trigger specification
to configure and run a [plugin for scheduled events](#for-scheduled-events)--for example:

```bash
# Run every 5 minutes
influxdb3 create trigger \
  --trigger-spec "every:5m" \
  --plugin-filename "hourly_check.py" \
  --database my_database \
  regular_check

# Run on a cron schedule (8am daily)
influxdb3 create trigger \
  --trigger-spec "cron:0 8 * * *" \
  --plugin-filename "daily_report.py" \
  --database my_database \
  daily_report
```

The plugin receives the scheduled call time.

### Create a trigger for HTTP requests

[For an HTTP request plugin], use the `path:<ENDPOINT_PATH>` trigger specification to configure and enable a [plugin for HTTP requests](#for-http-requests)--for example:

```bash
# Create an endpoint at /api/v3/engine/webhook
influxdb3 create trigger \
  --trigger-spec "path:webhook" \
  --plugin-filename "webhook_handler.py" \
  --database my_database \
  webhook_processor
```

The trigger makes your endpoint available at `/api/v3/engine/<ENDPOINT_PATH>`.
To run the plugin, send a `GET` or `POST` request to the endpoint--for example:

```bash
curl http://{{% influxdb/host %}}/api/v3/engine/webhook
```

The plugin receives the HTTP request object with methods, headers, and body.

### Use community plugins from GitHub

You can reference plugins directly from the GitHub repository by using the `gh:` prefix:

```bash
# Create a trigger using a plugin from GitHub
influxdb3 create trigger \
  --trigger-spec "every:1m" \
  --plugin-filename "gh:examples/schedule/system_metrics/system_metrics.py" \
  --database my_database \
  system_metrics
```

### Pass arguments to plugins

Use trigger arguments to pass configuration from a trigger to the plugin it runs. You can use this for:
- Threshold values for monitoring
- Connection properties for external services
- Configuration settings for plugin behavior

```bash
influxdb3 create trigger \
  --trigger-spec "every:1h" \
  --plugin-filename "threshold_check.py" \
  --trigger-arguments threshold=90,notify_email=admin@example.com \
  --database my_database \
  threshold_monitor
```

The arguments are passed to the plugin as a `Dict[str, str]` where the key is the argument name and the value is the argument value:

```python
def process_scheduled_call(influxdb3_local, call_time, args=None):
    if args and "threshold" in args:
        threshold = float(args["threshold"])
        email = args.get("notify_email", "default@example.com")
        
        # Use the arguments in your logic
        influxdb3_local.info(f"Checking threshold {threshold}, will notify {email}")
```

### Control trigger execution

By default, triggers run synchronously—each instance waits for previous instances to complete before executing.

To allow multiple instances of the same trigger to run simultaneously, configure triggers to run asynchronously:

```bash
# Allow multiple trigger instances to run simultaneously
influxdb3 create trigger \
  --trigger-spec "table:metrics" \
  --plugin-filename "heavy_process.py" \
  --run-asynchronous \
  --database my_database \
  async_processor
```

### Configure error handling for a trigger

To configure error handling behavior for a trigger, use the `--error-behavior <ERROR_BEHAVIOR>` CLI option with one of the following values:

- `log` (default): Log all plugin errors to stdout and the `system.processing_engine_logs` system table.
- `retry`: Attempt to run the plugin again immediately after an error.
- `disable`: Automatically disable the plugin when an error occurs (can be re-enabled later via CLI).

```bash
# Automatically retry on error
influxdb3 create trigger \
  --trigger-spec "table:important_data" \
  --plugin-filename "critical_process.py" \
  --error-behavior retry \
  --database my_database \
  critical_processor

# Disable the trigger on error
influxdb3 create trigger \
  --trigger-spec "path:webhook" \
  --plugin-filename "webhook_handler.py" \
  --error-behavior disable \
  --database my_database \
  auto_disable_processor
```

## Extend plugins with API features and state management

The Processing engine includes API capabilities that allow your plugins to
interact with InfluxDB data and maintain state between executions.
These features let you build more sophisticated plugins that can transform, analyze, and respond to data.

### Use the shared API

All plugins have access to the shared API to interact with the database.

#### Write data

Use the `LineBuilder` API to create line protocol data:

```python
# Create a line protocol entry
line = LineBuilder("weather")
line.tag("location", "us-midwest")
line.float64_field("temperature", 82.5)
line.time_ns(1627680000000000000)

# Write the data to the database
influxdb3_local.write(line)
```

Writes are buffered while the plugin runs and are flushed when the plugin completes. 

{{% expand-wrapper %}}
{{% expand "View the `LineBuilder` Python implementation" %}}

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
{{% /expand %}}
{{% /expand-wrapper %}}

#### Query data

Execute SQL queries and get results:

```python
# Simple query
results = influxdb3_local.query("SELECT * FROM metrics WHERE time > now() - INTERVAL '1 hour'")

# Parameterized query for safer execution
params = {"table": "metrics", "threshold": 90}
results = influxdb3_local.query("SELECT * FROM $table WHERE value > $threshold", params)
```

The shared API `query` function returns results as a `List` of `Dict[String, Any]`, where the key is the column name and the value is the column value. 

#### Log information

The shared API `info`, `warn`, and `error` functions accept multiple arguments,
convert them to strings, and log them as a space-separated message to the database log,
which is output in the server logs and captured in system tables that you can
query using SQL.

Add logging to track plugin execution:

```python
influxdb3_local.info("Starting data processing")
influxdb3_local.warn("Could not process some records")
influxdb3_local.error("Failed to connect to external API")

# Log structured data
obj_to_log = {"records": 157, "errors": 3}
influxdb3_local.info("Processing complete", obj_to_log)
```

#### Use the in-memory cache

The Processing engine provides an in-memory cache system that enables plugins to persist and retrieve data between executions.

Use the shared API `cache` property to access the cache API.

```python 
# Basic usage pattern  
influxdb3_local.cache.METHOD(PARAMETERS)
```

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `put` | `key` (str): The key to store the value under<br>`value` (Any): Any Python object to cache<br>`ttl` (Optional[float], default=None): Time in seconds before expiration<br>`use_global` (bool, default=False): If True, uses global namespace | None | Stores a value in the cache with an optional time-to-live |
| `get` | `key` (str): The key to retrieve<br>`default` (Any, default=None): Value to return if key not found<br>`use_global` (bool, default=False): If True, uses global namespace | Any | Retrieves a value from the cache or returns default if not found |
| `delete` | `key` (str): The key to delete<br>`use_global` (bool, default=False): If True, uses global namespace | bool | Deletes a value from the cache. Returns True if deleted, False if not found |

##### Cache namespaces

The cache system offers two distinct namespaces:

| Namespace | Scope | Best For |
| --- | --- | --- |
| **Trigger-specific** (default) | Isolated to a single trigger | Plugin state, counters, timestamps specific to one plugin |
| **Global** | Shared across all triggers | Configuration, lookup tables, service states that should be available to all plugins |

##### Store and retrieve cached data

```python
# Store a value
influxdb3_local.cache.put("last_run_time", time.time())

# Retrieve a value with a default if not found
last_time = influxdb3_local.cache.get("last_run_time", default=0)

# Delete a cached value
influxdb3_local.cache.delete("temporary_data")
```

##### Store cached data with expiration

```python
# Cache with a 5-minute TTL (time-to-live)
influxdb3_local.cache.put("api_response", response_data, ttl=300)
```

##### Share data across plugins

```python
# Store in the global namespace
influxdb3_local.cache.put("config", {"version": "1.0"}, use_global=True)

# Retrieve from the global namespace
config = influxdb3_local.cache.get("config", use_global=True)
```

##### Track state between executions

```python
# Get current counter or default to 0
counter = influxdb3_local.cache.get("execution_count", default=0)

# Increment counter
counter += 1

# Store the updated value
influxdb3_local.cache.put("execution_count", counter)

influxdb3_local.info(f"This plugin has run {counter} times")
```

#### Best practices for in-memory caching

- [Use the trigger-specific namespace](#use-the-trigger-specific-namespace)
- [Use TTL appropriately](#use-ttl-appropriately)
- [Cache computation results](#cache-computation-results)
- [Warm the cache](#warm-the-cache)
- [Consider cache limitations](#consider-cache-limitations)

##### Use the trigger-specific namespace

The cache is designed to support stateful operations while maintaining isolation between different triggers. Use the trigger-specific namespace for most operations and the global namespace only when data sharing across triggers is necessary.

##### Use TTL appropriately
Set realistic expiration times based on how frequently data changes.

```python
# Cache external API responses for 5 minutes  
influxdb3_local.cache.put("weather_data", api_response, ttl=300)
```

##### Cache computation results
Store the results of expensive calculations that need to be utilized frequently.
```python
# Cache aggregated statistics  
influxdb3_local.cache.put("daily_stats", calculate_statistics(data), ttl=3600)
```

##### Warm the cache
For critical data, prime the cache at startup. This can be especially useful for global namespace data where multiple triggers need the data.

```python
# Check if cache needs to be initialized  
if not influxdb3_local.cache.get("lookup_table"):   
    influxdb3_local.cache.put("lookup_table", load_lookup_data())
```

##### Consider cache limitations

- **Memory Usage**: Since cache contents are stored in memory, monitor your memory usage when caching large datasets.
- **Server Restarts**: Because the cache is cleared when the server restarts, design your plugins to handle cache initialization (as noted above).
- **Concurrency**: Be cautious of accessing inaccurate or out-of-date data when multiple trigger instances might simultaneously update the same cache key.

## Install Python dependencies

If your plugin needs additional Python packages, use the `influxdb3 install` command:

```bash
# Install a package directly
influxdb3 install package pandas
```

```bash
# With Docker
docker exec -it CONTAINER_NAME influxdb3 install package pandas
```

This creates a Python virtual environment in your plugins directory with the specified packages installed.
