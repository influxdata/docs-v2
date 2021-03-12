---
title: TICKscript nodes overview
description: Overview of nodes in TICKscript.
aliases:
    - kapacitor/v1.5/nodes/source_batch_node/
    - kapacitor/v1.5/nodes/source_stream_node/
    - kapacitor/v1.5/nodes/map_node/
    - kapacitor/v1.5/nodes/reduce_node/
menu:
  kapacitor_1_5_ref:
    name: TICKscript nodes
    identifier: nodes
    weight: 40
---

> ***Note:*** Before continuing, please make sure you have read the
> [TICKscript Language Specification](/kapacitor/v1.5/tick/).

Nodes represent process invocation units that either take data as a batch or a point-by-point stream, and then alter the data, store the data, or trigger some other activity based on changes in the data (e.g., an alert).

The property methods for these two nodes define the type of task that you are running, either
[stream](/kapacitor/v1.5/introduction/getting-started/#trigger-alerts-from-stream-data)
or
[batch](/kapacitor/v1.5/introduction/getting-started/#trigger-alerts-from-batch-data).

Below is a complete list of the available nodes. For each node, the associated property methods are described.

## Available nodes

* [AlertNode](/kapacitor/v1.5/nodes/alert_node)
* [BarrierNode](/kapacitor/v1.5/nodes/barrier_node)
* [BatchNode](/kapacitor/v1.5/nodes/batch_node)
* [ChangeDetectNode](/kapacitor/v1.5/nodes/change_detect_node)
* [CombineNode](/kapacitor/v1.5/nodes/combine_node)
* [DefaultNode](/kapacitor/v1.5/nodes/default_node)
* [DeleteNode](/kapacitor/v1.5/nodes/delete_node)
* [DerivativeNode](/kapacitor/v1.5/nodes/derivative_node)
* [EC2AutoscaleNode](/kapacitor/v1.5/nodes/ec2_autoscale_node)
* [EvalNode](/kapacitor/v1.5/nodes/eval_node)
* [FlattenNode](/kapacitor/v1.5/nodes/flatten_node)
* [FromNode](/kapacitor/v1.5/nodes/from_node)
* [GroupByNode](/kapacitor/v1.5/nodes/group_by_node)
* [HTTPOutputNode](/kapacitor/v1.5/nodes/http_out_node)
* [HTTPPostNode](/kapacitor/v1.5/nodes/http_post_node)
* [InfluxDBOutputNode](/kapacitor/v1.5/nodes/influx_d_b_out_node)
* [InfluxQLNode](/kapacitor/v1.5/nodes/influx_q_l_node)
* [JoinNode](/kapacitor/v1.5/nodes/join_node)
* [K8sAutoscaleNode](/kapacitor/v1.5/nodes/k8s_autoscale_node)
* [Kapacitor LoopbackNode](/kapacitor/v1.5/nodes/kapacitor_loopback_node)
* [LogNode](/kapacitor/v1.5/nodes/log_node)
* [NoOpNode](/kapacitor/v1.5/nodes/no_op_node)
* [QueryNode](/kapacitor/v1.5/nodes/query_node)
* [SampleNode](/kapacitor/v1.5/nodes/sample_node)
* [ShiftNode](/kapacitor/v1.5/nodes/shift_node)
* [SideloadNode](/kapacitor/v1.5/nodes/sideload_node)
* [StateCountNode](/kapacitor/v1.5/nodes/state_count_node)
* [StateDurationNode](/kapacitor/v1.5/nodes/state_duration_node)
* [StatsNode](/kapacitor/v1.5/nodes/stats_node)
* [StreamNode](/kapacitor/v1.5/nodes/stream_node)
* [SwarmAutoscaleNode](/kapacitor/v1.5/nodes/swarm_autoscale_node)
* [UDF (User Defined Function)Node](/kapacitor/v1.5/nodes/u_d_f_node)
* [UnionNode](/kapacitor/v1.5/nodes/union_node)
* [WhereNode](/kapacitor/v1.5/nodes/where_node)
* [WindowNode](/kapacitor/v1.5/nodes/window_node)
