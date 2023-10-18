---
title: influxd-ctl remove-meta
description: >
  The `influxd-ctl remove-meta` command removes a meta node from an InfluxDB
  Enterprise cluster.
menu:
  enterprise_influxdb_v1:
    parent: influxd-ctl
weight: 201
related:
  - /enterprise_influxdb/v1/tools/influxd-ctl/leave/
---

The `influxd-ctl remove-meta` command removes a meta node from an InfluxDB
Enterprise cluster.
By default, the local meta node is used to remove the specified node.
If `-bind` is specified, the bound address will be used.

To force-remove a meta node, bind to an existing meta node and include the the
`-tcpAddr` and `-force` flags along with the meta node's HTTP bind address.
Force removing a meta node should only be used if the meta node is no longer
reachable and is unrecoverable.
If the node is restarted after being force removed, it may interfere with the cluster.

{{% warn %}}
#### This command is destructive

`influxd-ctl remove-meta` erases all metadata in the specified meta node.
Only use this command if you want to _permanently_ remove a meta node from your
InfluxDB Enterprise cluster.
{{% /warn %}}

_This command doesn't delete metadata related to the removed meta node from other
nodes in the cluster. To remove all metadata about the removed meta node, use
[`influxd-ctl leave`](/enterprise_influxdb/v1/tools/influxd-ctl/leave/)._

## Usage

```sh
influxd-ctl remove-meta [flags] <meta-http-bind-addr>
```

## Arguments

- **meta-http-bind-addr**: HTTP bind address of the meta node to remove

## Flags {#command-flags}

| Flag       | Description                                                             |
| :--------- | :---------------------------------------------------------------------- |
| `-force`   | Force the removal of a meta node _(useful if the node is unresponsive)_ |
| `-tcpAddr` | TCP bind address of the meta node to remove                             |
| `-y`       | Assume `yes` to all prompts                                             |

{{% caption %}}
_Also see [`influxd-ctl` global flags](/enterprise_influxdb/v1/tools/influxd-ctl/#influxd-ctl-global-flags)._
{{% /caption %}}

## Examples

- [Remove the local meta node running on :8091](#remove-the-local-meta-node-running-on-8091)
- [Remove the meta node running on meta2:8091](#remove-the-meta-node-running-on-meta28091)
- [Forcefully remove an unresponsive meta node from the local meta node](#forcefully-remove-an-unresponsive-meta-node-from-the-local-meta-node)
- [Forcefully remove an unresponsive meta node through a remote meta node](#forcefully-remove-an-unresponsive-meta-node-through-a-remote-meta-node)

### Remove the local meta node running on :8091

```sh
influxd-ctl remove-meta localhost:8091
```

### Remove the meta node running on meta2:8091

```sh
influxd-ctl remove-meta meta2:8091
```

### Forcefully remove an unresponsive meta node from the local meta node

In the following example, the `influxd-ctl remove-data` command forcefully
removes the meta node running at the TCP address `meta2:8089` and HTTP address
`meta2:8091` from the cluster.

```sh
influxd-ctl remove-meta -force -tcpAddr meta2:8089 meta2:8091
```

### Forcefully remove an unresponsive meta node through a remote meta node

In the following example, the `influxd-ctl remove-data` command uses the meta
node at `meta1:8091` to forcefully remove the meta node running at the TCP
address `meta2:8089` and HTTP address `meta2:8091` from the cluster.

```sh
influxd-ctl -bind meta1:8091 remove-meta -force -tcpAddr meta2:8089 meta2:8091
```
