---
title: yield() function
description: The `yield()` function indicates the input tables received should be delivered as a result of the query.
aliases:
  - /influxdb/v2.0/reference/flux/functions/outputs/yield
  - /influxdb/v2.0/reference/flux/functions/built-in/outputs/yield/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/outputs/yield/
  - /influxdb/cloud/reference/flux/stdlib/built-in/outputs/yield/
menu:
  flux_0_x_ref:
    name: yield
    parent: universe
weight: 102
flux/v0.x/tags: [outputs]
related:
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-data/#the-basic-select-statement, InfluxQL – SELECT AS
introduced: 0.7.0
---

The `yield()` function indicates the input tables received should be delivered as a result of the query.
Yield outputs the input stream unmodified.
A query may have multiple results, each identified by the name provided to the `yield()` function.

```js
yield(name: "custom-name")
```

{{% note %}}
`yield()` is implicit for queries that do only one thing and are only needed when using multiple sources in a query.
With multiple sources, `yield()` is required to specify what is returned, and what name to give it.
{{% /note %}}

## Parameters

### name {data-type="string"}
A unique name for the yielded results.
Default is `"_results"`.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples
```js
from(bucket: "example-bucket")
  |> range(start: -5m)
  |> yield(name: "1")
```
