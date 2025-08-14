InfluxDB 3 can collect and send usage telemetry data to help improve the product. This page describes what telemetry data is collected, when it's collected, how it's transmitted, and how to disable it.

## What data is collected

{{< product-name >}} collects the following telemetry data:

### System metrics

- **CPU utilization**: Process-specific CPU usage
- **Memory usage**: Process memory consumption in MB
- **Cores**: Number of CPU cores in use
- **OS**: Operating system information
- **Version**: {{< product-name >}} version
- **Uptime**: Server uptime in seconds

### Write metrics

- **Write requests**: Number of write operations 
- **Write lines**: Number of lines written 
- **Write bytes**: Amount of data written in MB

### Query metrics

- **Query requests**: Number of query operations

### Storage metrics

- **Parquet file count**: Number of Parquet files
- **Parquet file size**: Total size of Parquet files in MB 
- **Parquet row count**: Total number of rows in Parquet files

### Processing engine metrics

- **WAL triggers**: Write-Ahead Log trigger counts
- **Schedule triggers**: Scheduled processing trigger counts 
- **Request triggers**: Request-based processing trigger counts 

### Instance information

- **Instance ID**: Unique identifier for the server instance
- **Cluster UUID**: Unique identifier for the cluster
- **Storage type**: Type of object storage being used
{{% show-in "core" %}}
- **Product type**: "Core"
{{% /show-in %}}
{{% show-in "enterprise" %}}
- **Product type**: "Enterprise"
{{% /show-in %}}

## Collection frequency

- **System metrics** (CPU, memory): Collected every 60 seconds
- **Write and query metrics**: Collected per operation, rolled up every 60 seconds
- **Storage and processing engine metrics**: Collected at snapshot time (when available)
- **Instance information**: Static data collected once

Telemetry data is transmitted once per hour.

## Disable telemetry

Disables sending telemetry data to InfluxData.

**Default:** `false`

| influxdb3 flag | Environment variable | 
| :------------- | :------------------- | 
| `--disable-telemetry-upload` | `INFLUXDB3_TELEMETRY_DISABLE_UPLOAD` |

#### Command line flag
```sh
influxdb3 serve --disable-telemetry-upload
```

#### Environment variable
```sh
export INFLUXDB3_TELEMETRY_DISABLE_UPLOAD=true
```

When telemetry is disabled, no usage data is collected or transmitted.

## Data handling

The telemetry data is used by InfluxData to understand product usage patterns, improve product performance and reliability, prioritize feature development, and identify/resolve issues. No personally identifiable information (PII) is collected. 

## Privacy and security

All telemetry data is transmitted securely via HTTPS. No database contents, queries, or user data is collected; only operational metrics and system information is transmitted.

All data collection follows InfluxData's privacy policy.