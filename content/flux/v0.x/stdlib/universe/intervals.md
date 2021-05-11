---
title: intervals() function
description: The `intervals()` function generates a set of time intervals over a range of time.
aliases:
  - /influxdb/v2.0/reference/flux/functions/misc/intervals
  - /influxdb/v2.0/reference/flux/functions/built-in/misc/intervals/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/misc/intervals
  - /influxdb/v2.0/reference/flux/stdlib/built-in/misc/intervals/
  - /influxdb/cloud/reference/flux/stdlib/built-in/misc/intervals/
menu:
  flux_0_x_ref:
    name: intervals
    parent: universe
weight: 102
draft: true
---

The `intervals()` function generates a set of time intervals over a range of time.

An interval is a record with `start` and `stop` properties that correspond to the inclusive start and exclusive stop times of the time interval.
The return value of intervals is another function that accepts start and stop time parameters and returns an interval generator.
The generator is then used to produce the set of intervals.
The set of intervals includes all intervals that intersect with the initial range of time.

{{% note %}}
The `intervals()` function is designed to be used with the intervals parameter
of the [`window()` function](/flux/v0.x/stdlib/universe/window).
{{% /note %}}

By default the end boundary of an interval will align with the Unix epoch (zero time)
modified by the offset of the `location` option.

```js
intervals()
```

## Parameters

### every {data-type="duration"}
The duration between starts of each of the intervals.
The Nth interval start time is the initial start time plus the offset plus an Nth multiple of the every parameter.
Defaults to the value of the `period` duration.

### period {data-type="duration"}
The length of each interval.
Each interval's stop time is equal to the interval start time plus the period duration.
It can be negative, indicating the start and stop boundaries are reversed.
Defaults to the value of the `every` duration.

### offset {data-type="duration"}
The duration by which to shift the window boundaries.
It can be negative, indicating that the offset goes backwards in time.
Defaults to `0`, which will align window end boundaries with the `every` duration.

### filter {data-type="function"}
A function that accepts an interval record and returns a boolean value.
Each potential interval is passed to the filter function.
When the function returns false, that interval is excluded from the set of intervals.
Defaults to include all intervals.

## Examples

##### Basic intervals
```js
// 1 hour intervals
intervals(every:1h)

// 2 hour long intervals every 1 hour
intervals(every:1h, period:2h)

// 2 hour long intervals every 1 hour starting at 30m past the hour
intervals(every:1h, period:2h, offset:30m)

// 1 week intervals starting on Monday (by default weeks start on Sunday)
intervals(every:1w, offset:1d)

// the hour from 11PM - 12AM every night
intervals(every:1d, period:-1h)

// the last day of each month
intervals(every:1mo, period:-1d)
```

##### Using a predicate
```js
// 1 day intervals excluding weekends
intervals(
  every:1d,
  filter: (interval) => !(weekday(time: interval.start) in [Sunday, Saturday]),
)

// Work hours from 9AM - 5PM on work days.
intervals(
  every:1d,
  period:8h,
  offset:9h,
  filter:(interval) => !(weekday(time: interval.start) in [Sunday, Saturday]),
)
```

##### Using known start and stop dates
```js
// Every hour for six hours on Sep 5th.
intervals(every:1h)(start:2018-09-05T00:00:00-07:00, stop: 2018-09-05T06:00:00-07:00)

// Generates
// [2018-09-05T00:00:00-07:00, 2018-09-05T01:00:00-07:00)
// [2018-09-05T01:00:00-07:00, 2018-09-05T02:00:00-07:00)
// [2018-09-05T02:00:00-07:00, 2018-09-05T03:00:00-07:00)
// [2018-09-05T03:00:00-07:00, 2018-09-05T04:00:00-07:00)
// [2018-09-05T04:00:00-07:00, 2018-09-05T05:00:00-07:00)
// [2018-09-05T05:00:00-07:00, 2018-09-05T06:00:00-07:00)

// Every hour for six hours with 1h30m periods on Sep 5th
intervals(every:1h, period:1h30m)(start:2018-09-05T00:00:00-07:00, stop: 2018-09-05T06:00:00-07:00)

// Generates
// [2018-09-05T00:00:00-07:00, 2018-09-05T01:30:00-07:00)
// [2018-09-05T01:00:00-07:00, 2018-09-05T02:30:00-07:00)
// [2018-09-05T02:00:00-07:00, 2018-09-05T03:30:00-07:00)
// [2018-09-05T03:00:00-07:00, 2018-09-05T04:30:00-07:00)
// [2018-09-05T04:00:00-07:00, 2018-09-05T05:30:00-07:00)
// [2018-09-05T05:00:00-07:00, 2018-09-05T06:30:00-07:00)

// Every hour for six hours using the previous hour on Sep 5th
intervals(every:1h, period:-1h)(start:2018-09-05T12:00:00-07:00, stop: 2018-09-05T18:00:00-07:00)

// Generates
// [2018-09-05T11:00:00-07:00, 2018-09-05T12:00:00-07:00)
// [2018-09-05T12:00:00-07:00, 2018-09-05T13:00:00-07:00)
// [2018-09-05T13:00:00-07:00, 2018-09-05T14:00:00-07:00)
// [2018-09-05T14:00:00-07:00, 2018-09-05T15:00:00-07:00)
// [2018-09-05T15:00:00-07:00, 2018-09-05T16:00:00-07:00)
// [2018-09-05T16:00:00-07:00, 2018-09-05T17:00:00-07:00)
// [2018-09-05T17:00:00-07:00, 2018-09-05T18:00:00-07:00)

// Every month for 4 months starting on Jan 1st
intervals(every:1mo)(start:2018-01-01, stop: 2018-05-01)

// Generates
// [2018-01-01, 2018-02-01)
// [2018-02-01, 2018-03-01)
// [2018-03-01, 2018-04-01)
// [2018-04-01, 2018-05-01)

// Every month for 4 months starting on Jan 15th
intervals(every:1mo)(start:2018-01-15, stop: 2018-05-15)

// Generates
// [2018-01-15, 2018-02-15)
// [2018-02-15, 2018-03-15)
// [2018-03-15, 2018-04-15)
// [2018-04-15, 2018-05-15)
```
