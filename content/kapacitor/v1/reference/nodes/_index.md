---
title: TICKscript nodes overview
description: Overview of nodes in TICKscript.
aliases:
  - /kapacitor/v1/nodes/source_batch_node/
  - /kapacitor/v1/nodes/map_node/
  - /kapacitor/v1/nodes/source_stream_node/
  - /kapacitor/v1/nodes/
  - /kapacitor/v1/nodes/reduce_node/
menu:
  kapacitor_v1:
    name: TICKscript nodes
    identifier: nodes
    parent: Reference
weight: 40
---

> ***Note:*** Before continuing, please make sure you have read the
> [TICKscript Language Specification](/kapacitor/v1/reference/tick/).

Nodes represent process invocation units that either take data as a batch or a point-by-point stream, and then alter the data, store the data, or trigger some other activity based on changes in the data (e.g., an alert).

The property methods for these two nodes define the type of task that you are running, either
[stream](/kapacitor/v1/introduction/getting-started/#trigger-alerts-from-stream-data)
or
[batch](/kapacitor/v1/introduction/getting-started/#trigger-alerts-from-batch-data).

Below is a complete list of the available nodes. For each node, the associated property methods are described.

## Available nodes

{{< children type="list" >}}