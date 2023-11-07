---
title: experimental.group() function
description: >
  `experimental.group()` introduces an `extend` mode to the existing `group()` function.
menu:
  flux_v0_ref:
    name: experimental.group
    parent: experimental
    identifier: experimental/group
weight: 101
flux/v0/tags: [transformations]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/experimental.flux#L179-L179

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`experimental.group()` introduces an `extend` mode to the existing `group()` function.



##### Function type signature

```js
(<-tables: stream[A], columns: [string], mode: string) => stream[A] where A: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### columns
({{< req >}})
List of columns to use in the grouping operation. Default is `[]`.



### mode
({{< req >}})
Grouping mode. `extend` is the only mode available to `experimental.group()`.

#### Grouping modes
- **extend**: Appends columns defined in the `columns` parameter to group keys.

### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Add a column to the group key

```js
import "experimental"

data
    |> experimental.group(columns: ["region"], mode: "extend")

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | *host | region  | _value  |
| -------------------- | ----- | ------- | ------- |
| 2021-01-01T00:00:00Z | host1 | east    | 41      |
| 2021-01-01T00:01:00Z | host1 | east    | 48      |
| 2021-01-01T00:00:00Z | host1 | west    | 34      |
| 2021-01-01T00:01:00Z | host1 | west    | 12      |

| _time                | *host | region  | _value  |
| -------------------- | ----- | ------- | ------- |
| 2021-01-01T00:00:00Z | host2 | east    | 56      |
| 2021-01-01T00:01:00Z | host2 | east    | 72      |
| 2021-01-01T00:00:00Z | host2 | west    | 43      |
| 2021-01-01T00:01:00Z | host2 | west    | 22      |


#### Output data

| _time                | *host | *region | _value  |
| -------------------- | ----- | ------- | ------- |
| 2021-01-01T00:00:00Z | host1 | east    | 41      |
| 2021-01-01T00:01:00Z | host1 | east    | 48      |

| _time                | *host | *region | _value  |
| -------------------- | ----- | ------- | ------- |
| 2021-01-01T00:00:00Z | host1 | west    | 34      |
| 2021-01-01T00:01:00Z | host1 | west    | 12      |

| _time                | *host | *region | _value  |
| -------------------- | ----- | ------- | ------- |
| 2021-01-01T00:00:00Z | host2 | east    | 56      |
| 2021-01-01T00:01:00Z | host2 | east    | 72      |

| _time                | *host | *region | _value  |
| -------------------- | ----- | ------- | ------- |
| 2021-01-01T00:00:00Z | host2 | west    | 43      |
| 2021-01-01T00:01:00Z | host2 | west    | 22      |

{{% /expand %}}
{{< /expand-wrapper >}}
