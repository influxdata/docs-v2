---
title: experimental.unpivot() function
description: >
  `experimental.unpivot()` creates `_field` and `_value` columns pairs using all columns (other than `_time`)
  _not_ in the group key.
  The `_field` column contains the original column label and the `_value` column
  contains the original column value.
menu:
  flux_v0_ref:
    name: experimental.unpivot
    parent: experimental
    identifier: experimental/unpivot
weight: 101
flux/v0/tags: [transformations]
introduced: 0.172.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/experimental.flux#L1350-L1356

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`experimental.unpivot()` creates `_field` and `_value` columns pairs using all columns (other than `_time`)
_not_ in the group key.
The `_field` column contains the original column label and the `_value` column
contains the original column value.

The output stream retains the group key and all group key columns of the input stream.
`_field` is added to the output group key.

##### Function type signature

```js
(<-tables: stream[{A with _time: time}], ?otherColumns: [string]) => stream[{B with _value: C, _field: string}] where A: Record, B: Record
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### tables

Input data. Default is piped-forward data (`<-`).



### otherColumns

List of column names that are not in the group key but are also not field columns. Default is `["_time"]`.




## Examples

### Unpivot data into _field and _value columns

```js
import "experimental"

data
    |> experimental.unpivot()

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | *location | temp  | hum  |
| -------------------- | --------- | ----- | ---- |
| 2022-01-01T00:00:00Z | Denver    | 10.2  | 81.5 |
| 2022-01-02T00:00:00Z | Denver    | 12.4  | 41.3 |

| _time                | *location | temp  | hum  |
| -------------------- | --------- | ----- | ---- |
| 2022-01-01T00:00:00Z | New York  | 50.1  | 99.2 |
| 2022-01-02T00:00:00Z | New York  | 55.8  | 97.7 |


#### Output data

| *location | *_field | _time                | _value  |
| --------- | ------- | -------------------- | ------- |
| Denver    | hum     | 2022-01-01T00:00:00Z | 81.5    |
| Denver    | hum     | 2022-01-02T00:00:00Z | 41.3    |

| *location | *_field | _time                | _value  |
| --------- | ------- | -------------------- | ------- |
| New York  | hum     | 2022-01-01T00:00:00Z | 99.2    |
| New York  | hum     | 2022-01-02T00:00:00Z | 97.7    |

| *location | *_field | _time                | _value  |
| --------- | ------- | -------------------- | ------- |
| Denver    | temp    | 2022-01-01T00:00:00Z | 10.2    |
| Denver    | temp    | 2022-01-02T00:00:00Z | 12.4    |

| *location | *_field | _time                | _value  |
| --------- | ------- | -------------------- | ------- |
| New York  | temp    | 2022-01-01T00:00:00Z | 50.1    |
| New York  | temp    | 2022-01-02T00:00:00Z | 55.8    |

{{% /expand %}}
{{< /expand-wrapper >}}
