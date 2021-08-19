---
title: TCP and UDP ports used in InfluxDB Enterprise
description: Configure TCP and UDP ports in InfluxDB Enterprise.
menu:
  enterprise_influxdb_1_9:
    name: Configure TCP and UDP Ports
    weight: 120
    parent: Configure
aliases:
  - /enterprise/v1.9/administration/ports/
---

![InfluxDB Enterprise network diagram](/img/enterprise/1-8-network-diagram.png)

## Enabled ports

### 8086

The default port that runs the InfluxDB HTTP service.
It is used for the primary public write and query API.
Clients include the CLI, Chronograf, InfluxDB client libraries, Grafana, curl, or anything that wants to write and read time series data to and from InfluxDB.
[Configure this port](/enterprise_influxdb/v1.9/administration/config-data-nodes/#bind-address-8088)
in the data node configuration file.

_See also: [API Reference](/enterprise_influxdb/v1.9/tools/api/)._

### 8088

Data nodes listen on this port.
Primarily used by other data nodes to handle distributed reads and writes at runtime.
Used to control a data node (e.g., tell it to write to a specific shard or execute a query).
It's also used by meta nodes for cluster-type operations (e.g., tell a data node to join or leave the cluster).

This is the default port used for RPC calls used for inter-node communication and by the CLI for backup and restore operations
(`influxdb backup` and `influxd restore`).
[Configure this port](/enterprise_influxdb/v1.9/administration/config/#bind-address-127-0-0-1-8088)
in the configuration file.

This port should not be exposed outside the cluster.

_See also: [Backup and Restore](/enterprise_influxdb/v1.9/administration/backup_and_restore/)._

### 8089

Used for communcation between meta nodes.
It is used by the Raft consensus protocol.
The only clients using `8089` should be the other meta nodes in the cluster.

This port should not be exposed outside the cluster.

### 8091

Meta nodes listen on this port.
It is used for the meta service API.
Primarily used by data nodes to stay in sync about databases, retention policies, shards, users, privileges, etc.
Used by meta nodes to receive incoming connections by data nodes and Chronograf.
Clients also include the `influxd-ctl` command line tool and Chronograph,

This port should not be exposed outside the cluster.

## Disabled ports

### 2003

The default port that runs the Graphite service.
[Enable and configure this port](/enterprise_influxdb/v1.9/administration/config#bind-address-2003)
in the configuration file.

**Resources** [Graphite README](https://github.com/influxdata/influxdb/tree/1.8/services/graphite/README.md)

### 4242

The default port that runs the OpenTSDB service.
[Enable and configure this port](/enterprise_influxdb/v1.9/administration/config#bind-address-4242)
in the configuration file.

**Resources** [OpenTSDB README](https://github.com/influxdata/influxdb/tree/1.8/services/opentsdb/README.md)

### 8089

The default port that runs the UDP service.
[Enable and configure this port](/enterprise_influxdb/v1.9/administration/config#bind-address-8089)
in the configuration file.

**Resources** [UDP README](https://github.com/influxdata/influxdb/tree/1.8/services/udp/README.md)

### 25826

The default port that runs the Collectd service.
[Enable and configure this port](/enterprise_influxdb/v1.9/administration/config#bind-address-25826)
in the configuration file.

**Resources** [Collectd README](https://github.com/influxdata/influxdb/tree/1.8/services/collectd/README.md)
