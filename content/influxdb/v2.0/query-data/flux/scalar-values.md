---
title: Extract scalar values in Flux
list_title: Extract scalar values
description: >
  Use Flux dynamic query functions to extract scalar values from Flux query output.
  This lets you, for example, dynamically set variables using query results.
menu:
  influxdb_2_0:
    name: Extract scalar values
    parent:  Query with Flux
weight: 220
influxdb/v2.0/tags: [scalar]
related:
  - /{{< latest "flux" >}}/function-types/#dynamic-queries, Flux dynamic query functions
aliases:
  - /influxdb/v2.0/query-data/guides/scalar-values/
list_code_example: |
  ```js
  scalarValue = {
    _record =
      data
        |> findRecord(fn: key => true, idx: 0)
    return _record._value
  }
  ```
---

Use Flux [dynamic query functions](/{{< latest "flux" >}}/function-types/#dynamic-queries)
to extract scalar values from Flux query output.
This lets you, for example, dynamically set variables using query results.

**To extract scalar values from output:**

1. [Extract a column from the input stream](#extract-a-column)
   _**or**_ [extract a row from the input stream](#extract-a-row).
2. Use the returned array or record to reference scalar values.

_The samples on this page use the [sample data provided below](#sample-data)._

{{% warn %}}
#### Current limitations
- The InfluxDB user interface (UI) does not currently support raw scalar output.
  Use [`map()`](/{{< latest "flux" >}}/stdlib/universe/map/) to add
  scalar values to output data.
{{% /warn %}}

## Table extraction
Flux formats query results as a stream of tables.
Both [`findColumn()`](/{{< latest "flux" >}}/stdlib/universe/findcolumn/)
and [`findRecord()`](/{{< latest "flux" >}}/stdlib/universe/findrecord/)
extract the first table in a stream of tables whose [group key](/influxdb/v2.0/reference/glossary/#group-key)
values match the `fn` [predicate function](/influxdb/v2.0/reference/glossary/#predicate-function).

{{% note %}}
#### Extract the correct table
Flux functions do not guarantee table order.
`findColumn()` and `findRecord` extract only the **first** table that matches the `fn` predicate.
To extract the correct table, be very specific in your predicate function or
filter and transform your data to minimize the number of tables piped-forward into the functions.
{{% /note %}}

## Extract a column
Use the [`findColumn()` function](/{{< latest "flux" >}}/stdlib/universe/findcolumn/)
to output an array of values from a specific column in the extracted table.

_See [Sample data](#sample-data) below._

```js
sampleData
  |> findColumn(
    fn: (key) => key._field == "temp" and key.location == "sfo",
    column: "_value"
  )

// Returns [65.1, 66.2, 66.3, 66.8]
```

### Use extracted column values
Use a variable to store the array of values.
In the example below, `SFOTemps` represents the array of values.
Reference a specific index (integer starting from `0`) in the array to return the
value at that index.

_See [Sample data](#sample-data) below._

```js
SFOTemps = sampleData
  |> findColumn(
    fn: (key) => key._field == "temp" and key.location == "sfo",
    column: "_value"
  )

SFOTemps
// Returns [65.1, 66.2, 66.3, 66.8]

SFOTemps[0]
// Returns 65.1

SFOTemps[2]
// Returns 66.3
```

## Extract a row
Use the [`findRecord()` function](/{{< latest "flux" >}}/stdlib/universe/findrecord/)
to output data from a single row in the extracted table.
Specify the index of the row to output using the `idx` parameter.
The function outputs a record with key-value pairs for each column.

```js
sampleData
  |> findRecord(
    fn: (key) => key._field == "temp" and key.location == "sfo",
    idx: 0
  )

// Returns {
//   _time:2019-11-11T12:00:00Z,
//   _field:"temp",
//   location:"sfo",
//   _value: 65.1
// }
```

### Use an extracted row record
Use a variable to store the extracted row record.
In the example below, `tempInfo` represents the extracted row.
Use [dot notation](/influxdb/v2.0/query-data/get-started/syntax-basics/#records) to reference
keys in the record.

```js
tempInfo = sampleData
  |> findRecord(
    fn: (key) => key._field == "temp" and key.location == "sfo",
    idx: 0
  )

tempInfo
// Returns {
//   _time:2019-11-11T12:00:00Z,
//   _field:"temp",
//   location:"sfo",
//   _value: 65.1
// }

tempInfo._time
// Returns 2019-11-11T12:00:00Z

tempInfo.location
// Returns sfo
```

## Example helper functions
Create custom helper functions to extract scalar values from query output.

##### Extract a scalar field value
```js
// Define a helper function to extract field values
getFieldValue = (tables=<-, field) => {
  extract = tables
    |> findColumn(
      fn: (key) => key._field == field,
      column: "_value"
    )
  return extract[0]
}

// Use the helper function to define a variable
lastJFKTemp = sampleData
  |> filter(fn: (r) => r.location == "kjfk")
  |> last()
  |> getFieldValue(field: "temp")

lastJFKTemp
// Returns 71.2
```

##### Extract scalar row data
```js
// Define a helper function to extract a row as a record
getRow = (tables=<-, field, idx=0) => {
  extract = tables
    |> findRecord(
      fn: (key) => true,
      idx: idx
    )
  return extract
}

// Use the helper function to define a variable
lastReported = sampleData
  |> last()
  |> getRow(idx: 0)

"The last location to report was ${lastReported.location}.
The temperature was ${string(v: lastReported._value)}°F."

// Returns:
// The last location to report was kord.
// The temperature was 38.9°F.
```

---

## Sample data

The following sample data set represents fictional temperature metrics collected
from three locations.
It's formatted in [annotated CSV](/influxdb/v2.0/reference/syntax/annotated-csv/) and imported
into the Flux query using the [`csv.from()` function](/{{< latest "flux" >}}/stdlib/csv/from/).

Place the following at the beginning of your query to use the sample data:

{{% truncate %}}
```js
import "csv"

sampleData = csv.from(csv: "
#datatype,string,long,dateTime:RFC3339,string,string,double
#group,false,true,false,true,true,false
#default,,,,,,
,result,table,_time,location,_field,_value
,,0,2019-11-01T12:00:00Z,sfo,temp,65.1
,,0,2019-11-01T13:00:00Z,sfo,temp,66.2
,,0,2019-11-01T14:00:00Z,sfo,temp,66.3
,,0,2019-11-01T15:00:00Z,sfo,temp,66.8
,,1,2019-11-01T12:00:00Z,kjfk,temp,69.4
,,1,2019-11-01T13:00:00Z,kjfk,temp,69.9
,,1,2019-11-01T14:00:00Z,kjfk,temp,71.0
,,1,2019-11-01T15:00:00Z,kjfk,temp,71.2
,,2,2019-11-01T12:00:00Z,kord,temp,46.4
,,2,2019-11-01T13:00:00Z,kord,temp,46.3
,,2,2019-11-01T14:00:00Z,kord,temp,42.7
,,2,2019-11-01T15:00:00Z,kord,temp,38.9
")
```
{{% /truncate %}}
