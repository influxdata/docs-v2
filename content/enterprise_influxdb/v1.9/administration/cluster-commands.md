---
title: Manage InfluxDB Enterprise clusters
description: >
  Use the `influxd-ctl` and `influx` command line tools to manage InfluxDB Enterprise clusters and data.
aliases:
    - /enterprise/v1.8/features/cluster-commands/
    - /enterprise_influxdb/v1.9/features/cluster-commands/
menu:
  enterprise_influxdb_1_9:
    name: Manage clusters
    weight: 40
    parent: Administration
---

Use the following tools to manage and interact with your InfluxDB Enterprise clusters:

- To manage your clusters, use [`influxd-ctl` cluster management utility](#influxd-ctl-cluster-management-utility)
- To manage nodes, back up and restore data, and rebalance clusters, use [`influx` command line interface (CLI)](#influx-command-line-interface-cli)

## `influxd-ctl` cluster management utility

For more information, see [`influxd-ctl`](/enterprise_influxdb/v1.9/tools/influxd-ctl/).

## `influx` command line interface (CLI)

Use the `influx` command line interface (CLI) to write data to your cluster, query data interactively, and view query output in different formats.
The `influx` CLI is available on all [data nodes](/enterprise_influxdb/v1.9/concepts/glossary/#data-node).

See [InfluxDB command line interface (CLI/shell)](/enterprise_influxdb/v1.9/tools/shell/)
for details on using the `influx` command line interface utility.
