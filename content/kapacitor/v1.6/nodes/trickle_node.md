---
title: TrickleNode
description: >
  TrickleNode converts `from` batch edges to stream edges.
  Children of `trickle` are treated as if they are in a stream.
menu:
  kapacitor_1_6_ref:
    name: TrickleNode
    identifier: trickle_node
    weight: 100
    parent: nodes
---

The `trickle` node converts `from` batch edges to stream edges.
Children of `trickle` are treated as if they are in a stream.

#### Examples

##### Convert batch data to stream data
```js
var errors = batch
  |query('SELECT value FROM errors')
  |trickle()
```

##### Convert windowed data to stream data
```js
var errors = stream
  |from()
  |window()
    .period(10m)
    .every(5m)
  |trickle()
```

### Constructor

| Chaining Method | Description                                                |
| :-------------- | :--------------------------------------------------------- |
| **trickle()**   | Create a new node that converts batch data to stream data. |

### Property methods
| Setters                | Description                                       |
| :--------------------- | :------------------------------------------------ |
| **[quiet](#quiet)( )** | Suppress all error logging events from this node. |

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
[GroupBy](#groupby),
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

### Quiet

Suppress all error logging events from this node.

```js
trickle.quiet()
```

---

## Chaining Methods

Chaining methods create a new node in the pipeline as a child of the calling node.
They do not modify the calling node.
Chaining methods are marked using the `|` operator.

### Alert

Create an alert node, which can trigger alerts.

```js
trickle|alert()
```

Returns: [AlertNode](/kapacitor/v1.6/nodes/alert_node/)

<a class="top" href="javascript:document.getElementsByClassName('article-heading')[0].scrollIntoView();" title="top"><span class="icon arrow-up"></span></a>

### Barrier

Create a new Barrier node that emits a BarrierMessage periodically.

One BarrierMessage will be emitted every period duration.


```js
trickle|barrier()
```

Returns: [BarrierNode](/kapacitor/v1.6/nodes/barrier_node/)

<a class="top" href="javascript:document.getElementsByClassName('article-heading')[0].scrollIntoView();" title="top"><span class="icon arrow-up"></span></a>

### Bottom

Select the bottom `num` points for `field` and sort by any extra tags or fields.

```js
trickle|bottom(num int64, field string, fieldsAndTags ...string)
```

Returns: [InfluxQLNode](/kapacitor/v1.6/nodes/influx_q_l_node/)

<a class="top" href="javascript:document.getElementsByClassName('article-heading')[0].scrollIntoView();" title="top"><span class="icon arrow-up"></span></a>

### ChangeDetect

Create a new node that only emits new points if different from the previous point.

```js
trickle|changeDetect(field string)
```

Returns: [ChangeDetectNode](/kapacitor/v1.6/nodes/change_detect_node/)

<a class="top" href="javascript:document.getElementsByClassName('article-heading')[0].scrollIntoView();" title="top"><span class="icon arrow-up"></span></a>

### Combine

Combine this node with itself. The data is combined on timestamp.


```js
trickle|combine(expressions ...ast.LambdaNode)
```

Returns: [CombineNode](/kapacitor/v1.6/nodes/combine_node/)

<a class="top" href="javascript:document.getElementsByClassName('article-heading')[0].scrollIntoView();" title="top"><span class="icon arrow-up"></span></a>

### Count

Count the number of points.


```js
trickle|count(field string)
```

Returns: [InfluxQLNode](/kapacitor/v1.6/nodes/influx_q_l_node/)

<a class="top" href="javascript:document.getElementsByClassName('article-heading')[0].scrollIntoView();" title="top"><span class="icon arrow-up"></span></a>

### CumulativeSum

Compute a cumulative sum of each point that is received.
A point is emitted for every point collected.


```js
trickle|cumulativeSum(field string)
```

Returns: [InfluxQLNode](/kapacitor/v1.6/nodes/influx_q_l_node/)

<a class="top" href="javascript:document.getElementsByClassName('article-heading')[0].scrollIntoView();" title="top"><span class="icon arrow-up"></span></a>

### Deadman

Helper function for creating an alert on low throughput, a.k.a. deadman's switch.

- Threshold: trigger alert if throughput drops below threshold in points/interval.
- Interval: how often to check the throughput.
- Expressions: optional list of expressions to also evaluate. Useful for time of day alerting.

Example:


```js
    var data = stream
        |from()...
    // Trigger critical alert if the throughput drops below 100 points per 10s and checked every 10s.
    data
        |deadman(100.0, 10s)
    //Do normal processing of data
    data...
```

The above is equivalent to this example:


```js
    var data = stream
        |from()...
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
    var data = stream
        |from()...
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
    var data = stream
        |from()...
    // Trigger critical alert if the throughput drops below 100 points per 10s and checked every 10s.
    // Only trigger the alert if the time of day is between 8am-5pm.
    data
        |deadman(100.0, 10s, lambda: hour("time") >= 8 AND hour("time") <= 17)
    //Do normal processing of data
    data...
```



```js
trickle|deadman(threshold float64, interval time.Duration, expr ...ast.LambdaNode)
```

Returns: [AlertNode](/kapacitor/v1.6/nodes/alert_node/)

<a class="top" href="javascript:document.getElementsByClassName('article-heading')[0].scrollIntoView();" title="top"><span class="icon arrow-up"></span></a>

### Default

Create a node that can set defaults for missing tags or fields.


```js
trickle|default()
```

Returns: [DefaultNode](/kapacitor/v1.6/nodes/default_node/)

<a class="top" href="javascript:document.getElementsByClassName('article-heading')[0].scrollIntoView();" title="top"><span class="icon arrow-up"></span></a>

### Delete

Create a node that can delete tags or fields.


```js
trickle|delete()
```

Returns: [DeleteNode](/kapacitor/v1.6/nodes/delete_node/)

<a class="top" href="javascript:document.getElementsByClassName('article-heading')[0].scrollIntoView();" title="top"><span class="icon arrow-up"></span></a>

### Derivative

Create a new node that computes the derivative of adjacent points.


```js
trickle|derivative(field string)
```

Returns: [DerivativeNode](/kapacitor/v1.6/nodes/derivative_node/)

<a class="top" href="javascript:document.getElementsByClassName('article-heading')[0].scrollIntoView();" title="top"><span class="icon arrow-up"></span></a>

### Difference

Compute the difference between points independent of elapsed time.


```js
trickle|difference(field string)
```

Returns: [InfluxQLNode](/kapacitor/v1.6/nodes/influx_q_l_node/)

<a class="top" href="javascript:document.getElementsByClassName('article-heading')[0].scrollIntoView();" title="top"><span class="icon arrow-up"></span></a>

### Distinct

Produce batch of only the distinct points.


```js
trickle|distinct(field string)
```

Returns: [InfluxQLNode](/kapacitor/v1.6/nodes/influx_q_l_node/)

<a class="top" href="javascript:document.getElementsByClassName('article-heading')[0].scrollIntoView();" title="top"><span class="icon arrow-up"></span></a>

### Ec2Autoscale

Create a node that can trigger autoscale events for a ec2 autoscalegroup.


```js
trickle|ec2Autoscale()
```

Returns: [Ec2AutoscaleNode](/kapacitor/v1.6/nodes/ec2_autoscale_node/)

<a class="top" href="javascript:document.getElementsByClassName('article-heading')[0].scrollIntoView();" title="top"><span class="icon arrow-up"></span></a>

### Elapsed

Compute the elapsed time between points.


```js
trickle|elapsed(field string, unit time.Duration)
```

Returns: [InfluxQLNode](/kapacitor/v1.6/nodes/influx_q_l_node/)

<a class="top" href="javascript:document.getElementsByClassName('article-heading')[0].scrollIntoView();" title="top"><span class="icon arrow-up"></span></a>

### Eval

Create an eval node that will evaluate the given transformation function to each data point.
A list of expressions may be provided and will be evaluated in the order they are given.
The results are available to later expressions.


```js
trickle|eval(expressions ...ast.LambdaNode)
```

Returns: [EvalNode](/kapacitor/v1.6/nodes/eval_node/)

<a class="top" href="javascript:document.getElementsByClassName('article-heading')[0].scrollIntoView();" title="top"><span class="icon arrow-up"></span></a>

### First

Select the first point.


```js
trickle|first(field string)
```

Returns: [InfluxQLNode](/kapacitor/v1.6/nodes/influx_q_l_node/)

<a class="top" href="javascript:document.getElementsByClassName('article-heading')[0].scrollIntoView();" title="top"><span class="icon arrow-up"></span></a>

### Flatten

Flatten points with similar times into a single point.


```js
trickle|flatten()
```

Returns: [FlattenNode](/kapacitor/v1.6/nodes/flatten_node/)

<a class="top" href="javascript:document.getElementsByClassName('article-heading')[0].scrollIntoView();" title="top"><span class="icon arrow-up"></span></a>

### GroupBy

Group the data by a set of tags.

Can pass literal * to group by all dimensions.
Example:


```js
    |groupBy(*)
```



```js
trickle|groupBy(tag ...interface{})
```

Returns: [GroupByNode](/kapacitor/v1.6/nodes/group_by_node/)

<a class="top" href="javascript:document.getElementsByClassName('article-heading')[0].scrollIntoView();" title="top"><span class="icon arrow-up"></span></a>

### HoltWinters

Compute the Holt-Winters (/{{< latest "influxdb" "v1" >}}/query_language/functions/#holt-winters) forecast of a data set.


```js
trickle|holtWinters(field string, h int64, m int64, interval time.Duration)
```

Returns: [InfluxQLNode](/kapacitor/v1.6/nodes/influx_q_l_node/)

<a class="top" href="javascript:document.getElementsByClassName('article-heading')[0].scrollIntoView();" title="top"><span class="icon arrow-up"></span></a>

### HoltWintersWithFit

Compute the Holt-Winters (/{{< latest "influxdb" "v1" >}}/query_language/functions/#holt-winters) forecast of a data set.
This method also outputs all the points used to fit the data in addition to the forecasted data.


```js
trickle|holtWintersWithFit(field string, h int64, m int64, interval time.Duration)
```

Returns: [InfluxQLNode](/kapacitor/v1.6/nodes/influx_q_l_node/)

<a class="top" href="javascript:document.getElementsByClassName('article-heading')[0].scrollIntoView();" title="top"><span class="icon arrow-up"></span></a>

### HttpOut

Create an HTTP output node that caches the most recent data it has received.
The cached data is available at the given endpoint.
The endpoint is the relative path from the API endpoint of the running task.
For example, if the task endpoint is at `/kapacitor/v1/tasks/<task_id>` and endpoint is
`top10`, then the data can be requested from `/kapacitor/v1/tasks/<task_id>/top10`.


```js
trickle|httpOut(endpoint string)
```

Returns: [HTTPOutNode](/kapacitor/v1.6/nodes/http_out_node/)

<a class="top" href="javascript:document.getElementsByClassName('article-heading')[0].scrollIntoView();" title="top"><span class="icon arrow-up"></span></a>

### HttpPost

Creates an HTTP Post node that POSTS received data to the provided HTTP endpoint.
HttpPost expects 0 or 1 arguments. If 0 arguments are provided, you must specify an
endpoint property method.


```js
trickle|httpPost(url ...string)
```

Returns: [HTTPPostNode](/kapacitor/v1.6/nodes/http_post_node/)

<a class="top" href="javascript:document.getElementsByClassName('article-heading')[0].scrollIntoView();" title="top"><span class="icon arrow-up"></span></a>

### InfluxDBOut

Create an influxdb output node that will store the incoming data into InfluxDB.


```js
trickle|influxDBOut()
```

Returns: [InfluxDBOutNode](/kapacitor/v1.6/nodes/influx_d_b_out_node/)

<a class="top" href="javascript:document.getElementsByClassName('article-heading')[0].scrollIntoView();" title="top"><span class="icon arrow-up"></span></a>

### Join

Join this node with other nodes. The data is joined on timestamp.


```js
trickle|join(others ...Node)
```

Returns: [JoinNode](/kapacitor/v1.6/nodes/join_node/)

<a class="top" href="javascript:document.getElementsByClassName('article-heading')[0].scrollIntoView();" title="top"><span class="icon arrow-up"></span></a>

### K8sAutoscale

Create a node that can trigger autoscale events for a kubernetes cluster.


```js
trickle|k8sAutoscale()
```

Returns: [K8sAutoscaleNode](/kapacitor/v1.6/nodes/k8s_autoscale_node/)

<a class="top" href="javascript:document.getElementsByClassName('article-heading')[0].scrollIntoView();" title="top"><span class="icon arrow-up"></span></a>

### KapacitorLoopback

Create an kapacitor loopback node that will send data back into Kapacitor as a stream.


```js
trickle|kapacitorLoopback()
```

Returns: [KapacitorLoopbackNode](/kapacitor/v1.6/nodes/kapacitor_loopback_node/)

<a class="top" href="javascript:document.getElementsByClassName('article-heading')[0].scrollIntoView();" title="top"><span class="icon arrow-up"></span></a>

### Last

Select the last point.


```js
trickle|last(field string)
```

Returns: [InfluxQLNode](/kapacitor/v1.6/nodes/influx_q_l_node/)

<a class="top" href="javascript:document.getElementsByClassName('article-heading')[0].scrollIntoView();" title="top"><span class="icon arrow-up"></span></a>

### Log

Create a node that logs all data it receives.


```js
trickle|log()
```

Returns: [LogNode](/kapacitor/v1.6/nodes/log_node/)

<a class="top" href="javascript:document.getElementsByClassName('article-heading')[0].scrollIntoView();" title="top"><span class="icon arrow-up"></span></a>

### Max

Select the maximum point.


```js
trickle|max(field string)
```

Returns: [InfluxQLNode](/kapacitor/v1.6/nodes/influx_q_l_node/)

<a class="top" href="javascript:document.getElementsByClassName('article-heading')[0].scrollIntoView();" title="top"><span class="icon arrow-up"></span></a>

### Mean

Compute the mean of the data.


```js
trickle|mean(field string)
```

Returns: [InfluxQLNode](/kapacitor/v1.6/nodes/influx_q_l_node/)

<a class="top" href="javascript:document.getElementsByClassName('article-heading')[0].scrollIntoView();" title="top"><span class="icon arrow-up"></span></a>

### Median

Compute the median of the data.

> **Note:** This method is not a selector.
If you want the median point, use `.percentile(field, 50.0)`.


```js
trickle|median(field string)
```

Returns: [InfluxQLNode](/kapacitor/v1.6/nodes/influx_q_l_node/)

<a class="top" href="javascript:document.getElementsByClassName('article-heading')[0].scrollIntoView();" title="top"><span class="icon arrow-up"></span></a>

### Min

Select the minimum point.


```js
trickle|min(field string)
```

Returns: [InfluxQLNode](/kapacitor/v1.6/nodes/influx_q_l_node/)

<a class="top" href="javascript:document.getElementsByClassName('article-heading')[0].scrollIntoView();" title="top"><span class="icon arrow-up"></span></a>

### Mode

Compute the mode of the data.


```js
trickle|mode(field string)
```

Returns: [InfluxQLNode](/kapacitor/v1.6/nodes/influx_q_l_node/)

<a class="top" href="javascript:document.getElementsByClassName('article-heading')[0].scrollIntoView();" title="top"><span class="icon arrow-up"></span></a>

### MovingAverage

Compute a moving average of the last window points.
No points are emitted until the window is full.


```js
trickle|movingAverage(field string, window int64)
```

Returns: [InfluxQLNode](/kapacitor/v1.6/nodes/influx_q_l_node/)

<a class="top" href="javascript:document.getElementsByClassName('article-heading')[0].scrollIntoView();" title="top"><span class="icon arrow-up"></span></a>

### Percentile

Select a point at the given percentile. This is a selector function, no interpolation between points is performed.


```js
trickle|percentile(field string, percentile float64)
```

Returns: [InfluxQLNode](/kapacitor/v1.6/nodes/influx_q_l_node/)

<a class="top" href="javascript:document.getElementsByClassName('article-heading')[0].scrollIntoView();" title="top"><span class="icon arrow-up"></span></a>

### Sample

Create a new node that samples the incoming points or batches.

One point will be emitted every count or duration specified.


```js
trickle|sample(rate interface{})
```

Returns: [SampleNode](/kapacitor/v1.6/nodes/sample_node/)

<a class="top" href="javascript:document.getElementsByClassName('article-heading')[0].scrollIntoView();" title="top"><span class="icon arrow-up"></span></a>

### Shift

Create a new node that shifts the incoming points or batches in time.


```js
trickle|shift(shift time.Duration)
```

Returns: [ShiftNode](/kapacitor/v1.6/nodes/shift_node/)

<a class="top" href="javascript:document.getElementsByClassName('article-heading')[0].scrollIntoView();" title="top"><span class="icon arrow-up"></span></a>

### Sideload

Create a node that can load data from external sources.


```js
trickle|sideload()
```

Returns: [SideloadNode](/kapacitor/v1.6/nodes/sideload_node/)

<a class="top" href="javascript:document.getElementsByClassName('article-heading')[0].scrollIntoView();" title="top"><span class="icon arrow-up"></span></a>

### Spread

Compute the difference between `min` and `max` points.


```js
trickle|spread(field string)
```

Returns: [InfluxQLNode](/kapacitor/v1.6/nodes/influx_q_l_node/)

<a class="top" href="javascript:document.getElementsByClassName('article-heading')[0].scrollIntoView();" title="top"><span class="icon arrow-up"></span></a>

### StateCount

Create a node that tracks number of consecutive points in a given state.


```js
trickle|stateCount(expression ast.LambdaNode)
```

Returns: [StateCountNode](/kapacitor/v1.6/nodes/state_count_node/)

<a class="top" href="javascript:document.getElementsByClassName('article-heading')[0].scrollIntoView();" title="top"><span class="icon arrow-up"></span></a>

### StateDuration

Create a node that tracks duration in a given state.


```js
trickle|stateDuration(expression ast.LambdaNode)
```

Returns: [StateDurationNode](/kapacitor/v1.6/nodes/state_duration_node/)

<a class="top" href="javascript:document.getElementsByClassName('article-heading')[0].scrollIntoView();" title="top"><span class="icon arrow-up"></span></a>

### Stats

Create a new stream of data that contains the internal statistics of the node.
The interval represents how often to emit the statistics based on real time.
This means the interval time is independent of the times of the data points the source node is receiving.


```js
trickle|stats(interval time.Duration)
```

Returns: [StatsNode](/kapacitor/v1.6/nodes/stats_node/)

<a class="top" href="javascript:document.getElementsByClassName('article-heading')[0].scrollIntoView();" title="top"><span class="icon arrow-up"></span></a>

### Stddev

Compute the standard deviation.


```js
trickle|stddev(field string)
```

Returns: [InfluxQLNode](/kapacitor/v1.6/nodes/influx_q_l_node/)

<a class="top" href="javascript:document.getElementsByClassName('article-heading')[0].scrollIntoView();" title="top"><span class="icon arrow-up"></span></a>

### Sum

Compute the sum of all values.


```js
trickle|sum(field string)
```

Returns: [InfluxQLNode](/kapacitor/v1.6/nodes/influx_q_l_node/)

<a class="top" href="javascript:document.getElementsByClassName('article-heading')[0].scrollIntoView();" title="top"><span class="icon arrow-up"></span></a>

### SwarmAutoscale

Create a node that can trigger autoscale events for a Docker swarm cluster.


```js
trickle|swarmAutoscale()
```

Returns: [SwarmAutoscaleNode](/kapacitor/v1.6/nodes/swarm_autoscale_node/)

<a class="top" href="javascript:document.getElementsByClassName('article-heading')[0].scrollIntoView();" title="top"><span class="icon arrow-up"></span></a>

### Top

Select the top `num` points for `field` and sort by any extra tags or fields.


```js
trickle|top(num int64, field string, fieldsAndTags ...string)
```

Returns: [InfluxQLNode](/kapacitor/v1.6/nodes/influx_q_l_node/)

<a class="top" href="javascript:document.getElementsByClassName('article-heading')[0].scrollIntoView();" title="top"><span class="icon arrow-up"></span></a>

### Trickle

Create a new node that converts batch data to stream data.

```js
trickle|trickle()
```

Returns: [TrickleNode](/kapacitor/v1.6/nodes/trickle_node/)

<a class="top" href="javascript:document.getElementsByClassName('article-heading')[0].scrollIntoView();" title="top"><span class="icon arrow-up"></span></a>

### Union

Perform the union of this node and all other given nodes.


```js
trickle|union(node ...Node)
```

Returns: [UnionNode](/kapacitor/v1.6/nodes/union_node/)

<a class="top" href="javascript:document.getElementsByClassName('article-heading')[0].scrollIntoView();" title="top"><span class="icon arrow-up"></span></a>

### Where

Create a new node that filters the data stream by a given expression.


```js
trickle|where(expression ast.LambdaNode)
```

Returns: [WhereNode](/kapacitor/v1.6/nodes/where_node/)

<a class="top" href="javascript:document.getElementsByClassName('article-heading')[0].scrollIntoView();" title="top"><span class="icon arrow-up"></span></a>

### Window

Create a new node that windows the stream by time.

NOTE: Window can only be applied to stream edges.


```js
trickle|window()
```

Returns: [WindowNode](/kapacitor/v1.6/nodes/window_node/)

<a class="top" href="javascript:document.getElementsByClassName('article-heading')[0].scrollIntoView();" title="top"><span class="icon arrow-up"></span></a>
