---
title: InfluxDB ports
description: Enabled and disabled ports in InfluxDB.
menu:
  influxdb_1_8:
    name: Ports
    weight: 50
    parent: Administration
---

## Enabled ports

### `8086`
The default port that runs the InfluxDB HTTP service.
[Configure this port](/influxdb/v1.8/administration/config#bind-address-8086)
in the configuration file.

**Resources** [API Reference](/influxdb/v1.8/tools/api/)

### 8088
The default port used by the RPC service for RPC calls made by the CLI for backup and restore operations (`influxdb backup` and `influxd restore`).
[Configure this port](/influxdb/v1.8/administration/config#bind-address-127-0-0-1-8088)
in the configuration file.

**Resources** [Backup and Restore](/influxdb/v1.8/administration/backup_and_restore/)

## Disabled ports

### 2003

The default port that runs the Graphite service.
[Enable and configure this port](/influxdb/v1.8/administration/config#bind-address-2003)
in the configuration file.

**Resources** [Graphite README](https://github.com/influxdata/influxdb/tree/1.8/services/graphite/README.md)

### 4242

The default port that runs the OpenTSDB service.
[Enable and configure this port](/influxdb/v1.8/administration/config#bind-address-4242)
in the configuration file.

**Resources** [OpenTSDB README](https://github.com/influxdata/influxdb/tree/1.8/services/opentsdb/README.md)

### 8089

The default port that runs the UDP service.
[Enable and configure this port](/influxdb/v1.8/administration/config#bind-address-8089)
in the configuration file.

**Resources** [UDP README](https://github.com/influxdata/influxdb/tree/1.8/services/udp/README.md)

### 25826

The default port that runs the Collectd service.
[Enable and configure this port](/influxdb/v1.8/administration/config#bind-address-25826)
in the configuration file.

**Resources** [Collectd README](https://github.com/influxdata/influxdb/tree/1.8/services/collectd/README.md)
