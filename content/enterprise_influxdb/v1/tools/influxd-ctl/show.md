---
title: influxd-ctl show
description: >
  The `influxd-ctl show` command lists all nodes in an InfluxDB Enterprise v1 cluster.
menu:
  enterprise_influxdb_v1:
    parent: influxd-ctl
weight: 201
---

The `influxd-ctl show` command lists all nodes in an InfluxDB Enterprise cluster.

## Usage

```sh
influxd-ctl show 
```

#### Example output

```sh
Data Nodes
==========
ID      TCP Address    HTTP Address   Version   Labels             Passive
4       data1:8088     data1:8086     v{{< latest-patch >}}   {"az":"us-west"}   false
5       data2:8088     data2:8086     v{{< latest-patch >}}   {"az":"us-east"}   false
 
Meta Nodes
==========
ID      Raft Address   HTTP Address   Version   Labels
1       meta1:8089     meta1:8091     v{{< latest-patch >}}   {"az":"us-west"}
2       meta2:8089     meta2:8091     v{{< latest-patch >}}   {"az":"us-west"}
3       meta3:8089     meta3:8091     v{{< latest-patch >}}   {"az":"us-east"}

Raft Status
==========
Leader  meta1:8089
Peers   ["meta2:8089", "meta3:8089"]
```

## Flags

_See [`influxd-ctl` global flags](/enterprise_influxdb/v1/tools/influxd-ctl/#influxd-ctl-global-flags)._

