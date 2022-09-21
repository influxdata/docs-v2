---
title: Options
description: >
  A Flux option represents a storage location for any value of a specified type.
  Options are mutable. An option can hold different values during its lifetime.
menu:
  flux_0_x_ref:
    parent: Flux specification
    name: Options
weight: 105
aliases:
  - /influxdb/v2.0/reference/flux/language/options/
  - /influxdb/cloud/reference/flux/language/options/
---

An option represents a storage location for any value of a specified type.
Options are mutable.
An option can hold different values during its lifetime.

Below is a list of built-in options currently implemented in the Flux language:

- [now](#now)
- [task](#task)
- [location](#location)

Options are not closed, meaning new options may be defined and consumed within packages and scripts.
Changing the value of an option for a package changes the value for all references
to that option from any other package.

#### now
The `now` option is a function that returns a time value used as a proxy for the current system time.

```js
// Query should execute as if the below time is the current system time
option now = () => 2006-01-02T15:04:05-07:00
```

#### task
The `task` option schedules the execution of a Flux query.

```js
option task = {
    name: "foo",        // Name is required.
    every: 1h,          // Task should be run at this interval.
    offset: 10m,        // Delay scheduling this task by this duration.
    cron: "0 2 * * *",  // Cron is a more sophisticated way to schedule. 'every' and 'cron' are mutually exclusive.
}
```

#### location
The `location` option sets the default time zone of all times in the script.
The location maps the UTC offset in use at that location for a given time.
The default value is [`timezone.utc`](/flux/v0.x/stdlib/timezone/#constants).

```js
import "timezone"

// Set timezone to be 5 hours west of UTC
option location = timezone.fixed(offset: -5h)

// Set location to be America/Denver
option location = timezone.location(name: "America/Denver")
```

{{< page-nav prev="/flux/v0.x/spec/variables/" next="/flux/v0.x/spec/types/" >}}
