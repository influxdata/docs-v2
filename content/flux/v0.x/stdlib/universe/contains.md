---
title: contains() function
description: The `contains()` function tests whether a value is a member of a set.
aliases:
  - /influxdb/v2.0/reference/flux/functions/built-in/tests/contains/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/tests/contains/
  - /influxdb/cloud/reference/flux/stdlib/built-in/tests/contains/
menu:
  flux_0_x_ref:
    name: contains
    parent: universe
weight: 102
related:
  - /flux/v0.x/data-types/composite/array/
flux/v0.x/tags: [tests]
introduced: 0.19.0
---

The `contains()` function tests whether a value is a member of a set.
If the value is a member of the set, the function returns `true`.
If the value is not a member of the set, the functions returns `false`.

```js
contains(
  value: 1,
  set: [1,2,3]
)
```

## Parameters

### value {data-type="string, bool, time, int, uint, float"}
Value to search for.

### set {data-type="array"}
Set of values to search in.

## Examples

#### Filter on a set of specific fields
```js
import "influxdata/influxdb/sample"

fields = ["temperature", "humidity"]

sample.data(set: "airSensor")
  |> range(start: -30m)
  |> filter(fn: (r) => contains(value: r._field, set: fields))
```

{{% expand "View example input and output" %}}
{{< flex >}}
{{% flex-content %}}
##### Example input data
| _time                | _field      | _value |
| :------------------- | :---------- | -----: |
| 2020-01-01T00:00:00Z | temperature |   74.1 |
| 2020-01-01T00:01:00Z | temperature |   73.9 |
| 2020-01-01T00:02:00Z | temperature |   74.0 |
| 2020-01-01T00:03:00Z | temperature |   74.2 |

| _time                | _field   | _value |
| :------------------- | :------- | -----: |
| 2020-01-01T00:00:00Z | humidity |   35.5 |
| 2020-01-01T00:01:00Z | humidity |   35.4 |
| 2020-01-01T00:02:00Z | humidity |   35.5 |
| 2020-01-01T00:03:00Z | humidity |   35.6 |

| _time                | _field | _value |
| :------------------- | :----- | -----: |
| 2020-01-01T00:00:00Z | co     |   0.65 |
| 2020-01-01T00:01:00Z | co     |   0.66 |
| 2020-01-01T00:02:00Z | co     |   0.66 |
| 2020-01-01T00:03:00Z | co     |   0.67 |

{{% /flex-content %}}
{{% flex-content %}}

##### Example output data
| _time                | _field      | _value |
| :------------------- | :---------- | -----: |
| 2020-01-01T00:00:00Z | temperature |   74.1 |
| 2020-01-01T00:01:00Z | temperature |   73.9 |
| 2020-01-01T00:02:00Z | temperature |   74.0 |
| 2020-01-01T00:03:00Z | temperature |   74.2 |

| _time                | _field   | _value |
| :------------------- | :------- | -----: |
| 2020-01-01T00:00:00Z | humidity |   35.5 |
| 2020-01-01T00:01:00Z | humidity |   35.4 |
| 2020-01-01T00:02:00Z | humidity |   35.5 |
| 2020-01-01T00:03:00Z | humidity |   35.6 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}