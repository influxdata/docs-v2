---
title: Select hours from data 
description: >
  This how-to guide walks you through how to select for specific hours from their data. 
menu:
  resources:
    parent: How-to Guides
weight: 112
date: 2021-06-03
series: [Flux]
metadata: [Flux]
---

## Problem
Users want to select specific hours from their data. For example they only want data from 9am - 5pm daily. 

## Solution 1
Use the [hourSelction()](/flux/v0.x/stdlib/universe/hourselection/) function. The hourSelection() function retains all rows of data within a specific time range. 
```js 
import "date"
from(bucket: "northbound")
    |> range(start: -7d)
    |> filter(fn: (r) => r["_measurement"] == "<measurement1>")
    |> filter(fn: (r) => r["_field"] == "<fieldKey1>")
    |> filter(fn: (r) => r["tagKey1"] == "tagKeyValue1")
    |> hourSelection(start: 9, stop: 17)
```


## Solution 2
Use the [date.hour()](/flux/v0.x/stdlib/date/hour/) function. 
```js 
import "date"
from(bucket: "northbound")
  |> range(start: -7d)
  |> filter(fn: (r) => r["_measurement"] == "<measurement1>")
  |> filter(fn: (r) => r["_field"] == "<fieldKey1>")
  |> filter(fn: (r) => r["tagKey1"] == "tagKeyValue1")
  |> filter(fn: (r) => date.hour(t: r["_time"]) > 9 and date.hour(t: r["_time"]) < 17)
  |> yield(name: "hours selected")
```

This solution is especially useful if you want to select certain hours from certain second, minutes, days, months, years, etc. Use the [Flux date package](/flux/v0.x/stdlib/date/) to assign integer representations to your data and filter for your desired schedule. 