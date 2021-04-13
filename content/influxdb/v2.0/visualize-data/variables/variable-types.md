---
title: Variable types
seotitle: Dashboard variable types
description: Overview of the types of dashboard variables available in InfluxDB
menu:
  influxdb_2_0:
    parent: Use and manage variables
weight: 207
influxdb/v2.0/tags: [variables]
---

Variable types determine how a variable's list of possible values is populated.
The following variable types are available:

- [Map](#map)
- [Query](#query)
- [CSV](#csv)

### Map
Map variables use a list of key value pairs in CSV format to map keys to specific values.
Keys populate the variable's value list in the InfluxDB user interface (UI), but
values are used when actually processing the query.

The most common use case for map variables is aliasing simple, human-readable keys
to complex values.

##### Map variable example
```js
Juanito MacNeil,"5TKl6l8i4idg15Fxxe4P"
Astrophel Chaudhary,"bDhZbuVj5RV94NcFXZPm"
Ochieng Benes,"YIhg6SoMKRUH8FMlHs3V"
Mila Emile,"o61AhpOGr5aO3cYVArC0"
```

### Query
Query variable values are populated using the `_value` column of a Flux query.

##### Query variable example
```js
// List all buckets
buckets()
  |> rename(columns: {"name": "_value"})
  |> keep(columns: ["_value"])
```

_For examples of dashboard variable queries, see [Common variable queries](/influxdb/v2.0/visualize-data/variables/common-variables)._

{{% note %}}
#### Important things to note about variable queries
- The variable will only use values from the `_value` column.
  If the data you’re looking for is in a column other than `_value`, use the
  [`rename()`](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/rename/) or
  [`map()`](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/map/) functions
  to change the name of that column to `_value`.
- The variable will only use the first table in the output stream.
  Use the [`group()` function](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/group)
  to group everything into a single table.
- Do not use any [predefined dashboard variables](/influxdb/v2.0/visualize-data/variables/#predefined-dashboard-variables) in variable queries.
{{% /note %}}

### CSV
CSV variables use a CSV-formatted list to populate variable values.
A common use case is when the list of potential values is static and cannot be
queried from InfluxDB.

##### CSV variable examples
```
value1, value2, value3, value4
```
```
value1
value2
value3
value4
```

## Use custom dashboard variables

Use the Flux `v` record and [dot or bracket notation](/influxdb/v2.0/query-data/get-started/syntax-basics/#records) to access custom dashboard variables. 

For example, to use a custom dashboard variable named `exampleVar` in a query,
reference the variable with `v.exampleVar`:

```js
from(bucket: "telegraf")
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) => r._measurement == "cpu" )
  |> filter(fn: (r) => r._field == "usage_user" )
  |> filter(fn: (r) => r.cpu == v.exampleVar)  
```

**To select variable values:**

- **In a dashboard:** Use the dashboard variable drop-down menus at the top of your dashboard.
- **In the Script Editor:** Click the **Variables** tab on the right of the Script Editor, click the name of the variable, and then select the variable value from the drop-down menu.

_For more on using dashboard variables, see [Use and manage variables](/influxdb/v2.0/visualize-data/variables/)._
