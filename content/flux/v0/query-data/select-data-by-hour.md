---
title: Select data from specific hours
list_title: Select data by hour
description: >
  Learn how to select data from specific hours of the day.
menu:
  flux_v0:
    name: Select data by hour
    parent: Query data sources
weight: 110
aliases:
  - /resources/how-to-guides/select-hours-from-data/
---

You may want to select data from specific hours of the day.
For example, you may only want data within normal business hours (9am - 5pm).

## Solution 1: hourSelection()

Use [`hourSelection()`](/flux/v0/stdlib/universe/hourselection/) to filter
data by a specific hour range in each day.

```js
from(bucket: "example-bucket")
    |> range(start: -7d)
    |> filter(fn: (r) => r["_measurement"] == "example-measurement")
    |> filter(fn: (r) => r["_field"] == "example-field")
    |> hourSelection(start: 9, stop: 17)
```

## Solution 2: date.hour()

Use [`date.hour()`](/flux/v0/stdlib/date/hour/) to evaluate hours in a
`filter()` predicate.

```js
import "date"

from(bucket: "example-bucket")
    |> range(start: -7d)
    |> filter(fn: (r) => r["_measurement"] == "example-measurement")
    |> filter(fn: (r) => r["_field"] == "example-field")
    |> filter(fn: (r) => date.hour(t: r["_time"]) > 9 and date.hour(t: r["_time"]) < 17)
```

This solution also applies if you want to select data from certain seconds in
a minute, minutes in an hour, days in the month, months in the year, and so on.
Use the [Flux `date` package](/flux/v0/stdlib/date/) to assign integer
representations to your data and filter for your desired schedule.
