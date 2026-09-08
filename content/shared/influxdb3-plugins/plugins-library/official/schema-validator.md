<!-- BEGIN GENERATED PLUGIN CONTENT -->
<!-- vale off -->
> **Note:** This plugin requires {{% product-name %}}.8.2 or later.

An {{% product-name %}} Processing Engine plugin that validates incoming line protocol data against a user-defined JSON schema. Only data that conforms to the schema is written to a target database or table, enabling a clean data pipeline pattern.

## Use Case

You have data coming into a "raw" database (for example, `raw_db`) from various sources. You want to ensure only properly-structured, validated data makes it into your "clean" database (for example, `clean_db`). This plugin sits on the WAL flush trigger and validates every incoming row against your schema definition before writing it to the target.

**Common patterns:**
- `raw_db` -> validate -> `clean_db` (cross-database)
- `raw_table` -> validate -> `validated_table` (same database, different table)
- `source_table` -> validate -> `source_table_clean` (same database, with suffix)

This is a **single-file plugin** (`schema_validator.py`) and can be loaded from GitHub via `gh:` trigger paths or created in InfluxDB Explorer.

> **Note:** The JSON schema configuration file (`schema_validator_config.json`) must be manually uploaded to the plugin directory on the server. There is currently no API for uploading non-plugin files, so Explorer cannot upload it for you. You can use `scp`, `rsync`, or any other file transfer method to place the schema file in the plugin directory alongside the plugin.

## Features

- **Measurement validation**: Define a whitelist of allowed measurement/table names
- **Tag validation**: Required/optional tags, allowed tag values
- **Field validation**: Required/optional fields, type checking (float, integer, string, boolean, uint64), allowed field values
- **Field stripping**: Extra tags/fields not defined in the schema are automatically stripped from the output
- **Flexible targeting**: Write to a different database, different table name, or add prefix/suffix
- **Per-table schemas**: Define different validation rules for each measurement
- **Rejection logging**: Optionally log rejected rows and/or write rejection details to a measurement
- **Cached config**: Schema file is cached for 5 minutes to avoid repeated file reads

## Quick Start

### 1. Deploy the plugin files

The plugin code can be deployed via the InfluxDB CLI, Explorer, or GitHub (`gh:`) trigger paths. However, the **schema JSON configuration file must be manually placed** in the plugin directory on the server since there is no API for uploading non-plugin files.

- `schema_validator.py` - the plugin code (can be uploaded via CLI/Explorer/GitHub)
- `schema_validator_config.json` - your schema definition (must be manually copied to the plugin directory)

### 2. Create a trigger

**Cross-database validation (raw_db -> clean_db):**
```bash
influxdb3 create trigger \
  --database raw_db \
  --plugin-filename schema_validator.py \
  --trigger-spec "all_tables" \
  --trigger-arguments schema_file=schema_validator_config.json,target_database=clean_db \
  schema_validator_trigger
```
**Same database, different table (with suffix):**
```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename schema_validator.py \
  --trigger-spec "table:weather" \
  --trigger-arguments schema_file=schema_validator_config.json,target_table_suffix=_clean \
  schema_validator_weather
```
**Using a TOML config file:**
```bash
influxdb3 create trigger \
  --database raw_db \
  --plugin-filename schema_validator.py \
  --trigger-spec "all_tables" \
  --trigger-arguments config_file_path=schema_validator_trigger_config.toml \
  schema_validator_trigger
```
### 3. Write data normally

Write to your raw database as usual. The plugin will automatically validate and forward conforming data.

```bash
# This row has all required fields -> will be written to clean_db
influxdb3 write --database raw_db \
  "weather,location=us-east,station_id=ST001 temperature=72.5,humidity=45.2"

# This row is missing required tag 'station_id' -> will be rejected
influxdb3 write --database raw_db \
  "weather,location=us-east temperature=72.5,humidity=45.2"
```
## Schema Configuration (JSON)

The schema is defined in a JSON file. Here is the full structure:

```json
{
    "allowed_measurements": ["weather", "cpu"],

    "tables": {
        "weather": {
            "target_table": "weather_clean",
            "tags": {
                "location": {
                    "required": true,
                    "allowed_values": ["us-east", "us-west", "eu-west"]
                },
                "station_id": {
                    "required": true
                },
                "region": {
                    "required": false
                }
            },
            "fields": {
                "temperature": {
                    "required": true,
                    "type": "float"
                },
                "humidity": {
                    "required": true,
                    "type": "float"
                },
                "condition": {
                    "required": false,
                    "type": "string",
                    "allowed_values": ["sunny", "cloudy", "rain", "snow"]
                }
            }
        }
    }
}
```
### Schema Fields Reference

#### Top-level

| Field | Type | Description |
|---|---|---|
| `allowed_measurements` | `list[str]` (optional) | Whitelist of allowed measurement/table names. If omitted or empty (`[]`), no measurement filter is applied — all measurements fall through to the `tables` rules. |
| `tables` | `dict` (required) | Map of measurement name -> table schema definition. Must contain at least one entry. Only measurements with an entry here will be validated and written to the target. |

#### Table Schema

| Field | Type | Description |
|---|---|---|
| `target_table` | `str` (optional) | Override the target measurement name. Takes precedence over prefix/suffix args. |
| `tags` | `dict` | Map of tag name -> tag definition. |
| `fields` | `dict` | Map of field name -> field definition. |
#### Tag Definition

| Field | Type | Description |
|---|---|---|
| `required` | `bool` | If `true`, the tag must be present on every row. |
| `allowed_values` | `list` (optional) | Whitelist of allowed values for this tag. |

#### Field Definition

| Field | Type | Description |
|---|---|---|
| `required` | `bool` | If `true`, the field must be present on every row. |
| `type` | `str` (optional) | Expected data type: `"float"`, `"integer"`, `"string"`, `"boolean"`, `"uint64"`. |
| `allowed_values` | `list` (optional) | Whitelist of allowed values for this field. |

## Trigger Arguments

These can be passed via `--trigger-arguments` or in a TOML config file.

| Argument | Required | Default | Description |
|---|---|---|---|
| `schema_file` | Yes | - | Path to the JSON schema file (relative to PLUGIN_DIR). |
| `target_database` | No | (same db) | Database to write validated data to. |
| `target_table_prefix` | No | `""` | Prefix added to measurement names in the target. |
| `target_table_suffix` | No | `""` | Suffix added to measurement names in the target. |
| `log_rejected` | No | `"true"` | Log info about rejected rows. |
| `log_accepted` | No | `"false"` | Log info about accepted rows. |
| `write_rejection_log` | No | `"false"` | Write rejection details to `_schema_rejections` measurement. |
| `config_file_path` | No | - | Path to TOML config file to override these arguments. |

## Validation Logic

For each incoming row, the plugin checks (in order):

1. **Measurement name**: Is the table name in `allowed_measurements`? (if defined)
2. **Table schema exists**: Is there a schema definition for this table in `tables`? If not, the table is skipped.
3. **Required tags**: Are all required tags present?
4. **Tag values**: Are tag values in the `allowed_values` list? (if defined)
5. **Required fields**: Are all required fields present?
6. **Field types**: Do field values match the expected type? (if defined)
7. **Field values**: Are field values in the `allowed_values` list? (if defined)
8. **Field stripping**: Any extra tags/fields not defined in the schema are stripped from the output.

If **any** check fails, the row is rejected and not written to the target.

## Examples

### IoT Sensor Validation

Ensure sensor readings always have a device_id, valid sensor type, and a numeric value:

```json
{
    "allowed_measurements": ["sensor_readings"],
    "tables": {
        "sensor_readings": {
            "target_table": "sensors_validated",
            "tags": {
                "device_id": { "required": true },
                "sensor_type": {
                    "required": true,
                    "allowed_values": ["temperature", "pressure", "humidity"]
                }
            },
            "fields": {
                "value": { "required": true, "type": "float" },
                "status": {
                    "required": false,
                    "type": "string",
                    "allowed_values": ["ok", "warning", "critical"]
                }
            }
        }
    }
}
```
### Multi-table with Cross-database

Validate weather and cpu data from raw_db, writing clean data to clean_db:

```bash
influxdb3 create trigger \
  --database raw_db \
  --plugin-filename schema_validator.py \
  --trigger-spec "all_tables" \
  --trigger-arguments schema_file=schema_validator_config.json,target_database=clean_db,write_rejection_log=true \
  schema_validator_all
```
### Monitoring Rejections

Query the rejection log to see what data is being rejected and why:

```sql
SELECT * FROM _schema_rejections
WHERE time > now() - INTERVAL '1 hour'
ORDER BY time DESC
```
## File Structure

```
schema_validator/
  schema_validator.py                       # Main plugin code
  schema_validator_config.json              # Example schema definition
  schema_validator_trigger_config.toml      # Example TOML trigger config
  README.md                                 # This file
```
## Notes

- The schema JSON file is cached for 5 minutes. To force a reload, restart the trigger or wait for the cache to expire.
- Extra tags/fields not defined in the schema are silently stripped from the output (not written to the target).
- Measurements without an entry in `tables` are skipped entirely (no data written).
- The `target_table` property in a table schema takes precedence over `target_table_prefix`/`target_table_suffix`.
- The `_schema_rejections` table (if `write_rejection_log=true`) is written to the target database.
- Uses `write_sync` / `write_sync_to_db` with `no_sync=True` for optimal memory performance.
- Valid rows are batched per table and written in a single call for efficiency.

## Logging

Logs are stored in the `_internal` database (or the database where the trigger is created) in the `system.processing_engine_logs` table. To view logs:

```bash
influxdb3 query --database _internal "SELECT * FROM system.processing_engine_logs WHERE trigger_name = 'your_trigger_name'"
```

Log columns:
- **event_time**: Timestamp of the log event
- **trigger_name**: Name of the trigger that generated the log
- **log_level**: Severity level (INFO, WARN, ERROR)
- **log_text**: Message describing the action or error

## Report an issue

For plugin issues, see the Plugins repository [issues page](https://github.com/influxdata/influxdb3_plugins/issues).

## Find support for {{% product-name %}}

The [InfluxDB Discord server](https://discord.gg/9zaNCW2PRT) is the best place to find support for InfluxDB 3 Core and InfluxDB 3 Enterprise.
For other InfluxDB versions, see the [Support and feedback](#bug-reports-and-feedback) options.
<!-- vale on -->
<!-- END GENERATED PLUGIN CONTENT -->
