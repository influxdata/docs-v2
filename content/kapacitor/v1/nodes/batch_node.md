---
title: BatchNode
description: >
  BatchNode handles creating several child QueryNode or QueryFluxNodes.
  Each call to `query` or `queryFlux` creates a child batch node that can further be configured.
  The `batch` variable in batch tasks is an instance of BatchNode.
menu:
  kapacitor_v1_ref:
    name: BatchNode
    identifier: batch_node
    weight: 100
    parent: nodes
---

The `batch` node handles the creation of several child QueryNode or QueryFluxNodes.
Each call to [`query`](/kapacitor/v1/nodes/query_node) or [`queryFlux`](/kapacitor/v1/nodes/query_flux_node)
creates a child batch node that can further be configured.
_See [QueryNode](/kapacitor/v1/nodes/query_node/) and [QueryFluxNode](/kapacitor/v1/nodes/query_flux_node/)._
The `batch` variable in batch tasks is an instance of
a [BatchNode.](/kapacitor/v1/nodes/batch_node/)

> A **QueryNode** or **QueryFluxNode** is required when using **BatchNode**.
> They defines the source and schedule for batch data and should be used before
> any other [chaining methods](#chaining-methods-1).

Examples:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[QueryNode](#)
[QueryFluxNode](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```js
var errors = batch
              |query('SELECT value from errors')
              ...
var views = batch
              |query('SELECT value from views')
              ...
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```js
var errors = batch
              |queryFlux('''
                from(bucket: "example-bucket")
                  |> range(start: -1m) 
                  |> filter(fn: (r) => r._measurement == "errors")
              ''')
              ...
var views = batch
              |queryFlux('''
                from(bucket: "example-bucket")
                  |> range(start: -1m) 
                  |> filter(fn: (r) => r._measurement == "views")
              ''')
              ...
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

Available Statistics:

* query_errors: number of errors when querying
* batches_queried: number of batches returned from queries
* points_queried: total number of points in batches


### Constructor

| Chaining Method | Description |
|:---------|:---------|
| **batch** | Has no constructor signature. |

### Property Methods

| Setters | Description |
|:--------|:------------|
| **[quiet](#quiet)&nbsp;(&nbsp;)** | Suppress all error logging events from this node. |


### Chaining Methods
[Deadman](#deadman),
[Query](#query),
[FluxQuery](#queryflux),
[Stats](#stats)

---

## Properties

Property methods modify state on the calling node.
They do not add another node to the pipeline, and always return a reference to the calling node.
Property methods are marked using the `.` operator.


### Quiet

Suppress all error logging events from this node.

```js
batch.quiet()
```

## Chaining Methods

Chaining methods create a new node in the pipeline as a child of the calling node.
They do not modify the calling node.
Chaining methods are marked using the `|` operator.


### Deadman

Helper function for creating an alert on low throughput, a.k.a. deadman's switch.

- Threshold: trigger alert if throughput drops below threshold in points/interval.
- Interval: how often to check the throughput.
- Expressions: optional list of expressions to also evaluate. Useful for time of day alerting.

Example:


```js
    var data = batch
        |query()...
    // Trigger critical alert if the throughput drops below 100 points per 10s and checked every 10s.
    data
        |deadman(100.0, 10s)
    //Do normal processing of data
    data...
```

The above is equivalent to this example:


```js
    var data = batch
        |query()...
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

Since the [AlertNode](/kapacitor/v1/nodes/alert_node/) is the last piece it can be further modified as usual.
Example:


```js
    var data = batch
        |query()...
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
        |query()...
    // Trigger critical alert if the throughput drops below 100 points per 10s and checked every 10s.
    // Only trigger the alert if the time of day is between 8am-5pm.
    data
        |deadman(100.0, 10s, lambda: hour("time") >= 8 AND hour("time") <= 17)
    //Do normal processing of data
    data...
```



```js
batch|deadman(threshold float64, interval time.Duration, expr ...ast.LambdaNode)
```

Returns: [AlertNode](/kapacitor/v1/nodes/alert_node/)

### Query

The query to execute. Must not contain a time condition
in the `WHERE` clause or contain a `GROUP BY` clause.
The time conditions are added dynamically according to the period, offset and schedule.
The `GROUP BY` clause is added dynamically according to the dimensions
passed to the `groupBy` method.


```js
batch|query(q string)
```

Returns: [QueryNode](/kapacitor/v1/nodes/query_node/)

### QueryFlux

The Flux query to execute.

```js
batch|QueryFlux(queryStr string)
```

Returns: [QueryFluxNode](/kapacitor/v1/nodes/query_flux_node/)

### Stats

Create a new stream of data that contains the internal statistics of the node.
The interval represents how often to emit the statistics based on real time.
This means the interval time is independent of the times of the data points the source node is receiving.


```js
batch|stats(interval time.Duration)
```

Returns: [StatsNode](/kapacitor/v1/nodes/stats_node/)
