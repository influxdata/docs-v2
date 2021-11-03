---
title: Query fields and tags
seotitle: Query fields and tags in InfluxDB using Flux
description: >
    Use `filter()` to query data based on fields, tags, or any other column value.
    `filter()` performs operations similar to the `SELECT` statement and the `WHERE`
    clause in InfluxQL and other SQL-like query languages.
weight: 201
menu:
  influxdb_2_1:
    parent: Query with Flux
influxdb/v2.1/tags: [query, select, where]
related:
  - /{{< latest "flux" >}}/stdlib/universe/filter/
  - /influxdb/v2.1/query-data/flux/conditional-logic/
  - /influxdb/v2.1/query-data/flux/regular-expressions/
list_code_example: |
  ```js
  from(bucket: "example-bucket")
    |> range(start: -1h)
    |> filter(fn: (r) =>
        r._measurement == "example-measurement" and
        r._field == "example-field" and
        r.tag == "example-tag"
    )
  ```
---

Use [`filter()`](/{{< latest "flux" >}}/stdlib/universe/filter/)
to query data based on fields, tags, or any other column value.
`filter()` performs operations similar to the `SELECT` statement and the `WHERE`
clause in InfluxQL and other SQL-like query languages.

## The filter() function
`filter()` has an `fn` parameter that expects a [predicate function](/influxdb/v2.1/reference/glossary/#predicate-function),
an anonymous function comprised of one or more [predicate expressions](/influxdb/v2.1/reference/glossary/#predicate-expression).
The predicate function evaluates each input row.
Rows that evaluate to `true` are **included** in the output data.
Rows that evaluate to `false` are **excluded** from the output data.

```js
// ...
  |> filter(fn: (r) => r._measurement == "example-measurement" )
```

The `fn` predicate function requires an `r` argument, which represents each row
as `filter()` iterates over input data.
Key-value pairs in the row record represent columns and their values.
Use [dot notation or bracket notation](/{{< latest "flux" >}}/data-types/composite/record/#reference-values-in-a-record) 
to reference specific column values in the predicate function.
Use [logical operators](/{{< latest "flux" >}}/spec/operators/#logical-operators)
to chain multiple predicate expressions together.

```js
// Row record
r = {foo: "bar", baz: "quz"}

// Example predicate function
(r) => r.foo == "bar" and r["baz"] == "quz"

// Evaluation results
(r) => true and true
```

## Filter by fields and tags
The combination of [`from()`](/{{< latest "flux" >}}/stdlib/influxdata/influxdb/from),
[`range()`](/{{< latest "flux" >}}/stdlib/universe/range),
and `filter()` represent the most basic Flux query:

1. Use `from()` to define your [bucket](/influxdb/v2.1/reference/glossary/#bucket).
2. Use `range()` to limit query results by time.
3. Use `filter()` to identify what rows of data to output.

```js
from(bucket: "example-bucket")
  |> range(start: -1h)
  |> filter(fn: (r) =>
      r._measurement == "example-measurement" and
      r._field == "example-field" and
      r.tag == "example-tag"
  )
```
