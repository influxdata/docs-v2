---
title: tableFind() function
description: >
  The `tableFind()` function extracts the first table in a stream of tables whose
  group key values match a predicate. If no table is found, the function errors.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/stream-table/tablefind/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/stream-table/tablefind/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/stream-table/tablefind/
menu:
  flux_0_x_ref:
    name: tableFind
    parent: universe
weight: 102
flux/v0.x/tags: [dynamic queries]
related:
  - /{{< latest "influxdb" >}}/query-data/flux/scalar-values/
introduced: 0.29.0
---

The `tableFind()` function extracts the first table in a stream of tables whose
group key values match a predicate. If no table is found, the function errors.

```js
tableFind(fn: (key) => key._field == "fieldName")
```

## Parameters

{{% note %}}
Make sure `fn` parameter names match each specified parameter.
To learn why, see [Match parameter names](/flux/v0.x/spec/data-model/#match-parameter-names).
{{% /note %}}

### fn {data-type="function"}

A predicate function for matching keys in a table's group key.
`tableFind` returns the first table that resolves as `true`.
Expects a `key` argument that represents a group key in the input stream.

##### Example fn function

```js
(key) => key._field == "fieldName"
```

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Example
{{% flux/sample-example-intro %}}

```js
import "sampledata"

t = sampledata.int()
    |> tableFind(fn: (key) => key.tag == "t2")

// t represents the first table in a stream whose group key
// contains "tag" with a value of "t2".
```

{{% note %}}
You can use `t` from the example above as input for [`getColumn()`](/flux/v0.x/stdlib/universe/getcolumn/)
and [`getRecord()`](/flux/v0.x/stdlib/universe/getrecord/).
{{% /note %}}
