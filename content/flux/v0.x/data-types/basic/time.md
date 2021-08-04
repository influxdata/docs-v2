---
title: Work with time types
list_title: Time
description: >
  Learn how to work with string data types in Flux.
menu:
  flux_0_x:
    name: Time
    parent: Basic types
weight: 201
---

A **time** type represents a single point in time with nanosecond precision.

**Type name**: `time`

###### On this page:
- [Time syntax](#time-syntax)
- [Convert data types to time](#convert-data-types-to-time)
- [Operate on time](#operate-on-time)

## Time syntax
Time types are represented with [RFC3339 timestamps](/influxdb/cloud/reference/glossary/#rfc3339-timestamp).

```js
YYYY-MM-DD
YYYY-MM-DDT00:00:00Z
YYYY-MM-DDT00:00:00.000Z
```

## Convert data types to time
Use the [`time()` function](/flux/v0.x/stdlib/universe/time/) to convert
the following [basic types](/flux/v0.x/data-types/basic/) to time:

- **string**: must be formatted as an
  [RFC3339 timestamp](/influxdb/cloud/reference/glossary/#rfc3339-timestamp).
- **int**: parsed as a [Unix nanosecond timestamp](/influxdb/cloud/reference/glossary/#unix-timestamp)
  and converted to a time value.
- **uint**: parsed as a [Unix nanosecond timestamp](/influxdb/cloud/reference/glossary/#unix-timestamp)
  and converted to a time value.

```js
time(v: "2021-01-01")
// Returns 2021-01-01T00:00:00.000000000Z

time(v: 1609459200000000000)
// Returns 2021-01-01T00:00:00.000000000Z

time(v: uint(v: 1609459200000000000))
// Returns 2021-01-01T00:00:00.000000000Z
```

### Convert columns to time

#### Convert the \_value column to time
Use the [`toTime()` function](/flux/v0.x/stdlib/universe/totime/) to convert
the `_value` column to time.

```js
data
  |> toTime()
```

{{< flex >}}
{{% flex-content %}}
##### Given the following input:
| \_time                                            | \_value _<span style="opacity:.5">(int)</span>_ |
| :------------------------------------------------ | ----------------------------------------------: |
| {{% nowrap %}}2021-01-01T00:00:00Z{{% /nowrap %}} |                                     10000000000 |
| {{% nowrap %}}2021-01-01T02:00:00Z{{% /nowrap %}} |                                     20000000000 |
| {{% nowrap %}}2021-01-01T03:00:00Z{{% /nowrap %}} |                                     30000000000 |
| {{% nowrap %}}2021-01-01T04:00:00Z{{% /nowrap %}} |                                     40000000000 |
{{% /flex-content %}}

{{% flex-content %}}
##### The example above returns:
| \_time                                            |  \_value _<span style="opacity:.5">(time)</span>_ |
| :------------------------------------------------ | ------------------------------------------------: |
| {{% nowrap %}}2021-01-01T00:00:00Z{{% /nowrap %}} | {{% nowrap %}}1970-01-01T00:00:10Z{{% /nowrap %}} |
| {{% nowrap %}}2021-01-01T02:00:00Z{{% /nowrap %}} | {{% nowrap %}}1970-01-01T00:00:20Z{{% /nowrap %}} |
| {{% nowrap %}}2021-01-01T03:00:00Z{{% /nowrap %}} | {{% nowrap %}}1970-01-01T00:00:30Z{{% /nowrap %}} |
| {{% nowrap %}}2021-01-01T04:00:00Z{{% /nowrap %}} | {{% nowrap %}}1970-01-01T00:00:40Z{{% /nowrap %}} |
{{% /flex-content %}}
{{< /flex >}}

#### Convert other columns to time
To convert columns other than `_value` to time:

1. Use [`map()`](/flux/v0.x/stdlib/universe/map/) to iterate over and rewrite rows.
2. Use [`time()`](/flux/v0.x/stdlib/universe/time/) to convert columns values to strings.

```js
data
  |> map(fn: (r) => ({ r with epoch_ns: time(v: r.epoch_ns) }))
```

{{< flex >}}
{{% flex-content %}}
##### Given the following input:
| \_time                                            | epoch_ns _<span style="opacity:.5">(int)</span>_ |
| :------------------------------------------------ | -----------------------------------------------: |
| {{% nowrap %}}2021-01-01T00:00:00Z{{% /nowrap %}} |                                      10000000000 |
| {{% nowrap %}}2021-01-01T02:00:00Z{{% /nowrap %}} |                                      20000000000 |
| {{% nowrap %}}2021-01-01T03:00:00Z{{% /nowrap %}} |                                      30000000000 |
| {{% nowrap %}}2021-01-01T04:00:00Z{{% /nowrap %}} |                                      40000000000 |
{{% /flex-content %}}

{{% flex-content %}}
##### The example above returns:
| \_time                                            | epoch_ns _<span style="opacity:.5">(time)</span>_ |
| :------------------------------------------------ | ------------------------------------------------: |
| {{% nowrap %}}2021-01-01T00:00:00Z{{% /nowrap %}} | {{% nowrap %}}1970-01-01T00:00:10Z{{% /nowrap %}} |
| {{% nowrap %}}2021-01-01T02:00:00Z{{% /nowrap %}} | {{% nowrap %}}1970-01-01T00:00:20Z{{% /nowrap %}} |
| {{% nowrap %}}2021-01-01T03:00:00Z{{% /nowrap %}} | {{% nowrap %}}1970-01-01T00:00:30Z{{% /nowrap %}} |
| {{% nowrap %}}2021-01-01T04:00:00Z{{% /nowrap %}} | {{% nowrap %}}1970-01-01T00:00:40Z{{% /nowrap %}} |
{{% /flex-content %}}
{{< /flex >}}

## Operate on time

- [Truncate timestamps to a specified unit](#truncate-timestamps-to-a-specified-unit)
- [Parse units of time from a timestamp](#parse-units-of-time-from-a-timestamp)
- [Add a duration to a time value](#add-a-duration-to-a-time-value)
- [Subtract a duration from a time value](#subtract-a-duration-from-a-time-value)

### Truncate timestamps to a specified unit
Truncating time values can be helpful when normalizing irregular timestamps.
To truncate timestamps to a specified unit:

1. Import the [`date` package](/flux/v0.x/stdlib/date/).
2. Use [`date.truncate()`](/flux/v0.x/stdlib/date/truncate/) and provide the
   unit of time to truncate to.

{{% note %}}
#### Truncate to weeks
When truncating a time value to the week (`1w`), weeks are determined using the 
**Unix epoch (1970-01-01T00:00:00Z UTC)**. The Unix epoch was on a Thursday, so
all calculated weeks begin on Thursday.
{{% /note %}}

```js
t0 = 2021-01-08T14:54:10.023849Z

date.truncate(t: t0, unit: 1ms)
// Returns 2021-01-08T14:54:10.023000000Z

date.truncate(t: t0, unit: 1m)
// Returns 2021-01-08T14:54:00.000000000Z

date.truncate(t: t0, unit: 1mo)
// Returns 2021-01-01T00:00:00.000000000Z
```

**To truncate the `_time` column, use [`truncateTimeColumn()`](/flux/v0.x/stdlib/universe/truncatetimecolumn/)**:

```js
data
  |> truncateTimeColumn(unit: 1m)
```

{{< flex >}}
{{% flex-content %}}
##### Given the following input:
| \_time                                            | _value |
| :------------------------------------------------ | -----: |
| {{% nowrap %}}2021-01-01T00:00:33Z{{% /nowrap %}} |    1.0 |
| {{% nowrap %}}2021-01-01T00:01:10Z{{% /nowrap %}} |    1.1 |
| {{% nowrap %}}2021-01-01T00:02:45Z{{% /nowrap %}} |    3.6 |
| {{% nowrap %}}2021-01-01T00:03:23Z{{% /nowrap %}} |    2.5 |
{{% /flex-content %}}

{{% flex-content %}}
##### The example above returns:
| \_time                                            | _value |
| :------------------------------------------------ | -----: |
| {{% nowrap %}}2021-01-01T00:00:00Z{{% /nowrap %}} |    1.0 |
| {{% nowrap %}}2021-01-01T00:01:00Z{{% /nowrap %}} |    1.1 |
| {{% nowrap %}}2021-01-01T00:02:00Z{{% /nowrap %}} |    3.6 |
| {{% nowrap %}}2021-01-01T00:03:00Z{{% /nowrap %}} |    2.5 |
{{% /flex-content %}}
{{< /flex >}}

### Parse units of time from a timestamp
To parse a specific unit of time from a time value:

1. Import the [`date` package](/flux/v0.x/stdlib/date/).
2. Use functions in the `date` package to return specific units of time from a timestamp.

```js
import "date"

t0 = 2021-01-08T14:54:10.023849Z

date.minute(t: t0)
// Returns 54

date.year(t: t0)
// Returns 2021

date.quarter(t: t0)
// Returns 1
```

### Add a duration to a time value
To add a [duration](/flux/v0.x/data-types/basic/duration/) to a time value:

1. Import the [`experimental` package](/flux/v0.x/stdlib/experimental/).
2. Use [`experimental.addDuration()`](/flux/v0.x/stdlib/experimental/addduration/)
   to add a duration to a time value.

```js
import "experimental"

experimental.addDuration(d: 1w, to: 2021-01-01T00:00:00Z)
// Returns 2021-01-08T00:00:00.000000000Z
```

### Subtract a duration from a time value
To subtract a [duration](/flux/v0.x/data-types/basic/duration/) from a time value:

1. Import the [`experimental` package](/flux/v0.x/stdlib/experimental/).
2. Use [`experimental.subDuration()`](/flux/v0.x/stdlib/experimental/subduration/)
to subtract a duration from a time value.

```js
import "experimental"

experimental.subDuration(d: 1w, from: 2021-01-01T00:00:00Z)
// Returns 2020-12-25T00:00:00.000000000Z
```
