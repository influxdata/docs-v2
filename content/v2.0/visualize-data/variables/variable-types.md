---
title: Variable types
seotitle: Dashboard variable types
description: Overview of the types of dashboard variables available in InfluxDB
menu:
  v2_0:
    parent: Use and manage variables
weight: 207
"v2.0/tags": [variables]
---

{{% note %}}
In the current version of InfluxDB v2.0 alpha, only [query-populated variables](#query) are available.
{{% /note %}}

Variable types determine how the list of possible values is populated.

## Query
Variable values are populated using the results of a Flux query.
All values in the `_value` column are possible values for the variable.

##### Variable query example
```js
// List all buckets
buckets()
	|> rename(columns: {"name": "_value"})
  |> keep(columns: ["_value"])
```

_For examples of dashboard variable queries, see [Common variable queries](/v2.0/visualize-data/variables/common-variables)._


#### Important things to note about variable queries
- The variable will only use values from the `_value` column.
  If the data you’re looking for is in a column other than `_value`, use the
  [`rename()`](/v2.0/reference/flux/functions/built-in/transformations/rename/) or
  [`map()`](/v2.0/reference/flux/functions/built-in/transformations/map/) functions
  to change the name of that column to `_value`.
- The variable will only use the first table in the output stream.
  Use the [`group()` function](/v2.0/reference/flux/functions/built-in/transformations/group)
  to group everything into a single table.
- Do not use any [predefined dashboard variables](/v2.0/visualize-data/variables/#predefined-dashboard-variables) in variable queries.
