---
title: timezone.fixed() function
description: >
  `timezone.fixed()` constructs a location with a fixed offset.
menu:
  flux_0_x_ref:
    name: timezone.fixed
    parent: timezone
weight: 101
flux/v0.x/tags: [timezone, location, data/time]
---

`timezone.fixed()` constructs a timezone record with a fixed offset from UTC.
Fixed timezones are not affected by location-based time shifts in the clock
such as daylight savings time or summertime.

```js
import "timezone"

timezone.fixed(offset: -2h)

// Returns {offset: -2h, zone: UTC}
```

## Parameters

### offset {data-type="duration"}
({{< req >}})
The fixed duration for the location offset.
The duration is the offset from UTC time.

## Examples

##### Apply a fixed timezone offset to windows
```js
import "array"
import "timezone"

option location = timezone.fixed(offset: -8h)

data = array.from(rows: [
        {_time: 2021-01-01T00:06:00Z, _value: 1},
        {_time: 2021-01-02T00:06:00Z, _value: 2},
        {_time: 2021-01-03T00:06:00Z, _value: 3}
    ])
    |> range(start: 2021-01-01T00:00:00Z, stop: 2021-01-04T00:00:00Z)

data
    |> window(every: 1d)
```

{{< expand-wrapper >}}
{{% expand "View example input and output data" %}}
#### Input data
| _start               | _stop                | _time                | _value |
| :------------------- | :------------------- | :------------------- | -----: |
| 2021-01-01T00:00:00Z | 2021-01-04T00:00:00Z | 2021-01-01T00:06:00Z |      1 |
| 2021-01-01T00:00:00Z | 2021-01-04T00:00:00Z | 2021-01-02T00:06:00Z |      2 |
| 2021-01-01T00:00:00Z | 2021-01-04T00:00:00Z | 2021-01-03T00:06:00Z |      3 |

#### Output data
| _start               | _stop                | _time                | _value |
| :------------------- | :------------------- | :------------------- | -----: |
| 2021-01-01T00:00:00Z | 2021-01-01T08:00:00Z | 2021-01-01T00:06:00Z |      1 |


| _start               | _stop                | _time                | _value |
| :------------------- | :------------------- | :------------------- | -----: |
| 2021-01-01T08:00:00Z | 2021-01-02T08:00:00Z | 2021-01-02T00:06:00Z |      2 |

| _start               | _stop                | _time                | _value |
| :------------------- | :------------------- | :------------------- | -----: |
| 2021-01-02T08:00:00Z | 2021-01-03T08:00:00Z | 2021-01-03T00:06:00Z |      3 |
{{% /expand %}}
{{< /expand-wrapper >}}