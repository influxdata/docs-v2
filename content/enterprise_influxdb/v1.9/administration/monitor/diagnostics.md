---
title: Use InfluxQL for diagnostics
description: Use InfluxQL commands for diagnostics and statistics.
menu:
  enterprise_influxdb_1_9:
    name: Diagnostics
    parent: Monitor
weight: 104
---

The commands below are useful when diagnosing issues with InfluxDB Enterprise clusters.
Use the [`influx` CLI](/enterprise_influxdb/v1.9/tools/influx-cli/use-influx/) to run these commands.

### SHOW STATS 

To see node statistics, run `SHOW STATS`.
The statistics returned by `SHOW STATS` are stored in memory only,
and are reset to zero when the node is restarted.

For details on this command, see [`SHOW STATS`](/enterprise_influxdb/v1.9/query_language/spec#show-stats).

### SHOW DIAGNOSTICS 

To see node diagnostic information, run `SHOW DIAGNOSTICS`.
This returns information such as build information, uptime, hostname, server configuration, memory usage, and Go runtime diagnostics.

For details on this command, see [`SHOW DIAGNOSTICS`](/enterprise_influxdb/v1.9/query_language/spec#show-diagnostics).
