The System Metrics Plugin collects comprehensive system performance metrics including CPU, memory, disk, and network statistics. 
This plugin runs on a scheduled basis to provide regular monitoring of your server infrastructure.

## Configuration

### Optional parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `hostname` | string | "localhost" | Hostname to tag system metrics with |

## Requirements

### Software requirements
- InfluxDB 3 Core or InfluxDB 3 Enterprise with Processing Engine enabled
- Python packages:
  - `psutil` (for system metrics collection)

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
   influxdb3 install package psutil
   ```

## Trigger setup

### Scheduled collection

Collect system metrics every 30 seconds:

```bash
influxdb3 create trigger \
  --database monitoring \
  --plugin-filename examples/schedule/system_metrics/system_metrics.py \
  --trigger-spec "every:30s" \
  --trigger-arguments 'hostname=server01' \
  system_monitoring
```

## Example usage

### Example: Basic system monitoring

Set up comprehensive system monitoring for a server:

```bash
# Create the monitoring trigger
influxdb3 create trigger \
  --database monitoring \
  --plugin-filename examples/schedule/system_metrics/system_metrics.py \
  --trigger-spec "every:60s" \
  --trigger-arguments 'hostname=web-server-01' \
  web_server_monitoring

# Query CPU metrics
influxdb3 query \
  --database monitoring \
  "SELECT host, cpu, user, system, idle FROM system_cpu WHERE time >= now() - interval '5 minutes'"

# Query memory metrics  
influxdb3 query \
  --database monitoring \
  "SELECT host, total, used, available, percent FROM system_memory WHERE time >= now() - interval '5 minutes'"
```

### Expected output

**CPU Metrics (`system_cpu`)**:
```
host        | cpu   | user | system | idle | time
------------|-------|------|--------|------|-----
web-server-01 | total | 15.2 | 8.1   | 76.7 | 2024-01-01T12:00:00Z
```

**Memory Metrics (`system_memory`)**:
```
host        | total      | used       | available  | percent | time
------------|------------|------------|------------|---------|-----
web-server-01 | 8589934592 | 4294967296 | 4294967296 | 50.0   | 2024-01-01T12:00:00Z
```

## Collected Measurements

### system_cpu
Overall CPU statistics and performance metrics.

**Tags:**
- `host`: Hostname (from configuration)
- `cpu`: Always "total" for aggregate metrics

**Fields:**
- `user`, `system`, `idle`, `iowait`, `nice`, `irq`, `softirq`, `steal`, `guest`, `guest_nice`: CPU time percentages
- `frequency_current`, `frequency_min`, `frequency_max`: CPU frequency in MHz
- `ctx_switches`, `interrupts`, `soft_interrupts`, `syscalls`: System call counts
- `load1`, `load5`, `load15`: System load averages

### system_cpu_cores
Per-core CPU metrics for detailed monitoring.

**Tags:**
- `host`: Hostname
- `core`: CPU core number (0, 1, 2, etc.)

**Fields:**
- `usage`: CPU usage percentage for this core
- `user`, `system`, `idle`: CPU time breakdowns per core
- `frequency_current`, `frequency_min`, `frequency_max`: Per-core frequency

### system_memory
System memory and virtual memory statistics.

**Tags:**
- `host`: Hostname

**Fields:**
- `total`, `available`, `used`, `free`: Memory amounts in bytes
- `active`, `inactive`, `buffers`, `cached`, `shared`, `slab`: Memory usage breakdown
- `percent`: Memory usage percentage

### system_swap
Swap memory usage and statistics.

**Tags:**
- `host`: Hostname

**Fields:**
- `total`, `used`, `free`: Swap amounts in bytes
- `percent`: Swap usage percentage
- `sin`, `sout`: Swap in/out operations

### system_disk_usage
Disk space usage for each mounted filesystem.

**Tags:**
- `host`: Hostname
- `device`: Device name (for example, /dev/sda1)
- `mountpoint`: Mount point path
- `fstype`: Filesystem type

**Fields:**
- `total`, `used`, `free`: Disk space in bytes
- `percent`: Disk usage percentage

### system_disk_io
Disk I/O statistics for each disk device.

**Tags:**
- `host`: Hostname
- `device`: Device name

**Fields:**
- `reads`, `writes`: Number of read/write operations
- `read_bytes`, `write_bytes`: Bytes read/written
- `read_time`, `write_time`: Time spent on I/O operations
- `busy_time`: Time disk was busy
- `read_merged_count`, `write_merged_count`: Merged I/O operations

### system_network
Network interface statistics.

**Tags:**
- `host`: Hostname
- `interface`: Network interface name (eth0, wlan0, etc.)

**Fields:**
- `bytes_sent`, `bytes_recv`: Network traffic in bytes
- `packets_sent`, `packets_recv`: Network packets
- `errin`, `errout`: Input/output errors
- `dropin`, `dropout`: Dropped packets

## Code overview

### Files

- `system_metrics.py`: Main plugin code that collects and writes system metrics

### Main functions

#### `process_scheduled_call(influxdb3_local, time, args)`
Entry point for scheduled metric collection. Orchestrates collection of all metric types.

#### `collect_cpu_metrics(influxdb3_local, hostname)`
Collects CPU statistics including overall and per-core metrics.

#### `collect_memory_metrics(influxdb3_local, hostname)`
Collects virtual memory, swap, and memory fault statistics.

#### `collect_disk_metrics(influxdb3_local, hostname)`
Collects disk usage and I/O performance metrics.

#### `collect_network_metrics(influxdb3_local, hostname)`
Collects network interface statistics.

### Logging

Logs are stored in the `_internal` database in the `system.processing_engine_logs` table. To view logs:

{{% code-placeholders "AUTH_TOKEN" %}}
```bash
influxdb3 query \
  --database _internal \
  --token AUTH_TOKEN \
  "SELECT * FROM system.processing_engine_logs WHERE trigger_name = 'system_monitoring'"
```
{{% /code-placeholders %}}

Replace {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}} with your {{% token-link "admin" %}}.

## Troubleshooting

### Common issues

#### Issue: Missing psutil module
**Solution**: Install the psutil package:
```bash
influxdb3 install package psutil
```

#### Issue: Permission denied errors for disk metrics
**Solution**: This is normal for system partitions that require elevated permissions. The plugin will skip these and continue collecting other metrics.

#### Issue: No per-core CPU metrics
**Solution**: This can happen on some systems where per-core data isn't available. The overall CPU metrics will still be collected.

### Performance considerations

- Collection frequency: 30-60 second intervals are recommended for most use cases
- The plugin handles errors gracefully and continues collecting available metrics
- Some metrics may not be available on all operating systems (the plugin handles this automatically)

## Report an issue

For plugin issues, see the Plugins repository [issues page](https://github.com/influxdata/influxdb3_plugins/issues).

## Find support for {{% product-name %}}

The [InfluxDB Discord server](https://discord.gg/9zaNCW2PRT) is the best place to find support for InfluxDB 3 Core and InfluxDB 3 Enterprise.
For other InfluxDB versions, see the [Support and feedback](#bug-reports-and-feedback) options.