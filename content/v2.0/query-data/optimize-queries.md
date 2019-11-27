---
title: Optimize Flux queries
description: >
  Optimize your Flux queries by changing function order, understanding how functions work,
  and being conscious of the nature of the data queried.
weight: 104
menu:
  v2_0:
    name: Optimize queries
    parent: Query data
v2.0/tags: [query]
---

Optimize your Flux queries with a few simple principles.
Query optimizations center around reducing the memory and compute (CPU) requirements
of a query by changing function order, understanding how functions work, and being
conscious of the nature of the data queried.

## Start queries with pushdown functions
Certain Flux functions can push their data manipulation down to the underlying
data source rather than pulling the data into memory and manipulating it there.
Using "pushdown" functions reduces the amount of memory necessary to run a query.
However, to benefit from these performance gains, you must **use pushdown functions
at the beginning of your query**.
When a non-pushdown function runs, Flux pulls the data into memory and manipulates the data there.
All subsequent functions must operate in memory, including pushdown-capable functions.

#### Pushdown functions
- [range()](/v2.0/reference/flux/stdlib/built-in/transformations/range/)
- [filter()](/v2.0/reference/flux/stdlib/built-in/transformations/filter/)
- [group()](/v2.0/reference/flux/stdlib/built-in/transformations/group/)

##### Pushdown functions in use
```js
from(bucket: "example-bucket")
  |> range(start: -1h)                       //
  |> filter(fn: (r) => r.sensor == "abc123") // Pushed to the data source
  |> group(columns: ["_field", "host"])      //

  |> aggregateWindow(every: 5m, fn: max)     //
  |> filter(fn: (r) => r._value >= 90.0)     // Run in memory
  |> top(n: 10)                              //
```

## Don't over-window data
Windowing (grouping data based on time intervals) is commonly used to aggregate and downsample data.
It's important to not "over-window" your data by using short window durations.
The more windows Flux creates, the more compute power it needs to evaluate which
window each row should be assigned to.

Reasonable window durations depend on the total time range queried.

## Use "heavy" functions sparingly
Some Flux functions are known to use more memory or CPU than others.
These provide vital functionality to Flux and your data processing workflow,
but use them only when necessary.

The following functions are known to be "heavy:"

- [map()](/v2.0/reference/flux/stdlib/built-in/transformations/map/)
- [reduce()](/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/reduce/)
- [window()](/v2.0/reference/flux/stdlib/built-in/transformations/window/)
- [join()](/v2.0/reference/flux/stdlib/built-in/transformations/join/)
- [union()](/v2.0/reference/flux/stdlib/built-in/transformations/union/)
- [pivot()](/v2.0/reference/flux/stdlib/built-in/transformations/pivot/)

{{% note %}}
Flux engineers are in the process of optimizing functions.
This list may not represent the current state of Flux and will be updated over time.
{{% /note %}}

## Balance time range vs data precision
To ensure queries are performant, be sure to balance the time range of your query
with the precision of your data.
For example, if you query data with values stored every second and you request
six months worth of data, results will include a minimum of ≈15.5 million points.
Flux has to store that data in memory as it generates a response.

To query data over large periods of time, consider creating a task to
[downsample high-resolution data](/v2.0/process-data/common-tasks/downsample-data/)
into lower resolution data.
Then query the low-resolution data using larger time ranges.
