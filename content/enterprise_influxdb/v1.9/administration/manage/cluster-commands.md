---
title: Manage InfluxDB Enterprise clusters
description: >
  Use the `influxd-ctl` and `influx` command line tools to manage InfluxDB Enterprise clusters and data.
aliases:
    - /enterprise/v1.8/features/cluster-commands/
    - /enterprise_influxdb/v1.9/features/cluster-commands/
    - /enterprise_influxdb/v1.9/administration/cluster-commands/
menu:
  enterprise_influxdb_1_9:
    name: Manage clusters
    weight: 30
    parent: Manage
---

Use the following tools to manage and interact with your InfluxDB Enterprise clusters.

## `influxd-ctl` cluster management utility

The [`influxd-ctl`](/enterprise_influxdb/v1.9/tools/influxd-ctl/) cluster management utility provides commands for managing your InfluxDB Enterprise clusters.
Use use `influxd-ctl` utility to manage your cluster nodes, back up and restore data, and rebalance clusters.
The `influxd-ctl` utility is available on all [meta nodes](/enterprise_influxdb/v1.9/concepts/glossary/#meta-node).

For more information, see [`influxd-ctl`](/enterprise_influxdb/v1.9/tools/influxd-ctl/).

## `influx` command line interface (CLI)

Use the `influx` command line interface (CLI) to write data to your cluster, query data interactively, and view query output in different formats.
The `influx` CLI is available on all [data nodes](/enterprise_influxdb/v1.9/concepts/glossary/#data-node).

See [InfluxDB command line interface (CLI/shell)](/enterprise_influxdb/v1.9/tools/influx-cli/use-influx/) for details on using the `influx` command line interface.
