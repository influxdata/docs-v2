---
title: influxd-ctl join
description: >
  The `influxd-ctl join` command joins a meta or data node data node to an
  InfluxDB Enterprise cluster.
menu:
  enterprise_influxdb_v1:
    parent: influxd-ctl
weight: 201
related:
  - /enterprise_influxdb/v1/tools/influxd-ctl/leave/
---

The `influxd-ctl join` command joins a meta or data node data node to an
InfluxDB Enterprise cluster.
The command searches for `influxd` and `influxd-meta` processes running on the
local machine bound to specific ports and determines if that process is an
InfluxDB meta or data node.

- **8088**: Data node
- **8091**: Meta node

{{% note %}}
If the InfluxDB data or meta processes are running on non-default ports, the
join operation cannot detect them.
{{% /note %}}

## Usage

```sh
influxd-ctl join [flags] <meta-node-http-bind-address>
```

## Arguments

- **meta-node-http-bind-address**: HTTP bind address of a meta node in an
 _existing_ cluster. Use this argument to add un-joined meta or data node to an
 existing cluster.

## Flags

| Flag | Description                                                                                                 |
| :--- | :---------------------------------------------------------------------------------------------------------- |
| `-p` | Add the data node as a [passive node](/enterprise_influxdb/v1/concepts/glossary/#passive-node-experimental) |
| `-v` | Print verbose information when joining                                                                      |

{{% caption %}}
_Also see [`influxd-ctl` global flags](/enterprise_influxdb/v1/tools/influxd-ctl/#influxd-ctl-global-flags)._
{{% /caption %}}

## Examples

- [Join a meta and data node into a cluster](#join-a-meta-and-data-node-into-a-cluster)
- [Join a meta and data node to an existing cluster](#join-a-meta-and-data-node-to-an-existing-cluster)
- [Join a meta node to an existing cluster](#join-a-meta-node-to-an-existing-cluster)

### Join a meta and data node into a cluster

In the following example, `influxd-ctl join` command detects a meta node process
running at `cluster-node-03:8091` and a data node process running at
`cluster-node-03:8088` and joins them into a _new_ cluster.

```sh
influxd-ctl join
```

###### Command output

```txt
Joining meta node at localhost:8091
Searching for meta node on cluster-node-03:8091...
Searching for data node on cluster-node-03:8088...

Successfully created cluster

  * Added meta node 1 at cluster-node-03:8091
  * Added data node 2 at cluster-node-03:8088

  To join additional nodes to this cluster, run the following command:

  influxd-ctl join cluster-node-03:8091
```

### Join a meta and data node to an existing cluster

In the following example, `influxd-ctl join` detects a meta node process running
at `cluster-node-03:8091` and a data node process running at `cluster-node-03:8088`.
It uses the meta node running at `cluster-meta-node-02:8091` in an _existing_
cluster to join the newly detected meta and data nodes to the cluster.

```sh
influxd-ctl join cluster-meta-node-02:8091
```

###### Command output

```txt
Joining meta node at cluster-meta-node-02:8091
Searching for meta node on cluster-node-03:8091...
Searching for data node on cluster-node-03:8088...

Successfully joined cluster

  * Added meta node 3 at cluster-node-03:8091
  * Added data node 4 at cluster-node-03:8088
```

### Join a meta node to an existing cluster

In the following example, `influxd-ctl join` detects a meta node process running
at `cluster-meta-node-03:8091`, but does not detect a data node process.
It uses the meta node running at `cluster-meta-node-02:8091` in an _existing_
cluster to join the newly detected meta node to the cluster.

```bash
influxd-ctl join cluster-meta-node-02:8091
```

###### Command output

```txt
Joining meta node at cluster-meta-node-02:8091
Searching for meta node on cluster-meta-node-03:8091...
Searching for data node on cluster-meta-node-03:8088...

Successfully joined cluster

  * Added meta node 18 at cluster-meta-node-03:8091
  * No data node added.  Run with -v to see more information
```

## Troubleshoot influxd-ctl join

Common problems when attempting to join nodes to InfluxDB Enterprise clusters:

- The `influxd` or `influxd-meta` processes are using non-standard ports and can't be detected.
- The `influxd` or `influxd-meta` processes are not running.
  Check the logs for startup errors.
