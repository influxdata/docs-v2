The InfluxDB to Iceberg Plugin enables data transfer from InfluxDB 3 to Apache Iceberg tables.
Transfer time series data to Iceberg for long-term storage, analytics, or integration with data lake architectures.
The plugin supports both scheduled batch transfers of historical data and on-demand transfers via HTTP API.

## Configuration

### Scheduler trigger parameters

#### Required parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `measurement` | string | required | Source measurement containing data to transfer |
| `window` | string | required | Time window for data transfer. Format: `<number><unit>` (for example, `"1h"`, `"30d"`) |
| `catalog_configs` | string | required | Base64-encoded JSON string containing Iceberg catalog configuration |

#### Optional parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `included_fields` | string | all fields | Dot-separated list of fields to include (for example, `"usage_user.usage_idle"`) |
| `excluded_fields` | string | none | Dot-separated list of fields to exclude |
| `namespace` | string | "default" | Iceberg namespace for the target table |
| `table_name` | string | measurement name | Iceberg table name |
| `config_file_path` | string | none | Path to TOML config file relative to PLUGIN_DIR |

### HTTP trigger parameters

#### Request body structure

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `measurement` | string | Yes | Source measurement containing data to transfer |
| `catalog_configs` | object | Yes | Iceberg catalog configuration dictionary. See [PyIceberg catalog documentation](https://py.iceberg.apache.org/configuration/) |
| `included_fields` | array | No | List of field names to include in replication |
| `excluded_fields` | array | No | List of field names to exclude from replication |
| `namespace` | string | No | Target Iceberg namespace (default: "default") |
| `table_name` | string | No | Target Iceberg table name (default: measurement name) |
| `batch_size` | string | No | Batch size duration for processing (default: "1d"). Format: `<number><unit>` |
| `backfill_start` | string | No | ISO 8601 datetime with timezone for backfill start |
| `backfill_end` | string | No | ISO 8601 datetime with timezone for backfill end |


### Schema management

- Automatically creates Iceberg table schema from the first batch of data
- Maps pandas data types to Iceberg types:
  - `int64` → `IntegerType`
  - `float64` → `FloatType`
  - `datetime64[us]` → `TimestampType`
  - `object` → `StringType`
- Fields with no null values are marked as `required`
- The `time` column is converted to `datetime64[us]` for Iceberg compatibility
- Tables are created in format: `<namespace>.<table_name>`

## Requirements

### Software requirements
- InfluxDB 3 Core or Enterprise with Processing Engine enabled
- Python packages:
  - `pandas` (for data manipulation)
  - `pyarrow` (for Parquet support)
  - `pyiceberg[catalog-options]` (for Iceberg integration)

### Installation steps

1. Start InfluxDB 3 with plugin support:
   ```bash
   influxdb3 serve \
     --node-id node0 \
     --object-store file \
     --data-dir ~/.influxdb3 \
     --plugin-dir ~/.plugins
   ```

2. Install required Python packages:
   ```bash
   influxdb3 install package pandas
   influxdb3 install package pyarrow
   influxdb3 install package "pyiceberg[s3fs,hive,sql-sqlite]"
   ```

   **Note:** Include the appropriate PyIceberg extras based on your catalog type:
   - `[s3fs]` for S3 storage
   - `[hive]` for Hive metastore
   - `[sql-sqlite]` for SQL catalog with SQLite
   - See [PyIceberg documentation](https://py.iceberg.apache.org/#installation) for all options

## Trigger setup

### Scheduled data transfer

Periodically transfer data from InfluxDB 3 to Iceberg:

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename gh:influxdata/influxdb_to_iceberg/influxdb_to_iceberg.py \
  --trigger-spec "every:1h" \
  --trigger-arguments 'measurement=cpu,window=1h,catalog_configs="eyJ1cmkiOiAiaHR0cDovL25lc3NpZTo5MDAwIn0=",namespace=monitoring,table_name=cpu_metrics' \
  hourly_iceberg_transfer
```

### HTTP API endpoint

Create an on-demand transfer endpoint:

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename gh:influxdata/influxdb_to_iceberg/influxdb_to_iceberg.py \
  --trigger-spec "request:replicate" \
  iceberg_http_transfer
```

Enable the trigger:
```bash
influxdb3 enable trigger --database mydb iceberg_http_transfer
```

The endpoint is registered at `/api/v3/engine/replicate`.

## Example usage

### Example 1: Basic scheduled transfer

Transfer CPU metrics to Iceberg every hour:

```bash
# Create trigger with base64-encoded catalog config
# Original JSON: {"uri": "http://nessie:9000"}
# Base64: eyJ1cmkiOiAiaHR0cDovL25lc3NpZTo5MDAwIn0=
influxdb3 create trigger \
  --database metrics \
  --plugin-filename gh:influxdata/influxdb_to_iceberg/influxdb_to_iceberg.py \
  --trigger-spec "every:1h" \
  --trigger-arguments 'measurement=cpu,window=24h,catalog_configs="eyJ1cmkiOiAiaHR0cDovL25lc3NpZTo5MDAwIn0="' \
  cpu_to_iceberg

# Write test data
influxdb3 write \
  --database metrics \
  "cpu,host=server1 usage_user=45.2,usage_system=12.1"

# After trigger runs, data is available in Iceberg table "default.cpu"
```

### Expected results
- Creates Iceberg table `default.cpu` with schema matching the measurement
- Transfers all CPU data from the last 24 hours
- Appends new data on each hourly run

### Example 2: HTTP backfill with field filtering

Backfill specific fields from historical data:

```bash
# Create and enable HTTP trigger
influxdb3 create trigger \
  --database metrics \
  --plugin-filename gh:influxdata/influxdb_to_iceberg/influxdb_to_iceberg.py \
  --trigger-spec "request:replicate" \
  iceberg_backfill

influxdb3 enable trigger --database metrics iceberg_backfill

# Request backfill via HTTP
curl -X POST http://localhost:8181/api/v3/engine/replicate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "measurement": "temperature",
    "catalog_configs": {
      "type": "sql",
      "uri": "sqlite:///path/to/catalog.db"
    },
    "included_fields": ["temp_celsius", "humidity"],
    "namespace": "weather",
    "table_name": "temperature_history",
    "batch_size": "12h",
    "backfill_start": "2024-01-01T00:00:00+00:00",
    "backfill_end": "2024-01-07T00:00:00+00:00"
  }'
```

### Expected results
- Creates Iceberg table `weather.temperature_history`
- Transfers only `temp_celsius` and `humidity` fields
- Processes data in 12-hour batches for the specified week
- Returns status of the backfill operation

### Example 3: S3-backed Iceberg catalog

Transfer data to Iceberg tables stored in S3:

```bash
# Create catalog config JSON
cat > catalog_config.json << EOF
{
  "type": "sql",
  "uri": "sqlite:///iceberg/catalog.db",
  "warehouse": "s3://my-bucket/iceberg-warehouse/",
  "s3.endpoint": "http://minio:9000",
  "s3.access-key-id": "minioadmin",
  "s3.secret-access-key": "minioadmin",
  "s3.path-style-access": true
}
EOF

# Encode to base64
CATALOG_CONFIG=$(base64 < catalog_config.json)

# Create trigger
influxdb3 create trigger \
  --database metrics \
  --plugin-filename gh:influxdata/influxdb_to_iceberg/influxdb_to_iceberg.py \
  --trigger-spec "every:30m" \
  --trigger-arguments "measurement=sensor_data,window=1h,catalog_configs=\"$CATALOG_CONFIG\",namespace=iot,table_name=sensors" \
  s3_iceberg_transfer
```

## Using TOML Configuration Files

This plugin supports using TOML configuration files to specify all plugin arguments. This is useful for complex configurations or when you want to version control your plugin settings.

### Important Requirements

**To use TOML configuration files, you must set the `PLUGIN_DIR` environment variable in the InfluxDB 3 host environment.** This is required in addition to the `--plugin-dir` flag when starting InfluxDB 3:

- `--plugin-dir` tells InfluxDB 3 where to find plugin Python files
- `PLUGIN_DIR` environment variable tells the plugins where to find TOML configuration files

### Setting Up TOML Configuration

1. **Start InfluxDB 3 with the PLUGIN_DIR environment variable set**:
   ```bash
   PLUGIN_DIR=~/.plugins influxdb3 serve --node-id node0 --object-store file --data-dir ~/.influxdb3 --plugin-dir ~/.plugins
   ```

2. **Copy the example TOML configuration file to your plugin directory**:
   ```bash
   cp influxdb_to_iceberg_config_scheduler.toml ~/.plugins/
   ```

3. **Edit the TOML file** to match your requirements:
   ```toml
   # Required parameters
   measurement = "cpu"
   window = "1h"
   
   # Optional parameters
   namespace = "monitoring"
   table_name = "cpu_metrics"
   
   # Iceberg catalog configuration
   [catalog_configs]
   type = "sql"
   uri = "http://nessie:9000"
   warehouse = "s3://iceberg-warehouse/"
   ```

4. **Create a trigger using the `config_file_path` argument**:
   ```bash
   influxdb3 create trigger \
     --database mydb \
     --plugin-filename influxdb_to_iceberg.py \
     --trigger-spec "every:1h" \
     --trigger-arguments config_file_path=influxdb_to_iceberg_config_scheduler.toml \
     iceberg_toml_trigger
   ```

## Code overview

### Files

- `influxdb_to_iceberg.py`: The main plugin code containing handlers for scheduled and HTTP triggers
- `influxdb_to_iceberg_config_scheduler.toml`: Example TOML configuration file for scheduled triggers

### Logging

Logs are stored in the `_internal` database (or the database where the trigger is created) in the `system.processing_engine_logs` table. To view logs:

```bash
influxdb3 query --database _internal "SELECT * FROM system.processing_engine_logs WHERE trigger_name = 'your_trigger_name'"
```

Log columns:
- **event_time**: Timestamp of the log event
- **trigger_name**: Name of the trigger that generated the log
- **log_level**: Severity level (INFO, WARN, ERROR)
- **log_text**: Message describing the action or error

### Main functions

#### `process_scheduled_call(influxdb3_local, call_time, args)`
Handles scheduled data transfers.
Queries data within the specified window and appends to Iceberg tables.

Key operations:
1. Parses configuration and decodes catalog settings
2. Queries source measurement with optional field filtering
3. Creates Iceberg table if needed
4. Appends data to Iceberg table

#### `process_http_request(influxdb3_local, request_body, args)`
Handles on-demand data transfers via HTTP.
Supports backfill operations with configurable batch sizes.

Key operations:
1. Validates request body parameters
2. Determines backfill time range
3. Processes data in batches
4. Returns transfer status

## Troubleshooting

### Common issues

#### Issue: "Failed to decode catalog_configs" error
**Solution**: Ensure the catalog configuration is properly base64-encoded:
```bash
# Create JSON file
echo '{"uri": "http://nessie:9000"}' > config.json
# Encode to base64
base64 config.json
```

#### Issue: "Failed to create Iceberg table" error
**Solution**: 
1. Verify catalog configuration is correct
2. Check warehouse path permissions
3. Ensure required PyIceberg extras are installed:
   ```bash
   influxdb3 install package "pyiceberg[s3fs]"
   ```

#### Issue: No data in Iceberg table after transfer
**Solution**:
1. Check if source measurement contains data:
   ```bash
   influxdb3 query --database mydb "SELECT COUNT(*) FROM measurement"
   ```
2. Verify time window covers data:
   ```bash
   influxdb3 query --database mydb "SELECT MIN(time), MAX(time) FROM measurement"
   ```
3. Check logs for errors:
   ```bash
   influxdb3 query --database _internal "SELECT * FROM system.processing_engine_logs WHERE log_level = 'ERROR'"
   ```

#### Issue: "Schema evolution not supported" error
**Solution**: The plugin doesn't handle schema changes. If fields change:
1. Create a new table with different name
2. Or manually update the Iceberg table schema

### Debugging tips

1. **Test catalog connectivity**:
   ```python
   from pyiceberg.catalog import load_catalog
   catalog = load_catalog("my_catalog", **catalog_configs)
   print(catalog.list_namespaces())
   ```

2. **Verify field names**:
   ```bash
   influxdb3 query --database mydb "SHOW FIELD KEYS FROM measurement"
   ```

3. **Use smaller windows** for initial testing:
   ```bash
   --trigger-arguments 'window=5m,...'
   ```

### Performance considerations

- **File sizing**: Each scheduled run creates new Parquet files. Use appropriate window sizes to balance file count and size
- **Batch processing**: For HTTP transfers, adjust `batch_size` based on available memory
- **Field filtering**: Use `included_fields` to reduce data volume when only specific fields are needed
- **Catalog choice**: SQL catalogs (SQLite) are simpler but REST catalogs scale better

## Report an issue

For plugin issues, see the Plugins repository [issues page](https://github.com/influxdata/influxdb3_plugins/issues).

## Find support for {{% product-name %}}

The [InfluxDB Discord server](https://discord.gg/9zaNCW2PRT) is the best place to find support for InfluxDB 3 Core and InfluxDB 3 Enterprise.
For other InfluxDB versions, see the [Support and feedback](#bug-reports-and-feedback) options.