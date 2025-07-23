The Downsampler Plugin enables time-based data aggregation and downsampling in InfluxDB 3.
Reduce data volume by aggregating measurements over specified time intervals using functions like avg, sum, min, max, derivative, or median.
The plugin supports both scheduled batch processing of historical data and on-demand downsampling through HTTP requests.
Each downsampled record includes metadata about the original data points compressed.

## Configuration

### Required parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `source_measurement` | string | required | Source measurement containing data to downsample |
| `target_measurement` | string | required | Destination measurement for downsampled data |
| `window` | string | required (scheduled only) | Time window for each downsampling job. Format: `<number><unit>` (for example, `"1h"`, `"1d"`) |

### Aggregation parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `interval` | string | `"10min"` | Time interval for downsampling. Format: `<number><unit>` (for example, `"10min"`, `"2h"`, `"1d"`) |
| `calculations` | string | "avg" | Aggregation functions. Single function or dot-separated field:aggregation pairs |
| `specific_fields` | string | all fields | Dot-separated list of fields to downsample (for example, `"co.temperature"`) |
| `excluded_fields` | string | none | Dot-separated list of fields to exclude from downsampling |

### Filtering parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `tag_values` | string | none | Tag filters. Format: `tag:value1@value2@value3` for multiple values |
| `offset` | string | "0" | Time offset to apply to the window |

### Advanced parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `target_database` | string | "default" | Database for storing downsampled data |
| `max_retries` | integer | 5 | Maximum number of retries for write operations |
| `batch_size` | string | "30d" | Time interval for batch processing (HTTP mode only) |
| `config_file_path` | string | none | Path to TOML config file relative to PLUGIN_DIR |

### Metadata columns

Each downsampled record includes three additional metadata columns:
- `record_count`—the number of original points compressed into this single downsampled row
- `time_from`—the minimum timestamp among the original points in the interval  
- `time_to`—the maximum timestamp among the original points in the interval

## Requirements

### Software requirements
- InfluxDB 3 Core or Enterprise with Processing Engine enabled
- Python packages: No additional packages required

### Installation steps

1. Start InfluxDB 3 with plugin support:
   ```bash
   influxdb3 serve \
     --node-id node0 \
     --object-store file \
     --data-dir ~/.influxdb3 \
     --plugin-dir ~/.plugins
   ```

2. No additional Python packages required for this plugin.

## Trigger setup

### Scheduled downsampling

Run downsampling periodically on historical data:

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename gh:influxdata/downsampler/downsampler.py \
  --trigger-spec "every:1h" \
  --trigger-arguments 'source_measurement=cpu_metrics,target_measurement=cpu_hourly,interval=1h,window=6h,calculations=avg,specific_fields=usage_user.usage_system' \
  cpu_hourly_downsample
```

### On-demand downsampling

Trigger downsampling via HTTP requests:

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename gh:influxdata/downsampler/downsampler.py \
  --trigger-spec "request:downsample" \
  downsample_api
```

## Example usage

### Example 1: CPU metrics hourly aggregation

Downsample CPU usage data from 1-minute intervals to hourly averages:

```bash
# Create the trigger
influxdb3 create trigger \
  --database system_metrics \
  --plugin-filename gh:influxdata/downsampler/downsampler.py \
  --trigger-spec "every:1h" \
  --trigger-arguments 'source_measurement=cpu,target_measurement=cpu_hourly,interval=1h,window=6h,calculations=avg,specific_fields=usage_user.usage_system.usage_idle' \
  cpu_hourly_downsample

# Write test data
influxdb3 write \
  --database system_metrics \
  "cpu,host=server1 usage_user=45.2,usage_system=12.1,usage_idle=42.7"

# Query downsampled data (after trigger runs)
influxdb3 query \
  --database system_metrics \
  "SELECT * FROM cpu_hourly WHERE time >= now() - 1d"
```

### Expected output
```
host    | usage_user | usage_system | usage_idle | record_count | time_from           | time_to             | time
--------|------------|--------------|------------|--------------|---------------------|---------------------|-----
server1 | 44.8       | 11.9         | 43.3       | 60           | 2024-01-01T00:00:00Z| 2024-01-01T00:59:59Z| 2024-01-01T01:00:00Z
```

**Aggregation details:**
- Before: 60 individual CPU measurements over 1 hour
- After: 1 aggregated measurement with averages and metadata
- Metadata shows original record count and time range

### Example 2: Multi-field aggregation with different functions

Apply different aggregation functions to different fields:

```bash
# Create trigger with field-specific aggregations
influxdb3 create trigger \
  --database sensors \
  --plugin-filename gh:influxdata/downsampler/downsampler.py \
  --trigger-spec "every:10min" \
  --trigger-arguments 'source_measurement=environment,target_measurement=environment_10min,interval=10min,window=30min,calculations=temperature:avg.humidity:avg.pressure:max' \
  env_multi_agg

# Write data with various sensor readings
influxdb3 write \
  --database sensors \
  "environment,location=office temperature=22.5,humidity=45.2,pressure=1013.25"

# Query aggregated data
influxdb3 query \
  --database sensors \
  "SELECT * FROM environment_10min WHERE time >= now() - 1h"
```

### Expected output
```
location | temperature | humidity | pressure | record_count | time
---------|-------------|----------|----------|--------------|-----
office   | 22.3        | 44.8     | 1015.1   | 10           | 2024-01-01T00:10:00Z
```

### Example 3: HTTP API downsampling with backfill

Use HTTP API for on-demand downsampling with historical data:

```bash
# Send HTTP request for backfill downsampling
curl -X POST http://localhost:8181/api/v3/engine/downsample \
  --header "Authorization: Bearer YOUR_TOKEN" \
  --data '{
    "source_measurement": "metrics",
    "target_measurement": "metrics_daily",
    "target_database": "analytics",
    "interval": "1d",
    "batch_size": "7d",
    "calculations": [["cpu_usage", "avg"], ["memory_usage", "max"], ["disk_usage", "avg"]],
    "backfill_start": "2024-01-01T00:00:00Z",
    "backfill_end": "2024-01-31T00:00:00Z",
    "max_retries": 3
  }'
```

## Using TOML Configuration Files

This plugin supports using TOML configuration files for complex configurations.

### Important Requirements

**To use TOML configuration files, you must set the `PLUGIN_DIR` environment variable in the InfluxDB 3 host environment:**

```bash
PLUGIN_DIR=~/.plugins influxdb3 serve --node-id node0 --object-store file --data-dir ~/.influxdb3 --plugin-dir ~/.plugins
```

### Example TOML Configuration

```toml
# downsampling_config_scheduler.toml
source_measurement = "cpu"
target_measurement = "cpu_hourly"
target_database = "analytics"
interval = "1h"
window = "6h"
calculations = "avg"
specific_fields = "usage_user.usage_system.usage_idle"
max_retries = 3

[tag_values]
host = ["server1", "server2", "server3"]
```

### Create trigger using TOML config

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename downsampler.py \
  --trigger-spec "every:1h" \
  --trigger-arguments config_file_path=downsampling_config_scheduler.toml \
  downsample_trigger
```

## Code overview

### Files

- `downsampler.py`: The main plugin code containing handlers for scheduled and HTTP-triggered downsampling
- `downsampling_config_scheduler.toml`: Example TOML configuration file for scheduled triggers

### Logging

Logs are stored in the `_internal` database (or the database where the trigger is created) in the `system.processing_engine_logs` table. To view logs:

```bash
influxdb3 query --database _internal "SELECT * FROM system.processing_engine_logs WHERE trigger_name = 'your_trigger_name'"
```

Log columns:
- **event_time**: Timestamp of the log event (with nanosecond precision)
- **trigger_name**: Name of the trigger that generated the log
- **log_level**: Severity level (INFO, WARN, ERROR)
- **log_text**: Message describing the action or error with unique task_id for traceability

### Main functions

#### `process_scheduled_call(influxdb3_local, call_time, args)`
Handles scheduled downsampling tasks.
Queries historical data within the specified window and applies aggregation functions.

Key operations:
1. Parses configuration from arguments or TOML file
2. Queries source measurement with optional tag filters
3. Applies time-based aggregation with specified functions
4. Writes downsampled data with metadata columns

#### `process_http_request(influxdb3_local, request_body, args)`
Handles HTTP-triggered on-demand downsampling.
Processes batch downsampling with configurable time ranges for backfill scenarios.

Key operations:
1. Parses JSON request body parameters
2. Processes data in configurable time batches
3. Applies aggregation functions to historical data
4. Returns processing statistics and results

#### `aggregate_data(data, interval, calculations)`
Core aggregation engine that applies statistical functions to time-series data.

Supported aggregation functions:
- `avg`: Average value
- `sum`: Sum of values
- `min`: Minimum value
- `max`: Maximum value
- `derivative`: Rate of change
- `median`: Median value

## Troubleshooting

### Common issues

#### Issue: No data in target measurement
**Solution**: Check that source measurement exists and contains data in the specified time window:
```bash
influxdb3 query --database mydb "SELECT COUNT(*) FROM source_measurement WHERE time >= now() - 1h"
```

#### Issue: Aggregation function not working
**Solution**: Verify field names and aggregation syntax. Use SHOW FIELD KEYS to check available fields:
```bash
influxdb3 query --database mydb "SHOW FIELD KEYS FROM source_measurement"
```

#### Issue: Tag filters not applied
**Solution**: Check tag value format. Use @ separator for multiple values:
```bash
--trigger-arguments 'tag_values=host:server1@server2@server3'
```

#### Issue: HTTP endpoint not accessible
**Solution**: Verify the trigger was created with correct request specification:
```bash
influxdb3 list triggers --database mydb
```

### Debugging tips

1. **Check execution logs** with task ID filtering:
   ```bash
   influxdb3 query --database _internal \
     "SELECT * FROM system.processing_engine_logs WHERE log_text LIKE '%task_id%' ORDER BY event_time DESC LIMIT 10"
   ```

2. **Test with smaller time windows** for debugging:
   ```bash
   --trigger-arguments 'window=5min,interval=1min'
   ```

3. **Verify field types** before aggregation:
   ```bash
   influxdb3 query --database mydb "SELECT * FROM source_measurement LIMIT 1"
   ```

### Performance considerations

- **Batch processing**: Use appropriate batch_size for HTTP requests to balance memory usage and performance
- **Field filtering**: Use specific_fields to process only necessary data
- **Retry logic**: Configure max_retries based on network reliability
- **Metadata overhead**: Metadata columns add ~20% storage overhead but provide valuable debugging information
- **Index optimization**: Tag filters are more efficient than field filters for large datasets

## Report an issue

For plugin issues, see the Plugins repository [issues page](https://github.com/influxdata/influxdb3_plugins/issues).

## Find support for {{% product-name %}}

The [InfluxDB Discord server](https://discord.gg/9zaNCW2PRT) is the best place to find support for InfluxDB 3 Core and InfluxDB 3 Enterprise.
For other InfluxDB versions, see the [Support and feedback](#bug-reports-and-feedback) options.