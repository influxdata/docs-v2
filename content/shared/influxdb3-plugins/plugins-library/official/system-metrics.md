A comprehensive system monitoring plugin that collects CPU, memory, disk, and network metrics from the host system.
This plugin provides detailed performance insights including per-core CPU statistics, memory usage breakdowns, disk I/O performance, and network interface statistics.

## Configuration

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `hostname` | string | `localhost` | Hostname to tag metrics with |
| `include_cpu` | boolean | `true` | Include CPU metrics collection |
| `include_memory` | boolean | `true` | Include memory metrics collection |
| `include_disk` | boolean | `true` | Include disk metrics collection |
| `include_network` | boolean | `true` | Include network metrics collection |
| `max_retries` | integer | `3` | Maximum number of retry attempts on failure |
| `config_file_path` | string | None | Path to configuration file from PLUGIN_DIR env var |

## Requirements

- InfluxDB 3 Core or InfluxDB 3 Enterprise
- Python psutil library (automatically installed)

### Files

- `system_metrics.py`: Main plugin file containing metric collection logic
- `system_metrics_config_scheduler.toml`: Configuration template for scheduled triggers
- `README.md`: This documentation file

### Features

- **CPU Metrics**: Overall and per-core CPU usage, frequency, load averages, context switches, and interrupts
- **Memory Metrics**: RAM usage, swap statistics, and memory page fault information
- **Disk Metrics**: Partition usage, I/O statistics, throughput, IOPS, and latency calculations
- **Network Metrics**: Interface statistics including bytes/packets sent/received and error counts
- **Configurable Collection**: Enable/disable specific metric types via configuration
- **Robust Error Handling**: Retry logic and graceful handling of permission errors
- **Task Tracking**: UUID-based task identification for debugging and log correlation

## Trigger Setup

### Install Required Dependencies

```bash
influxdb3 install package psutil
```

### Basic Scheduled Trigger

```bash
influxdb3 create trigger \
  --database system_monitoring \
  --plugin-filename system_metrics.py \
  --trigger-spec "every:30s" \
  system_metrics_trigger
```

### Using Configuration File

```bash
influxdb3 create trigger \
  --database system_monitoring \
  --plugin-filename system_metrics.py \
  --trigger-spec "every:1m" \
  --trigger-arguments config_file_path=system_metrics_config_scheduler.toml \
  system_metrics_config_trigger
```

### Custom Configuration

```bash
influxdb3 create trigger \
  --database system_monitoring \
  --plugin-filename system_metrics.py \
  --trigger-spec "every:30s" \
  --trigger-arguments hostname=web-server-01,include_disk=false,max_retries=5 \
  system_metrics_custom_trigger
```

## Example Usage

### Monitor Web Server Performance

```bash
# Create trigger for web server monitoring every 15 seconds
influxdb3 create trigger \
  --database web_monitoring \
  --plugin-filename system_metrics.py \
  --trigger-spec "every:15s" \
  --trigger-arguments hostname=web-server-01,include_network=true \
  web_server_metrics
```

### Database Server Monitoring

```bash
# Focus on CPU and disk metrics for database server
influxdb3 create trigger \
  --database db_monitoring \
  --plugin-filename system_metrics.py \
  --trigger-spec "every:30s" \
  --trigger-arguments hostname=db-primary,include_disk=true,include_cpu=true,include_network=false \
  database_metrics
```

### High-Frequency System Monitoring

```bash
# Collect all metrics every 10 seconds with higher retry tolerance
influxdb3 create trigger \
  --database system_monitoring \
  --plugin-filename system_metrics.py \
  --trigger-spec "every:10s" \
  --trigger-arguments hostname=critical-server,max_retries=10 \
  high_freq_metrics
```

### Expected Output

After creating a trigger, you can query the collected metrics:

```bash
influxdb3 query \
  --database system_monitoring \
  "SELECT * FROM system_cpu WHERE time >= now() - interval '5 minutes' LIMIT 5"
```

#### Sample Output

```
+------+--------+-------+--------+------+--------+-------+--------+-------+-------+------------+------------------+
| host | cpu    | user  | system | idle | iowait | nice  | irq    | load1 | load5 | load15     | time             |
+------+--------+-------+--------+------+--------+-------+--------+-------+-------+------------+------------------+
| srv1 | total  | 12.5  | 5.3    | 81.2 | 0.8    | 0.0   | 0.2    | 0.85  | 0.92  | 0.88       | 2024-01-15 10:00 |
| srv1 | total  | 13.1  | 5.5    | 80.4 | 0.7    | 0.0   | 0.3    | 0.87  | 0.93  | 0.88       | 2024-01-15 10:01 |
| srv1 | total  | 11.8  | 5.1    | 82.0 | 0.9    | 0.0   | 0.2    | 0.83  | 0.91  | 0.88       | 2024-01-15 10:02 |
| srv1 | total  | 14.2  | 5.8    | 79.0 | 0.8    | 0.0   | 0.2    | 0.89  | 0.92  | 0.88       | 2024-01-15 10:03 |
| srv1 | total  | 12.9  | 5.4    | 80.6 | 0.9    | 0.0   | 0.2    | 0.86  | 0.92  | 0.88       | 2024-01-15 10:04 |
+------+--------+-------+--------+------+--------+-------+--------+-------+-------+------------+------------------+
```

## Code Overview

### Main Functions

#### `process_scheduled_call()`

The main entry point for scheduled triggers.
Collects system metrics based on configuration and writes them to InfluxDB.

```python
def process_scheduled_call(influxdb3_local, call_time, args):
    # Parse configuration
    config = parse_config(args)
    
    # Collect metrics based on configuration
    if config['include_cpu']:
        collect_cpu_metrics(influxdb3_local, config['hostname'])
    
    if config['include_memory']:
        collect_memory_metrics(influxdb3_local, config['hostname'])
    
    # ... additional metric collections
```

#### `collect_cpu_metrics()`

Collects CPU utilization and performance metrics:

```python
def collect_cpu_metrics(influxdb3_local, hostname):
    # Get overall CPU stats
    cpu_percent = psutil.cpu_percent(interval=1, percpu=False)
    cpu_times = psutil.cpu_times()
    
    # Build and write CPU metrics
    line = LineBuilder("system_cpu")
        .tag("host", hostname)
        .tag("cpu", "total")
        .float64_field("user", cpu_times.user)
        .float64_field("system", cpu_times.system)
        .float64_field("idle", cpu_times.idle)
        .time_ns(time.time_ns())
    
    influxdb3_local.write(line)
```

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

### Common Issues

#### Permission Errors

Some disk I/O metrics may require elevated permissions:

```
ERROR: [Permission denied] Unable to access disk I/O statistics
```

**Solution**: The plugin will continue collecting other metrics even if some require elevated permissions.

#### Missing psutil Library

```
ERROR: No module named 'psutil'
```

**Solution**: Install the psutil package:

```bash
influxdb3 install package psutil
```

#### High CPU Usage

If the plugin causes high CPU usage, consider:
- Increasing the trigger interval (for example, from `every:10s` to `every:30s`)
- Disabling unnecessary metric types
- Reducing the number of disk partitions monitored

### Viewing Logs

Logs are stored in the `_internal` database in the `system.processing_engine_logs` table:

```bash
influxdb3 query \
  --database _internal \
  "SELECT * FROM system.processing_engine_logs WHERE trigger_name = 'system_metrics_trigger' ORDER BY time DESC LIMIT 10"
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
## Report an issue

For plugin issues, see the Plugins repository [issues page](https://github.com/influxdata/influxdb3_plugins/issues).

## Find support for {{% product-name %}}

The [InfluxDB Discord server](https://discord.gg/9zaNCW2PRT) is the best place to find support for InfluxDB 3 Core and InfluxDB 3 Enterprise.
For other InfluxDB versions, see the [Support and feedback](#bug-reports-and-feedback) options.