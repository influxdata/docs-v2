---
title: Recalculate the _value column
description: Recalculate the `_value` column without creating a new one.
influxdb/v2.0/tags: [queries]
menu:
  influxdb_2_0:
    name: Recalculate the _value column
    parent: Common queries
weight: 104
---

{{% note %}}
This example uses [NOAA water sample data](/influxdb/v2.0/reference/sample-data/#noaa-water-sample-data).
{{% /note %}}

Recalculate the `_value` column without creating a new one. Use the `with` operator in [`map()`](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/map/) to overwrite the existing `_value` column.

The following query:

  - Uses [`filter()`](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/filter/) to filter the `average_temperature` measurement.
  - Uses [`map()`](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/map/) to convert Fahrenheit temperature values into Celsius.

```js

from(bucket: "noaa")
  |> filter(fn: (r) => r._measurement == "average_temperature")
  |> range(start: -30d)
  |> map(fn: (r) => ({r with _value: (float(v: r._value) - 32.0) * 5.0 / 9.0} ))
```

| _field  | _measurement        | _start               | _stop                | _time                | location     | _value             |
|:------  |:------------        |:------               |:-----                |:-----                |:--------     | ------:            |
| degrees | average_temperature | 1920-03-05T22:10:01Z | 2020-03-05T22:10:01Z | 2019-08-17T00:00:00Z | coyote_creek | 27.77777777777778  |
| degrees | average_temperature | 1920-03-05T22:10:01Z | 2020-03-05T22:10:01Z | 2019-08-17T00:06:00Z | coyote_creek | 22.77777777777778  |
| degrees | average_temperature | 1920-03-05T22:10:01Z | 2020-03-05T22:10:01Z | 2019-08-17T00:12:00Z | coyote_creek | 30                 |
| degrees | average_temperature | 1920-03-05T22:10:01Z | 2020-03-05T22:10:01Z | 2019-08-17T00:18:00Z | coyote_creek | 31.666666666666668 |
| degrees | average_temperature | 1920-03-05T22:10:01Z | 2020-03-05T22:10:01Z | 2019-08-17T00:24:00Z | coyote_creek | 25                 |
| degrees | average_temperature | 1920-03-05T22:10:01Z | 2020-03-05T22:10:01Z | 2019-08-17T00:30:00Z | coyote_creek | 21.11111111111111  |
| degrees | average_temperature | 1920-03-05T22:10:01Z | 2020-03-05T22:10:01Z | 2019-08-17T00:36:00Z | coyote_creek | 28.88888888888889  |
| degrees | average_temperature | 1920-03-05T22:10:01Z | 2020-03-05T22:10:01Z | 2019-08-17T00:42:00Z | coyote_creek | 24.444444444444443 |
| degrees | average_temperature | 1920-03-05T22:10:01Z | 2020-03-05T22:10:01Z | 2019-08-17T00:48:00Z | coyote_creek | 29.444444444444443 |
| degrees | average_temperature | 1920-03-05T22:10:01Z | 2020-03-05T22:10:01Z | 2019-08-17T00:54:00Z | coyote_creek | 26.666666666666668 |
| degrees | average_temperature | 1920-03-05T22:10:01Z | 2020-03-05T22:10:01Z | 2019-08-17T01:00:00Z | coyote_creek | 21.11111111111111  |
| •••     | •••                 | •••                  | •••                  | •••                  | •••          | •••                |
