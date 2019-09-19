---
title: Manipulate timestamps with Flux
description: >
  Use Flux to process and manipulate timestamps.
menu:
  v2_0:
    name: Manipulate timestamps
    parent: How-to guides
weight: 209
---

Every point stored in InfluxDB has an associated timestamp.
Flux includes tools to process and manipulate timestamps to suit your needs.

- [Timestamp conversions](#timestamp-conversions)
- [Common scenarios](#common-scenarios)
- [Time-related Flux functions](#time-related-flux-functions)

## Timestamp conversions

### Convert nanosecond epoch timestamp to RFC3339
Use the [`time()` function](/v2.0/reference/flux/stdlib/built-in/transformations/type-conversions/time/)
to convert a **nanosecond** epoch timestamp to RFC3339 format.

```js
time(v: 1568808000000000000)
// Returns 2019-09-18T12:00:00.000000000Z
```

### Convert RFC3339 timestamp to nanosecond epoch timestamp
Use the [`uint()` function](/v2.0/reference/flux/stdlib/built-in/transformations/type-conversions/unit/)
to convert an RFC3339 timestamp to a nanosecond epoch timestamp.

```js
uint(v: 2019-09-18T12:00:00.000000000Z)
// Returns 1568808000000000000
```

## Common scenarios

### Calculate the duration between two timestamps
Flux doesn't support mathematical operations with time values.
To calculate the duration between two timestamps:

1. Use the `uint()` function to convert each timestamp to a nanosecond epoch timestamp.
2. Subtract one nanosecond epoch timestamp from the other.
3. Use the `duration()` function to convert the result into a duration.

```js
time1 = uint(v: 2019-09-17T21:12:05Z)
time2 = uint(v: 2019-09-18T22:16:35Z)

duration(v: time2 - time1)
// Returns 25h4m30s
```

{{% note %}}
Flux doesn't support duration column types.
To store a duration in a column, use the [`string()` function](/v2.0/reference/flux/stdlib/built-in/transformations/type-conversions/string/)
to convert it to a string.
{{% /note %}}

## Time-related Flux functions

#### now()
Use the [`now()` function](/v2.0/reference/flux/stdlib/built-in/misc/now/) to
return the current UTC time in RFC3339 format.

```js
now()
```

#### experimental.addDuration()
The [`experimental.addDuration()` function](/v2.0/reference/flux/stdlib/experimental/addduration/)
adds a duration to a specified time and returns the resulting time.

{{% warn %}}
By using `experimental.addDuration()`, you accept the
[risks of experimental functions](/v2.0/reference/flux/stdlib/experimental/#use-experimental-functions-at-your-own-risk).
{{% /warn %}}

```js
import "experimental"

experimental.addDuration(
  d: 6h,
  to: 2019-09-16T12:00:00Z,
)

// Returns 2019-09-16T18:00:00.000000000Z
```

#### experimental.subDuration()
The [`experimental.addDuration()` function](/v2.0/reference/flux/stdlib/experimental/subduration/)
subtracts a duration from a specified time and returns the resulting time.

{{% warn %}}
By using `experimental.addDuration()`, you accept the
[risks of experimental functions](/v2.0/reference/flux/stdlib/experimental/#use-experimental-functions-at-your-own-risk).
{{% /warn %}}

```js
import "experimental"

experimental.subDuration(
  d: 6h,
  from: 2019-09-16T12:00:00Z,
)

// Returns 2019-09-16T06:00:00.000000000Z
```
