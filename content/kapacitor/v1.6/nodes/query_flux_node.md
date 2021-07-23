---
title: QueryFluxNode
description: >
  QueryFluxNode defines a source and a schedule for processing batch data.
  The data is queried from an InfluxDB bucket and then passed into the data pipeline.
menu:
  kapacitor_1_6_ref:
    name: QueryFluxNode
    weight: 100
    parent: nodes
---

The `fluxQuery` node defines a source and a schedule for processing batch data.
The data is queried from an InfluxDB bucket and then passed into the data pipeline.

##### Example
The following example queries InfluxDB every 20 seconds and returns data from
the last minute.

```js
batch
  |fluxQuery('''
    from(bucket: "example-bucket")
    |> range(start: -1m)
    |> filter(fn: (r) =>
      r._measurement == "example-measurement" and
      r._field == "example-field"
    )
  ''')
    .period(1m)
    .every(20s)
```


### Constructor

| Chaining Method                     | Description            |
| :---------------------------------- | :--------------------- |
| **fluxQuery( `queryStr` `string`)** | Flux query to execute. |

### Property Methods

| Setters                                         | Description                                                                           |
| :---------------------------------------------- | :------------------------------------------------------------------------------------ |
| **[align](#align)( )**                          | Align start and end times with the `every` value. Does not apply if `cron` is used.   |
| **[cluster](#cluster)( `value` `string`)**      | The name of a configured InfluxDB cluster. If empty the default cluster will be used. |
| **[cron](#cron)( `value` `string`)**            | Define a schedule using cron syntax. Mutually exclusive with the `every` property.    |
| **[every](#every)( `value` `time.Duration`)**   | How often to query InfluxDB. Mutually exclusive with the `cron` property.             |
| **[offset](#offset)( `value` `time.Duration`)** | How far back in time to query from the current time.                                  |
| **[org](#org)( `value` `string`)**              | InfluxDB Cloud or 2.x organization name.                                              |
| **[orgID](#orgid)( `value` `string`)**          | InfluxDB Cloud or 2.x organization ID.                                                |
| **[period](#period)( `value` `time.Duration`)** | The period or length of time that will be queried from InfluxDB.                      |
| **[quiet](#quiet)( )**                          | Suppress all error logging events from this node.                                     |

### Chaining Methods

[Alert](#alert),
[Barrier](#barrier),
[Bottom](#bottom),
[ChangeDetect](#changedetect),
[Combine](#combine),
[Count](#count),
[CumulativeSum](#cumulativesum),
[Deadman](#deadman),
[Default](#default),
[Delete](#delete),
[Derivative](#derivative),
[Difference](#difference),
[Distinct](#distinct),
[Ec2Autoscale](#ec2autoscale),
[Elapsed](#elapsed),
[Eval](#eval),
[First](#first),
[Flatten](#flatten),
[HoltWinters](#holtwinters),
[HoltWintersWithFit](#holtwinterswithfit),
[HttpOut](#httpout),
[HttpPost](#httppost),
[InfluxDBOut](#influxdbout),
[Join](#join),
[K8sAutoscale](#k8sautoscale),
[KapacitorLoopback](#kapacitorloopback),
[Last](#last),
[Log](#log),
[Max](#max),
[Mean](#mean),
[Median](#median),
[Min](#min),
[Mode](#mode),
[MovingAverage](#movingaverage),
[Percentile](#percentile),
[Sample](#sample),
[Shift](#shift),
[Sideload](#sideload),
[Spread](#spread),
[StateCount](#statecount),
[StateDuration](#stateduration),
[Stats](#stats),
[Stddev](#stddev),
[Sum](#sum),
[SwarmAutoscale](#swarmautoscale),
[Top](#top),
[Trickle](#trickle),
[Union](#union),
[Where](#where),
[Window](#window)

---

## Properties

Property methods modify state on the calling node.
They do not add another node to the pipeline, and always return a reference to the calling node.
Property methods are marked using the `.` operator.


### Align

Align start and stop times for queries with even boundaries of the [QueryFluxNode.Every](/kapacitor/v1.6/nodes/query_node/#every) property.
Does not apply if using the [QueryFluxNode.Cron](/kapacitor/v1.6/nodes/query_node/#cron) property.


```js
fluxQuery.align()
```

### Cluster

The name of a configured InfluxDB cluster.
If empty, the default cluster is used.

```js
fluxQuery.cluster(value string)
```

### Cron

Define a schedule using a cron syntax.

The specific cron implementation is documented here:
https://github.com/gorhill/cronexpr#implementation

The Cron property is mutually exclusive with the Every property.

```js
fluxQuery.cron(value string)
```

### Every

How often to query InfluxDB.
The Every property is mutually exclusive with the Cron property.

```js
fluxQuery.every(value time.Duration)
```

### Offset

How far back in time to query from the current time.

For example, with an `offset` of 2 hours and an `every` of 5m,
Kapacitor will query InfluxDB every 5 minutes for the window of data 2 hours ago.

This applies to Cron schedules as well. If the cron specifies to run every Sunday at
1 AM and the Offset is 1 hour. Then at 1 AM on Sunday the data from 12 AM will be queried.


```js
fluxQuery.offset(value time.Duration)
```

### Period

The period or length of time queried from InfluxDB.


```js
fluxQuery.period(value time.Duration)
```

### Org

The InfluxDB Cloud or 2.x organization name to query.
If empty, the default `org` is used.

```js
fluxQuery.org(value string)
```

### OrgID

The InfluxDB Cloud or 2.x organization ID to query.
If empty, the default `orgID` is used.

```js
fluxQuery.orgID(value string)
```

### Quiet

Suppress all error logging events from this node.

```js
fluxQuery.quiet()
```


## Chaining Methods

Chaining methods create a new node in the pipeline as a child of the calling node.
They do not modify the calling node.
Chaining methods are marked using the `|` operator.


### Alert

Create an alert node, which can trigger alerts.


```js
fluxQuery|alert()
```

Returns: [AlertNode](/kapacitor/v1.6/nodes/alert_node/)

### Barrier

Create a new Barrier node that emits a BarrierMessage periodically.

One BarrierMessage will be emitted every period duration.


```js
fluxQuery|barrier()
```

Returns: [BarrierNode](/kapacitor/v1.6/nodes/barrier_node/)

### Bottom

Select the bottom `num` points for `field` and sort by any extra tags or fields.


```js
fluxQuery|bottom(num int64, field string, fieldsAndTags ...string)
```

Returns: [InfluxQLNode](/kapacitor/v1.6/nodes/influx_q_l_node/)

### ChangeDetect

Create a new node that only emits new points if different from the previous point.

```js
fluxQuery|changeDetect(field string)
```

Returns: [ChangeDetectNode](/kapacitor/v1.6/nodes/change_detect_node/)

### Combine

Combine this node with itself. The data is combined on timestamp.


```js
fluxQuery|combine(expressions ...ast.LambdaNode)
```

Returns: [CombineNode](/kapacitor/v1.6/nodes/combine_node/)

### Count

Count the number of points.


```js
fluxQuery|count(field string)
```

Returns: [InfluxQLNode](/kapacitor/v1.6/nodes/influx_q_l_node/)

### CumulativeSum

Compute a cumulative sum of each point that is received.
A point is emitted for every point collected.


```js
fluxQuery|cumulativeSum(field string)
```

Returns: [InfluxQLNode](/kapacitor/v1.6/nodes/influx_q_l_node/)

### Deadman

Helper function for creating an alert on low throughput, a.k.a. deadman's switch.

- Threshold: trigger alert if throughput drops below threshold in points/interval.
- Interval: how often to check the throughput.
- Expressions: optional list of expressions to also evaluate. Useful for time of day alerting.

Example:


```js
    var data = batch
        |fluxQuery()...
    // Trigger critical alert if the throughput drops below 100 points per 10s and checked every 10s.
    data
        |deadman(100.0, 10s)
    //Do normal processing of data
    data...
```

The above is equivalent to this example:


```js
    var data = batch
        |fluxQuery()...
    // Trigger critical alert if the throughput drops below 100 points per 10s and checked every 10s.
    data
        |stats(10s)
            .align()
        |derivative('emitted')
            .unit(10s)
            .nonNegative()
        |alert()
            .id('node \'stream0\' in task \'{{ .TaskName }}\'')
            .message('{{ .ID }} is {{ if eq .Level "OK" }}alive{{ else }}dead{{ end }}: {{ index .Fields "emitted" | printf "%0.3f" }} points/10s.')
            .crit(lambda: "emitted" <= 100.0)
    //Do normal processing of data
    data...
```

The `id` and `message` alert properties can be configured globally via the 'deadman' configuration section.

Since the [AlertNode](/kapacitor/v1.6/nodes/alert_node/) is the last piece it can be further modified as usual.
Example:


```js
    var data = batch
        |fluxQuery()...
    // Trigger critical alert if the throughput drops below 100 points per 10s and checked every 10s.
    data
        |deadman(100.0, 10s)
            .slack()
            .channel('#dead_tasks')
    //Do normal processing of data
    data...
```

You can specify additional lambda expressions to further constrain when the deadman's switch is triggered.
Example:


```js
    var data = batch
        |fluxQuery()...
    // Trigger critical alert if the throughput drops below 100 points per 10s and checked every 10s.
    // Only trigger the alert if the time of day is between 8am-5pm.
    data
        |deadman(100.0, 10s, lambda: hour("time") >= 8 AND hour("time") <= 17)
    //Do normal processing of data
    data...
```



```js
fluxQuery|deadman(threshold float64, interval time.Duration, expr ...ast.LambdaNode)
```

Returns: [AlertNode](/kapacitor/v1.6/nodes/alert_node/)

### Default

Create a node that can set defaults for missing tags or fields.


```js
fluxQuery|default()
```

Returns: [DefaultNode](/kapacitor/v1.6/nodes/default_node/)

### Delete

Create a node that can delete tags or fields.


```js
fluxQuery|delete()
```

Returns: [DeleteNode](/kapacitor/v1.6/nodes/delete_node/)

### Derivative

Create a new node that computes the derivative of adjacent points.


```js
fluxQuery|derivative(field string)
```

Returns: [DerivativeNode](/kapacitor/v1.6/nodes/derivative_node/)

### Difference

Compute the difference between points independent of elapsed time.


```js
fluxQuery|difference(field string)
```

Returns: [InfluxQLNode](/kapacitor/v1.6/nodes/influx_q_l_node/)

### Distinct

Produce batch of only the distinct points.


```js
fluxQuery|distinct(field string)
```

Returns: [InfluxQLNode](/kapacitor/v1.6/nodes/influx_q_l_node/)

### Ec2Autoscale

Create a node that can trigger autoscale events for a ec2 autoscalegroup.


```js
fluxQuery|ec2Autoscale()
```

Returns: [Ec2AutoscaleNode](/kapacitor/v1.6/nodes/ec2_autoscale_node/)

### Elapsed

Compute the elapsed time between points.


```js
fluxQuery|elapsed(field string, unit time.Duration)
```

Returns: [InfluxQLNode](/kapacitor/v1.6/nodes/influx_q_l_node/)

### Eval

Create an eval node that will evaluate the given transformation function to each data point.
A list of expressions may be provided and will be evaluated in the order they are given.
The results are available to later expressions.


```js
fluxQuery|eval(expressions ...ast.LambdaNode)
```

Returns: [EvalNode](/kapacitor/v1.6/nodes/eval_node/)

### First

Select the first point.


```js
fluxQuery|first(field string)
```

Returns: [InfluxQLNode](/kapacitor/v1.6/nodes/influx_q_l_node/)

### Flatten

Flatten points with similar times into a single point.


```js
fluxQuery|flatten()
```

Returns: [FlattenNode](/kapacitor/v1.6/nodes/flatten_node/)

### HoltWinters

Compute the Holt-Winters (/{{< latest "influxdb" "v1" >}}/query_language/functions/#holt-winters) forecast of a data set.


```js
fluxQuery|holtWinters(field string, h int64, m int64, interval time.Duration)
```

Returns: [InfluxQLNode](/kapacitor/v1.6/nodes/influx_q_l_node/)

### HoltWintersWithFit

Compute the Holt-Winters (/{{< latest "influxdb" "v1" >}}/query_language/functions/#holt-winters) forecast of a data set.
This method also outputs all the points used to fit the data in addition to the forecasted data.


```js
fluxQuery|holtWintersWithFit(field string, h int64, m int64, interval time.Duration)
```

Returns: [InfluxQLNode](/kapacitor/v1.6/nodes/influx_q_l_node/)

### HttpOut

Create an HTTP output node that caches the most recent data it has received.
The cached data is available at the given endpoint.
The endpoint is the relative path from the API endpoint of the running task.
For example, if the task endpoint is at `/kapacitor/v1/tasks/<task_id>` and endpoint is
`top10`, then the data can be requested from `/kapacitor/v1/tasks/<task_id>/top10`.


```js
fluxQuery|httpOut(endpoint string)
```

Returns: [HTTPOutNode](/kapacitor/v1.6/nodes/http_out_node/)

### HttpPost

Creates an HTTP Post node that POSTS received data to the provided HTTP endpoint.
HttpPost expects 0 or 1 arguments. If 0 arguments are provided, you must specify an
endpoint property method.


```js
fluxQuery|httpPost(url ...string)
```

Returns: [HTTPPostNode](/kapacitor/v1.6/nodes/http_post_node/)

### InfluxDBOut

Create an influxdb output node that will store the incoming data into InfluxDB.


```js
fluxQuery|influxDBOut()
```

Returns: [InfluxDBOutNode](/kapacitor/v1.6/nodes/influx_d_b_out_node/)

### Join

Join this node with other nodes. The data is joined on timestamp.


```js
fluxQuery|join(others ...Node)
```

Returns: [JoinNode](/kapacitor/v1.6/nodes/join_node/)

### K8sAutoscale

Create a node that can trigger autoscale events for a kubernetes cluster.


```js
fluxQuery|k8sAutoscale()
```

Returns: [K8sAutoscaleNode](/kapacitor/v1.6/nodes/k8s_autoscale_node/)

### KapacitorLoopback

Create an kapacitor loopback node that will send data back into Kapacitor as a stream.


```js
fluxQuery|kapacitorLoopback()
```

Returns: [KapacitorLoopbackNode](/kapacitor/v1.6/nodes/kapacitor_loopback_node/)

### Last

Select the last point.


```js
fluxQuery|last(field string)
```

Returns: [InfluxQLNode](/kapacitor/v1.6/nodes/influx_q_l_node/)

### Log

Create a node that logs all data it receives.


```js
fluxQuery|log()
```

Returns: [LogNode](/kapacitor/v1.6/nodes/log_node/)

### Max

Select the maximum point.


```js
fluxQuery|max(field string)
```

Returns: [InfluxQLNode](/kapacitor/v1.6/nodes/influx_q_l_node/)

### Mean

Compute the mean of the data.


```js
fluxQuery|mean(field string)
```

Returns: [InfluxQLNode](/kapacitor/v1.6/nodes/influx_q_l_node/)

### Median

Compute the median of the data.

> **Note:** This method is not a selector.
If you want the median point, use `.percentile(field, 50.0)`.


```js
fluxQuery|median(field string)
```

Returns: [InfluxQLNode](/kapacitor/v1.6/nodes/influx_q_l_node/)

### Min

Select the minimum point.


```js
fluxQuery|min(field string)
```

Returns: [InfluxQLNode](/kapacitor/v1.6/nodes/influx_q_l_node/)

### Mode

Compute the mode of the data.


```js
fluxQuery|mode(field string)
```

Returns: [InfluxQLNode](/kapacitor/v1.6/nodes/influx_q_l_node/)

### MovingAverage

Compute a moving average of the last window points.
No points are emitted until the window is full.


```js
fluxQuery|movingAverage(field string, window int64)
```

Returns: [InfluxQLNode](/kapacitor/v1.6/nodes/influx_q_l_node/)

### Percentile

Select a point at the given percentile. This is a selector function, no interpolation between points is performed.


```js
fluxQuery|percentile(field string, percentile float64)
```

Returns: [InfluxQLNode](/kapacitor/v1.6/nodes/influx_q_l_node/)

### Sample

Create a new node that samples the incoming points or batches.

One point will be emitted every count or duration specified.


```js
fluxQuery|sample(rate interface{})
```

Returns: [SampleNode](/kapacitor/v1.6/nodes/sample_node/)

### Shift

Create a new node that shifts the incoming points or batches in time.


```js
fluxQuery|shift(shift time.Duration)
```

Returns: [ShiftNode](/kapacitor/v1.6/nodes/shift_node/)

### Sideload

Create a node that can load data from external sources.


```js
fluxQuery|sideload()
```

Returns: [SideloadNode](/kapacitor/v1.6/nodes/sideload_node/)

### Spread

Compute the difference between `min` and `max` points.


```js
fluxQuery|spread(field string)
```

Returns: [InfluxQLNode](/kapacitor/v1.6/nodes/influx_q_l_node/)

### StateCount

Create a node that tracks number of consecutive points in a given state.


```js
fluxQuery|stateCount(expression ast.LambdaNode)
```

Returns: [StateCountNode](/kapacitor/v1.6/nodes/state_count_node/)

### StateDuration

Create a node that tracks duration in a given state.


```js
fluxQuery|stateDuration(expression ast.LambdaNode)
```

Returns: [StateDurationNode](/kapacitor/v1.6/nodes/state_duration_node/)

### Stats

Create a new stream of data that contains the internal statistics of the node.
The interval represents how often to emit the statistics based on real time.
This means the interval time is independent of the times of the data points the source node is receiving.


```js
fluxQuery|stats(interval time.Duration)
```

Returns: [StatsNode](/kapacitor/v1.6/nodes/stats_node/)

### Stddev

Compute the standard deviation.


```js
fluxQuery|stddev(field string)
```

Returns: [InfluxQLNode](/kapacitor/v1.6/nodes/influx_q_l_node/)

### Sum

Compute the sum of all values.


```js
fluxQuery|sum(field string)
```

Returns: [InfluxQLNode](/kapacitor/v1.6/nodes/influx_q_l_node/)

### SwarmAutoscale

Create a node that can trigger autoscale events for a Docker swarm cluster.


```js
fluxQuery|swarmAutoscale()
```

Returns: [SwarmAutoscaleNode](/kapacitor/v1.6/nodes/swarm_autoscale_node/)

### Top

Select the top `num` points for `field` and sort by any extra tags or fields.


```js
fluxQuery|top(num int64, field string, fieldsAndTags ...string)
```

Returns: [InfluxQLNode](/kapacitor/v1.6/nodes/influx_q_l_node/)

### Trickle

Create a new node that converts batch data to stream data.

```js
fluxQuery|trickle()
```

Returns: [TrickleNode](/kapacitor/v1.6/nodes/trickle_node/)

### Union

Perform the union of this node and all other given nodes.


```js
fluxQuery|union(node ...Node)
```

Returns: [UnionNode](/kapacitor/v1.6/nodes/union_node/)

### Where

Create a new node that filters the data stream by a given expression.


```js
fluxQuery|where(expression ast.LambdaNode)
```

Returns: [WhereNode](/kapacitor/v1.6/nodes/where_node/)

### Window

Create a new node that windows the stream by time.

NOTE: Window can only be applied to stream edges.


```js
fluxQuery|window()
```

Returns: [WindowNode](/kapacitor/v1.6/nodes/window_node/)
