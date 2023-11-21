---
title: rename() function
description: >
  `rename()` renames columns in a table.
menu:
  flux_v0_ref:
    name: rename
    parent: universe
    identifier: universe/rename
weight: 101
flux/v0/tags: [transformations]
introduced: 0.7.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L2287-L2291

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`rename()` renames columns in a table.

If a column in the group key is renamed, the column name in the group key is updated.

##### Function type signature

```js
(<-tables: stream[B], ?columns: A, ?fn: (column: string) => string) => stream[C] where A: Record, B: Record, C: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### columns

Record that maps old column names to new column names.



### fn

Function that takes the current column name (`column`) and returns a
new column name.



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

- [Explicitly map column names to new column names](#explicitly-map-column-names-to-new-column-names)
- [Rename columns using a function](#rename-columns-using-a-function)
- [Conditionally rename columns using a function](#conditionally-rename-columns-using-a-function)

### Explicitly map column names to new column names

```js
import "sampledata"

sampledata.int()
    |> rename(columns: {tag: "uid", _value: "val"})

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | -2      | t1   |
| 2021-01-01T00:00:10Z | 10      | t1   |
| 2021-01-01T00:00:20Z | 7       | t1   |
| 2021-01-01T00:00:30Z | 17      | t1   |
| 2021-01-01T00:00:40Z | 15      | t1   |
| 2021-01-01T00:00:50Z | 4       | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 19      | t2   |
| 2021-01-01T00:00:10Z | 4       | t2   |
| 2021-01-01T00:00:20Z | -3      | t2   |
| 2021-01-01T00:00:30Z | 19      | t2   |
| 2021-01-01T00:00:40Z | 13      | t2   |
| 2021-01-01T00:00:50Z | 1       | t2   |


#### Output data

| _time                | val  | *uid |
| -------------------- | ---- | ---- |
| 2021-01-01T00:00:00Z | -2   | t1   |
| 2021-01-01T00:00:10Z | 10   | t1   |
| 2021-01-01T00:00:20Z | 7    | t1   |
| 2021-01-01T00:00:30Z | 17   | t1   |
| 2021-01-01T00:00:40Z | 15   | t1   |
| 2021-01-01T00:00:50Z | 4    | t1   |

| _time                | val  | *uid |
| -------------------- | ---- | ---- |
| 2021-01-01T00:00:00Z | 19   | t2   |
| 2021-01-01T00:00:10Z | 4    | t2   |
| 2021-01-01T00:00:20Z | -3   | t2   |
| 2021-01-01T00:00:30Z | 19   | t2   |
| 2021-01-01T00:00:40Z | 13   | t2   |
| 2021-01-01T00:00:50Z | 1    | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}

### Rename columns using a function

```js
import "sampledata"

sampledata.int()
    |> rename(fn: (column) => "${column}_new")

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | -2      | t1   |
| 2021-01-01T00:00:10Z | 10      | t1   |
| 2021-01-01T00:00:20Z | 7       | t1   |
| 2021-01-01T00:00:30Z | 17      | t1   |
| 2021-01-01T00:00:40Z | 15      | t1   |
| 2021-01-01T00:00:50Z | 4       | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 19      | t2   |
| 2021-01-01T00:00:10Z | 4       | t2   |
| 2021-01-01T00:00:20Z | -3      | t2   |
| 2021-01-01T00:00:30Z | 19      | t2   |
| 2021-01-01T00:00:40Z | 13      | t2   |
| 2021-01-01T00:00:50Z | 1       | t2   |


#### Output data

| _time_new            | _value_new  | *tag_new |
| -------------------- | ----------- | -------- |
| 2021-01-01T00:00:00Z | -2          | t1       |
| 2021-01-01T00:00:10Z | 10          | t1       |
| 2021-01-01T00:00:20Z | 7           | t1       |
| 2021-01-01T00:00:30Z | 17          | t1       |
| 2021-01-01T00:00:40Z | 15          | t1       |
| 2021-01-01T00:00:50Z | 4           | t1       |

| _time_new            | _value_new  | *tag_new |
| -------------------- | ----------- | -------- |
| 2021-01-01T00:00:00Z | 19          | t2       |
| 2021-01-01T00:00:10Z | 4           | t2       |
| 2021-01-01T00:00:20Z | -3          | t2       |
| 2021-01-01T00:00:30Z | 19          | t2       |
| 2021-01-01T00:00:40Z | 13          | t2       |
| 2021-01-01T00:00:50Z | 1           | t2       |

{{% /expand %}}
{{< /expand-wrapper >}}

### Conditionally rename columns using a function

```js
import "sampledata"

sampledata.int()
    |> rename(
        fn: (column) => {
            _newColumnName = if column =~ /^_/ then "${column} (Reserved)" else column

            return _newColumnName
        },
    )

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | -2      | t1   |
| 2021-01-01T00:00:10Z | 10      | t1   |
| 2021-01-01T00:00:20Z | 7       | t1   |
| 2021-01-01T00:00:30Z | 17      | t1   |
| 2021-01-01T00:00:40Z | 15      | t1   |
| 2021-01-01T00:00:50Z | 4       | t1   |

| _time                | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 19      | t2   |
| 2021-01-01T00:00:10Z | 4       | t2   |
| 2021-01-01T00:00:20Z | -3      | t2   |
| 2021-01-01T00:00:30Z | 19      | t2   |
| 2021-01-01T00:00:40Z | 13      | t2   |
| 2021-01-01T00:00:50Z | 1       | t2   |


#### Output data

| _time (Reserved)     | _value (Reserved)  | *tag |
| -------------------- | ------------------ | ---- |
| 2021-01-01T00:00:00Z | -2                 | t1   |
| 2021-01-01T00:00:10Z | 10                 | t1   |
| 2021-01-01T00:00:20Z | 7                  | t1   |
| 2021-01-01T00:00:30Z | 17                 | t1   |
| 2021-01-01T00:00:40Z | 15                 | t1   |
| 2021-01-01T00:00:50Z | 4                  | t1   |

| _time (Reserved)     | _value (Reserved)  | *tag |
| -------------------- | ------------------ | ---- |
| 2021-01-01T00:00:00Z | 19                 | t2   |
| 2021-01-01T00:00:10Z | 4                  | t2   |
| 2021-01-01T00:00:20Z | -3                 | t2   |
| 2021-01-01T00:00:30Z | 19                 | t2   |
| 2021-01-01T00:00:40Z | 13                 | t2   |
| 2021-01-01T00:00:50Z | 1                  | t2   |

{{% /expand %}}
{{< /expand-wrapper >}}
