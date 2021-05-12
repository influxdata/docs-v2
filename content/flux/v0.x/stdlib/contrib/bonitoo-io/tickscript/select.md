---
title: tickscript.select() function
description: >
  The `tickscript.select()` function changes a column's name and optionally applies
  an aggregate or selector function to values in the column.
menu:
  flux_0_x_ref:
    name: tickscript.select
    parent: tickscript
weight: 302
related:
  - /flux/v0.x/stdlib/contrib/bonitoo-io/tickscript/selectwindow/
  - /{{< latest "kapacitor" >}}/nodes/query_node/
flux/v0.x/tags: [transformations]
introduced: 0.111.0
---

The `tickscript.select()` function changes a column's name and optionally applies
an aggregate or selector function to values in the column.

```js
import "contrib/bonitoo-io/tickscript"

tickscript.select(
  column: "_value",
  fn: sum,
  as: "example-name"
)
```

#### TICKscript helper function
`tickscript.select()` is a helper function meant to replicate TICKscript operations
like the following:

```js
// Rename
query("SELECT x AS y")

// Aggregate and rename
query("SELECT f(x) AS y")
```

## Parameters

### column {data-type="string"}
Column to operate on.
Default is `_value`.

### fn {data-type="function"}
[Aggregate](/flux/v0.x/function-types/#saggregates/) or [selector](/flux/v0.x/function-types/#selectors)
function to apply.

### as {data-type="string"}
({{< req >}})
New column name.

## Examples

- [Change the name of the value column](#change-the-name-of-the-value-column)
- [Change the name of the value column and apply an aggregate function](#change-the-name-of-the-value-column-and-apply-an-aggregate-function)
- [Change the name of the value column and apply a selector function](#change-the-name-of-the-value-column-and-apply-a-selector-function)

---

#### Change the name of the value column
```js
import "contrib/bonitoo-io/tickscript"

data
  |> tickscript.select(as: "example-name")
```

{{< flex >}}
{{% flex-content %}}
##### Input data
| _time                | _value |
|:-----                | ------:|
| 2021-01-01T00:00:00Z | 1.2    |
| 2021-01-01T01:00:00Z | 3.2    |
| 2021-01-01T02:00:00Z | 4.0    |
{{% /flex-content %}}
{{% flex-content %}}
##### Output data
| _time                | example-name |
|:-----                | ------------:|
| 2021-01-01T00:00:00Z | 1.2          |
| 2021-01-01T01:00:00Z | 3.2          |
| 2021-01-01T02:00:00Z | 4.0          |
{{% /flex-content %}}
{{< /flex >}}

---

#### Change the name of the value column and apply an aggregate function
```js
import "contrib/bonitoo-io/tickscript"

data
  |> tickscript.select(
    as: "sum",
    fn: sum
  )
```

{{< flex >}}
{{% flex-content %}}
##### Input data
| _time                | _value |
|:-----                | ------:|
| 2021-01-01T00:00:00Z | 1.2    |
| 2021-01-01T01:00:00Z | 3.2    |
| 2021-01-01T02:00:00Z | 4.0    |
{{% /flex-content %}}
{{% flex-content %}}
##### Output data
| sum |
|:---:|
| 8.4 |
{{% /flex-content %}}
{{< /flex >}}

---

#### Change the name of the value column and apply a selector function
```js
import "contrib/bonitoo-io/tickscript"

data
  |> tickscript.select(
    as: "max",
    fn: max
  )
```

{{< flex >}}
{{% flex-content %}}
##### Input data
| _time                | _value |
|:-----                | ------:|
| 2021-01-01T00:00:00Z | 1.2    |
| 2021-01-01T01:00:00Z | 3.2    |
| 2021-01-01T02:00:00Z | 4.0    |
{{% /flex-content %}}
{{% flex-content %}}
##### Output data
| _time                | max |
|:-----                | ---:|
| 2021-01-01T02:00:00Z | 4.0 |
{{% /flex-content %}}
{{< /flex >}}

---
