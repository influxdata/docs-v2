The System Metrics Plugin provides comprehensive system monitoring capabilities for InfluxDB 3, collecting CPU, memory, disk, and network metrics from the host system.
Monitor detailed performance insights including per-core CPU statistics, memory usage breakdowns, disk I/O performance, and network interface statistics.
Features configurable metric collection with robust error handling and retry logic for reliable monitoring.

## Configuration

### Required parameters

No required parameters - all system metrics are collected by default with sensible defaults.

### System monitoring parameters

| Parameter         | Type    | Default     | Description                                                                    |
|-------------------|---------|-------------|--------------------------------------------------------------------------------|
| `hostname`        | string  | `localhost` | Hostname to tag all metrics with for system identification                     |
| `include_cpu`     | boolean | `true`      | Include comprehensive CPU metrics collection (overall and per-core statistics) |
| `include_memory`  | boolean | `true`      | Include memory metrics collection (RAM usage, swap statistics, page faults)    |
| `include_disk`    | boolean | `true`      | Include disk metrics collection (partition usage, I/O statistics, performance) |
| `include_network` | boolean | `true`      | Include network metrics collection (interface statistics and error counts)     |
| `max_retries`     | integer | `3`         | Maximum retry attempts on failure with graceful error handling                 |

### TOML configuration

| Parameter          | Type   | Default | Description                                                                      |
|--------------------|--------|---------|----------------------------------------------------------------------------------|
| `config_file_path` | string | none    | TOML config file path relative to `PLUGIN_DIR` (required for TOML configuration) |

*To use a TOML configuration file, set the `PLUGIN_DIR` environment variable and specify the `config_file_path` in the trigger arguments.* This is in addition to the `--plugin-dir` flag when starting InfluxDB 3.

#### Example TOML configuration

[system_metrics_config_scheduler.toml](https://github.com/influxdata/influxdb3_plugins/blob/master/influxdata/system_metrics/system_metrics_config_scheduler.toml)

For more information on using TOML configuration files, see the Using TOML Configuration Files section in the [influxdb3_plugins
/README.md](https://github.com/influxdata/influxdb3_plugins/blob/master/README.md).

## Installation steps

1. Start {{% product-name %}} with the Processing Engine enabled (`--plugin-dir /path/to/plugins`)

2. Install required Python packages:
   
   - `psutil` (for system metrics collection)

   ```bash
   influxdb3 install package psutil
   ```

## Trigger setup

### Basic scheduled trigger

Monitor system performance every 30 seconds:

```bash
influxdb3 create trigger \
  --database system_monitoring \
  --plugin-filename gh:influxdata/system_metrics/system_metrics.py \
  --trigger-spec "every:30s" \
  system_metrics_trigger
```

### Custom configuration

Monitor specific metrics with custom hostname:

```bash
influxdb3 create trigger \
  --database system_monitoring \
  --plugin-filename gh:influxdata/system_metrics/system_metrics.py \
  --trigger-spec "every:30s" \
  --trigger-arguments hostname=web-server-01,include_disk=false,max_retries=5 \
  system_metrics_custom_trigger
```

## Example usage

### Example 1: Web server monitoring

Monitor web server performance every 15 seconds with network statistics:

```bash
# Create trigger for web server monitoring
influxdb3 create trigger \
  --database web_monitoring \
  --plugin-filename gh:influxdata/system_metrics/system_metrics.py \
  --trigger-spec "every:15s" \
  --trigger-arguments hostname=web-server-01,include_network=true \
  web_server_metrics

# Query recent CPU metrics
influxdb3 query \
  --database web_monitoring \
  "SELECT * FROM system_cpu WHERE time >= now() - interval '5 minutes' LIMIT 5"
```

### Expected output
```
+---------------+-------+------+--------+------+--------+-------+-------+-----------+------------------+
| host          | cpu   | user | system | idle | iowait | nice  | load1 | load5     | time             |
+---------------+-------+------+--------+------+--------+-------+-------+-----------+------------------+
| web-server-01 | total | 12.5 | 5.3    | 81.2 | 0.8    | 0.0   | 0.85  | 0.92      | 2024-01-15 10:00 |
| web-server-01 | total | 13.1 | 5.5    | 80.4 | 0.7    | 0.0   | 0.87  | 0.93      | 2024-01-15 10:01 |
| web-server-01 | total | 11.8 | 5.1    | 82.0 | 0.9    | 0.0   | 0.83  | 0.91      | 2024-01-15 10:02 |
+---------------+-------+------+--------+------+--------+-------+-------+-----------+------------------+
```

### Example 2: Database server monitoring

Focus on CPU and disk metrics for database server:

```bash
# Create trigger for database server
influxdb3 create trigger \
  --database db_monitoring \
  --plugin-filename gh:influxdata/system_metrics/system_metrics.py \
  --trigger-spec "every:30s" \
  --trigger-arguments hostname=db-primary,include_disk=true,include_cpu=true,include_network=false \
  database_metrics

# Query disk usage
influxdb3 query \
  --database db_monitoring \
  "SELECT * FROM system_disk_usage WHERE host = 'db-primary'"
```

### Example 3: High-frequency monitoring

Collect all metrics every 10 seconds with higher retry tolerance:

```bash
# Create high-frequency monitoring trigger
influxdb3 create trigger \
  --database system_monitoring \
  --plugin-filename gh:influxdata/system_metrics/system_metrics.py \
  --trigger-spec "every:10s" \
  --trigger-arguments hostname=critical-server,max_retries=10 \
  high_freq_metrics
```

## Code overview

### Files

- `system_metrics.py`: The main plugin code containing system metrics collection logic
- `system_metrics_config_scheduler.toml`: Example TOML configuration file for scheduled triggers

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
The main entry point for scheduled triggers. Collects system metrics based on configuration and writes them to InfluxDB.

Key operations:
1. Parses configuration from arguments
2. Collects CPU, memory, disk, and network metrics based on configuration
3. Writes metrics to InfluxDB with proper error handling and retry logic

#### `collect_cpu_metrics(influxdb3_local, hostname)`
Collects CPU utilization and performance metrics including per-core statistics and system load averages.

#### `collect_memory_metrics(influxdb3_local, hostname)`
Collects memory usage statistics including RAM, swap, and page fault information.

#### `collect_disk_metrics(influxdb3_local, hostname)`
Collects disk usage and I/O statistics for all mounted partitions.

#### `collect_network_metrics(influxdb3_local, hostname)`
Collects network interface statistics including bytes transferred and error counts.

### Measurements and Fields

#### system_cpu

Overall CPU statistics and metrics:
- **Tags**: `host`, `cpu=total`
- **Fields**: `user`, `system`, `idle`, `iowait`, `nice`, `irq`, `softirq`, `steal`, `guest`, `guest_nice`, `frequency_current`, `frequency_min`, `frequency_max`, `ctx_switches`, `interrupts`, `soft_interrupts`, `syscalls`, `load1`, `load5`, `load15`

#### system_cpu_cores

Per-core CPU statistics:
- **Tags**: `host`, `core` (core number)
- **Fields**: `usage`, `user`, `system`, `idle`, `iowait`, `nice`, `irq`, `softirq`, `steal`, `guest`, `guest_nice`, `frequency_current`, `frequency_min`, `frequency_max`

#### system_memory

System memory statistics:
- **Tags**: `host`
- **Fields**: `total`, `available`, `used`, `free`, `active`, `inactive`, `buffers`, `cached`, `shared`, `slab`, `percent`

#### system_swap

Swap memory statistics:
- **Tags**: `host`
- **Fields**: `total`, `used`, `free`, `percent`, `sin`, `sout`

#### system_memory_faults

Memory page fault information (when available):
- **Tags**: `host`
- **Fields**: `page_faults`, `major_faults`, `minor_faults`, `rss`, `vms`, `dirty`, `uss`, `pss`

#### system_disk_usage

Disk partition usage:
- **Tags**: `host`, `device`, `mountpoint`, `fstype`
- **Fields**: `total`, `used`, `free`, `percent`

#### system_disk_io

Disk I/O statistics:
- **Tags**: `host`, `device`
- **Fields**: `reads`, `writes`, `read_bytes`, `write_bytes`, `read_time`, `write_time`, `busy_time`, `read_merged_count`, `write_merged_count`

#### system_disk_performance

Calculated disk performance metrics:
- **Tags**: `host`, `device`
- **Fields**: `read_bytes_per_sec`, `write_bytes_per_sec`, `read_iops`, `write_iops`, `avg_read_latency_ms`, `avg_write_latency_ms`, `util_percent`

#### system_network

Network interface statistics:
- **Tags**: `host`, `interface`
- **Fields**: `bytes_sent`, `bytes_recv`, `packets_sent`, `packets_recv`, `errin`, `errout`, `dropin`, `dropout`

## Troubleshooting

### Common issues

#### Issue: Permission errors on disk I/O metrics
Some disk I/O metrics may require elevated permissions.

**Solution**: The plugin will continue collecting other metrics even if some require elevated permissions. Consider running InfluxDB 3 with appropriate permissions if disk I/O metrics are critical.

#### Issue: Missing psutil library
```
ERROR: No module named 'psutil'
```

**Solution**: Install the psutil package:
```bash
influxdb3 install package psutil
```

#### Issue: High CPU usage from plugin
If the plugin causes high CPU usage, consider:
- Increasing the trigger interval (for example, from `every:10s` to `every:30s`)
- Disabling unnecessary metric types
- Reducing the number of disk partitions monitored

#### Issue: No data being collected
**Solution**: 
1. Check that the trigger is active:
   ```bash
   influxdb3 query --database _internal "SELECT * FROM system.processing_engine_logs WHERE trigger_name = 'your_trigger_name'"
   ```
2. Verify system permissions allow access to system metrics
3. Check that the psutil package is properly installed

### Debugging tips

1. **Check recent metrics collection**:
   ```bash
   # List all system metric measurements
   influxdb3 query \
     --database system_monitoring \
     "SHOW MEASUREMENTS WHERE measurement =~ /^system_/"

   # Check recent CPU metrics
   influxdb3 query \
     --database system_monitoring \
     "SELECT COUNT(*) FROM system_cpu WHERE time >= now() - interval '1 hour'"
   ```

2. **Monitor plugin logs**:
   ```bash
   influxdb3 query \
     --database _internal \
     "SELECT * FROM system.processing_engine_logs WHERE trigger_name = 'system_metrics_trigger' ORDER BY time DESC LIMIT 10"
   ```

3. **Test metric collection manually**:
   ```bash
   influxdb3 test schedule_plugin \
     --database system_monitoring \
     --schedule "0 0 * * * ?" \
     system_metrics.py
   ```

### Performance considerations

- The plugin collects comprehensive system metrics efficiently using the psutil library
- Metric collection is optimized to minimize system overhead
- Error handling and retry logic ensure reliable operation
- Configurable metric types allow focusing on relevant metrics only
## Report an issue

For plugin issues, see the Plugins repository [issues page](https://github.com/influxdata/influxdb3_plugins/issues).

## Find support for {{% product-name %}}

The [InfluxDB Discord server](https://discord.gg/9zaNCW2PRT) is the best place to find support for InfluxDB 3 Core and InfluxDB 3 Enterprise.
For other InfluxDB versions, see the [Support and feedback](#bug-reports-and-feedback) options.