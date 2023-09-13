---
title: Work with durations
list_title: Duration
description: >
  A **duration** type represents a length of time with nanosecond precision
  Learn how to work with duration data types in Flux.
menu:
  flux_v0:
    name: Duration
    parent: Basic types
weight: 201
flux/v0.x/tags: ["basic types", "data types"]
related:
  - /flux/v0/stdlib/universe/duration/
list_code_example: |
  ```js
  1ns
  1h 
  1w 
  3d12h4m25s
  ```
---

A **duration** type represents a length of time with nanosecond precision. 

**Type name**: `duration`

- [Duration syntax](#duration-syntax)
- [Convert data types to durations](#convert-data-types-to-durations)
- [Operate on durations](#operate-on-durations)

## Duration syntax
Duration literals contain integers and unit specifiers.
Flux supports the following unit specifiers:

- `ns`: nanosecond
- `us`: microsecond
- `ms`: millisecond
- `s`: second
- `m`: minute
- `h`: hour
- `d`: day
- `w`: week
- `mo`: calendar month
- `y`: calendar year

```js
1ns // 1 nanosecond
1us // 1 microsecond
1ms // 1 millisecond
1s  // 1 second
1m  // 1 minute
1h  // 1 hour
1d  // 1 day
1w  // 1 week
1mo // 1 calendar month
1y  // 1 calendar year

3d12h4m25s // 3 days, 12 hours, 4 minutes, and 25 seconds
```

{{% note %}}
#### Do not include leading zeros in duration literals
The integer part of a duration literal should not contain leading zeros.
Leading zeros are parsed as separate integer literals.
For example:

```js
01m // parsed as 0 (integer literal) and 1m (duration literal)
02h05m // parsed as 0 (integer literal), 2h (duration literal), 0 (integer literal), and 5m (duration literal)
```
{{% /note %}}

## Convert data types to durations
Use the [`duration()` function](/flux/v0/stdlib/universe/duration/) to convert
the following [basic types](/flux/v0/data-types/basic/) to durations:

- **string**: parsed as a duration string and converted to a duration.
- **int**: parsed as nanoseconds and converted to a duration.
- **uint**: parsed as nanoseconds and converted to a duration.

```js
duration(v: "1h30m")
// Returns 1h30m

duration(v: 1000000)
// Returns 1ms

duration(v: uint(v: 3000000000))
// Returns 3s
```

{{% note %}}
**Flux does not support duration columns.**
{{% /note %}}

## Operate on durations

- [Perform arithmetic operations on durations](#perform-arithmetic-operations-on-durations)
- [Add a duration to a time value](#add-a-duration-to-a-time-value)
- [Subtract a duration from a time value](#subtract-a-duration-from-a-time-value)

### Perform arithmetic operations on durations
To perform operations like adding, subtracting, multiplying, or dividing duration values:

1. Use [`int()`](/flux/v0/stdlib/universe/int/) or [`uint()`](/flux/v0/stdlib/universe/uint/)
   to convert duration values to numeric values.
2. Use [arithmetic operators](/flux/v0/spec/operators/#arithmetic-operators) to
   operate on numeric values.
3. Use [`duration()`](/flux/v0/stdlib/universe/duration/) to convert the calculated
   numeric value into a duration. 

```js
duration(v: int(v: 6h4m) + int(v: 22h32s))
// Returns 1d4h4m32s

duration(v: int(v: 22h32s) - int(v: 6h4m))
// Returns 15h56m32s

duration(v: int(v: 32m10s) * 10)
// Returns 5h21m40s

duration(v: int(v: 24h) / 2)
// Returns 12h
```

### Add a duration to a time value
1. Import the [`date` package](/flux/v0/stdlib/date/).
2. Use [`date.add()`](/flux/v0/stdlib/date/add/)
   to add a duration to a time value.

```js
import "date"

date.add(d: 1w, to: 2021-01-01T00:00:00Z)
// Returns 2021-01-08T00:00:00.000000000Z
```

### Subtract a duration from a time value
1. Import the [`date` package](/flux/v0/stdlib/date/).
2. Use [`date.sub()`](/flux/v0/stdlib/date/sub/)
to subtract a duration from a time value.

```js
import "date"

date.sub(d: 1w, from: 2021-01-01T00:00:00Z)
// Returns 2020-12-25T00:00:00.000000000Z
```
