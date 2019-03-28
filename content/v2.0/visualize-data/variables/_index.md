---
title: Use and manage variables
seotitle: Use and manage dashboard variables
description: >
  Dashboard variables allow you to alter specific components of cells' queries
  without having to edit the queries, making it easy to interact with your dashboard cells and explore your data.
menu:
  v2_0:
    parent: Visualize data
weight: 101
"v2.0/tags": [variables]
---

Dashboard variables allow you to alter specific components of cells' queries
without having to edit the queries, making it easy to interact with your dashboard cells and explore your data.

Variables are scoped by organization.

## Use dashboard variables
Both [custom dashboard variables](#manage-custom-variables) and [predefined dashboard variables](#predefined-dashboard-variables)
are stored in a `v` object associated with each dashboard.
Reference each variable using dot-notation (e.g. `v.variableName`).

```js
from(bucket: v.bucket)
  |> range(start: v.timeRangeStart, stop: v.timeRangeStart)
  |> filter(fn (r) => r._measurement == v.measurement and r._field == v.field)
  |> aggregateWindow(every: v.windowPeriod, fn: mean)
```

## Manage custom variables
As you build queries, In the Cell Editor and Data explorer, available variables are listed in the variables tab.
Must use the script builder. Click on a variable to input into your script.
Hover over the variable in the variables tab to select a value for the current query.

{{< children >}}

## Predefined dashboard variables
The InfluxDB provides the following predefined dashboard variables:

#### v.timeRangeStart
Specifies the beginning of the queried time range.
This variable is typically used to define the [`start` parameter](/v2.0/reference/flux/functions/built-in/transformations/range#start)
of the `range()` function.

The **Time Range** selector defines the value of this variable.

#### v.timeRangeStop
Specifies the end of the queried time range.
This variable is typically used to define the [`stop` parameter](/v2.0/reference/flux/functions/built-in/transformations/range#stop)
of the `range()` function.

The **Time Range** selector defines the value of this variable.
It defaults to `now`.

#### v.windowPeriod
Specifies the period of windowed data.
This variable is typically used to define the `every` or `period` parameter of the
[`window()` function](/v2.0/reference/flux/functions/built-in/transformations/window)
in data aggregation operations.

The value of this variable is calculated by dividing the total time within the displayed
time range by the dashboard refresh interval (defined by the **Refresh** dropdown).
