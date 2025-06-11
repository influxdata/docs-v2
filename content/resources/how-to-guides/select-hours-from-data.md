---
title: Select data from specific hours
description: >
  Learn how to select data from specific hours of the day. 
menu:
  resources:
    parent: How-to guides
weight: 102
---

## Problem
You may want to select data from specific hours of the day. For example, you may only want data within normal business hours (9am - 5pm). 

## Solution 1
Use [hourSelection()](/flux/v0/stdlib/universe/hourselection/) to filter data by a specific hour range in each day. 

```js 
import "date"

from(bucket: "example-bucket")
    |> range(start: -7d)
    |> filter(fn: (r) => r["_measurement"] == "example-measurement")
    |> filter(fn: (r) => r["_field"] == "example-field")
    |> hourSelection(start: 9, stop: 17)
```


## Solution 2
Use [date.hour()](/flux/v0/stdlib/date/hour/) to evaluate hours in a `filter()` predicate. 

```js 
import "date"

from(bucket: "example-bucket")
    |> range(start: -7d)
    |> filter(fn: (r) => r["_measurement"] == "example-measurement")
    |> filter(fn: (r) => r["_field"] == "example-field")
    |> filter(fn: (r) => date.hour(t: r["_time"]) > 9 and date.hour(t: r["_time"]) < 17)

This solution also applies if you to select data from certain seconds in a minute, minutes in an hour, days in the month, months in the year, etc. Use the [Flux `date` package](/flux/v0/stdlib/date/) to assign integer representations to your data and filter for your desired schedule. 