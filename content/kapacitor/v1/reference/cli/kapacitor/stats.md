---
title: kapacitor stats
description: >
  The `kapacitor stats` command returns Kapacitor server statistics.
menu:
  kapacitor_v1:
    name: kapacitor stats
    parent: kapacitor
weight: 301
---

The `kapacitor stats` command returns Kapacitor server statistics.

## Usage

```sh
kapacitor stats <context>
```

## Arguments

- **context**: Statistics context. The following contexts are available:
  - **general**: Displays a summary of Kapacitor statistics.
  - **ingress**: Displays statistics about data Kapacitor is receiving segmented
    by database, retention policy, and measurement.

## Examples

- [View general Kapacitor statistics](#view-general-kapacitor-statistics)
- [View Kapacitor ingress statistics](#view-kapacitor-ingress-statistics)

### View general Kapacitor statistics

```sh
kapacitor stats general
```

{{< expand-wrapper >}}
{{% expand "View example general statistics output" %}}
```sh
ClusterID:                    ef3b3f9d-0997-4c0b-b1b6-5d0fb37fe509
ServerID:                     90582c9c-2e25-4654-903e-0acfc48fb5da
Host:                         localhost
Tasks:                        8
Enabled Tasks:                2
Subscriptions:                12
Version:                      1.7.0~n201711280812
```
{{% /expand %}}
{{< /expand-wrapper >}}

### View Kapacitor ingress statistics

```sh
kapacitor stats ingress
```

{{< expand-wrapper >}}
{{% expand "View example ingress statistics output" %}}
```sh
Database   Retention Policy Measurement    Points Received
_internal  monitor          cq                        5274
_internal  monitor          database                 52740
_internal  monitor          httpd                     5274
_internal  monitor          queryExecutor             5274
_internal  monitor          runtime                   5274
_internal  monitor          shard                   300976
_internal  monitor          subscriber              126576
_internal  monitor          tsm1_cache              300976
_internal  monitor          tsm1_engine             300976
_internal  monitor          tsm1_filestore          300976
_internal  monitor          tsm1_wal                300976
_internal  monitor          write                     5274
_kapacitor autogen          edges                    26370
_kapacitor autogen          ingress                  73817
_kapacitor autogen          kapacitor                 2637
_kapacitor autogen          load                      2637
_kapacitor autogen          nodes                    23733
_kapacitor autogen          runtime                   2637
_kapacitor autogen          topics                   73836
chronograf autogen          alerts                    1560
telegraf   autogen          cpu                      47502
telegraf   autogen          disk                     31676
telegraf   autogen          diskio                   52800
telegraf   autogen          kernel                    5280
telegraf   autogen          mem                       5280
telegraf   autogen          processes                 5280
telegraf   autogen          swap                     10560
telegraf   autogen          system                   15840
```
{{% /expand %}}
{{< /expand-wrapper >}}
