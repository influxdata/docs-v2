<!-- BEGIN GENERATED PLUGIN CONTENT -->
<!-- vale off -->
> **Note:** This plugin requires {{% product-name %}}.8.2 or later.


The AMQP Subscriber Plugin enables real-time ingestion of AMQP messages (RabbitMQ and other AMQP-compatible brokers) into {{% product-name %}}. Subscribe to queues and automatically transform messages into time-series data with support for JSON, Line Protocol, and custom text formats. The plugin provides flexible message acknowledgement policies and comprehensive error tracking with statistics.

## Configuration

Plugin parameters may be specified as key-value pairs in the `--trigger-arguments` flag (CLI) or in the `trigger_arguments` field (API) when creating a trigger. This plugin supports TOML configuration files for complex mapping scenarios, which can be specified using the `config_file_path` parameter.

### Plugin metadata

This plugin includes a JSON metadata schema in its docstring that defines supported trigger types and configuration parameters. This metadata enables the [InfluxDB 3 Explorer](https://docs.influxdata.com/influxdb3/explorer/) UI to display and configure the plugin.

### Required parameters

| Parameter    | Type   | Default                   | Description                                                                                      |
|--------------|--------|---------------------------|--------------------------------------------------------------------------------------------------|
| `host`       | string | required                  | AMQP broker hostname or IP address                                                               |
| `queues`     | string | required                  | Space-separated list of queue names to consume messages from (for example, "sensor_data alerts")        |
| `table_name` | string | required (json/text only) | Static InfluxDB measurement name. Required for `json`/`text` formats if `table_name_field` is not set. Not required for `lineprotocol`. |
| `table_name_field` | string | none | Field path to extract table name dynamically from message data. JSON: field name (auto-prefixed with `$.`). Text: regex pattern with capture group. Alternative to `table_name`. |

### Connection parameters

| Parameter      | Type    | Default | Description                                     |
|----------------|---------|--------|-------------------------------------------------|
| `port`         | integer | 5672   | AMQP broker port (5672 for non-TLS, 5671 for TLS) |
| `virtual_host` | string  | "/"    | AMQP virtual host                               |

### Authentication parameters

| Parameter        | Type   | Default | Description                                                       |
|------------------|--------|---------|-------------------------------------------------------------------|
| `auth_mechanism` | string | "plain" | Authentication mechanism: `plain` or `external`                   |
| `username`       | string | none    | AMQP broker username. Required when `auth_mechanism` is `plain`   |
| `password`       | string | none    | AMQP broker password. Required when `auth_mechanism` is `plain`   |

**Authentication mechanisms:**
- `plain` - Username/password authentication (SASL PLAIN). Both `username` and `password` are required; the plugin no longer falls back to the RabbitMQ default `guest`/`guest` credentials.
- `external` - Client TLS certificate authentication (SASL EXTERNAL). Requires `ssl_ca_cert`, `ssl_client_cert`, and `ssl_client_key`. `username`/`password` are ignored.

### TLS/SSL parameters

| Parameter (CLI)   | Parameter (TOML)           | Type   | Default | Description                                                      |
|-------------------|----------------------------|--------|---------|------------------------------------------------------------------|
| `ssl_ca_cert`     | `[amqp.ssl]` `ca_cert`     | string | none    | Path to CA certificate file. Enables SSL when provided.          |
| `ssl_client_cert` | `[amqp.ssl]` `client_cert` | string | none    | Path to client certificate for mutual TLS                        |
| `ssl_client_key`  | `[amqp.ssl]` `client_key`  | string | none    | Path to client private key for mutual TLS                        |

**Note:** For mutual TLS, both `ssl_client_cert` and `ssl_client_key` must be provided together. SSL is automatically enabled when `ssl_ca_cert` is provided.

### Message handling parameters

| Parameter          | Type    | Default      | Description                                                              |
|--------------------|---------|--------------|--------------------------------------------------------------------------|
| `ack_policy`           | string  | "on_success" | When to acknowledge messages: `on_success` or `always`                                         |
| `requeue_on_failure`   | string  | "false"      | Whether to requeue messages that fail processing. When `true`, failed messages are returned to the queue for retry. |
| `max_messages`         | integer | 500          | Maximum number of messages to retrieve per scheduled call                                      |

**Acknowledgement policies:**
- `on_success` - Acknowledge only after successful processing. Failed messages are rejected (requeue controlled by `requeue_on_failure`).
- `always` - Acknowledge all messages at the end of processing, regardless of success or failure.

### Logging parameters

In TOML configuration, `enable_full_logging` is placed directly under the `[amqp]` section.

| Parameter             | Type    | Default | Description                                                                                                                                                                                                                              |
|-----------------------|---------|---------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `enable_full_logging` | boolean | false   | When `true`, full exception messages are written to logs. When `false` (default), only the exception type is logged, to avoid leaking sensitive values (credentials, payloads, paths) into log output. Enable temporarily for debugging. |

### Message format parameters

| Parameter         | Type   | Default | Description                                                    |
|-------------------|--------|---------|----------------------------------------------------------------|
| `format`          | string | "json"  | Message format: json, lineprotocol, or text                    |
| `timestamp_field` | string | none    | Field containing timestamp (format depends on message format)  |

**Format-specific timestamp_field syntax:**

The timestamp field format differs between JSON and Text formats:

| Format   | Syntax              | Split Method       | Example (CLI)    | Example (TOML)     |
|----------|---------------------|--------------------|------------------|--------------------|
| JSON     | `field_name:format` | Split by first `:` | `"timestamp:ms"` | `"$.timestamp:ms"` |
| Text     | `regex:format`      | Split by last `:`  | `"ts:(\\d+):ms"` | `"ts:(\\d+):ms"`   |

**Note:** In CLI arguments, JSON paths are specified without `$.` prefix (added automatically). In TOML configuration, use full JSONPath syntax with `$.` prefix.

**Note:** Text format uses the last colon to split, allowing regex patterns to contain colons (for example, time patterns).

**Supported timestamp formats:**
- `ns` - nanoseconds (Unix timestamp)
- `ms` - milliseconds (Unix timestamp)
- `s` - seconds (Unix timestamp)
- `datetime` - ISO 8601 string (for example, "2021-12-01T12:00:00Z")

### JSON format parameters

| Parameter | Type   | Default  | Description                                                               |
|-----------|--------|----------|---------------------------------------------------------------------------|
| `tags`    | string | none     | Space-separated tag names. Example: "room sensor location"                |
| `fields`  | string | required | Space-separated field mappings. Format: "name:type=jsonpath" without `$.` |

**Field specification format:** `"temp:float=temperature hum:int=humidity status:bool=online"`

**Supported field types:** `int`, `uint`, `float`, `string`, `bool`

### Text format parameters

| Parameter | Type   | Default   | Description                                                       |
|-----------|--------|-----------|-------------------------------------------------------------------|
| `tags`    | string | none      | Space-separated tag patterns. Format: "name=regex_pattern"        |
| `fields`  | string | required  | Space-separated field patterns. Format: "name:type=regex_pattern" |

**Tag specification format:** `"room=room:([^,\\s]+) sensor=sensor:(\\w+)"`

**Field specification format:** `"temp:float=temp:([\\d.]+) status:bool=(true|false)"`

### TOML configuration

| Parameter          | Type   | Default | Description                                     |
|--------------------|--------|---------|-------------------------------------------------|
| `config_file_path` | string | none    | Path to TOML config file (absolute or relative) |

*To use a TOML configuration file, specify the `config_file_path` in the trigger arguments.*

### File path resolution

All file paths in the plugin (configuration file, TLS certificates) follow the same resolution logic:

- **Absolute paths** (for example, `/etc/amqp/config.toml`) are used as-is
- **Relative paths** (for example, `config.toml`, `certs/ca.crt`) are resolved from `PLUGIN_DIR` environment variable

If a relative path is specified and `PLUGIN_DIR` is not set, the plugin will return an error.

#### Example TOML configuration

[amqp_config_example.toml](https://github.com/influxdata/influxdb3_plugins/blob/master/influxdata/amqp_subscriber/amqp_config_example.toml) - comprehensive configuration example with all three message formats

## Data requirements

The plugin automatically creates the target measurement table on first write. Field mappings are required for JSON and Text formats to specify which fields to extract and their data types.

### Message encoding requirements

- **UTF-8 text only**: The plugin only processes UTF-8 encoded text messages. Binary messages are automatically skipped with a warning logged.
- **Non-empty payloads**: Empty or whitespace-only messages are automatically skipped.

## Software Requirements

- **{{% product-name %}}**: with the Processing Engine enabled
- **Python packages**:
  - `pika` (AMQP client library)
  - `jsonpath-ng` (JSON path parsing for JSON format)

### Installation steps

1. Start {{% product-name %}} with the Processing Engine enabled (`--plugin-dir /path/to/plugins`):

   ```bash
   influxdb3 serve \
     --node-id node0 \
     --object-store file \
     --data-dir ~/.influxdb3 \
     --plugin-dir ~/.plugins
   ```
2. Install required Python packages:

   ```bash
   influxdb3 install package pika
   influxdb3 install package jsonpath-ng
   ```
## Trigger setup

### Scheduled ingestion with TOML configuration

Recommended for production use with complex mappings:

```bash
# 1. Set PLUGIN_DIR environment variable
export PLUGIN_DIR=~/.plugins

# 2. Copy and edit configuration file
cp amqp_config_example.toml $PLUGIN_DIR/my_amqp_config.toml
# Edit my_amqp_config.toml with your broker and mapping settings

# 3. Create the trigger
influxdb3 create trigger \
  --database mydb \
  --plugin-filename gh:influxdata/amqp_subscriber/amqp_subscriber.py \
  --trigger-spec "every:10s" \
  --trigger-arguments config_file_path=my_amqp_config.toml \
  amqp_ingestion
```
### Scheduled ingestion with command-line arguments

For simple JSON message ingestion:

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename gh:influxdata/amqp_subscriber/amqp_subscriber.py \
  --trigger-spec "every:5s" \
  --trigger-arguments 'host=localhost,queues=sensor_data alerts,format=json,table_name=sensor_data,fields=temp:float=temperature hum:int=humidity,tags=location sensor_id' \
  amqp_sensors
```
### Secure AMQP connection with TLS

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename gh:influxdata/amqp_subscriber/amqp_subscriber.py \
  --trigger-spec "every:10s" \
  --trigger-arguments 'host=secure-broker.example.com,port=5671,queues=secure_data,format=json,table_name=secure_data,ssl_ca_cert=certs/ca.crt,username=myuser,password=mypass,fields=value:float=value' \
  secure_amqp
```
## Message Formats

### JSON Format

The primary use case for structured IoT data. Supports nested fields using JSONPath expressions.

#### TOML Configuration

```toml
[amqp]
host = "localhost"
port = 5672
queues = ["sensor_data", "alerts"]
format = "json"

[mapping.json]
table_name = "sensor_data"
timestamp_field = "$.timestamp:ms"

[mapping.json.tags]
location = "$.location"
sensor_id = "$.sensor.id"

[mapping.json.fields]
temperature = ["$.temp", "float"]
humidity = ["$.humidity", "int"]
status = ["$.online", "bool"]
```
#### Example Message

```json
{
  "timestamp": 1638360000000,
  "location": "warehouse_a",
  "sensor": {
    "id": "sensor_001"
  },
  "temp": 22.5,
  "humidity": 65,
  "online": true
}
```
#### Resulting Data

```
sensor_data,location=warehouse_a,sensor_id=sensor_001 temperature=22.5,humidity=65i,status=true 1638360000000000000
```
#### JSON Array Support

Process batch messages containing arrays of JSON objects:

```json
[
  {"timestamp": 1638360000000, "sensor_id": "001", "temperature": 22.5},
  {"timestamp": 1638360001000, "sensor_id": "002", "temperature": 23.1},
  {"timestamp": 1638360002000, "sensor_id": "003", "temperature": 21.8}
]
```
**Array processing behavior:**
- Each array element is processed independently as a separate data point
- If one element fails to parse, the others continue processing (partial success)
- Parse errors for individual elements are logged to `amqp_exceptions` table
- Statistics count each AMQP message as one unit (messages_received+=1, messages_processed+=1), regardless of array size

### Line Protocol Format

For messages already in InfluxDB line protocol format, use passthrough mode. No mapping configuration needed - messages are validated and written directly.

#### TOML Configuration

```toml
[amqp]
host = "rabbitmq.example.com"
queues = ["influxdb_metrics"]
format = "lineprotocol"
```
#### CLI Configuration

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename amqp_subscriber.py \
  --trigger-spec "every:10s" \
  --trigger-arguments 'host=rabbitmq.example.com,queues=influxdb_metrics,format=lineprotocol' \
  amqp_lineprotocol
```
#### Example Message

```
sensor_data,location=warehouse_a,sensor_id=001 temperature=22.5,humidity=65i 1638360000000000000
```
#### Supported Line Protocol Types

| Type             | Suffix         | Example            |
|------------------|----------------|--------------------|
| Float            | none           | `temperature=22.5` |
| Integer          | `i`            | `count=100i`       |
| Unsigned Integer | `u`            | `bytes=1024u`      |
| String           | `"..."`        | `status="running"` |
| Boolean          | `true`/`false` | `active=true`      |

### Text Format

Parse plain text messages using regular expressions:

#### TOML Configuration

```toml
[amqp]
format = "text"

[mapping.text]
table_name = "sensor_logs"
timestamp_field = "ts:(\\d+):ms"

[mapping.text.tags]
location = "location=([^,\\s]+)"

[mapping.text.fields]
temperature = ["temp:([\\d.]+)", "float"]
humidity = ["hum:(\\d+)", "int"]
status = ["status:(true|false)", "bool"]
```
#### Example Message

```
location=warehouse_a,temp:22.5,hum:65,status:true,ts:1638360000000
```
## Statistics and Monitoring

The plugin tracks comprehensive statistics and writes them to the `amqp_stats` table on every plugin invocation.

**Important notes:**
- Statistics are written **on every plugin invocation**
- Each queue is tracked separately with independent statistics
- Statistics persist across plugin restarts using the InfluxDB cache

### amqp_stats Table

| Field                   | Type  | Description                                              |
|-------------------------|-------|----------------------------------------------------------|
| `queue` (tag)           | tag   | AMQP queue name                                          |
| `host` (tag)            | tag   | AMQP broker address                                      |
| `virtual_host` (tag)    | tag   | AMQP virtual host                                        |
| `messages_received`     | int   | Total messages received (all time)                       |
| `messages_processed`    | int   | Total messages processed (all time)                      |
| `messages_failed`       | int   | Total messages failed (all time)                         |
| `success_rate`          | float | Total success rate (all time, %)                         |
| `period_received`       | int   | Messages received in current period                      |
| `period_processed`      | int   | Messages processed in current period                     |
| `period_failed`         | int   | Messages failed in current period                        |
| `period_success_rate`   | float | Success rate for current period (%)                      |

### Querying Statistics

```bash
# Get latest statistics
influxdb3 query --database mydb \
  "SELECT * FROM amqp_stats ORDER BY time DESC LIMIT 10"

# Success rate over time
influxdb3 query --database mydb \
  "SELECT queue, success_rate, messages_processed, messages_failed
   FROM amqp_stats
   WHERE time > now() - INTERVAL '1 hour'
   ORDER BY time DESC"
```
## Error Handling

Parse errors and message processing failures are logged to the `amqp_exceptions` table:

### amqp_exceptions Table

| Field             | Type   | Description                                |
|-------------------|--------|--------------------------------------------|
| `queue` (tag)     | tag    | AMQP queue where error occurred            |
| `error_type` (tag)| tag    | Type of error (for example, JSONDecodeError)      |
| `error_message`   | string | Detailed error message                     |
| `raw_message`     | string | Original AMQP message (truncated to 1KB)   |

### Checking for Errors

```bash
influxdb3 query --database mydb \
  "SELECT * FROM amqp_exceptions ORDER BY time DESC LIMIT 10"
```
## Troubleshooting

### Check Plugin Logs

```bash
influxdb3 query --database _internal \
  "SELECT * FROM system.processing_engine_logs
   WHERE trigger_name = 'amqp_ingestion'
   ORDER BY time DESC LIMIT 20"
```
### Common Issues

#### "pika library not installed"

```bash
influxdb3 install package pika
```
#### "Configuration file not found"

- For relative paths, ensure `PLUGIN_DIR` environment variable is set
- For absolute paths, verify the file exists at the specified location

```bash
# For relative paths
export PLUGIN_DIR=~/.plugins
ls $PLUGIN_DIR/my_amqp_config.toml

# Or use absolute path
ls /etc/amqp/my_amqp_config.toml
```
#### "Failed to connect to AMQP broker"

- Verify broker address and port
- Check network connectivity
- For TLS connections, verify certificate paths
- Verify authentication credentials
- Verify `auth_mechanism` matches the broker configuration (`plain` requires `username`/`password`; `external` requires client certificates)

#### "Both ssl_client_cert and ssl_client_key must be provided for mutual TLS"

For mutual TLS authentication, both client certificate and key are required.

#### "No fields were mapped from JSON data"

- Verify JSONPath expressions in field mappings (use `$.` prefix)
- Check that JSON structure matches your paths
- Review `amqp_exceptions` table for detailed errors

#### Messages not being processed

- Check trigger status: `influxdb3 show summary --database mydb`
- Verify AMQP connection in plugin logs
- Ensure the queue exists and has messages
- Check that the queue name is correct

#### Failed messages are being discarded

By default, failed messages are rejected without requeue (`requeue_on_failure=false`):
- Set `requeue_on_failure=true` to return failed messages to the queue for retry
- Use `ack_policy=always` to acknowledge all messages regardless of errors
- Check `amqp_exceptions` table to diagnose parsing issues
- Configure a dead-letter queue in RabbitMQ to capture rejected messages for analysis

## Architecture

### How It Works

1. **Scheduled Trigger**: Plugin runs on schedule (for example, `every:10s`)
2. **Configuration Caching**: Plugin configuration is parsed once and cached between executions
3. **Message Retrieval**: Plugin connects, retrieves up to `max_messages` from queue using `basic_get`
4. **Parse & Write**: Messages parsed according to format and written to InfluxDB
5. **Acknowledgement**: Messages acknowledged based on `ack_policy` setting
6. **Error Tracking**: Parse errors logged to `amqp_exceptions` table
7. **Statistics**: Written to `amqp_stats` table on every plugin invocation
8. **Disconnect**: Connection closed after processing

### Performance Optimization

The plugin includes several optimizations for high-throughput scenarios:

- **Configuration Caching**: Plugin configuration is parsed once and reused across all trigger executions
- **Pre-compiled Patterns**: JSONPath expressions and regex patterns are compiled once during parser initialization, not per-message
- **Batch Retrieval**: Multiple messages retrieved in a single connection session
- **QoS Control**: Prefetch count limits memory usage on consumer side

## Report an issue

For plugin issues, see the Plugins repository [issues page](https://github.com/influxdata/influxdb3_plugins/issues).

## Find support for {{% product-name %}}

The [InfluxDB Discord server](https://discord.gg/9zaNCW2PRT) is the best place to find support for InfluxDB 3 Core and InfluxDB 3 Enterprise.
For other InfluxDB versions, see the [Support and feedback](#bug-reports-and-feedback) options.
<!-- vale on -->
<!-- END GENERATED PLUGIN CONTENT -->
