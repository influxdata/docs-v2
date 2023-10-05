---
title: influxd-ctl leave
description: >
  The `influxd-ctl leave` command removes a meta or data node from an InfluxDB
  Enterprise cluster.
menu:
  enterprise_influxdb_v1:
    parent: influxd-ctl
weight: 201
related:
  - /enterprise_influxdb/v1/tools/influxd-ctl/join/
  - /enterprise_influxdb/v1/tools/influxd-ctl/remove-data/
  - /enterprise_influxdb/v1/tools/influxd-ctl/remove-meta/
---

The `influxd-ctl leave` command removes a meta or data node from an InfluxDB
Enterprise cluster.
The command searches for `influxd` and `influxd-meta` processes running on the
local machine bound to specific ports and determines if that process is an
InfluxDB meta or data node.

- **8088**: Data node
- **8091**: Meta node

{{% note %}}
If the InfluxDB data or meta processes are running on non-default ports, the
leave operation cannot detect them.
{{% /note %}}

{{% warn %}}
#### This command is destructive

`influxd-ctl leave` erases all metastore information from meta nodes and all
data from data nodes.
Only use this command if you want to _permanently_ remove a node from your
InfluxDB Enterprise cluster.
{{% /warn %}}

## Usage

```sh
influxd-ctl leave [flags]
```

## Flags {#command-flags}

| Flag | Description                 |
| :--- | :-------------------------- |
| `-y` | Assume `yes` to all prompts |

{{% caption %}}
_Also see [`influxd-ctl` global flags](/enterprise_influxdb/v1/tools/influxd-ctl/#influxd-ctl-global-flags)._
{{% /caption %}}

## Examples

- [Remove nodes from a cluster](#remove-nodes-from-a-cluster)
- [Remove nodes from a cluster and assume yes to all prompts](#remove-nodes-from-a-cluster-and-assume-yes-to-all-prompts)

### Remove nodes from a cluster

In the following example, `influxd-ctl leave` detects the meta node running at
`cluster-node-03:8091` and the data node running at `cluster-node-03:8088` in
an existing InfluxDB Enterprise cluster and prompts the user to remove them.

```bash
influxd-ctl leave
```

###### Command output and interactive prompts

```txt
Searching for data node on cluster-node-03:8088...
Remove data node cluster-node-03:8088 from the cluster [y/N]: y
Removed cluster-node-03:8088 from the cluster
Searching for meta node on cluster-node-03:8091...
Remove meta node cluster-node-03:8091 from the cluster [y/N]: y

Successfully left cluster

  * Removed data node cluster-node-03:8088 from cluster
  * Removed meta node cluster-node-03:8091 from cluster
```

### Remove nodes from a cluster and assume yes to all prompts

In the following example, `influxd-ctl leave` detects the meta node running at
`cluster-node-03:8091` and the data node running at `cluster-node-03:8088` in an
existing InfluxDB Enterprise cluster removes them from the cluster without prompts.

```bash
$ influxd-ctl leave -y
```

###### Command output

```txt
Searching for data node on cluster-node-03:8088...
Removed cluster-node-03:8088 from the cluster
Searching for meta node on cluster-node-03:8091...

Successfully left cluster

  * Removed data node cluster-node-03:8088 from cluster
  * Removed meta node cluster-node-03:8091 from cluster
```
