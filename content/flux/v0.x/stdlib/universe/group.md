---
title: group() function
description: >
  `group()` regroups input data by modifying group key of input tables.
menu:
  flux_0_x_ref:
    name: group
    parent: universe
    identifier: universe/group
weight: 101
flux/v0.x/tags: [transformations]
introduced: 0.7.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L712-L712

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`group()` regroups input data by modifying group key of input tables.

**Note**: Group does not gaurantee sort order.
To ensure data is sorted correctly, use `sort()` after `group()`.

##### Function type signature

```js
group = (<-tables: stream[A], ?columns: [string], ?mode: string) => stream[A] where A: Record
```

## Parameters

### columns


List of columns to use in the grouping operation. Default is `[]`.**Note**: When `columns` is set to an empty array, `group()` ungroups
all data merges it into a single output table.

### mode


Grouping mode. Default is `by`.**Avaliable modes**:
- **by**: Group by columns defined in the `columns` parameter.
- **except**: Group by all columns _except_ those in defined in the
  `columns` parameter.

### tables


Input data. Default is piped-forward data (`<-`).


## Examples


### Group by specific columns

```js
import "sampledata"

sampledata.int()
    |> group(columns: ["_time", "tag"])
```

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

| *_time               | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | -2      | t1   |

| *_time               | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 19      | t2   |

| *_time               | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:10Z | 10      | t1   |

| *_time               | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:10Z | 4       | t2   |

| *_time               | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:20Z | 7       | t1   |

| *_time               | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:20Z | -3      | t2   |

| *_time               | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:30Z | 17      | t1   |

| *_time               | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:30Z | 19      | t2   |

| *_time               | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:40Z | 15      | t1   |

| *_time               | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:40Z | 13      | t2   |

| *_time               | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:50Z | 4       | t1   |

| *_time               | _value  | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:50Z | 1       | t2   |


### Group by everything except time

```js
import "sampledata"

sampledata.int()
    |> group(columns: ["_time"], mode: "except")
```

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

| _time                | *_value | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:20Z | -3      | t2   |

| _time                | *_value | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | -2      | t1   |

| _time                | *_value | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:50Z | 1       | t2   |

| _time                | *_value | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:50Z | 4       | t1   |

| _time                | *_value | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:10Z | 4       | t2   |

| _time                | *_value | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:20Z | 7       | t1   |

| _time                | *_value | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:10Z | 10      | t1   |

| _time                | *_value | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:40Z | 13      | t2   |

| _time                | *_value | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:40Z | 15      | t1   |

| _time                | *_value | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:30Z | 17      | t1   |

| _time                | *_value | *tag |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | 19      | t2   |
| 2021-01-01T00:00:30Z | 19      | t2   |


### Ungroup data

```js
import "sampledata"

// Merge all tables into a single table
sampledata.int()
    |> group()
```

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

| _time                | _value  | tag  |
| -------------------- | ------- | ---- |
| 2021-01-01T00:00:00Z | -2      | t1   |
| 2021-01-01T00:00:10Z | 10      | t1   |
| 2021-01-01T00:00:20Z | 7       | t1   |
| 2021-01-01T00:00:30Z | 17      | t1   |
| 2021-01-01T00:00:40Z | 15      | t1   |
| 2021-01-01T00:00:50Z | 4       | t1   |
| 2021-01-01T00:00:00Z | 19      | t2   |
| 2021-01-01T00:00:10Z | 4       | t2   |
| 2021-01-01T00:00:20Z | -3      | t2   |
| 2021-01-01T00:00:30Z | 19      | t2   |
| 2021-01-01T00:00:40Z | 13      | t2   |
| 2021-01-01T00:00:50Z | 1       | t2   |

