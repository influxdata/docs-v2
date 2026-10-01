<!-- BEGIN GENERATED PLUGIN CONTENT -->
<!-- vale off -->
> **Note:** This plugin requires {{% product-name %}}.8.2 or later.


The Schema Validator Plugin validates incoming line protocol against a user-defined JSON schema and forwards only conforming rows to a target database or table. It runs on every WAL flush of the tables named by its trigger specification: each row is checked against the measurement whitelist, the required tags and their allowed values, and the required fields, their types and their allowed values. Valid rows are stripped down to the schema-defined tags and fields and written to the target; rejected rows are optionally logged and recorded in a `_schema_rejections` measurement.

Typical pipelines:

- `raw_db` → validate → `clean_db` (cross-database)
- `raw_table` → validate → `validated_table` (same database, different table)
- `source_table` → validate → `source_table_clean` (same database, with a suffix)

This is a single-file plugin (`schema_validator.py`) and can be loaded from GitHub via `gh:` trigger paths or created in InfluxDB 3 Explorer.

> **Note:** The JSON schema file must be placed in the plugin directory on the server by hand — there is no API for uploading non-plugin files, so Explorer cannot upload it for you. Use `scp`, `rsync`, or any other file transfer method.

## Features

- **Measurement whitelist**: `allowed_measurements` names the tables that are processed; a table outside the list is skipped
- **Tag validation**: each tag is required or optional and may carry a list of allowed values
- **Field validation**: each field is required or optional, is checked against its declared or inferred type, and may carry a list of allowed values
- **Field stripping**: tags and fields the schema does not define are dropped from the written row
- **Flexible targeting**: write to another database, to the name a table's `target_table` gives, or to the source name with a prefix or suffix
- **Per-table schemas**: every measurement carries its own tags, fields and target
- **Rejection logging**: a rejected row is logged with its reason and, optionally, recorded in the `_schema_rejections` measurement
- **Cached schema**: the JSON file is re-read at most once every five minutes

## Configuration

Plugin parameters may be specified as key-value pairs in the `--trigger-arguments` flag (CLI) or in the `trigger_arguments` field (API) when creating a trigger. Some plugins support TOML configuration files, which can be specified using the plugin's `config_file_path` parameter.

### Plugin metadata

This plugin includes a JSON metadata schema in its docstring that defines supported trigger types and configuration parameters. This metadata enables the [InfluxDB 3 Explorer](https://docs.influxdata.com/influxdb3/explorer/) UI to display and configure the plugin.

### Required parameters

| Parameter     | Type   | Default  | Description                                                                 |
|---------------|--------|----------|-----------------------------------------------------------------------------|
| `schema_file` | string | required | Path to the JSON schema file, absolute or relative to the plugin directory. Must end in `.json` |

### Data write trigger parameters

| Parameter             | Type    | Default          | Description                                                                                                                                        |
|-----------------------|---------|------------------|----------------------------------------------------------------------------------------------------------------------------------------------------|
| `target_database`     | string  | trigger's own DB | Database that validated rows and the rejection log are written to                                                                                  |
| `target_table_prefix` | string  | `""`             | Prefix added to the source measurement name in the target. Ignored for tables that define `target_table`                                           |
| `target_table_suffix` | string  | `""`             | Suffix added to the source measurement name in the target. Ignored for tables that define `target_table`                                           |
| `log_rejected`        | boolean | `true`           | Log one warning per rejected row, plus one message per skipped table. Accepts `true`/`false`, `1`/`0`, `yes`/`no`, `on`/`off`                      |
| `log_accepted`        | boolean | `false`          | Log one message per accepted row — noisy, use for debugging. Accepts `true`/`false`, `1`/`0`, `yes`/`no`, `on`/`off`                               |
| `write_rejection_log` | boolean | `false`          | Write rejected row details to the `_schema_rejections` measurement in the target database. Accepts `true`/`false`, `1`/`0`, `yes`/`no`, `on`/`off` |

### Environment variables

Every parameter can also come from an environment variable named
`INFLUXDB3_SCHEMA_VALIDATOR_<PARAMETER>` in upper case — for example,
`INFLUXDB3_SCHEMA_VALIDATOR_SCHEMA_FILE` sets `schema_file`. The environment is
the lowest layer: a trigger argument overrides it, and the TOML file overrides
both. `INFLUXDB3_SCHEMA_VALIDATOR_CONFIG_FILE_PATH` names the TOML file when the
trigger doesn't carry a `config_file_path` argument.

### TOML configuration

| Parameter          | Type   | Default | Description                                                                      |
|--------------------|--------|---------|----------------------------------------------------------------------------------|
| `config_file_path` | string | none    | Path to a TOML config file, absolute or relative to the plugin directory         |

To use a TOML configuration file, name it in `config_file_path` in the trigger arguments. A relative path — `config_file_path` and `schema_file` alike — is resolved against the plugin directory: `PLUGIN_DIR` when it is set, otherwise `INFLUXDB3_PLUGIN_DIR`, which the processing engine sets from `--plugin-dir`, otherwise the parent of `VIRTUAL_ENV`. An absolute path is used as written.

The file accepts the same keys as inline arguments, and its values override them. A key outside the tables above is refused and named in the error, in the trigger arguments and in the TOML file alike, so a misspelling is reported rather than silently dropped.

#### Example TOML configuration

- [schema_validator_trigger_config.toml](https://github.com/influxdata/influxdb3_plugins/blob/master/influxdata/schema_validator/schema_validator_trigger_config.toml)

For more information on using TOML configuration files, see the Using TOML Configuration Files section in the [influxdb3_plugins/README.md](https://github.com/influxdata/influxdb3_plugins/blob/master/README.md).

## Schema configuration (JSON)

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
                "station_id": { "required": true },
                "region": { "required": false }
            },
            "fields": {
                "temperature": { "required": true, "type": "float" },
                "humidity": { "required": true, "type": "float" },
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
### Top-level

| Field                  | Type                   | Description                                                                                                                                     |
|------------------------|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------|
| `allowed_measurements` | `list[str]` (optional) | Whitelist of measurement names. When omitted or empty, no measurement filter is applied and all measurements fall through to the `tables` rules |
| `tables`               | `dict` (required)      | Map of measurement name -> table definition. Must contain at least one entry; measurements without an entry are skipped                         |

### Table definition

| Field          | Type              | Description                                                                                  |
|----------------|-------------------|----------------------------------------------------------------------------------------------|
| `target_table` | `str` (optional)  | Target measurement name for this table. Takes precedence over `target_table_prefix`/`suffix` |
| `tags`         | `dict` (optional) | Map of tag name -> tag definition                                                            |
| `fields`       | `dict` (required) | Map of field name -> field definition. Must contain at least one entry                       |

### Tag definition

| Field            | Type              | Description                                   |
|------------------|-------------------|-----------------------------------------------|
| `required`       | `bool`            | When `true`, the tag must be present on a row |
| `allowed_values` | `list` (optional) | Whitelist of values, compared as strings      |

### Field definition

| Field            | Type              | Description                                                      |
|------------------|-------------------|------------------------------------------------------------------|
| `required`       | `bool`            | When `true`, the field must be present on a row                  |
| `type`           | `str` (optional)  | Expected type. When omitted, the type is inferred from the value |
| `allowed_values` | `list` (optional) | Whitelist of values, compared by value and as strings            |

A tag or field written as a bare name instead of a definition object is treated as required with no value whitelist.

### Field types

| `type`                       | Accepted values                                                    |
|------------------------------|--------------------------------------------------------------------|
| `float`, `float64`, `double` | Integers and floats, excluding booleans; must be finite            |
| `integer`, `int`, `int64`    | Integers, excluding booleans; must fit into `int64`                |
| `uint64`, `unsigned`, `uint` | Non-negative integers, excluding booleans; must fit into `uint64`  |
| `string`, `str`              | Strings                                                            |
| `boolean`, `bool`            | Booleans                                                           |

An unknown type name in the schema is reported as an error and the plugin does not run. When a field definition has no `type`, the type is inferred from the value: booleans become `boolean`, integers `integer`, floats `float`, everything else `string`.

## Validation logic

For each row, in order:

1. **Required tags** — every tag marked `required` must be present.
2. **Tag values** — a tag with `allowed_values` must carry one of them.
3. **Required fields** — every field marked `required` must be present.
4. **Field types** — a present field must match its declared or inferred type.
5. **Field values** — a field with `allowed_values` must carry one of them.

If any check fails, the row is rejected and nothing is written for it. A row is also rejected when it carries no schema-defined field, or when a value cannot be written as its type (a non-finite float, an integer outside the `int64`/`uint64` range).

Tags and fields absent from the schema are stripped from the output. Tables absent from a non-empty `allowed_measurements` list are skipped, as are tables with no `tables` entry.

## Target resolution

Validated rows of a table are written to:

1. the table's `target_table`, when set; otherwise
2. `<target_table_prefix><source_table><target_table_suffix>`.

When `target_database` is not set, rows go back into the trigger's own database, so a table must resolve to a measurement name other than its own — otherwise the trigger would feed itself. A flush carrying such a table is rejected, naming the offending table; tables that the trigger never receives are not checked. Set `target_database`, a prefix, a suffix, or a per-table `target_table`.

The schema file is cached for 5 minutes; edits are picked up within that window.

## Rejection log

With `write_rejection_log` enabled, every rejected row adds one point to `_schema_rejections` in the target database:

| Column         | Kind      | Description                                                |
|----------------|-----------|------------------------------------------------------------|
| `source_table` | tag       | Table the rejected row arrived on                          |
| `reason`       | field     | Rejection reason                                           |
| `row_data`     | field     | The row rendered as a string, truncated to 1024 characters |
| `time`         | timestamp | Time of validation                                         |

Entries are batched per table and written in one call.

## Software Requirements

- **{{% product-name %}}**: with the Processing Engine enabled
- **Python packages**: `influxdata-plugin-utils>=0.4.0`

## Installation steps

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
   influxdb3 install package "influxdata-plugin-utils>=0.4.0"
   ```
3. Copy the JSON schema file into the plugin directory:

   ```bash
   scp schema_validator_config.json user@server:~/.plugins/
   ```
## Trigger setup

Cross-database validation (`raw_db` -> `clean_db`):

```bash
influxdb3 create trigger \
  --database raw_db \
  --path "gh:influxdata/schema_validator/schema_validator.py" \
  --trigger-spec "all_tables" \
  --trigger-arguments "schema_file=schema_validator_config.json,target_database=clean_db" \
  --error-behavior log \
  schema_validator_trigger
```
Same database, different table:

```bash
influxdb3 create trigger \
  --database mydb \
  --path "gh:influxdata/schema_validator/schema_validator.py" \
  --trigger-spec "table:weather" \
  --trigger-arguments "schema_file=schema_validator_config.json,target_table_suffix=_clean" \
  --error-behavior log \
  schema_validator_weather
```
Using a TOML config file:

```bash
influxdb3 create trigger \
  --database raw_db \
  --path "gh:influxdata/schema_validator/schema_validator.py" \
  --trigger-spec "all_tables" \
  --trigger-arguments "config_file_path=schema_validator_trigger_config.toml" \
  --error-behavior log \
  schema_validator_trigger
```
### Enable triggers

```bash
influxdb3 enable trigger --database raw_db schema_validator_trigger
```
## Example usage

### Example 1: Cross-database validation

```bash
# This row has all required tags and fields -> written to clean_db
influxdb3 write --database raw_db \
  "weather,location=us-east,station_id=ST001 temperature=72.5,humidity=45.2"

# This row is missing the required tag 'station_id' -> rejected
influxdb3 write --database raw_db \
  "weather,location=us-east temperature=72.5,humidity=45.2"

# Query the validated data
influxdb3 query --database clean_db "SELECT * FROM weather_clean ORDER BY time DESC LIMIT 10"
```
### Example 2: Monitoring rejections

```bash
influxdb3 create trigger \
  --database raw_db \
  --path "gh:influxdata/schema_validator/schema_validator.py" \
  --trigger-spec "all_tables" \
  --trigger-arguments "schema_file=schema_validator_config.json,target_database=clean_db,write_rejection_log=true" \
  --error-behavior log \
  schema_validator_all
```
```sql
SELECT source_table, reason, row_data
FROM _schema_rejections
WHERE time > now() - INTERVAL '1 hour'
ORDER BY time DESC
```
## Code overview

### Files

- `schema_validator.py`: The main plugin code containing `process_writes`
- `schema_validator_config.json`: Example JSON schema definition
- `schema_validator_trigger_config.toml`: Example TOML trigger configuration
- `test_schema_validator.py`: Pytest suite (55 tests, runs without a live {{% product-name %}} server)
- `requirements.txt`: Runtime dependencies (`influxdata-plugin-utils>=0.4.0`)

### Logging

Logs are stored in the trigger's database in the `system.processing_engine_logs` table. To view logs:

```bash
influxdb3 query --database YOUR_DATABASE "SELECT * FROM system.processing_engine_logs WHERE trigger_name = 'your_trigger_name'"
```
Every log line is prefixed with a per-fire `task_id` (eight hex characters) so records from a single trigger fire can be correlated.

### Main functions

#### `process_writes(influxdb3_local, table_batches, args)`

Loads the configuration and the cached schema, then processes each table batch independently: rows are validated, valid ones are collected as line protocol and written with `write_sync` (or `write_sync_to_db` when `target_database` is set), and rejection log entries are written in a second batch. Writes are not retried, so a WAL flush is never held by backoff; a failing write is reported with the number of rows that did not land, those rows are counted as dropped in the closing summary instead of accepted, and the remaining tables are still processed.

## Troubleshooting

### Common issues

#### Issue: No data appears in the target

**Solution**: Only measurements with an entry in `tables` are forwarded, and a non-empty `allowed_measurements` list filters them further. Check `system.processing_engine_logs` for `No schema defined for table` and `not in allowed_measurements` messages.

#### Issue: Trigger reports "would be written back into itself"

**Solution**: With no `target_database`, the target measurement name must differ from the source. Set `target_database`, `target_table_prefix`, `target_table_suffix`, or the table's `target_table`.

#### Issue: Every row of a table is rejected

**Solution**: Read the rejection reason in the logs or in `_schema_rejections`. Common causes are a `required` tag that arrives as a field in the source data (or the reverse), an `allowed_values` list that does not cover production values, and a `type` that does not match what is written (for example, `integer` against a value written as `72.5`).

#### Issue: Schema edits do not take effect

**Solution**: The schema file is cached for 5 minutes. Wait for the cache to expire or restart the trigger.

## Report an issue

For plugin issues, see the Plugins repository [issues page](https://github.com/influxdata/influxdb3_plugins/issues).

## Find support for {{% product-name %}}

The [InfluxDB Discord server](https://discord.gg/9zaNCW2PRT) is the best place to find support for InfluxDB 3 Core and InfluxDB 3 Enterprise.
For other InfluxDB versions, see the [Support and feedback](#bug-reports-and-feedback) options.
<!-- vale on -->
<!-- END GENERATED PLUGIN CONTENT -->
