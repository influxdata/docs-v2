
Use Flux [dynamic query functions](/flux/v0/function-types/#dynamic-queries)
to extract scalar values from Flux query output.
This lets you, for example, dynamically set variables using query results.

**To extract scalar values from output:**

1. [Extract a column from the input stream](#extract-a-column)
   _**or**_ [extract a row from the input stream](#extract-a-row).
2. Use the returned array or record to reference scalar values.

_The samples on this page use the [sample data provided below](#sample-data)._

{{% note %}}
#### Output scalar values

The InfluxDB `/api/v2/query` HTTP API endpoint and all clients that use it
(InfluxDB UI, `influx` CLI, etc.) only support queries that return a stream of tables.
This endpoint does not support raw scalar output.

To output a scalar value as part of a stream of tables:

1.  Import the [`array` package](/flux/v0/stdlib/array/from/).
2.  Use [`array.from()`](/flux/v0/stdlib/array/from/) and
    [`display()`](/flux/v0/stdlib/universe/display/) to wrap the
    literal representation of a scalar value in a stream of tables and return it
    as output.

{{< expand-wrapper >}}
{{% expand "View example" %}}

```js
import "array"

SFOTemps =
    sampleData
        |> findColumn(
            fn: (key) => key._field == "temp" and key.location == "sfo",
            column: "_value",
        )

array.from(rows: [{ output: display(v: SFOTemps) }])
```

##### Returns

| output                     |
| :------------------------- |
| [ 65.1, 66.2, 66.3, 66.8 ] |

{{% /expand %}}
{{< /expand-wrapper >}}
{{% /note %}}

## Table extraction

Flux formats query results as a stream of tables.
Both [`findColumn()`](/flux/v0/stdlib/universe/findcolumn/)
and [`findRecord()`](/flux/v0/stdlib/universe/findrecord/)
extract the first table in a stream of tables whose [group key](/flux/v0/get-started/data-model/#group-key)
values match the `fn` [predicate function](/flux/v0/get-started/syntax-basics/#predicate-functions).

{{% note %}}
#### Extract the correct table

Flux functions do not guarantee table order.
`findColumn()` and `findRecord()` extract only the **first** table that matches the `fn` predicate.
To extract the correct table, use the `fn` predicate function to specifically identify the table to extract or
filter and transform your data to minimize the number of tables piped-forward into the functions.
{{% /note %}}

## Extract a column

Use the [`findColumn()` function](/flux/v0/stdlib/universe/findcolumn/)
to output an array of values from a specific column in the extracted table.

_See [Sample data](#sample-data) below._

```js
sampleData
    |> findColumn(
        fn: (key) => key._field == "temp" and key.location == "sfo",
        column: "_value",
    )

// Returns [65.1, 66.2, 66.3, 66.8]
```

{{% caption %}}
To return this value from the InfluxDB query API, InfluxDB UI, or influx CLI see
[Output scalar values](#output-scalar-values).
{{% /caption %}}


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
        column: "_value",
    )

SFOTemps
// Returns [65.1, 66.2, 66.3, 66.8]

SFOTemps[0]
// Returns 65.1

SFOTemps[2]
// Returns 66.3
```

{{% caption %}}
To return this value from the InfluxDB query API, InfluxDB UI, or influx CLI see
[Output scalar values](#output-scalar-values).
{{% /caption %}}

## Extract a row

Use the [`findRecord()` function](/flux/v0/stdlib/universe/findrecord/)
to output data from a single row in the extracted table.
Specify the index of the row to output using the `idx` parameter.
The function outputs a record with key-value pairs for each column.

```js
sampleData
    |> findRecord(
        fn: (key) => key._field == "temp" and key.location == "sfo",
        idx: 0,
    )

// Returns {
//   _time:2019-11-11T12:00:00Z,
//   _field:"temp",
//   location:"sfo",
//   _value: 65.1
// }
```

{{% caption %}}
To return this value from the InfluxDB query API, InfluxDB UI, or influx CLI see
[Output scalar values](#output-scalar-values).
{{% /caption %}}

### Use an extracted row record

Use a variable to store the extracted row record.
In the example below, `tempInfo` represents the extracted row.
Use [dot or bracket notation](/flux/v0/data-types/composite/record/#dot-notation)
to reference keys in the record.

```js
tempInfo = sampleData
    |> findRecord(
        fn: (key) => key._field == "temp" and key.location == "sfo",
        idx: 0,
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

{{% caption %}}
To return this value from the InfluxDB query API, InfluxDB UI, or influx CLI see
[Output scalar values](#output-scalar-values).
{{% /caption %}}

## Example helper functions

Create custom helper functions to extract scalar values from query output.

##### Extract a scalar field value

```js
// Define a helper function to extract field values
getFieldValue = (tables=<-, field) => {
    extract = tables
        |> findColumn(fn: (key) => key._field == field, column: "_value")

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

{{% caption %}}
To return this value from the InfluxDB query API, InfluxDB UI, or influx CLI see
[Output scalar values](#output-scalar-values).
{{% /caption %}}

##### Extract scalar row data

```js
// Define a helper function to extract a row as a record
getRow = (tables=<-, field, idx=0) => {
    extract = tables
        |> findRecord(fn: (key) => true, idx: idx)

    return extract
}

// Use the helper function to define a variable
lastReported = sampleData
    |> last()
    |> getRow(field: "temp")

"The last location to report was ${lastReported.location}.
The temperature was ${string(v: lastReported._value)}°F."

// Returns:
// The last location to report was kord.
// The temperature was 38.9°F.
```

{{% caption %}}
To return this value from the InfluxDB query API, InfluxDB UI, or influx CLI see
[Output scalar values](#output-scalar-values).
{{% /caption %}}

---

## Sample data

The following sample data set represents fictional temperature metrics collected
from three locations.
It's formatted as an array of Flux [records](/flux/v0/data-types/composite/record/)
and structured as a stream of stables using [`array.from()` function](/flux/v0/stdlib/array/from/).

Place the following at the beginning of your query to use the sample data:

```js
import "array"

sampleData =
    array.from(
        rows: [
            {_time: 2019-11-01T12:00:00Z, location: "sfo", _field: "temp", _value: 65.1},
            {_time: 2019-11-01T13:00:00Z, location: "sfo", _field: "temp", _value: 66.2},
            {_time: 2019-11-01T14:00:00Z, location: "sfo", _field: "temp", _value: 66.3},
            {_time: 2019-11-01T15:00:00Z, location: "sfo", _field: "temp", _value: 66.8},
            {_time: 2019-11-01T12:00:00Z, location: "kjfk", _field: "temp", _value: 69.4},
            {_time: 2019-11-01T13:00:00Z, location: "kjfk", _field: "temp", _value: 69.9},
            {_time: 2019-11-01T14:00:00Z, location: "kjfk", _field: "temp", _value: 71.0},
            {_time: 2019-11-01T15:00:00Z, location: "kjfk", _field: "temp", _value: 71.2},
            {_time: 2019-11-01T12:00:00Z, location: "kord", _field: "temp", _value: 46.4},
            {_time: 2019-11-01T13:00:00Z, location: "kord", _field: "temp", _value: 46.3},
            {_time: 2019-11-01T14:00:00Z, location: "kord", _field: "temp", _value: 42.7},
            {_time: 2019-11-01T15:00:00Z, location: "kord", _field: "temp", _value: 38.9},
        ],
    )
    |> group(columns: ["location", "_field"])
```
