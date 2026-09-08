<!-- BEGIN GENERATED PLUGIN CONTENT -->
<!-- vale off -->
> **Note:** This plugin requires {{% product-name %}}.8.2 or later.


The Kafka Subscriber Plugin enables real-time ingestion of Kafka messages into {{% product-name %}}. Subscribe to Kafka topics and automatically transform messages into time-series data with support for JSON, Line Protocol, and custom text formats. The plugin uses consumer groups for reliable message delivery and provides flexible offset commit policies for different use cases. The consumer is reused across scheduled invocations to avoid a consumer-group rebalance every cycle, and it optionally supports a dead-letter queue topic for failed messages and id-based deduplication for messages without their own timestamp.

**Binary formats:** `avro`, `jsonschema`, and `protobuf` (Confluent wire format) are decoded via Confluent Schema Registry. `avro` can also be decoded as raw schemaless Avro with a local `.avsc` schema, and `protobuf` with a local `.proto` schema. See [Binary formats](#binary-formats).

## Configuration

Plugin parameters may be specified as key-value pairs in the `--trigger-arguments` flag (CLI) or in the `trigger_arguments` field (API) when creating a trigger. This plugin supports TOML configuration files for complex mapping scenarios, which can be specified using the `config_file_path` parameter.

### Plugin metadata

This plugin includes a JSON metadata schema in its docstring that defines supported trigger types and configuration parameters. This metadata enables the [InfluxDB 3 Explorer](https://docs.influxdata.com/influxdb3/explorer/) UI to display and configure the plugin.

### Required parameters

In TOML configuration, `bootstrap_servers`, `topics`, and `group_id` are placed under the `[kafka]` section; `table_name` and `table_name_field` are placed under `[mapping.json]` or `[mapping.text]` section.

| Parameter           | Type   | Default                   | Description                                                                                                                   |
|---------------------|--------|---------------------------|-------------------------------------------------------------------------------------------------------------------------------|
| `bootstrap_servers` | string | required                  | Space-separated list of Kafka broker addresses (for example, "kafka1:9092 kafka2:9092")                                              |
| `topics`            | string | required                  | Space-separated list of topics (for example, "sensor_data metrics")                                                                  |
| `group_id`          | string | required                  | Kafka consumer group ID (must be unique per consumer group)                                                                   |
| `table_name`        | string | conditional               | InfluxDB measurement name for storing data. Required for all formats except `lineprotocol`, unless `table_name_field` is set. |
| `table_name_field`  | string | none                      | JSON field name or regex pattern to extract table name dynamically from each message. Alternative to static `table_name`.     |

### Connection parameters

In TOML configuration, these parameters are placed under the `[kafka]` section.

| Parameter            | Type   | Default     | Description                                                                                                                                                                                                                                                                              |
|----------------------|--------|-------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `auto_offset_reset`  | string | "earliest"  | Where to start consuming on first connect: "earliest" or "latest"                                                                                                                                                                                                                        |
| `max_poll_records`   | int    | 500         | Maximum messages per scheduled call. Set to 0 for unlimited.                                                                                                                                                                                                                             |
| `max_poll_interval`  | int    | 300         | Maximum seconds between scheduled poll cycles before the broker considers the consumer dead (maps to `max.poll.interval.ms`). The consumer is reused across invocations, so it must stay in the group between polls — increase this when the trigger interval is longer than ~5 minutes. |

### Offset Commit Policy

In TOML configuration, this parameter is placed under the `[kafka]` section.

| Parameter              | Type   | Default      | Description                                                       |
|------------------------|--------|--------------|-------------------------------------------------------------------|
| `offset_commit_policy` | string | "on_success" | When to commit offsets: "on_success" or "always"                  |

**Policy behavior:**

| Policy       | Behavior                                                                                     |
|--------------|----------------------------------------------------------------------------------------------|
| `on_success` | Commit offsets only after ALL messages in the batch are successfully processed and written   |
| `always`     | Commit offsets immediately after receiving messages, regardless of processing success        |

**When to use each policy:**

- **on_success (recommended)**: Use when data integrity is important. Failed messages will be reprocessed on the next trigger execution.
- **always**: Use in high-throughput scenarios where occasional data loss is acceptable, or when you have external error handling (failed messages are logged to `kafka_exceptions` table).

**Interaction with `dlq_topic`:**

Because the consumer is reused across invocations, its fetch position advances as messages are polled. Under `on_success`, when a message still needs reprocessing — a transient InfluxDB write failure, or a parse failure (poison message) that could **not** be offloaded — the plugin **rewinds the consumer** to the lowest such offset on each affected partition, so those messages are re-read on the next cycle. Only the affected partitions are rewound; partitions whose messages all succeeded are not. A parse failure that is **successfully** published to `dlq_topic` is treated as handled: the consumer is not rewound for it, and it is preserved in the DLQ instead of being re-read.

Without `dlq_topic`, a poison message under `on_success` is rewound and reprocessed on every cycle until it is resolved (its original payload is not stored in `kafka_exceptions`, so configure `dlq_topic` if you need to skip past and preserve poison messages). With `always`, the offset is committed immediately regardless and the consumer is never rewound, so a failed message is **not** reprocessed; `dlq_topic` simply preserves the failed messages that would otherwise be dropped.

> **Note:** Rewinding re-reads from the failed offset, so messages on the same partition that succeeded *after* the failed one are re-read and re-written. Enable [deduplication](#deduplication-parameters) (or use messages carrying their own timestamp) to avoid duplicate points from this at-least-once retry.

### Security parameters

In TOML configuration, this parameter is placed under the `[kafka]` section.

| Parameter           | Type   | Default     | Description                                                              |
|---------------------|--------|-------------|--------------------------------------------------------------------------|
| `security_protocol` | string | "PLAINTEXT" | Security protocol: "PLAINTEXT", "SSL", "SASL_PLAINTEXT", "SASL_SSL"      |

### SASL Authentication parameters

In TOML configuration, these parameters are placed under the `[kafka.sasl]` section with shortened names.

| Parameter (CLI)  | Parameter (TOML)             | Type   | Default | Description                                                          |
|------------------|------------------------------|--------|---------|----------------------------------------------------------------------|
| `sasl_mechanism` | `[kafka.sasl]` `mechanism`   | string | none    | SASL mechanism: "PLAIN", "SCRAM-SHA-256", "SCRAM-SHA-512"            |
| `sasl_username`  | `[kafka.sasl]` `username`    | string | none    | SASL username (required with sasl_mechanism)                         |
| `sasl_password`  | `[kafka.sasl]` `password`    | string | none    | SASL password (required with sasl_mechanism)                         |

**Note:** All three SASL parameters must be provided together when using SASL authentication.

### SSL/TLS parameters

In TOML configuration, these parameters are placed under the `[kafka.ssl]` section with shortened names.

| Parameter (CLI)    | Parameter (TOML)               | Type   | Default | Description                                    |
|--------------------|--------------------------------|--------|---------|------------------------------------------------|
| `ssl_ca_cert`      | `[kafka.ssl]` `ca_cert`        | string | none    | Path to CA certificate file                    |
| `ssl_cert`         | `[kafka.ssl]` `client_cert`    | string | none    | Path to client certificate for mutual TLS      |
| `ssl_key`          | `[kafka.ssl]` `client_key`     | string | none    | Path to client private key for mutual TLS      |
| `ssl_key_password` | `[kafka.ssl]` `key_password`   | string | none    | Password for encrypted client private key      |

**Note:** For mutual TLS, both `ssl_cert` and `ssl_key` must be provided together.

### Logging parameters

In TOML configuration, `enable_full_logging` is placed directly under the `[kafka]` section.

| Parameter             | Type    | Default | Description                                                                                                                                                                                                                              |
|-----------------------|---------|---------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `enable_full_logging` | boolean | false   | When `true`, full exception messages are written to logs. When `false` (default), only the exception type is logged, to avoid leaking sensitive values (credentials, payloads, paths) into log output. Enable temporarily for debugging. |

### Dead-letter queue parameters

In TOML configuration, `dlq_topic` is placed under the `[kafka]` section.

| Parameter   | Type   | Default | Description                                                                                                                                              |
|-------------|--------|---------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| `dlq_topic` | string | none    | Kafka topic to publish messages that fail to parse. The original payload and key are produced unchanged, with `source_topic`, `error_type` and `error_message` set as Kafka headers. When unset, no DLQ topic is used. |

**Behavior:**

- Only **parse failures** (poison messages) are routed to the DLQ topic — including messages missing a required `dedup_id_field`. Transient write failures to InfluxDB are **not** sent to the DLQ; they keep their offsets uncommitted (with `on_success`) so they are retried on the next cycle.
- Failures continue to be recorded in the `kafka_exceptions` table regardless of `dlq_topic`.
- The DLQ producer reuses the same `bootstrap_servers` and security settings as the consumer.
- **The DLQ topic must already exist on the broker.** The plugin does not create it. If your broker has `auto.create.topics.enable=false` (typical for production and managed services such as Confluent Cloud or MSK), create the topic beforehand. When the topic is missing, delivery fails and — under `on_success` — the offset is not committed, so the batch is reprocessed until the topic exists. The real broker reason (for example `Unknown topic or partition`) is logged so you can fix it quickly.

### Deduplication parameters

In TOML configuration, `dedup_window` is placed under the `[kafka]` section; `dedup_id_field` and `dedup_id_name` are placed under `[mapping.json]` or `[mapping.text]` section.

| Parameter        | Type   | Default    | Description                                                                                                                                                              |
|------------------|--------|------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `dedup_id_field` | string | none       | Extractor for a unique message id (enables deduplication). Holds **only** the extractor: JSON — a field name in CLI args (extracted via `$.<name>`) or a JSONPath in TOML (e.g. `$.event_id`); Text — a regex pattern with a capturing group. |
| `dedup_id_name`  | string | "dedup_id" | Field name the extracted id is written under and tracked by. Optional; only used with `dedup_id_field`.                                                                  |
| `dedup_window`   | string | "24h"      | Lookback window for the duplicate check (e.g. `30m`, `24h`, `7d`). Only used with `dedup_id_field`.                                                                     |

**Behavior:**

- Deduplication is **only active when no `timestamp_field` is configured**. When messages carry their own timestamp, InfluxDB already overwrites duplicates by `(measurement, tags, time)`, so no extra check is needed.
- When active, the plugin extracts the id, writes it under the `dedup_id_name` field (default `dedup_id`), and — before writing — checks whether that id already exists within `dedup_window`. The check is a **single query per table per cycle**, constrained by both the time window and the batch's ids (`... WHERE time >= <cutoff> AND "<dedup_id_name>" IN (...)`), so it returns few rows. Duplicates within the same batch are also dropped.
- If the dedup query fails, the plugin **fails open** (writes the records) rather than dropping data.
- A message that is missing the configured id is treated as a parse failure (routed to the DLQ / `kafka_exceptions`). For JSON arrays, individual elements missing the id are skipped with a warning.
- **Performance:** for very high-volume topics prefer a shorter `dedup_window` to keep the query light.
- Pick a `dedup_id_name` that does not collide with a field you already map — it would be written twice.

### Message format parameters

In TOML configuration, `format` is placed under the `[kafka]` section; `timestamp_field` is placed under `[mapping.json]` or `[mapping.text]` section.

| Parameter         | Type   | Default | Description                                                          |
|-------------------|--------|---------|----------------------------------------------------------------------|
| `format`          | string | "json"  | Message format: json, lineprotocol, text, avro, jsonschema, protobuf |
| `timestamp_field` | string | none    | Field containing timestamp (format depends on message format)        |

**Supported formats:**

| Format         | Description                                                            |
|----------------|------------------------------------------------------------------------|
| `json`         | JSON with JSONPath field mapping                                       |
| `lineprotocol` | InfluxDB Line Protocol passthrough                                     |
| `text`         | Plain text with regex-based parsing                                    |
| `avro`         | Avro via Confluent Schema Registry (JSONPath mapping)                  |
| `jsonschema`   | JSON Schema via Confluent Schema Registry (JSONPath)                   |
| `protobuf`     | Protobuf (Confluent wire format) via Schema Registry or a local .proto |

**Format-specific timestamp_field syntax:**

| Format   | Syntax              | Split Method       | Example (CLI)    | Example (TOML)     |
|----------|---------------------|--------------------|------------------|--------------------|
| JSON     | `field_name:format` | Split by first `:` | `"timestamp:ms"` | `"$.timestamp:ms"` |
| Text     | `regex:format`      | Split by last `:`  | `"ts:(\\d+):ms"` | `"ts:(\\d+):ms"`   |

**Supported timestamp formats:**
- `ns` - nanoseconds (Unix timestamp)
- `ms` - milliseconds (Unix timestamp)
- `s` - seconds (Unix timestamp)
- `datetime` - ISO 8601 string (for example, "2021-12-01T12:00:00Z")

For `avro` and `jsonschema`, a field decoded as a native `datetime`/`date`
(Avro/JSON Schema logical type) is converted to a timestamp automatically,
regardless of the configured format specifier.

### JSON format parameters

In TOML configuration, `tags` are placed under `[mapping.json.tags]` section and `fields` under `[mapping.json.fields]` section.

| Parameter | Type   | Default  | Description                                                               |
|-----------|--------|----------|---------------------------------------------------------------------------|
| `tags`    | string | none     | Space-separated tag names. Example: "room sensor location"                |
| `fields`  | string | required | Space-separated field mappings. Format: "name:type=jsonpath" without `$.` |

**Field specification format:** `"temp:float=temperature hum:int=humidity status:bool=online"`

**Supported field types:** `int`, `uint`, `float`, `string`, `bool`

### Text format parameters

In TOML configuration, `tags` are placed under `[mapping.text.tags]` section and `fields` under `[mapping.text.fields]` section.

| Parameter | Type   | Default   | Description                                                       |
|-----------|--------|-----------|-------------------------------------------------------------------|
| `tags`    | string | none      | Space-separated tag patterns. Format: "name=regex_pattern"        |
| `fields`  | string | required  | Space-separated field patterns. Format: "name:type=regex_pattern" |

### Binary formats

The decoded record is a dict (or a top-level list, expanded into one record per
element) for all binary formats, so field/tag/timestamp mapping uses the same
JSONPath syntax as the JSON format, under `[mapping.avro]`,
`[mapping.jsonschema]`, or `[mapping.protobuf]`.

Per-message decode failures (schema id not found, malformed payload) are handled
like parse failures: the message is logged to `kafka_exceptions`, sent to
`dlq_topic` if configured, or replayed otherwise. Binary payloads are forwarded
to the DLQ as the original raw bytes.

An unreachable or misconfigured Schema Registry is caught when the decoder is
first built: the cycle is aborted before any message is polled or committed, so
nothing is lost, and the run retries on the next schedule.

#### Avro / JSON Schema (Schema Registry)

Set `format` to `avro` or `jsonschema` to consume binary messages in the
Confluent wire format (magic byte + 4-byte schema id + payload). The schema is
fetched from the Schema Registry by the id embedded in each message — no local
schema files are needed.

The parameter names are identical in CLI/API arguments and TOML. In TOML they
are placed under the `[kafka.schema_registry]` section.

| Parameter                              | Type   | Default  | Description                                                                                                 |
|----------------------------------------|--------|----------|-------------------------------------------------------------------------------------------------------------|
| `schema_registry_url`                  | string | required | Schema Registry URL. Required for `avro` / `jsonschema`, and for `protobuf` without `protobuf_schema_file`. |
| `schema_registry_username`             | string | none     | Basic-auth username (or API key for Confluent Cloud).                                                       |
| `schema_registry_password`             | string | none     | Basic-auth password (or API secret). Used with username.                                                    |
| `schema_registry_ca_cert`              | string | none     | CA certificate for TLS to the registry.                                                                     |
| `schema_registry_client_cert`          | string | none     | Client certificate for mutual TLS to the registry.                                                          |
| `schema_registry_client_key`           | string | none     | Client private key for mutual TLS. Requires client cert.                                                    |
| `schema_registry_client_key_password`  | string | none     | Password for an encrypted client private key.                                                               |

> **Note:** `avro` and `jsonschema` require the extra packages `httpx`,
> `fastavro`, and `jsonschema`.

#### Avro (local .avsc schema, schemaless)

Set `format` to `avro` and `avro_schema_file` to a local `.avsc` schema to
consume Avro messages produced **without** a Schema Registry — raw schemaless
encoding with no Confluent wire header. The whole message value is the Avro body
and is decoded with the local schema; the Schema Registry is **not** contacted.

The parameter name is identical in CLI/API arguments and TOML. In TOML it is
placed under the `[kafka.avro]` section.

| Parameter          | Type   | Default  | Description                                                                  |
|--------------------|--------|----------|------------------------------------------------------------------------------|
| `avro_schema_file` | string | required | Path to a local `.avsc`/`.json` schema (absolute or relative to PLUGIN_DIR). |

> **Note:** requires the `fastavro` package. The schema is parsed once and
> cached. Writer and reader schema are assumed identical (no schema evolution).

#### Protobuf (local .proto or Schema Registry)

Set `format` to `protobuf` to consume Protobuf messages in the Confluent wire
format. The schema source is chosen implicitly, like `avro`:

- **Local `.proto`** — set `protobuf_schema_file`. The wire framing is parsed
  locally and the schema is read from the file; the Schema Registry is not
  contacted.
- **Schema Registry** — omit `protobuf_schema_file` and set `schema_registry_url`.
  The `.proto` (and any referenced schemas) is fetched by the wire-frame schema
  id, compiled with `protoc`, and cached per schema id. The `[kafka.schema_registry]`
  section (url, auth, TLS) is shared with `avro`/`jsonschema`.

The message index selects which message type to decode, or set
`protobuf_message_type` to choose it explicitly. In registry mode the schema
matches the producer's, so the message index is always correct and
`protobuf_message_type` is usually unnecessary.

The parameter names are identical in CLI/API arguments and TOML. In TOML they
are placed under the `[kafka.protobuf]` section.

| Parameter                | Type   | Default            | Description                                                                            |
|--------------------------|--------|--------------------|----------------------------------------------------------------------------------------|
| `protobuf_schema_file`   | string | conditional        | Path to a local `.proto` (absolute or relative to PLUGIN_DIR). Omit to use the registry. |
| `protobuf_include_dir`   | string | schema file's dir  | Include directory for resolving `import` statements (local mode only).                 |
| `protobuf_message_type`  | string | wire message index | Fully-qualified message name to decode (e.g. `sensors.SensorReading`).                 |

> **Note:** `protobuf` requires `grpcio-tools` (bundles `protoc` to compile the
> `.proto`); it is included in the plugin's dependencies and installed
> automatically. The `.proto` is
> compiled once and cached. `MessageToDict` semantics apply: proto3 scalar fields
> equal to their default (`0`/`""`/`false`) are omitted from the record;
> `int64`/`uint64` become strings; enums become their names; `bytes` become
> base64 strings.

See examples 11–14 in [kafka_config_example.toml](https://github.com/influxdata/influxdb3_plugins/blob/master/influxdata/kafka_subscriber/kafka_config_example.toml).

### TOML configuration

| Parameter          | Type   | Default | Description                                     |
|--------------------|--------|---------|-------------------------------------------------|
| `config_file_path` | string | none    | Path to TOML config file (absolute or relative) |

### File path resolution

All file paths in the plugin (configuration file, TLS certificates) follow the same resolution logic:

- **Absolute paths** (for example, `/etc/kafka/config.toml`) are used as-is
- **Relative paths** (for example, `config.toml`, `certs/ca.crt`) are resolved against the plugin directory, taken from `PLUGIN_DIR`, then `INFLUXDB3_PLUGIN_DIR`, then the parent of `VIRTUAL_ENV`

If a relative path is specified and none of these can be resolved, the plugin will return an error.

#### Example TOML configuration

[kafka_config_example.toml](https://github.com/influxdata/influxdb3_plugins/blob/master/influxdata/kafka_subscriber/kafka_config_example.toml) - comprehensive configuration example with all formats and security options

## Data requirements

The plugin automatically creates the target measurement table on first write. Field mappings are required for JSON and Text formats to specify which fields to extract and their data types.

### Message encoding requirements

- **Text formats** (`json`, `text`, `lineprotocol`): payloads must be UTF-8 encoded.
- **Binary formats** (`avro`, `jsonschema`, `protobuf`): payloads are decoded from binary (see [Binary formats](#binary-formats)).
- **Non-empty payloads**: Empty or whitespace-only messages are automatically skipped.

## Software Requirements

- **{{% product-name %}}**: with the Processing Engine enabled
- **Python packages** (all bundled in `manifest.toml` and installed automatically with the plugin):
  - `confluent-kafka>=2.15.0` (Kafka client based on librdkafka) — all formats
  - `jsonpath-ng` (JSONPath field mapping) — all formats
  - `fastavro` — `avro` format (both Schema Registry and local `.avsc`)
  - `httpx`, `authlib`, `cachetools` — any Schema Registry format (`avro` / `jsonschema` / registry-mode `protobuf`)
  - `jsonschema` (library) — `jsonschema` message format only
  - `protobuf`, `grpcio-tools` — `protobuf` format only

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
   influxdb3 install package confluent-kafka
   influxdb3 install package jsonpath-ng
   ```
## Trigger setup

### Scheduled ingestion with TOML configuration

Recommended for production use with complex mappings:

```bash
# 1. Set PLUGIN_DIR environment variable
export PLUGIN_DIR=~/.plugins

# 2. Copy and edit configuration file
cp kafka_config_example.toml $PLUGIN_DIR/my_kafka_config.toml
# Edit my_kafka_config.toml with your Kafka cluster and mapping settings

# 3. Create the trigger
influxdb3 create trigger \
  --database mydb \
  --plugin-filename gh:influxdata/kafka_subscriber/kafka_subscriber.py \
  --trigger-spec "every:10s" \
  --trigger-arguments config_file_path=my_kafka_config.toml \
  kafka_ingestion
```
### Scheduled ingestion with command-line arguments

For simple JSON message ingestion:

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename gh:influxdata/kafka_subscriber/kafka_subscriber.py \
  --trigger-spec "every:5s" \
  --trigger-arguments 'bootstrap_servers=kafka1:9092 kafka2:9092,topics=sensors.temperature sensors.humidity,group_id=influxdb3_consumer,format=json,table_name=sensor_data,fields=temp:float=temperature hum:int=humidity,tags=location sensor_id' \
  kafka_sensors
```
### Secure Kafka connection with SASL_SSL

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename gh:influxdata/kafka_subscriber/kafka_subscriber.py \
  --trigger-spec "every:10s" \
  --trigger-arguments 'bootstrap_servers=kafka1:9093 kafka2:9093,topics=secure.data,group_id=influxdb3_secure,format=json,table_name=secure_data,security_protocol=SASL_SSL,sasl_mechanism=SCRAM-SHA-512,sasl_username=myuser,sasl_password=mypass,ssl_ca_cert=certs/ca.crt,fields=value:float=value' \
  secure_kafka
```
## Message Formats

### JSON Format

The primary use case for structured data. Supports nested fields using JSONPath expressions.

#### TOML Configuration

```toml
[kafka]
bootstrap_servers = ["kafka:9092"]
topics = ["sensors.temperature"]
group_id = "influxdb3_json"
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
- Parse errors for individual elements are logged as warnings and the element is skipped (not written to `kafka_exceptions`)
- Statistics count 1 Kafka message = 1 unit (regardless of array size)

### Line Protocol Format

For messages already in InfluxDB line protocol format, use passthrough mode. No mapping configuration needed.

#### TOML Configuration

```toml
[kafka]
bootstrap_servers = ["kafka:9092"]
topics = ["influxdb.metrics"]
group_id = "influxdb3_lineprotocol"
format = "lineprotocol"
```
#### Example Message

```
sensor_data,location=warehouse_a,sensor_id=001 temperature=22.5,humidity=65i 1638360000000000000
```
### Text Format

Parse plain text messages using regular expressions:

#### TOML Configuration

```toml
[kafka]
bootstrap_servers = ["kafka:9092"]
topics = ["legacy.logs"]
group_id = "influxdb3_text"
format = "text"

[mapping.text]
table_name = "sensor_logs"
timestamp_field = "ts:(\\d+):ms"

[mapping.text.tags]
location = "location=([^,\\s]+)"

[mapping.text.fields]
temperature = ["temp:([\\d.]+)", "float"]
humidity = ["hum:(\\d+)", "int"]
```
#### Example Message

```
location=warehouse_a,temp:22.5,hum:65,ts:1638360000000
```
### Avro Format (Schema Registry)

Decode Avro messages in the Confluent wire format. The schema is resolved from
the Schema Registry by the id embedded in each message; mapping uses JSONPath
on the decoded record.

#### TOML Configuration

```toml
[kafka]
bootstrap_servers = ["kafka:9092"]
topics = ["sensors.avro"]
group_id = "influxdb3_avro"
format = "avro"

[kafka.schema_registry]
schema_registry_url = "http://schema-registry:8081"
# schema_registry_username = "sr_api_key"     # optional basic auth
# schema_registry_password = "sr_api_secret"

[mapping.avro]
table_name = "sensor_data"
timestamp_field = "$.timestamp:ms"

[mapping.avro.tags]
device_id = "$.device_id"

[mapping.avro.fields]
temperature = ["$.temperature", "float"]
humidity = ["$.humidity", "float"]
```
### Avro Format (local .avsc schema, schemaless)

Decode raw schemaless Avro (no Schema Registry, no wire header) with a local
`.avsc` schema. Set `avro_schema_file` to switch `format = "avro"` to this mode.

```toml
[kafka]
bootstrap_servers = ["kafka:9092"]
topics = ["sensors.avro"]
group_id = "influxdb3_avro_file"
format = "avro"

[kafka.avro]
avro_schema_file = "schemas/sensor.avsc"

[mapping.avro]
table_name = "sensor_data"
timestamp_field = "$.timestamp:ms"

[mapping.avro.tags]
device_id = "$.device_id"

[mapping.avro.fields]
temperature = ["$.temperature", "float"]
humidity = ["$.humidity", "float"]
```
### JSON Schema Format (Schema Registry)

Decode JSON-Schema messages in the Confluent wire format. Configuration mirrors
the Avro example, using `format = "jsonschema"` and `[mapping.jsonschema]`.

```toml
[kafka]
bootstrap_servers = ["kafka:9092"]
topics = ["events.jsonschema"]
group_id = "influxdb3_jsonschema"
format = "jsonschema"

[kafka.schema_registry]
schema_registry_url = "http://schema-registry:8081"

[mapping.jsonschema]
table_name = "events"
timestamp_field = "$.ts:ms"

[mapping.jsonschema.fields]
value = ["$.value", "float"]
```
### Protobuf Format (local .proto schema)

Decode Protobuf messages in the Confluent wire format using a local `.proto`
file. The Schema Registry is not contacted; the message type is selected by the
wire message index, or set `protobuf_message_type` to choose it explicitly.

```toml
[kafka]
bootstrap_servers = ["kafka:9092"]
topics = ["sensors.protobuf"]
group_id = "influxdb3_protobuf"
format = "protobuf"

[kafka.protobuf]
protobuf_schema_file = "schemas/sensor.proto"
# protobuf_include_dir = "schemas"               # optional, for .proto imports
# protobuf_message_type = "sensors.SensorReading" # optional, defaults to wire message index

[mapping.protobuf]
table_name = "sensor_data"
timestamp_field = "$.timestamp:ms"

[mapping.protobuf.tags]
device_id = "$.device_id"

[mapping.protobuf.fields]
temperature = ["$.temperature", "float"]
humidity = ["$.humidity", "float"]
```
### Protobuf Format (Schema Registry)

Omit `protobuf_schema_file` and set `schema_registry_url` to fetch and compile
the `.proto` (and any referenced schemas) by the wire-frame schema id. The
`[kafka.protobuf]` section can be omitted entirely.

```toml
[kafka]
bootstrap_servers = ["kafka:9092"]
topics = ["sensors.protobuf"]
group_id = "influxdb3_protobuf_sr"
format = "protobuf"

[kafka.schema_registry]
schema_registry_url = "http://schema-registry:8081"

[mapping.protobuf]
table_name = "sensor_data"
timestamp_field = "$.timestamp:ms"

[mapping.protobuf.tags]
device_id = "$.device_id"

[mapping.protobuf.fields]
temperature = ["$.temperature", "float"]
humidity = ["$.humidity", "float"]
```
## Statistics and Monitoring

The plugin tracks comprehensive statistics and writes them to the `kafka_stats` table on every plugin invocation.

### kafka_stats Table

| Field                       | Type  | Description                               |
|-----------------------------|-------|-------------------------------------------|
| `topic` (tag)               | tag   | Kafka topic name                          |
| `partition` (tag)           | tag   | Partition number                          |
| `consumer_group` (tag)      | tag   | Consumer group ID                         |
| `bootstrap_servers` (tag)   | tag   | Kafka cluster address                     |
| `messages_received`         | int   | Total messages received                   |
| `messages_processed`        | int   | Successfully processed messages           |
| `messages_failed`           | int   | Failed messages                           |
| `last_offset`               | int   | Last processed offset for this partition  |
| `success_rate`              | float | Percentage of successful messages         |

### Querying Statistics

```bash
# Get latest statistics
influxdb3 query --database mydb \
  "SELECT * FROM kafka_stats ORDER BY time DESC LIMIT 10"

# Success rate by topic
influxdb3 query --database mydb \
  "SELECT topic, partition, success_rate, messages_processed, messages_failed
   FROM kafka_stats
   WHERE time > now() - INTERVAL '1 hour'
   ORDER BY time DESC"

# Check consumer lag indicators
influxdb3 query --database mydb \
  "SELECT topic, partition, last_offset
   FROM kafka_stats
   WHERE consumer_group = 'influxdb3_consumer'
   ORDER BY time DESC LIMIT 10"
```
## Error Handling

Parse errors and message processing failures are logged to the `kafka_exceptions` table:

### kafka_exceptions Table

| Field               | Type   | Description                              |
|---------------------|--------|------------------------------------------|
| `topic` (tag)       | tag    | Kafka topic where error occurred         |
| `partition` (tag)   | tag    | Partition number                         |
| `error_type` (tag)  | tag    | Type of error (for example, JSONDecodeError)    |
| `offset`            | int    | Message offset                           |
| `error_message`     | string | Detailed error message                   |

### Checking for Errors

```bash
influxdb3 query --database mydb \
  "SELECT * FROM kafka_exceptions ORDER BY time DESC LIMIT 10"
```
### Dead-letter queue

When `dlq_topic` is configured, messages that fail to parse are additionally republished to that Kafka topic with the original payload and key, so they can be inspected or replayed without re-reading the source topic. Error context is attached as Kafka headers:

| Header          | Description                                  |
|-----------------|----------------------------------------------|
| `source_topic`  | Topic the message was originally consumed from |
| `error_type`    | Exception type (e.g. `JSONDecodeError`)      |
| `error_message` | Error detail (truncated to 1KB)              |

Transient InfluxDB write failures are not sent to the DLQ — they are retried on the next cycle (with `offset_commit_policy=on_success`).

## Troubleshooting

### Check Plugin Logs

```bash
influxdb3 query --database _internal \
  "SELECT * FROM system.processing_engine_logs
   WHERE trigger_name = 'kafka_ingestion'
   ORDER BY time DESC LIMIT 20"
```
### Common Issues

#### "confluent-kafka library not installed" or "No module named 'confluent_kafka'"

```bash
influxdb3 install package confluent-kafka
```
If you encounter `librdkafka` related errors:
- Ubuntu/Debian: `sudo apt-get install librdkafka-dev`
- macOS: `brew install librdkafka`

#### "Configuration file not found"

- For relative paths, ensure `PLUGIN_DIR` environment variable is set
- For absolute paths, verify the file exists at the specified location

```bash
# For relative paths
export PLUGIN_DIR=~/.plugins
ls $PLUGIN_DIR/my_kafka_config.toml

# Or use absolute path
ls /etc/kafka/my_kafka_config.toml
```
#### "Failed to connect to Kafka cluster"

- Verify bootstrap_servers addresses and ports
- Check network connectivity to Kafka brokers
- For SSL connections, verify certificate paths
- For SASL authentication, verify credentials

#### "SASL mechanism required when security_protocol includes SASL"

When using `SASL_PLAINTEXT` or `SASL_SSL`, you must provide:
- `sasl_mechanism`
- `sasl_username`
- `sasl_password`

#### "No fields were mapped from JSON data"

- Verify JSONPath expressions in field mappings (use `$.` prefix)
- Check that JSON structure matches your paths
- Review `kafka_exceptions` table for detailed errors

#### Messages not being processed

- Check trigger status: `influxdb3 show summary --database mydb`
- Verify Kafka connection in plugin logs
- Check consumer group lag using Kafka tools
- Increase trigger frequency (for example, from `every:10s` to `every:5s`)
- If many messages are queued, increase `max_poll_records` or set to `0` (unlimited)

#### Offset commit issues with `on_success` policy

If using `offset_commit_policy=on_success` and seeing repeated message processing:
- Check `kafka_exceptions` table for processing errors
- Fix the root cause of failures
- Consider using `offset_commit_policy=always` if some data loss is acceptable

## Architecture

### How It Works

1. **Scheduled Trigger**: Plugin runs on schedule (for example, `every:10s`)
2. **Configuration Caching**: Plugin configuration is parsed once and cached between executions
3. **Persistent Consumer**: The Kafka consumer is created once and reused across invocations (cached), so it stays in its consumer group and no rebalance happens every cycle
4. **Consumer Poll**: Consumer polls for available messages (drains all available messages)
5. **Offset Commit**: Based on `offset_commit_policy`:
   - `always`: Commits immediately after poll
   - `on_success`: Commits only after successful processing of all messages
6. **Deduplication** (optional): When `dedup_id_field` is set and no message timestamp is configured, duplicate ids within `dedup_window` are skipped
7. **Parse & Write**: Messages parsed according to format and written to InfluxDB
8. **Error Tracking**: Parse errors logged to `kafka_exceptions` table (and `dlq_topic` if configured)
9. **Statistics**: Written to `kafka_stats` table on every plugin invocation

### Performance Optimization

The plugin includes several optimizations for high-throughput scenarios:

- **Persistent Consumer**: The consumer is reused across trigger executions instead of reconnecting each cycle, eliminating the consumer-group rebalance (and its latency/broker overhead) that a connect/disconnect-per-cycle would cause. It stays in the group while the schedule interval stays below `max_poll_interval`.
- **Configuration Caching**: Plugin configuration is parsed once and reused across all trigger executions
- **Pre-compiled Patterns**: JSONPath expressions and regex patterns are compiled once during parser initialization
- **Batch Polling**: Consumer drains available messages in a single trigger execution (limited by `max_poll_records`, default 500)
- **Manual Offset Commit**: Provides control over exactly-once vs at-least-once semantics

### Consumer Group Behavior

- A single consumer connection is created and reused across trigger executions; it is only rebuilt after a fatal connection/poll error or a configuration change
- Set `max_poll_interval` above your trigger interval so the broker does not evict the reused consumer between polls (this would force a rebalance)
- Consumer group ID ensures partitions are assigned consistently
- Offsets are committed to Kafka for durability
- Multiple plugin instances with the same `group_id` will share partitions (load balancing)

## Report an issue

For plugin issues, see the Plugins repository [issues page](https://github.com/influxdata/influxdb3_plugins/issues).

## Find support for {{% product-name %}}

The [InfluxDB Discord server](https://discord.gg/9zaNCW2PRT) is the best place to find support for InfluxDB 3 Core and InfluxDB 3 Enterprise.
For other InfluxDB versions, see the [Support and feedback](#bug-reports-and-feedback) options.
<!-- vale on -->
<!-- END GENERATED PLUGIN CONTENT -->
