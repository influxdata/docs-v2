The InfluxDB 3 processing engine provides a Python API that plugins use at runtime.
Nothing in this API is importable from a plugin—the runtime injects the objects instead.
InfluxDB passes `influxdb3_local` (an `InfluxDB3Local` instance) as the first argument to every trigger entry point and installs `LineBuilder` into Python builtins before the plugin runs, so both single-file and multi-file plugins can use them without an import.

- [Trigger entry points](#trigger-entry-points)
- [Log messages](#log-messages)
- [Query data](#query-data)
- [Write data](#write-data)
- [Cache data](#cache-data)
- [Plugin cancellation](#plugin-cancellation)
- [LineBuilder](#linebuilder)
- [TableBatch](#tablebatch)
- [Exceptions](#exceptions)

For usage patterns and examples, see [Extend plugins](/influxdb3/version/extend-plugin/).

## Trigger entry points

A plugin defines one entry point that matches the trigger type it is attached to.
You define the function; InfluxDB calls it when the trigger fires.
Multi-file plugins must define the entry point in the plugin directory's `__init__.py`.

| Trigger type | Trigger specification | Entry point function |
| :----------- | :-------------------- | :---------- |
| Data write (WAL) | `table:TABLE_NAME` or `all_tables` | [`process_writes()`](#process_writes) |
| Scheduled | `every:DURATION` or `cron:EXPRESSION` | [`process_scheduled_call()`](#process_scheduled_call) |
| HTTP request | `request:REQUEST_PATH` | [`process_request()`](#process_request) |

### `process_writes()`

```python
def process_writes(
    influxdb3_local,
    table_batches: Sequence[TableBatch],
    args: Mapping[str, str] | None = None,
) -> None
```

Entry point for data write (WAL) triggers.
InfluxDB calls the function with the rows that were just written to the database, grouped by table.

- `table_batches`: the written rows as a sequence of [`TableBatch`](#tablebatch) dictionaries.
- `args`: trigger arguments as a string-to-string mapping.

### `process_scheduled_call()`

```python
def process_scheduled_call(
    influxdb3_local,
    schedule_time: datetime,
    args: Mapping[str, str] | None = None,
) -> None
```

Entry point for scheduled triggers.

- `schedule_time`: the trigger's fire time as a naive `datetime`.
  The engine builds the value with `datetime.fromtimestamp()`, so it is expressed in the server's local timezone and truncated to whole seconds.
- `args`: trigger arguments as a string-to-string mapping.

### `process_request()`

```python
def process_request(
    influxdb3_local,
    query_params: Mapping[str, str],
    request_headers: Mapping[str, str],
    request_body: bytes,
    args: Mapping[str, str] | None = None,
)
```

Entry point for HTTP request triggers.

- `query_params`: URL query parameters as a string-to-string mapping.
- `request_headers`: request headers as a string-to-string mapping.
  Header names are lowercased, and the client's `Authorization` header is stripped before the plugin sees it.
- `request_body`: the raw request bytes.
- `args`: trigger arguments as a string-to-string mapping.

#### Return value

`process_request` returns an HTTP-style response in one of the following forms:

- **A Flask-style response object**—duck-typed, not an actual `flask.Response`.
  The object must define a `__flask_response__()` method that returns `True`, a `status_code` attribute, a `headers` mapping, and a `get_data()` method that returns `str`.
  A genuine `flask.Response` is rejected: it does not define `__flask_response__`, and its `get_data()` returns bytes.
- **A tuple** of `(body, status, headers)` following Flask conventions.
  `status` and `headers` are optional; when `status` is present, `headers` may be the second or third element.
- **A bare string, dictionary, list, or iterator**, rendered with defaults:
  dictionaries and lists are JSON-encoded with `Content-Type: application/json`; strings and other iterables are concatenated with a `text/html` default content type.

The status code defaults to `200` when not provided.
Any other return value—`None`, or an object that is not a string, dictionary, list, or iterable—fails the request with status `500` and the error `Unsupported return type from Python function`.
Returning `bytes` is accepted as an iterable but yields an empty body, because its items are integers; encode to `str` instead.

## Log messages

```python
influxdb3_local.info(*args: object) -> None
influxdb3_local.warn(*args: object) -> None
influxdb3_local.error(*args: object) -> None
```

Each method converts its arguments to strings, joins them with spaces, and logs the result at the named level:

- `info`: records the message in the system logs.
- `warn`: forwards the message to the processing engine logs and test output.
- `error`: records the message in the system logs and the plugin return payload.

Log messages are stored in the `system.processing_engine_logs` table, where you can [query them using SQL](/influxdb3/version/admin/query-system-data/#query-trigger-logs).

## Query data

```python
influxdb3_local.query(
    query: str,
    args: Mapping[str, str] | None = None,
    database: str | None = None,
) -> list[dict[str, Any]]
```

Executes a SQL query and returns a list of row dictionaries.

`args` supplies values for named SQL parameters, referenced in the query with a leading `$`:

```python
influxdb3_local.query(
    "SELECT host, usage FROM cpu WHERE host = $host",
    {"host": "host1"},
)
```

Parameter values must be strings; passing an `int` or `float` raises `TypeError`.

`database` selects which database to query and defaults to the database the trigger is attached to.
{{% show-in "enterprise" %}}
In a cluster, a node that serves queries runs the query itself; a node that does not forwards it to a querier node over Arrow Flight.
{{% /show-in %}}

Each row dictionary contains every column in the result schema:

- Column values are native Python `int`, `float`, `bool`, or `str` values.
- Timestamp columns are nanosecond timestamps represented as integers.
- Dictionary-encoded columns (tags) are materialized as their string labels.
- SQL `NULL` values are returned as `None`.

Columns of any other Arrow type raise `ValueError`.
Supported types are `Int64`, `UInt64`, `Float64`, `Boolean`, `Utf8`, `LargeUtf8`, `Timestamp` (nanosecond), and `Dictionary` of `Utf8`.

Raises [`QueryError`](#exceptions) on execution failures, invalid SQL, or an invalid database name.

## Write data

All write methods take a [`LineBuilder`](#linebuilder) line and raise an exception when the target database is `_internal`.

`write` and `write_to_db` queue writes; queued writes are flushed once the plugin returns, so they land after any `write_sync` or `write_sync_to_db` calls the plugin made.
`write_sync` and `write_sync_to_db` write synchronously through the write buffer while the plugin is still running.

### `write`

```python
influxdb3_local.write(line: LineBuilder) -> None
```

Queues a line protocol write to the current database.

### `write_to_db`

```python
influxdb3_local.write_to_db(db_name: str, line: LineBuilder) -> None
```

Queues a line protocol write to the named database.

### `write_sync`

```python
influxdb3_local.write_sync(line: LineBuilder, no_sync: bool) -> None
```

Writes line protocol to the current database synchronously.
`no_sync` is required; pass `no_sync=True` to skip waiting for WAL synchronization.
Use [`write_sync_to_db`](#write_sync_to_db) to target a different database.

### `write_sync_to_db`

```python
influxdb3_local.write_sync_to_db(
    db_name: str,
    line: LineBuilder,
    no_sync: bool,
) -> None
```

Writes line protocol to the named database synchronously.
`no_sync` is required; pass `no_sync=True` to skip waiting for WAL synchronization.
Use [`write_sync`](#write_sync) to write to the trigger's database.

## Cache data

```python
influxdb3_local.cache: Cache
```

The `influxdb3_local.cache` property provides an in-memory cache that persists values between plugin executions.

The trigger-local cache (the default) is scoped to the database and trigger pair; the global cache is shared by every trigger in the process.
Set `use_global=True` in cache calls to use the global cache.
The server clears both caches on restart.

Reading the `cache` property runs an expiry sweep, though the sweep only does work once per cleanup interval.
Individual expired entries are dropped on read regardless.

### `cache.put()`

```python
influxdb3_local.cache.put(
    key: str,
    value: Any,
    ttl: float | None = None,
    use_global: bool | None = None,
) -> None
```

Stores a Python object in the trigger-local cache or the global shared cache.

`ttl` controls expiry in seconds.
Values in test caches (`influxdb3 test`) default to a 30-minute TTL when not provided; production caches persist values indefinitely unless a `ttl` is set.

Raises `ValueError` when `ttl` is negative, `NaN`, or too large to represent as a duration.

### `cache.get()`

```python
influxdb3_local.cache.get(
    key: str,
    default: Any | None = None,
    use_global: bool | None = None,
) -> Any | None
```

Fetches a value from the trigger-local or global cache.
Expired entries are evicted on read.
Returns the stored value, the provided default, or `None` when the key is absent.

### `cache.delete()`

```python
influxdb3_local.cache.delete(
    key: str,
    use_global: bool | None = None,
) -> bool
```

Removes a cached value.
Returns `True` when the key existed in the selected cache.

## Plugin cancellation

Once the current plugin run has been cancelled—the server is shutting down, or the trigger was disabled or deleted—the logging, write, and query methods raise `KeyboardInterrupt`.

`KeyboardInterrupt` subclasses `BaseException` rather than `Exception`, so a plugin's `except Exception` handler does not swallow it, and a long-running loop unwinds instead of hanging the shutdown or the disable.
The message reads `influxdb3 is shutting down` for every cancellation cause, including a plain trigger disable.

The `cache` property and the cache methods do not check for cancellation and keep working.

## LineBuilder

`LineBuilder` constructs InfluxDB line protocol in plugins.
It handles line protocol escaping and nanosecond timestamps, and plugins can use it without an import.

Construct a builder with `LineBuilder(measurement)`, then call the tag, field, and timestamp methods on the resulting instance.
In this section, `line` is a `LineBuilder` instance.
Tag and field methods return the same `LineBuilder` instance, so you can chain calls:

```python
line = LineBuilder("weather")
line.tag("location", "us-midwest").float64_field("temperature", 82.5)
influxdb3_local.write(line)
```

Raises `InvalidMeasurementError` when the measurement name contains spaces.
Tag and field keys that are empty or contain spaces, commas, or equals signs raise `InvalidKeyError`.

| Method | Adds |
| :----- | :--- |
| `tag(key, value)` | A tag; the value is stringified |
| `int64_field(key, value)` | A signed integer field |
| `uint64_field(key, value)` | An unsigned integer field; negative values raise `ValueError` |
| `float64_field(key, value)` | A float field; integral values are rendered with a trailing `.0` |
| `string_field(key, value)` | A string field with quotes and backslashes escaped |
| `bool_field(key, value)` | A boolean field, rendered as `t` or `f` |
| `time_ns(timestamp_ns)` | The nanosecond timestamp for the line |
| `build()` | Renders the line as line protocol |

### `line.build()`

```python
line.build() -> str
```

When you call `build()` on a `LineBuilder` instance, it renders the accumulated measurement, tags, fields, and optional timestamp as a line protocol string.
`build()` raises `InvalidLineError` when called without any fields.
For format details, see the [line protocol reference](/influxdb3/version/reference/line-protocol/).

## TableBatch

A batch of WAL rows for a single table, delivered to [`process_writes`](#process_writes).

A `TableBatch` is a plain dictionary—read it with `table_batch["table_name"]` and `table_batch["rows"]`, not attribute access.

| Key | Type | Description |
| :-- | :--- | :---------- |
| `table_name` | `str` | The table the batch belongs to |
| `rows` | `Sequence[MutableMapping[str, Any]]` | The written rows |

Each row is itself a dictionary that holds every column in the table schema (tags, fields, and time) keyed by column name.
Columns with no value for that row are `None`.
Time columns are nanosecond integers.

## Exceptions

| Exception | Raised |
| :-------- | :----- |
| `InfluxDBError` | Base exception for `LineBuilder` errors |
| `InvalidMeasurementError` | When the measurement name contains spaces |
| `InvalidKeyError` | When a tag or field key is empty or contains spaces, commas, or equals signs |
| `InvalidLineError` | When building line protocol fails—for example, no fields were added |
| `QueryError` | By [`query`](#query-data) when a query fails or names an invalid database |

### Catching QueryError

The `QueryError` class is defined by the engine's native extension module, which a plugin cannot import, and the name is not injected into plugin globals or builtins.
`except QueryError` therefore raises `NameError`.
Catch `Exception` instead and inspect `type(err).__name__` to distinguish it:

```python
try:
    results = influxdb3_local.query("SELECT * FROM cpu")
except Exception as err:
    if type(err).__name__ == "QueryError":
        influxdb3_local.error("query failed:", err)
```
