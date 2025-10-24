---
title: Manage node labels
description: >
  Assign user-defined labels to nodes in your InfluxDB Enterprise v1 cluster.
menu:
  enterprise_influxdb_v1:
    name: Manage node labels
    parent: Manage
weight: 101
related:
  - /enterprise_influxdb/v1/tools/influxd-ctl/show/
  - /enterprise_influxdb/v1/tools/influxd-ctl/node-labels/
---

Assign user-defined labels to nodes in your InfluxDB Enterprise cluster.
**Node labels** are user-defined key-value pairs assigned to nodes in your
cluster that act as metadata for each node.

The tools used for viewing and managing node labels in your InfluxDB Enterprise cluster
are the [`influxd-ctl show` command ](/enterprise_influxdb/v1/tools/influxd-ctl/show/)
and the [`influxd-ctl node-label` command and subcommands](/enterprise_influxdb/v1/tools/influxd-ctl/node-labels/).

<!-- TOC -->

- [View node labels](#view-node-labels)
- [Add labels to a node](#add-labels-to-a-node)
- [Update node labels](#update-node-labels)
- [Delete node labels](#delete-node-labels)
- [Programmatically access node labels](#programmatically-access-node-labels)

<!-- TOC -->

## View node labels

Use the [`influxd-ctl show` command](/enterprise_influxdb/v1/tools/influxd-ctl/show/)
to view information about nodes in your InfluxDB Enterprise cluster, including
node labels.

```sh
influxd-ctl show
```

{{< expand-wrapper >}}
{{% expand "View example `influxd-ctl show` output" %}}
```sh
Data Nodes
==========
ID      TCP Address        Version         Labels
4       data-node-01:8188  {{< latest-patch >}}-c{{< latest-patch >}}  {"az":"us-west"}
5       data-node-02:8288  {{< latest-patch >}}-c{{< latest-patch >}}  {"az":"us-east"}

Meta Nodes
==========
ID      TCP Address        Version         Labels
1       meta-node-01:8191  {{< latest-patch >}}-c{{< latest-patch >}}  {"az":"us-west"}
2       meta-node-02:8291  {{< latest-patch >}}-c{{< latest-patch >}}  {"az":"us-east"}
3       meta-node-03:8391  {{< latest-patch >}}-c{{< latest-patch >}}  {"az":"us-west"}
```
{{% /expand %}}
{{< /expand-wrapper >}}

## Add labels to a node

To add a label to a node in your InfluxDB Enterprise cluster, use the
[`influxd-ctl node-labels set` command](/enterprise_influxdb/v1/tools/influxd-ctl/node-labels/set/)
and include the following flags:

- **-nodeid**: Node ID to add the labels to
- **-labels**: JSON object of label key-value pairs

```sh
influxd-ctl node-labels set -nodeid 4 -labels '{"az":"us-east","team":"amer"}'
```

{{< expand-wrapper >}}
{{% expand "View `influxd-ctl show` output with added labels" %}}
```sh
Data Nodes
==========
ID      TCP Address        Version         Labels
4       data-node-01:8188  {{< latest-patch >}}-c{{< latest-patch >}}  {"az":"us-east","team":"amer"}
5       data-node-02:8288  {{< latest-patch >}}-c{{< latest-patch >}}  {}

Meta Nodes
==========
ID      TCP Address        Version         Labels
1       meta-node-01:8191  {{< latest-patch >}}-c{{< latest-patch >}}  {}
2       meta-node-02:8291  {{< latest-patch >}}-c{{< latest-patch >}}  {}
3       meta-node-03:8391  {{< latest-patch >}}-c{{< latest-patch >}}  {}
```
{{% /expand %}}
{{< /expand-wrapper >}}

## Update node labels

To update node labels, use the
[`influxd-ctl node-labels set` command](/enterprise_influxdb/v1/tools/influxd-ctl/node-labels/set/)
and include the following flags:

- **-nodeid**: Node ID to update the labels on
- **-labels**: JSON object of label key-value pairs to update

```sh
influxd-ctl node-labels set -nodeid 4 -labels '{"team":"emea"}'
```

_Only label keys included in the `-labels` JSON object are updated.
All other node labels are not modified._

{{< expand-wrapper >}}
{{% expand "View `influxd-ctl show` output with updated labels" %}}
```sh
Data Nodes
==========
ID      TCP Address        Version         Labels
4       data-node-01:8188  {{< latest-patch >}}-c{{< latest-patch >}}  {"az":"us-east","team":"emea"}
5       data-node-02:8288  {{< latest-patch >}}-c{{< latest-patch >}}  {}

Meta Nodes
==========
ID      TCP Address        Version         Labels
1       meta-node-01:8191  {{< latest-patch >}}-c{{< latest-patch >}}  {}
2       meta-node-02:8291  {{< latest-patch >}}-c{{< latest-patch >}}  {}
3       meta-node-03:8391  {{< latest-patch >}}-c{{< latest-patch >}}  {}
```
{{% /expand %}}
{{< /expand-wrapper >}}

## Delete node labels

To update node labels, use the
[`influxd-ctl node-labels set` command](/enterprise_influxdb/v1/tools/influxd-ctl/node-labels/set/)
and include the following flags:

- **-nodeid**: Node ID to update the labels on
- **-labels**: JSON object of label key-value pairs to update

```sh
influxd-ctl node-labels delete -nodeid 4 -labels '["team"]'
```

{{< expand-wrapper >}}
{{% expand "View `influxd-ctl show` output with deleted label" %}}
```sh
Data Nodes
==========
ID      TCP Address        Version         Labels
4       data-node-01:8188  {{< latest-patch >}}-c{{< latest-patch >}}  {"az":"us-east"}
5       data-node-02:8288  {{< latest-patch >}}-c{{< latest-patch >}}  {}

Meta Nodes
==========
ID      TCP Address        Version         Labels
1       meta-node-01:8191  {{< latest-patch >}}-c{{< latest-patch >}}  {}
2       meta-node-02:8291  {{< latest-patch >}}-c{{< latest-patch >}}  {}
3       meta-node-03:8391  {{< latest-patch >}}-c{{< latest-patch >}}  {}
```
{{% /expand %}}
{{< /expand-wrapper >}}

## Programmatically access node labels

Use the `/show-cluster` endpoint of meta node API to return a JSON object containing
information about your InfluxDB Enterprise cluster, including node labels.

{{< api-endpoint method="get" endpoint="meta-node-host:8191/show-cluster" >}}

{{< expand-wrapper >}}
{{% expand "View example JSON output" %}}
```json
{
    "data": [
        {
            "id": 4,
            "addr": "data-node-01:8086",
            "httpScheme": "http",
            "tcpAddr": "data-node-01:8088",
            "version": "v1.10.0",
            "labels": {
              "az": "us-east",
              "team": "emea"
          }
        },
        {
            "id": 5,
            "addr": "data-node-02:8086",
            "httpScheme": "http",
            "tcpAddr": "data-node-02:8088",
            "version": "v1.10.0",
            "labels": {
              "az": "us-west",
              "team": "apac"
          }
        }
    ],
    "meta": [
        {
            "id": 1,
            "addr": "meta-node-01:8091",
            "httpScheme": "http",
            "tcpAddr": "meta-node-01:8089",
            "version": "v1.10.0",
            "labels": {
                "az": "us-east",
                "team": "emea"
            }
        },
        {
            "id": 2,
            "addr": "meta-node-02:8091",
            "httpScheme": "http",
            "tcpAddr": "meta-node-02:8089",
            "version": "v1.10.0",
            "labels": {
              "az": "us-west",
              "team": "apac"
          }
        },
        {
            "id": 3,
            "addr": "meta-node-03:8091",
            "httpScheme": "http",
            "tcpAddr": "meta-node-03:8089",
            "version": "v1.10.0",
            "labels": {
              "az": "us-east",
              "team": "amer"
          }
        }
    ]
}
```
{{% /expand %}}
{{< /expand-wrapper >}}
