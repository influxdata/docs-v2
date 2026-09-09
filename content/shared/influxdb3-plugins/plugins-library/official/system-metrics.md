<!-- BEGIN GENERATED PLUGIN CONTENT -->
<!-- vale off -->
The System Metrics Plugin provides comprehensive system monitoring capabilities for {{% product-name %}}, collecting CPU, memory, disk, and network metrics from the host system. Monitor detailed performance insights including per-core CPU statistics, memory usage breakdowns, disk I/O performance, and network interface statistics. Features configurable metric collection with robust error handling and retry logic for reliable monitoring.

## Configuration

Plugin parameters may be specified as key-value pairs in the `--trigger-arguments` flag (CLI) or in the `trigger_arguments` field (API) when creating a trigger. Some plugins support TOML configuration files, which can be specified using the plugin's `config_file_path` parameter.

If a plugin supports multiple trigger specifications, some parameters may depend on the trigger specification that you use.

### Plugin metadata

This plugin includes a JSON metadata schema in its docstring that defines supported trigger types and configuration parameters. This metadata enables the [InfluxDB 3 Explorer](https://docs.influxdata.com/influxdb3/explorer/) UI to display and configure the plugin.

### Optional parameters

| Parameter         | Type    | Default     | Description                                                                                      |
|-------------------|---------|-------------|--------------------------------------------------------------------------------------------------|
| `hostname`        | string  | `localhost` | Hostname to tag all metrics with for system identification                                       |
| `include_cpu`     | boolean | `true`      | Include comprehensive CPU metrics collection (overall and per-core statistics)                   |
| `include_memory`  | boolean | `true`      | Include memory metrics collection (RAM usage, swap statistics, page faults)                      |
| `include_disk`    | boolean | `true`      | Include disk metrics collection (partition usage, I/O statistics, performance)                   |
| `include_network` | boolean | `true`      | Include network metrics collection (interface statistics and error counts)                       |
| `max_retries`     | integer | `3`         | Retry attempts per metric type; the group is skipped and the run continues once they are used up |

*Note: This plugin has no required parameters. All parameters have sensible defaults.*

Boolean parameters accept `true`/`false`, `1`/`0`, `yes`/`no`, and `on`/`off`. A value the plugin cannot interpret is reported in the logs and the run collects nothing, so fix the trigger arguments and the next run recovers.

### TOML configuration

| Parameter          | Type   | Default | Description                                                                      |
|--------------------|--------|---------|----------------------------------------------------------------------------------|
| `config_file_path` | string | none    | TOML config file path relative to `PLUGIN_DIR` (required for TOML configuration) |

*To use a TOML configuration file, set the `PLUGIN_DIR` environment variable and specify the `config_file_path` in the trigger arguments.* This is in addition to the `--plugin-dir` flag when starting {{% product-name %}}. Relative paths are resolved against the first directory that is set: `PLUGIN_DIR`, then `INFLUXDB3_PLUGIN_DIR`, then the parent of `VIRTUAL_ENV`. Only that directory is used — the file is not looked up in the remaining ones.

Values in the TOML file override the inline trigger arguments. If the file cannot be read, the plugin logs an error and collects metrics using the inline arguments and defaults.

#### Example TOML configuration

[system_metrics_config_scheduler.toml](https://github.com/influxdata/influxdb3_plugins/blob/master/influxdata/system_metrics/system_metrics_config_scheduler.toml)

For more information on using TOML configuration files, see the Using TOML Configuration Files section in the [influxdb3_plugins/README.md](https://github.com/influxdata/influxdb3_plugins/blob/master/README.md).

## Software Requirements

- **{{% product-name %}}**: with the Processing Engine enabled.
- **Python packages**: `influxdata-plugin-utils>=0.3.0`, `psutil`

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
   influxdb3 install package "influxdata-plugin-utils>=0.3.0"
   influxdb3 install package psutil
   ```
## Trigger setup

### Basic Scheduled Trigger

```bash
influxdb3 create trigger \
  --database system_monitoring \
  --path "gh:influxdata/system_metrics/system_metrics.py" \
  --trigger-spec "every:30s" \
  system_metrics_trigger
```
### Using Configuration File

```bash
influxdb3 create trigger \
  --database system_monitoring \
  --path "gh:influxdata/system_metrics/system_metrics.py" \
  --trigger-spec "every:1m" \
  --trigger-arguments config_file_path=system_metrics_config_scheduler.toml \
  system_metrics_config_trigger
```
### Custom Configuration

```bash
influxdb3 create trigger \
  --database system_monitoring \
  --path "gh:influxdata/system_metrics/system_metrics.py" \
  --trigger-spec "every:30s" \
  --trigger-arguments hostname=web-server-01,include_disk=false,max_retries=5 \
  system_metrics_custom_trigger
```
## Example usage

### Monitor Web Server Performance

```bash
# Create trigger for web server monitoring every 15 seconds
influxdb3 create trigger \
  --database web_monitoring \
  --path "gh:influxdata/system_metrics/system_metrics.py" \
  --trigger-spec "every:15s" \
  --trigger-arguments hostname=web-server-01,include_network=true \
  web_server_metrics
```
### Database Server Monitoring

```bash
# Focus on CPU and disk metrics for database server
influxdb3 create trigger \
  --database db_monitoring \
  --path "gh:influxdata/system_metrics/system_metrics.py" \
  --trigger-spec "every:30s" \
  --trigger-arguments hostname=db-primary,include_disk=true,include_cpu=true,include_network=false \
  database_metrics
```
### High-Frequency System Monitoring

```bash
# Collect all metrics every 10 seconds with higher retry tolerance
influxdb3 create trigger \
  --database system_monitoring \
  --path "gh:influxdata/system_metrics/system_metrics.py" \
  --trigger-spec "every:10s" \
  --trigger-arguments hostname=critical-server,max_retries=10 \
  high_freq_metrics
```
### Query collected metrics

This plugin collects system metrics automatically. After the trigger runs, query to view the collected data:

```bash
influxdb3 query \
  --database system_monitoring \
  "SELECT * FROM system_cpu WHERE time >= now() - interval '5 minutes' LIMIT 5"
```
**Expected output**

 +------+--------+-------+--------+------+--------+-------+--------+-------+-------+------------+------------------+
 | host | cpu    | user  | system | idle | iowait | nice  | irq    | load1 | load5 | load15     | time             |
 +------+--------+-------+--------+------+--------+-------+--------+-------+-------+------------+------------------+
 | srv1 | total  | 12.5  | 5.3    | 81.2 | 0.8    | 0.0   | 0.2    | 0.85  | 0.92  | 0.88       | 2024-01-15 10:00 |
 | srv1 | total  | 13.1  | 5.5    | 80.4 | 0.7    | 0.0   | 0.3    | 0.87  | 0.93  | 0.88       | 2024-01-15 10:01 |
 | srv1 | total  | 11.8  | 5.1    | 82.0 | 0.9    | 0.0   | 0.2    | 0.83  | 0.91  | 0.88       | 2024-01-15 10:02 |
 | srv1 | total  | 14.2  | 5.8    | 79.0 | 0.8    | 0.0   | 0.2    | 0.89  | 0.92  | 0.88       | 2024-01-15 10:03 |
 | srv1 | total  | 12.9  | 5.4    | 80.6 | 0.9    | 0.0   | 0.2    | 0.86  | 0.92  | 0.88       | 2024-01-15 10:04 |
 +------+--------+-------+--------+------+--------+-------+--------+-------+-------+------------+------------------+

## Code overview

### Main Functions

#### `process_scheduled_call()`

The main entry point for scheduled triggers. Loads the configuration, then runs each enabled collector and writes the lines it built. A collector is retried up to `max_retries` times, and its lines are written only once it completes.

```python
def process_scheduled_call(influxdb3_local, call_time, args=None):
    config = _load_config(influxdb3_local, args, task_id)

    for config_key, metric_type, collect in _COLLECTORS:
        if not config[config_key]:
            continue
        lines = _collect_with_retry(
            influxdb3_local, collect, metric_type, hostname, max_retries, task_id
        )
        write_data(influxdb3_local, lines, batch=False, retries=0)
```
### Measurements and Fields

#### system_cpu

Overall CPU statistics and metrics:

- **Tags**: `host`, `cpu=total`
- **Fields**: `user`, `system`, `idle`, `iowait`, `nice`, `irq`, `softirq`, `steal`, `guest`, `guest_nice`, `frequency_current`, `frequency_min`, `frequency_max`, `ctx_switches`, `interrupts`, `soft_interrupts`, `syscalls`, `load1`, `load5`, `load15`

The state shares (`user` through `guest_nice`) are derived from the change in the CPU time counters between two consecutive runs, so each value covers the interval between the previous run and the current one. They are absent on the first run after the trigger is created or restarted; the remaining fields are written from the first run on.

#### system_cpu_cores

Per-core CPU statistics:

- **Tags**: `host`, `core` (core number)
- **Fields**: `usage`, `user`, `system`, `idle`, `iowait`, `nice`, `irq`, `softirq`, `steal`, `guest`, `guest_nice`, `frequency_current`, `frequency_min`, `frequency_max`

Shares are derived the same way as in `system_cpu`; `usage` is the busy share of the core, everything except `idle` and `iowait`.

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

Disk performance rates, derived from the change in the I/O counters between two consecutive runs of the plugin:

- **Tags**: `host`, `device`
- **Fields**: `read_bytes_per_sec`, `write_bytes_per_sec`, `read_iops`, `write_iops`, `avg_read_latency_ms`, `avg_write_latency_ms`, `util_percent`

Each value covers the interval between the previous run and the current one, so the shorter the trigger interval, the finer the resolution. A device gets no line when there is nothing to compare against: on the first run after the trigger is created or restarted, and when its counters were reset (for example after the device was re-attached).

#### system_network

Network interface statistics:

- **Tags**: `host`, `interface`
- **Fields**: `bytes_sent`, `bytes_recv`, `packets_sent`, `packets_recv`, `errin`, `errout`, `dropin`, `dropout`

## Troubleshooting

### Common issues

#### Issue: Permission errors for disk I/O metrics

**Solution**: The plugin will continue collecting other metrics even if some require elevated permissions. Run InfluxDB with appropriate permissions if disk I/O metrics are required.

#### Issue: Missing Python packages

**Solution**: Install the required packages:

```bash
influxdb3 install package "influxdata-plugin-utils>=0.3.0"
influxdb3 install package psutil
```
#### Issue: No `system_disk_performance` data, or CPU shares are missing

**Solution**: Both are derived from two consecutive runs. Wait for the second run of the trigger; if the values stay missing, check the logs for `No previous disk I/O sample` and `No previous CPU sample`, which repeat when the cached counters are lost on every run.

#### Issue: One metric group is missing while the others are written

**Solution**: A collector that keeps failing is skipped so the rest of the run survives. Look for `Failed to collect <type> metrics after N retries` in the logs, followed by `skipped after repeated failures`, which names every group left out of that run.

#### Issue: No metrics at all and a configuration error in the logs

**Solution**: An invalid parameter value stops the run before any collection. Look for `Failed to load configuration` in the logs, which names the offending value, and fix the trigger arguments. A TOML file that cannot be read is a separate case: it is logged as `Failed to apply config file` and collection continues with the inline arguments.

#### Issue: High CPU usage from plugin

**Solution**: Increase the trigger interval (for example, from `every:10s` to `every:30s`). Disable unnecessary metric types. Reduce the number of disk partitions monitored.

### Viewing Logs

Logs are stored in the trigger's database in the `system.processing_engine_logs` table:

```bash
influxdb3 query \
  --database YOUR_DATABASE \
  "SELECT * FROM system.processing_engine_logs WHERE trigger_name = 'system_metrics_trigger' ORDER BY event_time DESC LIMIT 10"
```
### Verifying Data Collection

Check that metrics are being collected:

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
