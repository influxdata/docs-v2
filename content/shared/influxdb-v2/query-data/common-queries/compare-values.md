<!-- Shortcode -->

{{% note %}}
This example uses [NOAA water sample data](/influxdb/version/reference/sample-data/#noaa-water-sample-data).
{{% /note %}}

This example compares the value from the latest point to an average value stored in another bucket. This is useful when using the average value to calculate a [threshold check](/influxdb/version/monitor-alert/checks/create/#threshold-check).

The following query:

- Uses [`range()`](/flux/v0/stdlib/universe/range/) to define a time range.
- Gets the last value in the `means` bucket and compares it to the last value in the `noaa` bucket using [`last()`](/flux/v0/stdlib/universe/last/).
- Uses [`join()`](/flux/v0/stdlib/universe/join/) to combine the results
- Uses [`map()`](/flux/v0/stdlib/universe/map/) to calculate the differences

```js
means = from(bucket: "weekly_means")
    |> range(start: 2019-09-01T00:00:00Z)
    |> last()
    |> keep(columns: ["_value", "location"])

latest = from(bucket: "noaa")
    |> range(start: 2019-09-01T00:00:00Z)
    |> filter(fn: (r) => r._measurement == "average_temperature")
    |> last()
    |> keep(columns: ["_value", "location"])

join(tables: {mean: means, reading: latest}, on: ["location"])
    |> map(fn: (r) => ({r with deviation: r._value_reading - r._value_mean}))
```

### Example results

| location     | _value_mean       | _value_reading | deviation         |
|:--------     | -----------:      | --------------:| ---------:        |
| coyote_creek | 79.82710622710623 | 89             | 9.172893772893772 |
| santa_monica | 80.20451339915374 | 85             | 4.79548660084626  |
