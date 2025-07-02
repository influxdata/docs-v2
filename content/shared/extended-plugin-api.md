The Processing Engine includes a shared API that your plugins can use to interact with data, write new records in line protocol format, and maintain state between executions. These capabilities let you build plugins that transform, analyze, and respond to time series data as it flows through your database.

The plugin API lets you:

- [Write data](#write-data)
- [Query data](#query-data)
- [Log messages for monitoring and debugging](#log-messages-for-monitoring-and-debugging)
- [Maintain state with the in-memory cache](#maintain-state-with-in-memory-cache)
  - [Store and retrieve cached data](#store-and-retrieve-cached-data)
  - [Use TTL appropriately](#use-ttl-appropriately)
  - [Share data across plugins](#share-data-across-plugins)
  - [Build a counter](#building-a-counter)
- [Guidelines for in-memory caching](#guidelines-for-in-memory-caching)
  - [Consider cache limitations](#consider-cache-limitations)

## Get started with the shared API

Each plugin automatically has access to the shared API through the `influxdb3_local` object. You don’t need to import any libraries. The API becomes available as soon as your plugin runs.

## Write data

To write data into your database, use the `LineBuilder` API to create line protocol data:

```python
# Create a line protocol entry
line = LineBuilder("weather")
line.tag("location", "us-midwest")
line.float64_field("temperature", 82.5)
line.time_ns(1627680000000000000)

# Write the data to the database
influxdb3_local.write(line)
```

InfluxDB 3 buffers your writes while the plugin runs and flushes them when the plugin completes. 

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

## Query data

Your plugins can execute SQL queries and process results directly:

```python
# Simple query
results = influxdb3_local.query("SELECT * FROM metrics WHERE time > now() - INTERVAL '1 hour'")

# Parameterized query for safer execution
params = {"table": "metrics", "threshold": 90}
results = influxdb3_local.query("SELECT * FROM $table WHERE value > $threshold", params)
```

Query results are a `List` of `Dict[String, Any]`, where each dictionary represents a row. Column names are keys, and column values are the corresponding values.

## Log messages for monitoring and debugging

Use the shared API's `info`, `warn`, and `error` functions to log messages from your plugin. Each function accepts one or more arguments, converts them to strings, and logs them as a space-separated message.

Add logging to monitor plugin execution and assist with debugging:

```python
influxdb3_local.info("Starting data processing")
influxdb3_local.warn("Could not process some records")
influxdb3_local.error("Failed to connect to external API")

# Log structured data
obj_to_log = {"records": 157, "errors": 3}
influxdb3_local.info("Processing complete", obj_to_log)
```

The system writes all log messages to the server logs and stores them in [system tables](/influxdb3/version/reference/cli/influxdb3/show/system/summary/), where you can query them using SQL.

## Maintain state with the in-memory cache

The Processing Engine provides an in-memory cache that enables your plugins to persist and retrieve data between executions.

Access the cache using the `cache` property of the shared API:

```python 
# Basic usage pattern  
influxdb3_local.cache.METHOD(PARAMETERS)
```

`cache` provides the following methods to retrieve and manage cached values: 

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `put` | `key` (str): The key to store the value under<br>`value` (Any): Any Python object to cache<br>`ttl` (Optional[float], default=None): Time in seconds before expiration<br>`use_global` (bool, default=False): If True, uses global namespace | None | Stores a value in the cache with an optional time-to-live |
| `get` | `key` (str): The key to retrieve<br>`default` (Any, default=None): Value to return if key not found<br>`use_global` (bool, default=False): If True, uses global namespace | Any | Retrieves a value from the cache or returns default if not found |
| `delete` | `key` (str): The key to delete<br>`use_global` (bool, default=False): If True, uses global namespace | bool | Deletes a value from the cache. Returns True if deleted, False if not found |

### Understanding cache namespaces

The cache system offers two distinct namespaces:

| Namespace | Scope | Best For |
| --- | --- | --- |
| **Trigger-specific** (default) | Isolated to a single trigger | Plugin state, counters, timestamps specific to one plugin |
| **Global** | Shared across all triggers | Configuration, lookup tables, service states that should be available to all plugins |

### Common cache operations

- [Store and retrieve cached data](#store-and-retrieve-cached-data)
- [Store cached data with expiration](#store-cached-data-with-expiration)
- [Share data across plugins](#share-data-across-plugins)
- [Build a counter](#build-a-counter)

### Store and retrieve cached data

```python
# Store a value
influxdb3_local.cache.put("last_run_time", time.time())

# Retrieve a value with a default if not found
last_time = influxdb3_local.cache.get("last_run_time", default=0)

# Delete a cached value
influxdb3_local.cache.delete("temporary_data")
```

### Store cached data with expiration

```python
# Cache with a 5-minute TTL (time-to-live)
influxdb3_local.cache.put("api_response", response_data, ttl=300)
```

### Share data across plugins

```python
# Store in the global namespace
influxdb3_local.cache.put("config", {"version": "1.0"}, use_global=True)

# Retrieve from the global namespace
config = influxdb3_local.cache.get("config", use_global=True)
```

### Building a counter

You can track how many times a plugin has run:

```python
# Get current counter or default to 0
counter = influxdb3_local.cache.get("execution_count", default=0)

# Increment counter
counter += 1

# Store the updated value
influxdb3_local.cache.put("execution_count", counter)

influxdb3_local.info(f"This plugin has run {counter} times")
```

## Guidelines for in-memory caching

To get the most out of the in-memory cache, follow these guidelines:

- [Use the trigger-specific namespace](#use-the-trigger-specific-namespace)
- [Use TTL appropriately](#use-ttl-appropriately)
- [Cache computation results](#cache-computation-results)
- [Warm the cache](#warm-the-cache)
- [Consider cache limitations](#consider-cache-limitations)

### Use the trigger-specific namespace

The Processing Engine provides a cache that supports stateful operations while maintaining isolation between different triggers. For most use cases, use the trigger-specific namespace to keep plugin state isolated. Use the global namespace only when you need to share data across triggers.

### Use TTL appropriately

Set appropriate expiration times based on how frequently your data changes:

```python
# Cache external API responses for 5 minutes  
influxdb3_local.cache.put("weather_data", api_response, ttl=300)
```

### Cache computation results

Store the results of expensive calculations that you frequently utilize:

```python
# Cache aggregated statistics  
influxdb3_local.cache.put("daily_stats", calculate_statistics(data), ttl=3600)
```

### Warm the cache

For critical data, prime the cache at startup. This can be especially useful for global namespace data where multiple triggers need the data:

```python
# Check if cache needs to be initialized  
if not influxdb3_local.cache.get("lookup_table"):   
    influxdb3_local.cache.put("lookup_table", load_lookup_data())
```

### Consider cache limitations

- **Memory Usage**: Since the system stores cache contents in memory, monitor your memory usage when caching large datasets.
- **Server Restarts**: Because the server clears the cache on restart, design your plugins to handle cache initialization (as noted above).
- **Concurrency**: Be cautious of accessing inaccurate or out-of-date data when multiple trigger instances might simultaneously update the same cache key.

## Next Steps

With an understanding of the InfluxDB 3 Shared Plugin API, you can start building data workflows that transform, analyze, and respond to your time series data.

To find example plugins you can extend, visit the [influxdb3_plugins repository](https://github.com/influxdata/influxdb3_plugins) on GitHub.