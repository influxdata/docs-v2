
Now that you know the [basics of querying data from InfluxDB](/influxdb/version/get-started/query/),
let's go beyond a basic query and begin to process the queried data.
"Processing" data could mean transforming, aggregating, downsampling, or alerting
on data. This tutorial covers the following data processing use cases:

- [Remap or assign values in your data](#remap-or-assign-values-in-your-data)
- [Group data](#group-data)
- [Aggregate or select specific data](#aggregate-or-select-specific-data)
- [Pivot data into a relational schema](#pivot-data-into-a-relational-schema)
- [Downsample data](#downsample-data)
- [Automate processing with InfluxDB tasks](#automate-processing-with-influxdb-tasks)

{{% note %}}
Most data processing operations require manually editing Flux queries.
If you're using the **InfluxDB Data Explorer**, switch to the **Script Editor**
instead of using the **Query Builder.**
{{% /note %}}

## Remap or assign values in your data

Use the [`map()` function](/flux/v0/stdlib/universe/map/) to
iterate over each row in your data and update the values in that row.
`map()` is one of the most useful functions in Flux and will help you accomplish
many of they data processing operations you need to perform.

{{< expand-wrapper >}}
{{% expand "Learn more about how `map()` works" %}}

`map()` takes a single parameter, `fn`.
`fn` takes an anonymous function that reads each row as a
[record](/flux/v0/data-types/composite/record/) named `r`.
In the `r` record, each key-value pair represents a column and its value.
For example:

```js
r = {
    _time: 2020-01-01T00:00:00Z,
    _measurement: "home",
    room: "Kitchen",
    _field: "temp",
    _value: 21.0,
}
```

| _time                | _measurement | room    | _field | _value |
| :------------------- | :----------- | :------ | :----- | :----- |
| 2020-01-01T00:00:00Z | home         | Kitchen | temp   | 21.0   |

The `fn` function modifies the `r` record in any way you need and returns a new
record for the row. For example, using the record above:

```js
(r) => ({ _time: r._time, _field: "temp_F", _value: (r._value * 1.8) + 32.0})

// Returns: {_time: 2020-01-01T00:00:00Z, _field: "temp_F", _value: 69.8}
```

| _time                | _field | _value |
| :------------------- | :----- | -----: |
| 2020-01-01T00:00:00Z | temp_F |   69.8 |

Notice that some of the columns were dropped from the original row record.
This is because the `fn` function explicitly mapped the `_time`, `_field`, and `_value` columns.
To retain existing columns and only update or add specific columns, use the
`with` operator to extend your row record.
For example, using the record above:

```js
(r) => ({r with _value: (r._value * 1.8) + 32.0, degrees: "F"})

// Returns:
// {
//     _time: 2020-01-01T00:00:00Z,
//     _measurement: "home",
//     room: "Kitchen",
//     _field: "temp",
//     _value: 69.8,
//     degrees: "F",
// }
```

| _time                | _measurement | room    | _field | _value | degrees |
| :------------------- | :----------- | :------ | :----- | -----: | :------ |
| 2020-01-01T00:00:00Z | home         | Kitchen | temp   |   69.8 | F       |

{{% /expand %}}
{{< /expand-wrapper >}}

```js
from(bucket: "get-started")
    |> range(start: 2022-01-01T08:00:00Z, stop: 2022-01-01T20:00:01Z)
    |> filter(fn: (r) => r._measurement == "home")
    |> filter(fn: (r) => r._field == "hum")
    |> map(fn: (r) => ({r with _value: r._value / 100.0}))
```

### Map examples

{{< expand-wrapper >}}

{{% expand "Perform mathematical operations" %}}

`map()` lets your perform mathematical operations on your data.
For example, using the [data written in "Get started writing to InfluxDB"](/influxdb/version/get-started/write/#view-the-written-data):

1.  Query the `temp` field to return room temperatures in °C.
2.  Use `map()` to iterate over each row and convert the °C temperatures in the
    `_value` column to °F using the equation: `°F = (°C * 1.8) + 32.0`.

```js
from(bucket: "get-started")
    |> range(start: 2022-01-01T14:00:00Z, stop: 2022-01-01T20:00:01Z)
    |> filter(fn: (r) => r._measurement == "home")
    |> filter(fn: (r) => r._field == "temp")
    |> map(fn: (r) => ({r with _value: (r._value * 1.8) + 32.0}))
```

{{< tabs-wrapper >}}
{{% tabs "small" %}}
[Input](#)
[Output](#)
<span class="tab-view-output">Click to view output</span>
{{% /tabs %}}
{{% tab-content %}}

{{% note %}}
`_start` and `_stop` columns have been omitted.
{{% /note %}}

| _time                | _measurement | room        | _field | _value |
| :------------------- | :----------- | :---------- | :----- | -----: |
| 2022-01-01T14:00:00Z | home         | Kitchen     | temp   |   22.8 |
| 2022-01-01T15:00:00Z | home         | Kitchen     | temp   |   22.7 |
| 2022-01-01T16:00:00Z | home         | Kitchen     | temp   |   22.4 |
| 2022-01-01T17:00:00Z | home         | Kitchen     | temp   |   22.7 |
| 2022-01-01T18:00:00Z | home         | Kitchen     | temp   |   23.3 |
| 2022-01-01T19:00:00Z | home         | Kitchen     | temp   |   23.1 |
| 2022-01-01T20:00:00Z | home         | Kitchen     | temp   |   22.7 |

| _time                | _measurement | room        | _field | _value |
| :------------------- | :----------- | :---------- | :----- | -----: |
| 2022-01-01T14:00:00Z | home         | Living Room | temp   |   22.3 |
| 2022-01-01T15:00:00Z | home         | Living Room | temp   |   22.3 |
| 2022-01-01T16:00:00Z | home         | Living Room | temp   |   22.4 |
| 2022-01-01T17:00:00Z | home         | Living Room | temp   |   22.6 |
| 2022-01-01T18:00:00Z | home         | Living Room | temp   |   22.8 |
| 2022-01-01T19:00:00Z | home         | Living Room | temp   |   22.5 |
| 2022-01-01T20:00:00Z | home         | Living Room | temp   |   22.2 |

{{% /tab-content %}}
{{% tab-content %}}

{{% note %}}
`_start` and `_stop` columns have been omitted.
{{% /note %}}

| _time                | _measurement | room    | _field |            _value |
| :------------------- | :----------- | :------ | :----- | ----------------: |
| 2022-01-01T14:00:00Z | home         | Kitchen | temp   | 73.03999999999999 |
| 2022-01-01T15:00:00Z | home         | Kitchen | temp   |             72.86 |
| 2022-01-01T16:00:00Z | home         | Kitchen | temp   |             72.32 |
| 2022-01-01T17:00:00Z | home         | Kitchen | temp   |             72.86 |
| 2022-01-01T18:00:00Z | home         | Kitchen | temp   |             73.94 |
| 2022-01-01T19:00:00Z | home         | Kitchen | temp   | 73.58000000000001 |
| 2022-01-01T20:00:00Z | home         | Kitchen | temp   |             72.86 |

| _time                | _measurement | room        | _field |            _value |
| :------------------- | :----------- | :---------- | :----- | ----------------: |
| 2022-01-01T14:00:00Z | home         | Living Room | temp   |             72.14 |
| 2022-01-01T15:00:00Z | home         | Living Room | temp   |             72.14 |
| 2022-01-01T16:00:00Z | home         | Living Room | temp   |             72.32 |
| 2022-01-01T17:00:00Z | home         | Living Room | temp   |             72.68 |
| 2022-01-01T18:00:00Z | home         | Living Room | temp   | 73.03999999999999 |
| 2022-01-01T19:00:00Z | home         | Living Room | temp   |              72.5 |
| 2022-01-01T20:00:00Z | home         | Living Room | temp   | 71.96000000000001 |

{{% /tab-content %}}
{{< /tabs-wrapper >}}

{{% /expand %}}

{{% expand "Conditionally assign a state" %}}

Within a `map()` function, you can use [conditional expressions](/flux/v0/spec/expressions/#conditional-expressions) (if/then/else) to conditionally assign values.
For example, using the [data written in "Get started writing to InfluxDB"](/influxdb/version/get-started/write/#view-the-written-data):

1.  Query the `co` field to return carbon monoxide parts per million (ppm) readings in each room.
2.  Use `map()` to iterate over each row, evaluate the value in the `_value`
    column, and then conditionally assign a state:
    
    - If the carbon monoxide is less than 10 ppm, assign the state: **ok**.
    - Otherwise, assign the state: **warning**.

    Store the state in a **state** column.

```js
from(bucket: "get-started")
    |> range(start: 2022-01-01T14:00:00Z, stop: 2022-01-01T20:00:01Z)
    |> filter(fn: (r) => r._measurement == "home")
    |> filter(fn: (r) => r._field == "co")
    |> map(fn: (r) => ({r with state: if r._value < 10 then "ok" else "warning"}))
```

{{< tabs-wrapper >}}
{{% tabs "small" %}}
[Input](#)
[Output](#)
<span class="tab-view-output">Click to view output</span>
{{% /tabs %}}
{{% tab-content %}}

{{% note %}}
`_start` and `_stop` columns have been omitted.
{{% /note %}}

| _time                | _measurement | room    | _field | _value |
| :------------------- | :----------- | :------ | :----- | -----: |
| 2022-01-01T14:00:00Z | home         | Kitchen | co     |      1 |
| 2022-01-01T15:00:00Z | home         | Kitchen | co     |      3 |
| 2022-01-01T16:00:00Z | home         | Kitchen | co     |      7 |
| 2022-01-01T17:00:00Z | home         | Kitchen | co     |      9 |
| 2022-01-01T18:00:00Z | home         | Kitchen | co     |     18 |
| 2022-01-01T19:00:00Z | home         | Kitchen | co     |     22 |
| 2022-01-01T20:00:00Z | home         | Kitchen | co     |     26 |

| _time                | _measurement | room        | _field | _value |
| :------------------- | :----------- | :---------- | :----- | -----: |
| 2022-01-01T14:00:00Z | home         | Living Room | co     |      1 |
| 2022-01-01T15:00:00Z | home         | Living Room | co     |      1 |
| 2022-01-01T16:00:00Z | home         | Living Room | co     |      4 |
| 2022-01-01T17:00:00Z | home         | Living Room | co     |      5 |
| 2022-01-01T18:00:00Z | home         | Living Room | co     |      9 |
| 2022-01-01T19:00:00Z | home         | Living Room | co     |     14 |
| 2022-01-01T20:00:00Z | home         | Living Room | co     |     17 |

{{% /tab-content %}}
{{% tab-content %}}

{{% note %}}
`_start` and `_stop` columns have been omitted.
{{% /note %}}

| _time                | _measurement | room    | _field | _value | state   |
| :------------------- | :----------- | :------ | :----- | -----: | :------ |
| 2022-01-01T14:00:00Z | home         | Kitchen | co     |      1 | ok      |
| 2022-01-01T15:00:00Z | home         | Kitchen | co     |      3 | ok      |
| 2022-01-01T16:00:00Z | home         | Kitchen | co     |      7 | ok      |
| 2022-01-01T17:00:00Z | home         | Kitchen | co     |      9 | ok      |
| 2022-01-01T18:00:00Z | home         | Kitchen | co     |     18 | warning |
| 2022-01-01T19:00:00Z | home         | Kitchen | co     |     22 | warning |
| 2022-01-01T20:00:00Z | home         | Kitchen | co     |     26 | warning |

| _time                | _measurement | room        | _field | _value | state   |
| :------------------- | :----------- | :---------- | :----- | -----: | :------ |
| 2022-01-01T14:00:00Z | home         | Living Room | co     |      1 | ok      |
| 2022-01-01T15:00:00Z | home         | Living Room | co     |      1 | ok      |
| 2022-01-01T16:00:00Z | home         | Living Room | co     |      4 | ok      |
| 2022-01-01T17:00:00Z | home         | Living Room | co     |      5 | ok      |
| 2022-01-01T18:00:00Z | home         | Living Room | co     |      9 | ok      |
| 2022-01-01T19:00:00Z | home         | Living Room | co     |     14 | warning |
| 2022-01-01T20:00:00Z | home         | Living Room | co     |     17 | warning |

{{% /tab-content %}}
{{< /tabs-wrapper >}}

{{% /expand %}}

{{% expand "Alert on data" %}}

`map()` lets you execute more complex operations on a per row basis.
Using a [Flux block (`{}`)](/flux/v0/spec/blocks/) in the `fn` function,
you can create scoped variables and execute other functions within the context 
of each row. For example, you can send a message to [Slack](https://slack.com).

{{% note %}}
For this example to actually send messages to Slack, you need to
[set up a Slack app that can send and receive messages](https://api.slack.com/messaging/sending).
{{% /note %}}

For example, using the [data written in "Get started writing to InfluxDB"](/influxdb/version/get-started/write/#view-the-written-data):

1.  Import the [`slack` package](/flux/v0/stdlib/slack/).
2.  Query the `co` field to return carbon monoxide parts per million (ppm) readings in each room.
3.  Use `map()` to iterate over each row, evaluate the value in the `_value`
    column, and then conditionally assign a state:
    
    - If the carbon monoxide is less than 10 ppm, assign the state: **ok**.
    - Otherwise, assign the state: **warning**.

    Store the state in a **state** column.
4.  Use [`filter()`](/flux/v0/stdlib/universe/filter/) to return
    only rows with **warning** in the state column.
5.  Use `map()` to iterate over each row.
    In your `fn` function, use a [Flux block (`{}`)](/flux/v0/spec/blocks/) to:

    1.  Create a `responseCode` variable that uses [`slack.message()`](/flux/v0/stdlib/slack/message/)
        to send a message to Slack using data from the input row.
        `slack.message()` returns the response code of the Slack API request as an integer.
    2.  Use a `return` statement to return a new row record.
        The new row should extend the input row with a new column, **sent**, with
        a boolean value determined by the `responseCode` variable.

`map()` sends a message to Slack for each row piped forward into the function.

```js
import "slack"

from(bucket: "get-started")
    |> range(start: 2022-01-01T14:00:00Z, stop: 2022-01-01T20:00:01Z)
    |> filter(fn: (r) => r._measurement == "home")
    |> filter(fn: (r) => r._field == "co")
    |> map(fn: (r) => ({r with state: if r._value < 10 then "ok" else "warning"}))
    |> filter(fn: (r) => r.state == "warning")
    |> map(
        fn: (r) => {
            responseCode =
                slack.message(
                    token: "mYSlacK70k3n",
                    color: "#ff0000",
                    channel: "#alerts",
                    text: "Carbon monoxide is at dangerous levels in the ${r.room}: ${r._value} ppm.",
                )

            return {r with sent: responseCode == 200}
        },
    )
```

{{< tabs-wrapper >}}
{{% tabs "small" %}}
[Input](#)
[Output](#)
<span class="tab-view-output">Click to view output</span>
{{% /tabs %}}
{{% tab-content %}}

The following input represents the data filtered by the **warning** state.

{{% note %}}
`_start` and `_stop` columns have been omitted.
{{% /note %}}

| _time                | _measurement | room    | _field | _value | state   |
| :------------------- | :----------- | :------ | :----- | -----: | :------ |
| 2022-01-01T18:00:00Z | home         | Kitchen | co     |     18 | warning |
| 2022-01-01T19:00:00Z | home         | Kitchen | co     |     22 | warning |
| 2022-01-01T20:00:00Z | home         | Kitchen | co     |     26 | warning |

| _time                | _measurement | room        | _field | _value | state   |
| :------------------- | :----------- | :---------- | :----- | -----: | :------ |
| 2022-01-01T19:00:00Z | home         | Living Room | co     |     14 | warning |
| 2022-01-01T20:00:00Z | home         | Living Room | co     |     17 | warning |

{{% /tab-content %}}
{{% tab-content %}}

The output includes a **sent** column indicating the if the message was sent.

{{% note %}}
`_start` and `_stop` columns have been omitted.
{{% /note %}}

| _time                | _measurement | room    | _field | _value | state   | sent |
| :------------------- | :----------- | :------ | :----- | -----: | :------ | :--- |
| 2022-01-01T18:00:00Z | home         | Kitchen | co     |     18 | warning | true |
| 2022-01-01T19:00:00Z | home         | Kitchen | co     |     22 | warning | true |
| 2022-01-01T20:00:00Z | home         | Kitchen | co     |     26 | warning | true |

| _time                | _measurement | room        | _field | _value | state   | sent |
| :------------------- | :----------- | :---------- | :----- | -----: | :------ | :--- |
| 2022-01-01T19:00:00Z | home         | Living Room | co     |     14 | warning | true |
| 2022-01-01T20:00:00Z | home         | Living Room | co     |     17 | warning | true |

{{% /tab-content %}}
{{< /tabs-wrapper >}}

With the results above, you would receive the following messages in Slack:

> Carbon monoxide is at dangerous levels in the Kitchen: 18 ppm.  
> Carbon monoxide is at dangerous levels in the Kitchen: 22 ppm.  
> Carbon monoxide is at dangerous levels in the Living Room: 14 ppm.  
> Carbon monoxide is at dangerous levels in the Kitchen: 26 ppm.  
> Carbon monoxide is at dangerous levels in the Living Room: 17 ppm.  

{{% note %}}
You can also use the [InfluxDB checks and notifications system](/influxdb/version/monitor-alert/)
as a user interface for configuring checks and alerting on data.
{{% /note %}}

{{% /expand %}}
{{< /expand-wrapper >}}

## Group data

Use the [`group()` function](/flux/v0/stdlib/universe/group/) to
regroup your data by specific column values in preparation for further processing.

```js
from(bucket: "get-started")
    |> range(start: 2022-01-01T08:00:00Z, stop: 2022-01-01T20:00:01Z)
    |> filter(fn: (r) => r._measurement == "home")
    |> group(columns: ["room", "_field"])
```

{{% note %}}
Understanding data grouping and why it matters is important, but may be too much
for this "getting started" tutorial.
For more information about how data is grouped and why it matters, see the
[Flux data model](/flux/v0/get-started/data-model/) documentation.
{{% /note %}}

By default, `from()` returns data queried from InfluxDB grouped by series
(measurement, tags, and field key).
Each table in the returned stream of tables represents a group.
Each table contains the same values for the columns that data is grouped by.
This grouping is important as you [aggregate data](#aggregate-or-select-specific-data).

### Group examples

{{< expand-wrapper >}}
{{% expand "Group data by specific columns" %}}

Using the [data written in "Get started writing to InfluxDB"](/influxdb/version/get-started/write/#view-the-written-data):

1.  Query the `temp` and `hum` fields.
2.  Use `group()` to group by only the `_field` column.

```js
from(bucket: "get-started")
    |> range(start: 2022-01-01T08:00:00Z, stop: 2022-01-01T10:00:01Z)
    |> filter(fn: (r) => r._measurement == "home")
    |> filter(fn: (r) => r._field == "temp" or r._field == "hum")
    |> group(columns: ["_field"])
```

{{< tabs-wrapper >}}
{{% tabs "small" %}}
[Input](#)
[Output](#)
<span class="tab-view-output">Click to view output</span>
{{% /tabs %}}
{{% tab-content %}}

The following data is output from the last `filter()` and piped forward into `group()`:

{{% note %}}
`_start` and `_stop` columns have been omitted.
{{% /note %}}

{{% flux/group-key "[_measurement=home, room=Kitchen, _field=hum]" true %}}

| _time                | _measurement | room        | _field | _value |
| :------------------- | :----------- | :---------- | :----- | :----- |
| 2022-01-01T08:00:00Z | home         | Kitchen     | hum    | 35.9   |
| 2022-01-01T09:00:00Z | home         | Kitchen     | hum    | 36.2   |
| 2022-01-01T10:00:00Z | home         | Kitchen     | hum    | 36.1   |

{{% flux/group-key "[_measurement=home, room=Living Room, _field=hum]" true %}}

| _time                | _measurement | room        | _field | _value |
| :------------------- | :----------- | :---------- | :----- | :----- |
| 2022-01-01T08:00:00Z | home         | Living Room | hum    | 35.9   |
| 2022-01-01T09:00:00Z | home         | Living Room | hum    | 35.9   |
| 2022-01-01T10:00:00Z | home         | Living Room | hum    | 36     |

{{% flux/group-key "[_measurement=home, room=Kitchen, _field=temp]" true %}}

| _time                | _measurement | room        | _field | _value |
| :------------------- | :----------- | :---------- | :----- | :----- |
| 2022-01-01T08:00:00Z | home         | Kitchen     | temp   | 21     |
| 2022-01-01T09:00:00Z | home         | Kitchen     | temp   | 23     |
| 2022-01-01T10:00:00Z | home         | Kitchen     | temp   | 22.7   |

{{% flux/group-key "[_measurement=home, room=Living Room, _field=temp]" true %}}

| _time                | _measurement | room        | _field | _value |
| :------------------- | :----------- | :---------- | :----- | :----- |
| 2022-01-01T08:00:00Z | home         | Living Room | temp   | 21.1   |
| 2022-01-01T09:00:00Z | home         | Living Room | temp   | 21.4   |
| 2022-01-01T10:00:00Z | home         | Living Room | temp   | 21.8   |

{{% /tab-content %}}
{{% tab-content %}}

When grouped by `_field`, all rows with the `temp` field will be in one table
and all the rows with the `hum` field will be in another.
`_measurement` and `room` columns no longer affect how rows are grouped.

{{% note %}}
`_start` and `_stop` columns have been omitted.
{{% /note %}}

{{% flux/group-key "[_field=hum]" true %}}

| _time                | _measurement | room        | _field | _value |
| :------------------- | :----------- | :---------- | :----- | :----- |
| 2022-01-01T08:00:00Z | home         | Kitchen     | hum    | 35.9   |
| 2022-01-01T09:00:00Z | home         | Kitchen     | hum    | 36.2   |
| 2022-01-01T10:00:00Z | home         | Kitchen     | hum    | 36.1   |
| 2022-01-01T08:00:00Z | home         | Living Room | hum    | 35.9   |
| 2022-01-01T09:00:00Z | home         | Living Room | hum    | 35.9   |
| 2022-01-01T10:00:00Z | home         | Living Room | hum    | 36     |

{{% flux/group-key "[_field=temp]" true %}}

| _time                | _measurement | room        | _field | _value |
| :------------------- | :----------- | :---------- | :----- | :----- |
| 2022-01-01T08:00:00Z | home         | Kitchen     | temp   | 21     |
| 2022-01-01T09:00:00Z | home         | Kitchen     | temp   | 23     |
| 2022-01-01T10:00:00Z | home         | Kitchen     | temp   | 22.7   |
| 2022-01-01T08:00:00Z | home         | Living Room | temp   | 21.1   |
| 2022-01-01T09:00:00Z | home         | Living Room | temp   | 21.4   |
| 2022-01-01T10:00:00Z | home         | Living Room | temp   | 21.8   |

{{% /tab-content %}}
{{< /tabs-wrapper >}}

{{% /expand %}}

{{% expand "Ungroup data" %}}

Using the [data written in "Get started writing to InfluxDB"](/influxdb/version/get-started/write/#view-the-written-data):

1.  Query the `temp` and `hum` fields.
2.  Use `group()` without any parameters to "ungroup" data or group by no columns.
    The default value of the `columns` parameter is an empty array (`[]`).

```js
from(bucket: "get-started")
    |> range(start: 2022-01-01T08:00:00Z, stop: 2022-01-01T10:00:01Z)
    |> filter(fn: (r) => r._measurement == "home")
    |> filter(fn: (r) => r._field == "temp" or r._field == "hum")
    |> group()
```

{{< tabs-wrapper >}}
{{% tabs "small" %}}
[Input](#)
[Output](#)
<span class="tab-view-output">Click to view output</span>
{{% /tabs %}}
{{% tab-content %}}

The following data is output from the last `filter()` and piped forward into `group()`:

{{% note %}}
`_start` and `_stop` columns have been omitted.
{{% /note %}}

{{% flux/group-key "[_measurement=home, room=Kitchen, _field=hum]" true %}}

| _time                | _measurement | room        | _field | _value |
| :------------------- | :----------- | :---------- | :----- | :----- |
| 2022-01-01T08:00:00Z | home         | Kitchen     | hum    | 35.9   |
| 2022-01-01T09:00:00Z | home         | Kitchen     | hum    | 36.2   |
| 2022-01-01T10:00:00Z | home         | Kitchen     | hum    | 36.1   |

{{% flux/group-key "[_measurement=home, room=Living Room, _field=hum]" true %}}

| _time                | _measurement | room        | _field | _value |
| :------------------- | :----------- | :---------- | :----- | :----- |
| 2022-01-01T08:00:00Z | home         | Living Room | hum    | 35.9   |
| 2022-01-01T09:00:00Z | home         | Living Room | hum    | 35.9   |
| 2022-01-01T10:00:00Z | home         | Living Room | hum    | 36     |

{{% flux/group-key "[_measurement=home, room=Kitchen, _field=temp]" true %}}

| _time                | _measurement | room        | _field | _value |
| :------------------- | :----------- | :---------- | :----- | :----- |
| 2022-01-01T08:00:00Z | home         | Kitchen     | temp   | 21     |
| 2022-01-01T09:00:00Z | home         | Kitchen     | temp   | 23     |
| 2022-01-01T10:00:00Z | home         | Kitchen     | temp   | 22.7   |

{{% flux/group-key "[_measurement=home, room=Living Room, _field=temp]" true %}}

| _time                | _measurement | room        | _field | _value |
| :------------------- | :----------- | :---------- | :----- | :----- |
| 2022-01-01T08:00:00Z | home         | Living Room | temp   | 21.1   |
| 2022-01-01T09:00:00Z | home         | Living Room | temp   | 21.4   |
| 2022-01-01T10:00:00Z | home         | Living Room | temp   | 21.8   |

{{% /tab-content %}}
{{% tab-content %}}

When ungrouped, a data is returned in a single table.

{{% note %}}
`_start` and `_stop` columns have been omitted.
{{% /note %}}

{{% flux/group-key "[]" true %}}

| _time                | _measurement | room        | _field | _value |
| :------------------- | :----------- | :---------- | :----- | -----: |
| 2022-01-01T08:00:00Z | home         | Kitchen     | hum    |   35.9 |
| 2022-01-01T09:00:00Z | home         | Kitchen     | hum    |   36.2 |
| 2022-01-01T10:00:00Z | home         | Kitchen     | hum    |   36.1 |
| 2022-01-01T08:00:00Z | home         | Kitchen     | temp   |     21 |
| 2022-01-01T09:00:00Z | home         | Kitchen     | temp   |     23 |
| 2022-01-01T10:00:00Z | home         | Kitchen     | temp   |   22.7 |
| 2022-01-01T08:00:00Z | home         | Living Room | hum    |   35.9 |
| 2022-01-01T09:00:00Z | home         | Living Room | hum    |   35.9 |
| 2022-01-01T10:00:00Z | home         | Living Room | hum    |     36 |
| 2022-01-01T08:00:00Z | home         | Living Room | temp   |   21.1 |
| 2022-01-01T09:00:00Z | home         | Living Room | temp   |   21.4 |
| 2022-01-01T10:00:00Z | home         | Living Room | temp   |   21.8 |

{{% /tab-content %}}
{{< /tabs-wrapper >}}

{{% /expand %}}
{{< /expand-wrapper >}}

## Aggregate or select specific data

Use Flux [aggregate](/flux/v0/function-types/#aggregates)
or [selector](/flux/v0/function-types/#selectors) functions to
return aggregate or selected values from **each** input table.

```js
from(bucket: "get-started")
    |> range(start: 2022-01-01T08:00:00Z, stop: 2022-01-01T20:00:01Z)
    |> filter(fn: (r) => r._measurement == "home")
    |> filter(fn: (r) => r._field == "co" or r._field == "hum" or r._field == "temp")
    |> mean()
```

{{% note %}}
#### Aggregate over time

If you want to query aggregate values over time, this is a form of
[downsampling](#downsample-data).
{{% /note %}}

### Aggregate functions

[Aggregate functions](/flux/v0/function-types/#aggregates) drop
columns that are **not** in the [group key](/flux/v0/get-started/data-model/#group-key)
and return a single row for each input table with the aggregate value of that table.

#### Aggregate examples

{{< expand-wrapper >}}

{{% expand "Calculate the average temperature for each room" %}}

Using the [data written in "Get started writing to InfluxDB"](/influxdb/version/get-started/write/#view-the-written-data):

1.  Query the `temp` field. By default, `from()` returns the data grouped by
    `_measurement`, `room` and `_field`, so each table represents a room.
2.  Use `mean()` to return the average temperature from each room.

```js
from(bucket: "get-started")
    |> range(start: 2022-01-01T14:00:00Z, stop: 2022-01-01T20:00:01Z)
    |> filter(fn: (r) => r._measurement == "home")
    |> filter(fn: (r) => r._field == "temp")
    |> mean()
```

{{< tabs-wrapper >}}
{{% tabs "small" %}}
[Input](#)
[Output](#)
<span class="tab-view-output">Click to view output</span>
{{% /tabs %}}
{{% tab-content %}}

{{% note %}}
`_start` and `_stop` columns have been omitted.
{{% /note %}}

| _time                | _measurement | room        | _field | _value |
| :------------------- | :----------- | :---------- | :----- | -----: |
| 2022-01-01T14:00:00Z | home         | Kitchen     | temp   |   22.8 |
| 2022-01-01T15:00:00Z | home         | Kitchen     | temp   |   22.7 |
| 2022-01-01T16:00:00Z | home         | Kitchen     | temp   |   22.4 |
| 2022-01-01T17:00:00Z | home         | Kitchen     | temp   |   22.7 |
| 2022-01-01T18:00:00Z | home         | Kitchen     | temp   |   23.3 |
| 2022-01-01T19:00:00Z | home         | Kitchen     | temp   |   23.1 |
| 2022-01-01T20:00:00Z | home         | Kitchen     | temp   |   22.7 |

| _time                | _measurement | room        | _field | _value |
| :------------------- | :----------- | :---------- | :----- | -----: |
| 2022-01-01T14:00:00Z | home         | Living Room | temp   |   22.3 |
| 2022-01-01T15:00:00Z | home         | Living Room | temp   |   22.3 |
| 2022-01-01T16:00:00Z | home         | Living Room | temp   |   22.4 |
| 2022-01-01T17:00:00Z | home         | Living Room | temp   |   22.6 |
| 2022-01-01T18:00:00Z | home         | Living Room | temp   |   22.8 |
| 2022-01-01T19:00:00Z | home         | Living Room | temp   |   22.5 |
| 2022-01-01T20:00:00Z | home         | Living Room | temp   |   22.2 |

{{% /tab-content %}}
{{% tab-content %}}

{{% note %}}
`_start` and `_stop` columns have been omitted.
{{% /note %}}

| _measurement | room    | _field |             _value |
| :----------- | :------ | :----- | -----------------: |
| home         | Kitchen | temp   | 22.814285714285713 |

| _measurement | room        | _field |            _value |
| :----------- | :---------- | :----- | ----------------: |
| home         | Living Room | temp   | 22.44285714285714 |

{{% /tab-content %}}
{{< /tabs-wrapper >}}

{{% /expand %}}

{{% expand "Calculate the overall average temperature of all rooms" %}}

Using the [data written in "Get started writing to InfluxDB"](/influxdb/version/get-started/write/#view-the-written-data):

1.  Query the `temp` field.
2.  Use `group()` to **ungroup** the data into a single table. By default,
    `from()` returns the data grouped by`_measurement`, `room` and `_field`.
    To get the overall average, you need to structure all results as a single table.
3.  Use `mean()` to return the average temperature.

```js
from(bucket: "get-started")
    |> range(start: 2022-01-01T14:00:00Z, stop: 2022-01-01T20:00:01Z)
    |> filter(fn: (r) => r._measurement == "home")
    |> filter(fn: (r) => r._field == "temp")
    |> group()
    |> mean()
```

{{< tabs-wrapper >}}
{{% tabs "small" %}}
[Input](#)
[Output](#)
<span class="tab-view-output">Click to view output</span>
{{% /tabs %}}
{{% tab-content %}}

The following input data represents the ungrouped data that is piped forward
into `mean()`.

{{% note %}}
`_start` and `_stop` columns have been omitted.
{{% /note %}}

| _time                | _measurement | room        | _field | _value |
| :------------------- | :----------- | :---------- | :----- | -----: |
| 2022-01-01T14:00:00Z | home         | Kitchen     | temp   |   22.8 |
| 2022-01-01T15:00:00Z | home         | Kitchen     | temp   |   22.7 |
| 2022-01-01T16:00:00Z | home         | Kitchen     | temp   |   22.4 |
| 2022-01-01T17:00:00Z | home         | Kitchen     | temp   |   22.7 |
| 2022-01-01T18:00:00Z | home         | Kitchen     | temp   |   23.3 |
| 2022-01-01T19:00:00Z | home         | Kitchen     | temp   |   23.1 |
| 2022-01-01T20:00:00Z | home         | Kitchen     | temp   |   22.7 |
| 2022-01-01T14:00:00Z | home         | Living Room | temp   |   22.3 |
| 2022-01-01T15:00:00Z | home         | Living Room | temp   |   22.3 |
| 2022-01-01T16:00:00Z | home         | Living Room | temp   |   22.4 |
| 2022-01-01T17:00:00Z | home         | Living Room | temp   |   22.6 |
| 2022-01-01T18:00:00Z | home         | Living Room | temp   |   22.8 |
| 2022-01-01T19:00:00Z | home         | Living Room | temp   |   22.5 |
| 2022-01-01T20:00:00Z | home         | Living Room | temp   |   22.2 |

{{% /tab-content %}}
{{% tab-content %}}

{{% note %}}
`_start` and `_stop` columns have been omitted.
{{% /note %}}

|             _value |
| -----------------: |
| 22.628571428571426 |

{{% /tab-content %}}
{{< /tabs-wrapper >}}

{{% /expand %}}

{{% expand "Count the number of points reported per room across all fields" %}}

Using the [data written in "Get started writing to InfluxDB"](/influxdb/version/get-started/write/#view-the-written-data):

1.  Query all fields by simply filtering by the `home` measurement.
2.  The fields in the `home` measurement are different types.
    Use `toFloat()` to cast all field values to floats.
3.  Use `group()` to group the data by `room`.
4.  Use `count()` to return the number of rows in each input table.

```js
from(bucket: "get-started")
    |> range(start: 2022-01-01T14:00:00Z, stop: 2022-01-01T20:00:01Z)
    |> filter(fn: (r) => r._measurement == "home")
    |> toFloat()
    |> group(columns: ["room"])
    |> count()
```

##### Output

{{% note %}}
`_start` and `_stop` columns have been omitted.
{{% /note %}}

| room    | _value |
| :------ | -----: |
| Kitchen |     21 |

| room        | _value |
| :---------- | -----: |
| Living Room |     21 |

{{% /expand %}}

{{< /expand-wrapper >}}

{{% note %}}
#### Assign a new aggregate timestamp

`_time` is generally not part of the group key and will be dropped when using
aggregate functions. To assign a new timestamp to aggregate points, duplicate
the `_start` or `_stop` column, which represent the query bounds, as the
new `_time` column.

```js
from(bucket: "get-started")
    |> range(start: 2022-01-01T14:00:00Z, stop: 2022-01-01T20:00:01Z)
    |> filter(fn: (r) => r._measurement == "home")
    |> filter(fn: (r) => r._field == "temp")
    |> mean()
    |> duplicate(column: "_stop", as: "_time")
```
{{% /note %}}

### Selector functions

[Selector functions](/flux/v0/function-types/#selectors) return
one or more columns from each input table and retain all columns and their values.

#### Selector examples

{{< expand-wrapper >}}

{{% expand "Return the first temperature from each room" %}}

Using the [data written in "Get started writing to InfluxDB"](/influxdb/version/get-started/write/#view-the-written-data):

1.  Query the `temp` field.
2.  Use [`first()`](/flux/v0/stdlib/universe/first/) to return the
    first row from each table.

```js
from(bucket: "get-started")
    |> range(start: 2022-01-01T14:00:00Z, stop: 2022-01-01T20:00:01Z)
    |> filter(fn: (r) => r._measurement == "home")
    |> filter(fn: (r) => r._field == "temp")
    |> first()
```

{{< tabs-wrapper >}}
{{% tabs "small" %}}
[Input](#)
[Output](#)
<span class="tab-view-output">Click to view output</span>
{{% /tabs %}}
{{% tab-content %}}

{{% note %}}
`_start` and `_stop` columns have been omitted.
{{% /note %}}

| _time                | _measurement | room        | _field | _value |
| :------------------- | :----------- | :---------- | :----- | -----: |
| 2022-01-01T14:00:00Z | home         | Kitchen     | temp   |   22.8 |
| 2022-01-01T15:00:00Z | home         | Kitchen     | temp   |   22.7 |
| 2022-01-01T16:00:00Z | home         | Kitchen     | temp   |   22.4 |
| 2022-01-01T17:00:00Z | home         | Kitchen     | temp   |   22.7 |
| 2022-01-01T18:00:00Z | home         | Kitchen     | temp   |   23.3 |
| 2022-01-01T19:00:00Z | home         | Kitchen     | temp   |   23.1 |
| 2022-01-01T20:00:00Z | home         | Kitchen     | temp   |   22.7 |

| _time                | _measurement | room        | _field | _value |
| :------------------- | :----------- | :---------- | :----- | -----: |
| 2022-01-01T14:00:00Z | home         | Living Room | temp   |   22.3 |
| 2022-01-01T15:00:00Z | home         | Living Room | temp   |   22.3 |
| 2022-01-01T16:00:00Z | home         | Living Room | temp   |   22.4 |
| 2022-01-01T17:00:00Z | home         | Living Room | temp   |   22.6 |
| 2022-01-01T18:00:00Z | home         | Living Room | temp   |   22.8 |
| 2022-01-01T19:00:00Z | home         | Living Room | temp   |   22.5 |
| 2022-01-01T20:00:00Z | home         | Living Room | temp   |   22.2 |

{{% /tab-content %}}
{{% tab-content %}}

{{% note %}}
`_start` and `_stop` columns have been omitted.
{{% /note %}}

| _time                | _measurement | room        | _field | _value |
| :------------------- | :----------- | :---------- | :----- | -----: |
| 2022-01-01T14:00:00Z | home         | Kitchen     | temp   |   22.8 |

| _time                | _measurement | room        | _field | _value |
| :------------------- | :----------- | :---------- | :----- | -----: |
| 2022-01-01T14:00:00Z | home         | Living Room | temp   |   22.3 |

{{% /tab-content %}}
{{< /tabs-wrapper >}}

{{% /expand %}}

{{% expand "Return the last temperature from each room" %}}

Using the [data written in "Get started writing to InfluxDB"](/influxdb/version/get-started/write/#view-the-written-data):

1.  Query the `temp` field.
2.  Use [`last()`](/flux/v0/stdlib/universe/last/) to return the
    last row from each table.

```js
from(bucket: "get-started")
    |> range(start: 2022-01-01T14:00:00Z, stop: 2022-01-01T20:00:01Z)
    |> filter(fn: (r) => r._measurement == "home")
    |> filter(fn: (r) => r._field == "temp")
    |> last()
```

{{< tabs-wrapper >}}
{{% tabs "small" %}}
[Input](#)
[Output](#)
<span class="tab-view-output">Click to view output</span>
{{% /tabs %}}
{{% tab-content %}}

{{% note %}}
`_start` and `_stop` columns have been omitted.
{{% /note %}}

| _time                | _measurement | room        | _field | _value |
| :------------------- | :----------- | :---------- | :----- | -----: |
| 2022-01-01T14:00:00Z | home         | Kitchen     | temp   |   22.8 |
| 2022-01-01T15:00:00Z | home         | Kitchen     | temp   |   22.7 |
| 2022-01-01T16:00:00Z | home         | Kitchen     | temp   |   22.4 |
| 2022-01-01T17:00:00Z | home         | Kitchen     | temp   |   22.7 |
| 2022-01-01T18:00:00Z | home         | Kitchen     | temp   |   23.3 |
| 2022-01-01T19:00:00Z | home         | Kitchen     | temp   |   23.1 |
| 2022-01-01T20:00:00Z | home         | Kitchen     | temp   |   22.7 |

| _time                | _measurement | room        | _field | _value |
| :------------------- | :----------- | :---------- | :----- | -----: |
| 2022-01-01T14:00:00Z | home         | Living Room | temp   |   22.3 |
| 2022-01-01T15:00:00Z | home         | Living Room | temp   |   22.3 |
| 2022-01-01T16:00:00Z | home         | Living Room | temp   |   22.4 |
| 2022-01-01T17:00:00Z | home         | Living Room | temp   |   22.6 |
| 2022-01-01T18:00:00Z | home         | Living Room | temp   |   22.8 |
| 2022-01-01T19:00:00Z | home         | Living Room | temp   |   22.5 |
| 2022-01-01T20:00:00Z | home         | Living Room | temp   |   22.2 |

{{% /tab-content %}}
{{% tab-content %}}

{{% note %}}
`_start` and `_stop` columns have been omitted.
{{% /note %}}

| _time                | _measurement | room        | _field | _value |
| :------------------- | :----------- | :---------- | :----- | -----: |
| 2022-01-01T20:00:00Z | home         | Kitchen     | temp   |   22.7 |

| _time                | _measurement | room        | _field | _value |
| :------------------- | :----------- | :---------- | :----- | -----: |
| 2022-01-01T20:00:00Z | home         | Living Room | temp   |   22.2 |

{{% /tab-content %}}
{{< /tabs-wrapper >}}

{{% /expand %}}

{{% expand "Return the maximum temperature from each room" %}}

Using the [data written in "Get started writing to InfluxDB"](/influxdb/version/get-started/write/#view-the-written-data):

1.  Query the `temp` field.
2.  Use [`max()`](/flux/v0/stdlib/universe/max/) to return the row
    with the highest value in the `_value` column from each table.

```js
from(bucket: "get-started")
    |> range(start: 2022-01-01T14:00:00Z, stop: 2022-01-01T20:00:01Z)
    |> filter(fn: (r) => r._measurement == "home")
    |> filter(fn: (r) => r._field == "temp")
    |> max()
```

{{< tabs-wrapper >}}
{{% tabs "small" %}}
[Input](#)
[Output](#)
<span class="tab-view-output">Click to view output</span>
{{% /tabs %}}
{{% tab-content %}}

{{% note %}}
`_start` and `_stop` columns have been omitted.
{{% /note %}}

| _time                | _measurement | room        | _field | _value |
| :------------------- | :----------- | :---------- | :----- | -----: |
| 2022-01-01T14:00:00Z | home         | Kitchen     | temp   |   22.8 |
| 2022-01-01T15:00:00Z | home         | Kitchen     | temp   |   22.7 |
| 2022-01-01T16:00:00Z | home         | Kitchen     | temp   |   22.4 |
| 2022-01-01T17:00:00Z | home         | Kitchen     | temp   |   22.7 |
| 2022-01-01T18:00:00Z | home         | Kitchen     | temp   |   23.3 |
| 2022-01-01T19:00:00Z | home         | Kitchen     | temp   |   23.1 |
| 2022-01-01T20:00:00Z | home         | Kitchen     | temp   |   22.7 |

| _time                | _measurement | room        | _field | _value |
| :------------------- | :----------- | :---------- | :----- | -----: |
| 2022-01-01T14:00:00Z | home         | Living Room | temp   |   22.3 |
| 2022-01-01T15:00:00Z | home         | Living Room | temp   |   22.3 |
| 2022-01-01T16:00:00Z | home         | Living Room | temp   |   22.4 |
| 2022-01-01T17:00:00Z | home         | Living Room | temp   |   22.6 |
| 2022-01-01T18:00:00Z | home         | Living Room | temp   |   22.8 |
| 2022-01-01T19:00:00Z | home         | Living Room | temp   |   22.5 |
| 2022-01-01T20:00:00Z | home         | Living Room | temp   |   22.2 |

{{% /tab-content %}}
{{% tab-content %}}

{{% note %}}
`_start` and `_stop` columns have been omitted.
{{% /note %}}

| _time                | _measurement | room        | _field | _value |
| :------------------- | :----------- | :---------- | :----- | -----: |
| 2022-01-01T14:00:00Z | home         | Kitchen     | temp   |   22.8 |

| _time                | _measurement | room        | _field | _value |
| :------------------- | :----------- | :---------- | :----- | -----: |
| 2022-01-01T18:00:00Z | home         | Living Room | temp   |   22.8 |

{{% /tab-content %}}
{{< /tabs-wrapper >}}

{{% /expand %}}

{{< /expand-wrapper >}}

## Pivot data into a relational schema

If coming from relational SQL or SQL-like query languages, such as InfluxQL,
the data model that Flux uses is different than what you're used to.
Flux returns multiple tables where each table contains a different field.
A "relational" schema structures each field as a column in each row.

Use the [`pivot()` function](/flux/v0/stdlib/universe/pivot/) to
pivot data into a "relational" schema based on timestamps.

```js
from(bucket: "get-started")
    |> range(start: 2022-01-01T14:00:00Z, stop: 2022-01-01T20:00:01Z)
    |> filter(fn: (r) => r._measurement == "home")
    |> filter(fn: (r) => r._field == "co" or r._field == "hum" or r._field == "temp")
    |> filter(fn: (r) => r.room == "Kitchen")
    |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
```

{{< expand-wrapper >}}
{{% expand "View input and pivoted output" %}}

{{< tabs-wrapper >}}
{{% tabs "small" %}}
[Input](#)
[Output](#)
<span class="tab-view-output">Click to view output</span>
{{% /tabs %}}
{{% tab-content %}}

{{% note %}}
`_start` and `_stop` columns have been omitted.
{{% /note %}}

| _time                | _measurement | room    | _field | _value |
| :------------------- | :----------- | :------ | :----- | -----: |
| 2022-01-01T14:00:00Z | home         | Kitchen | co     |      1 |
| 2022-01-01T15:00:00Z | home         | Kitchen | co     |      3 |
| 2022-01-01T16:00:00Z | home         | Kitchen | co     |      7 |
| 2022-01-01T17:00:00Z | home         | Kitchen | co     |      9 |
| 2022-01-01T18:00:00Z | home         | Kitchen | co     |     18 |
| 2022-01-01T19:00:00Z | home         | Kitchen | co     |     22 |
| 2022-01-01T20:00:00Z | home         | Kitchen | co     |     26 |

| _time                | _measurement | room    | _field | _value |
| :------------------- | :----------- | :------ | :----- | -----: |
| 2022-01-01T14:00:00Z | home         | Kitchen | hum    |   36.3 |
| 2022-01-01T15:00:00Z | home         | Kitchen | hum    |   36.2 |
| 2022-01-01T16:00:00Z | home         | Kitchen | hum    |     36 |
| 2022-01-01T17:00:00Z | home         | Kitchen | hum    |     36 |
| 2022-01-01T18:00:00Z | home         | Kitchen | hum    |   36.9 |
| 2022-01-01T19:00:00Z | home         | Kitchen | hum    |   36.6 |
| 2022-01-01T20:00:00Z | home         | Kitchen | hum    |   36.5 |

| _time                | _measurement | room    | _field | _value |
| :------------------- | :----------- | :------ | :----- | -----: |
| 2022-01-01T14:00:00Z | home         | Kitchen | temp   |   22.8 |
| 2022-01-01T15:00:00Z | home         | Kitchen | temp   |   22.7 |
| 2022-01-01T16:00:00Z | home         | Kitchen | temp   |   22.4 |
| 2022-01-01T17:00:00Z | home         | Kitchen | temp   |   22.7 |
| 2022-01-01T18:00:00Z | home         | Kitchen | temp   |   23.3 |
| 2022-01-01T19:00:00Z | home         | Kitchen | temp   |   23.1 |
| 2022-01-01T20:00:00Z | home         | Kitchen | temp   |   22.7 |

{{% /tab-content %}}
{{% tab-content %}}

{{% note %}}
`_start` and `_stop` columns have been omitted.
{{% /note %}}

| _time                | _measurement | room    |  co |  hum | temp |
| :------------------- | :----------- | :------ | --: | ---: | ---: |
| 2022-01-01T14:00:00Z | home         | Kitchen |   1 | 36.3 | 22.8 |
| 2022-01-01T15:00:00Z | home         | Kitchen |   3 | 36.2 | 22.7 |
| 2022-01-01T16:00:00Z | home         | Kitchen |   7 |   36 | 22.4 |
| 2022-01-01T17:00:00Z | home         | Kitchen |   9 |   36 | 22.7 |
| 2022-01-01T18:00:00Z | home         | Kitchen |  18 | 36.9 | 23.3 |
| 2022-01-01T19:00:00Z | home         | Kitchen |  22 | 36.6 | 23.1 |
| 2022-01-01T20:00:00Z | home         | Kitchen |  26 | 36.5 | 22.7 |

{{% /tab-content %}}
{{< /tabs-wrapper >}}

{{% /expand %}}
{{< /expand-wrapper >}}

## Downsample data

Downsampling data is a strategy that improve performance at query time and also
optimizes long-term data storage. Simply put, downsampling reduces the number of
points returned by a query without losing the general trends in the data.

_For more information about downsampling data, see
[Downsample data](/influxdb/version/process-data/common-tasks/downsample-data/)._

The most common way to downsample data is by time intervals or "windows."
For example, you may want to query the last hour of data and return the average
value for every five minute window.

Use [`aggregateWindow()`](/flux/v0/stdlib/universe/aggregatewindow/)
to downsample data by specified time intervals:

- Use the `every` parameter to specify the duration of each window.
- Use the `fn` parameter to specify what [aggregate](/flux/v0/function-types/#aggregates)
  or [selector](/flux/v0/function-types/#selectors) function
  to apply to each window.
- _(Optional)_ Use the `timeSrc` parameter to specify which column value to
  use to create the new aggregate timestamp for each window.
  The default is `_stop`.

```js
from(bucket: "get-started")
    |> range(start: 2022-01-01T14:00:00Z, stop: 2022-01-01T20:00:01Z)
    |> filter(fn: (r) => r._measurement == "home")
    |> filter(fn: (r) => r._field == "temp")
    |> aggregateWindow(every: 2h, fn: mean)
```

{{< expand-wrapper >}}
{{% expand "View input and downsampled output" %}}

{{< tabs-wrapper >}}
{{% tabs "small" %}}
[Input](#)
[Output](#)
<span class="tab-view-output">Click to view output</span>
{{% /tabs %}}
{{% tab-content %}}

{{% note %}}
`_start` and `_stop` columns have been omitted.
{{% /note %}}

| _time                | _measurement | room        | _field | _value |
| :------------------- | :----------- | :---------- | :----- | -----: |
| 2022-01-01T14:00:00Z | home         | Kitchen     | temp   |   22.8 |
| 2022-01-01T15:00:00Z | home         | Kitchen     | temp   |   22.7 |
| 2022-01-01T16:00:00Z | home         | Kitchen     | temp   |   22.4 |
| 2022-01-01T17:00:00Z | home         | Kitchen     | temp   |   22.7 |
| 2022-01-01T18:00:00Z | home         | Kitchen     | temp   |   23.3 |
| 2022-01-01T19:00:00Z | home         | Kitchen     | temp   |   23.1 |
| 2022-01-01T20:00:00Z | home         | Kitchen     | temp   |   22.7 |

| _time                | _measurement | room        | _field | _value |
| :------------------- | :----------- | :---------- | :----- | -----: |
| 2022-01-01T14:00:00Z | home         | Living Room | temp   |   22.3 |
| 2022-01-01T15:00:00Z | home         | Living Room | temp   |   22.3 |
| 2022-01-01T16:00:00Z | home         | Living Room | temp   |   22.4 |
| 2022-01-01T17:00:00Z | home         | Living Room | temp   |   22.6 |
| 2022-01-01T18:00:00Z | home         | Living Room | temp   |   22.8 |
| 2022-01-01T19:00:00Z | home         | Living Room | temp   |   22.5 |
| 2022-01-01T20:00:00Z | home         | Living Room | temp   |   22.2 |

{{% /tab-content %}}
{{% tab-content %}}

{{% note %}}
`_start` and `_stop` columns have been omitted.
{{% /note %}}

| _time                | _measurement | room        | _field |             _value |
| :------------------- | :----------- | :---------- | :----- | -----------------: |
| 2022-01-01T16:00:00Z | home         | Kitchen     | temp   |              22.75 |
| 2022-01-01T18:00:00Z | home         | Kitchen     | temp   | 22.549999999999997 |
| 2022-01-01T20:00:00Z | home         | Kitchen     | temp   | 23.200000000000003 |
| 2022-01-01T20:00:01Z | home         | Kitchen     | temp   |               22.7 |

| _time                | _measurement | room        | _field |             _value |
| :------------------- | :----------- | :---------- | :----- | -----------------: |
| 2022-01-01T16:00:00Z | home         | Living Room | temp   |               22.3 |
| 2022-01-01T18:00:00Z | home         | Living Room | temp   |               22.5 |
| 2022-01-01T20:00:00Z | home         | Living Room | temp   |              22.65 |
| 2022-01-01T20:00:01Z | home         | Living Room | temp   |               22.2 |

{{% /tab-content %}}
{{< /tabs-wrapper >}}

{{% /expand %}}
{{< /expand-wrapper >}}

## Automate processing with InfluxDB tasks

[InfluxDB tasks](/influxdb/version/process-data/get-started/) are scheduled queries
that can perform any of the data processing operations described above.
Generally tasks then use the [`to()` function](/flux/v0/stdlib/influxdata/influxdb/to/)
to write the processed result back to InfluxDB.

_For more information about creating and configuring tasks, see
[Get started with InfluxDB tasks](/influxdb/version/process-data/get-started/)._

#### Example downsampling task

```js
option task = {
    name: "Example task"
    every: 1d,
}

from(bucket: "get-started-downsampled")
    |> range(start: -task.every)
    |> filter(fn: (r) => r._measurement == "home")
    |> aggregateWindow(every: 2h, fn: mean)
```
{{< page-nav prev="/influxdb/version/get-started/query/" next="/influxdb/version/get-started/visualize/" keepTab=true >}}
