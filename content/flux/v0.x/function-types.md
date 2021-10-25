---
title: Flux function types and categories
description: >
  Flux functions each share a set of behaviors or traits that define how the function works.
  View high-level function types and categories that represent distinct and important function behaviors.
menu:
  flux_0_x_ref:
    name: Function types & categories
weight: 10
related:
  - /flux/v0.x/stdlib/
aliases:
  - /influxdb/v2.0/reference/flux/functions/inputs
  - /influxdb/v2.0/reference/flux/functions/built-in/inputs/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/inputs/
  - /influxdb/cloud/reference/flux/stdlib/built-in/inputs/
  - /influxdb/v2.0/reference/flux/functions/outputs
  - /influxdb/v2.0/reference/flux/functions/built-in/outputs/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/outputs/
  - /influxdb/cloud/reference/flux/stdlib/built-in/outputs/  
  - /influxdb/v2.0/reference/flux/functions/misc
  - /influxdb/v2.0/reference/flux/functions/built-in/misc/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/misc/
  - /influxdb/cloud/reference/flux/stdlib/built-in/misc/
  - /influxdb/v2.0/reference/flux/functions/built-in/tests/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/tests/
  - /influxdb/cloud/reference/flux/stdlib/built-in/tests/
  - /influxdb/v2.0/reference/flux/functions/transformations
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/
  - /influxdb/v2.0/reference/flux/functions/transformations/aggregates
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/aggregates/  
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/aggregates/  
  - /influxdb/v2.0/reference/flux/functions/transformations/selectors
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/selectors/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/selectors/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/selectors/
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/stream-table/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/stream-table/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/stream-table/
  - /influxdb/v2.0/reference/flux/functions/transformations/type-conversions
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/type-conversions/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/type-conversions/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/type-conversions/
---

Flux functions share a set of behaviors or traits that define how the function works.
This types and categories lists below are not all-inclusive, but covers distinct
and important function behaviors.

- [Function types](#function-types)
- [Function categories](#function-categories)

---

## Function types
- [Inputs](#inputs)
- [Outputs](#outputs)
- [Transformations](#transformations)
  - [Aggregates](#aggregates)
  - [Selectors](#selectors)
- [Dynamic queries](#dynamic-queries)

---

### Inputs
Flux input functions return data from data sources.
The following input functions are available:

{{< list-all-functions filters="inputs" >}}

---

### Outputs
Flux output functions yield results or send data to a specified output destination.
The following output functions are are available:

{{< list-all-functions filters="outputs" >}}

---

### Transformations
Flux transformations take a [stream of tables](/flux/v0.x/get-started/data-model/#stream-of-tables)
as input, transform the data in some way, and output a stream of tables.
Transformations cover a broad range of functions, but the following categorizations
highlight important behaviors associated with specific transformation functions.

- [Aggregates](#aggregates)
- [Selectors](#selectors)

{{% note %}}
##### aggregateWindow helper function
The [`aggregateWindow()` function](/flux/v0.x/stdlib/universe/aggregatewindow)
windows or groups data by time and applies an aggregate or selector function
to input tables.
**All aggregate and selector functions** work with `aggregateWindow()`.
{{% /note %}}

#### Aggregates
Flux aggregate functions are [transformations](#transformations) aggregate values
from input tables in some way.
Output tables contain a single row with the aggregated value.
Aggregate transformations output a table for every input table they receive.

Each output table from an aggregate function will:

- Contain a single record.
- Have the same [group key](/flux/v0.x/get-started/data-model/#group-key) as the input table.
- Contain the an aggregated column.
  The column label will be the same as the input table.
  The column data type depends on the specific aggregate operation.
  The value of the column will be `null` if the input table is empty or the input
  column has only `null` values.
- Drop all columns that are:
  - not in the group key
  - not the aggregated column

**The following aggregate functions are available:**

{{< list-all-functions filters="aggregates" >}}

##### Aggregate selectors
The following functions are both aggregates and selectors.
Each returns `n` values after performing an aggregate operation.
They are categorized as [selector functions](#selectors) in this documentation:

- [highestAverage()](/flux/v0.x/stdlib/universe/highestaverage)
- [highestCurrent()](/flux/v0.x/stdlib/universe/highestcurrent)
- [highestMax()](/flux/v0.x/stdlib/universe/highestmax)
- [lowestAverage()](/flux/v0.x/stdlib/universe/lowestaverage)
- [lowestCurrent()](/flux/v0.x/stdlib/universe/lowestcurrent)
- [lowestMin()](/flux/v0.x/stdlib/universe/lowestmin)

#### Selectors
Flux selector functions are [transformations](#transformations) that return one
or more record per input table.

Each output table from a selector function will:

- Contain one or more unmodified records.
- Have the same [group key](/flux/v0.x/get-started/data-model/#group-key) as the input table.

**The following selector functions are available:**

{{< list-all-functions filters="selectors" >}}

##### Selectors and aggregates
The following functions can be used as both selectors or aggregates, but they are
categorized as [aggregate functions](#aggregates) in this documentation:

- [median()](/flux/v0.x/stdlib/universe/median)
- [quantile()](/flux/v0.x/stdlib/universe/quantile)

---

### Dynamic queries
Flux dynamic query functions extract a table from a stream of tables and access its
columns and records.
For recommended usage, see [Extract scalar values](/influxdb/cloud/query-data/flux/scalar-values/).

{{< list-all-functions filters="dynamic queries" >}}

---

## Function categories
The following categories represent high-level function behaviors.

- [Filters](#filters)
- [Type conversions](#type-conversions)
- [Tests](#tests)
- [Date/time](#datetime)
- [Metadata](#metadata)
- [Notification endpoints](#notification-endpoints)
- [Geotemporal](#geotemporal)

### Filters
Filter functions iterate over and evaluate each input row to see if it matches
specified conditions.
Rows that do not match the specified conditions are dropped from the output.
The following filter functions are available:

{{< list-all-functions filters="filters" >}}

---

### Type conversions
Flux type conversion functions convert scalar values or columns to a specific data type.
The following type conversion functions are available:

{{< list-all-functions filters="type-conversions" >}}

---

### Tests
Flux testing functions test various aspects of data.
Tests return either `true` or `false`, a transformed stream of tables, or, upon failure, an error.
The following testing functions are available:

{{< list-all-functions filters="tests" >}}

---

### Date/time
Flux date/time functions return or operate on [time](/flux/v0.x/data-types/basic/time/)
or [duration](/flux/v0.x/spec/types/#duration-types) values.
The following data/time functions are available:

{{< list-all-functions filters="date/time" >}}

---

### Metadata
Flux metadata functions return metadata from the input stream or from an underlying data source.
The following metadata functions are available:

{{< list-all-functions filters="metadata" >}}

---

### Notification endpoints
Flux notification endpoint functions iterate over rows in an input stream of tables
and send a notification to external endpoints or services per row.
The following notification endpoint functions are available:

{{< list-all-functions filters="notification endpoints" >}}

#### Single notification functions
Single notification functions send a single message to a remote endpoint.

{{< list-all-functions filters="single notification" >}}

For more information on how to send notifications with Flux,
see [Send notifications](/flux/v0.x/notifications/).

---

### Geotemporal
Flux geotemporal functions are designed to work with geotemporal data (geographic location over time).
The following geotemporal functions are available:

{{< list-all-functions filters="geotemporal" >}}
