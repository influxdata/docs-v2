---
title: bool() function
description: The `bool()` function converts a single value to a boolean.
aliases:
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/type-conversions/bool/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/type-conversions/bool/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/type-conversions/bool/
menu:
  flux_0_x_ref:
    name: bool
    parent: universe
weight: 102
flux/v0.x/tags: [type-conversions]
related:
  - /flux/v0.x/data-types/basic/bool/
  - /flux/v0.x/stdlib/universe/tobool/
introduced: 0.7.0
---

The `bool()` function converts a single value to a boolean.

_**Output data type:** Boolean_

```js
bool(v: "true")
```

## Parameters

### v {data-type="string, int, uint, float"}
The value to convert.

## Examples

#### Convert a numeric column to a boolean column
```js
import "sampledata"

data = sampledata.numericBool()
    |> rename(columns: {_value: "online"})

data
    |> map(fn: (r) => ({r with online: bool(v: r.online)}))
```

{{< expand-wrapper >}}
{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}

##### Input data
| _time                | tag | online |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | t1  |      1 |
| 2021-01-01T00:00:10Z | t1  |      1 |
| 2021-01-01T00:00:20Z | t1  |      0 |
| 2021-01-01T00:00:30Z | t1  |      1 |
| 2021-01-01T00:00:40Z | t1  |      0 |
| 2021-01-01T00:00:50Z | t1  |      0 |

| _time                | tag | online |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | t2  |      0 |
| 2021-01-01T00:00:10Z | t2  |      1 |
| 2021-01-01T00:00:20Z | t2  |      0 |
| 2021-01-01T00:00:30Z | t2  |      1 |
| 2021-01-01T00:00:40Z | t2  |      1 |
| 2021-01-01T00:00:50Z | t2  |      0 |

{{% /flex-content %}}
{{% flex-content %}}

##### Output data
| _time                | tag | online |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | t1  |   true |
| 2021-01-01T00:00:10Z | t1  |   true |
| 2021-01-01T00:00:20Z | t1  |  false |
| 2021-01-01T00:00:30Z | t1  |   true |
| 2021-01-01T00:00:40Z | t1  |  false |
| 2021-01-01T00:00:50Z | t1  |  false |

| _time                | tag | online |
| :------------------- | :-- | -----: |
| 2021-01-01T00:00:00Z | t2  |  false |
| 2021-01-01T00:00:10Z | t2  |   true |
| 2021-01-01T00:00:20Z | t2  |  false |
| 2021-01-01T00:00:30Z | t2  |   true |
| 2021-01-01T00:00:40Z | t2  |   true |
| 2021-01-01T00:00:50Z | t2  |  false |
{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}
