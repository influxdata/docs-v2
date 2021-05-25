---
draft: true
title: Use node labels
description: >
  TK
menu:
  enterprise_influxdb_1_9:
    name: Use node labels
    weight: 40
    parent: Administration
---

Use the [`influxd-ctl node-labels`](/enterprise_influxdb/v1.9/administration/cluster-commands/#node-labels) command to assign arbitrary labels to meta and data nodes in a cluster.
You might want to tag nodes with the availability zone in which they're located.

### Example `influxd-ctl` usage

Showing a cluster with no node labels:

```
❯ ./influxd-ctl show
Data Nodes
==========
ID      TCP Address     Version Labels
4       localhost:8188  unknown {}
5       localhost:8288  unknown {}

Meta Nodes
==========
ID      TCP Address     Version Labels
1       localhost:8191  unknown {}
2       localhost:8291  unknown {}
3       localhost:8391  unknown {}
```

Adding labels to the two data nodes and then showing the cluster:

```
❯ ./influxd-ctl node-labels set -nodeid 4 -labels '{"az":"us-east","hello":"earth"}'
❯ ./influxd-ctl node-labels set -nodeid 5 -labels '{"az":"us-west","hello":"mars"}'
❯ ./influxd-ctl show
Data Nodes
==========
ID      TCP Address     Version Labels
4       localhost:8188  unknown {"az":"us-east","hello":"earth"}
5       localhost:8288  unknown {"az":"us-west","hello":"mars"}

Meta Nodes
==========
ID      TCP Address     Version Labels
1       localhost:8191  unknown {}
2       localhost:8291  unknown {}
3       localhost:8391  unknown {}
```

Updating an existing label on one node, deleting a label on the other node, and showing the cluster:

```
❯ ./influxd-ctl node-labels set -nodeid 4 -labels '{"hello":"world"}'
❯ ./influxd-ctl node-labels delete -nodeid 5 -labels '["hello"]'
❯ ./influxd-ctl show
Data Nodes
==========
ID      TCP Address     Version Labels
4       localhost:8188  unknown {"az":"us-east","hello":"world"}
5       localhost:8288  unknown {"az":"us-west"}

Meta Nodes
==========
ID      TCP Address     Version Labels
1       localhost:8191  unknown {}
2       localhost:8291  unknown {}
3       localhost:8391  unknown {}
```

### Programmatic access to node labels

Scripts or programs that need to parse node labels should use the meta API. E.g.,

```
❯ curl -s localhost:8191/show-cluster | jq . | head -14
{
  "data": [
    {
      "id": 4,
      "version": "unknown",
      "tcpAddr": "localhost:8188",
      "httpAddr": "localhost:8186",
      "httpScheme": "http",
      "status": "joined",
      "labels": {
        "az": "us-east",
        "hello": "world"
      }
    },
```
