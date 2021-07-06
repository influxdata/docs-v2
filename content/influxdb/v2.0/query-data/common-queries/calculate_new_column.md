---
title: Use values to calculate a new column
description: >
  Use the `map()` function to create a new column calculated from existing values in each row.
influxdb/v2.0/tags: [queries]
menu:
  influxdb_2_0:
    name: Calculate a new column
    parent: Common queries
weight: 104
---

{{% note %}}
This example uses [NOAA water sample data](/influxdb/v2.0/reference/sample-data/#noaa-water-sample-data).
{{% /note %}}

This example converts temperature from Fahrenheit to Celsius and maps the Celsius value to a new `celsius` column.

The following query:

  - Uses [`filter()`](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/filter/) to filter the `average_temperature` measurement.
  - Uses [`map()`](/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/map/) to create a new column calculated from existing values in each row.

```js
from(bucket: "noaa")
  |> filter(fn: (r) => r._measurement == "average_temperature")
  |> range(start: -30d)
  |> map(fn: (r) => ({r with
      celsius: ((r._value - 32.0) * 5.0 / 9.0)
    })
  )
```

### Example results

| _start               | _stop                | _field  | _measurement        | location     | _time                | _value | celsius |
|:------               |:-----                |:------: |:------------:       |:--------:    |:-----                | ------:| -------:|
| 1920-03-05T22:10:01Z | 2020-03-05T22:10:01Z | degrees | average_temperature | coyote_creek | 2019-08-17T00:00:00Z | 82     | 27.78   |
| 1920-03-05T22:10:01Z | 2020-03-05T22:10:01Z | degrees | average_temperature | coyote_creek | 2019-08-17T00:06:00Z | 73     | 22.78   |
| 1920-03-05T22:10:01Z | 2020-03-05T22:10:01Z | degrees | average_temperature | coyote_creek | 2019-08-17T00:12:00Z | 86     | 30.00   |
| 1920-03-05T22:10:01Z | 2020-03-05T22:10:01Z | degrees | average_temperature | coyote_creek | 2019-08-17T00:18:00Z | 89     | 31.67   |
| 1920-03-05T22:10:01Z | 2020-03-05T22:10:01Z | degrees | average_temperature | coyote_creek | 2019-08-17T00:24:00Z | 77     | 25.00   |
| 1920-03-05T22:10:01Z | 2020-03-05T22:10:01Z | degrees | average_temperature | coyote_creek | 2019-08-17T00:30:00Z | 70     | 21.11   |
| 1920-03-05T22:10:01Z | 2020-03-05T22:10:01Z | degrees | average_temperature | coyote_creek | 2019-08-17T00:36:00Z | 84     | 28.89   |
| 1920-03-05T22:10:01Z | 2020-03-05T22:10:01Z | degrees | average_temperature | coyote_creek | 2019-08-17T00:42:00Z | 76     | 24.44   |
| 1920-03-05T22:10:01Z | 2020-03-05T22:10:01Z | degrees | average_temperature | coyote_creek | 2019-08-17T00:48:00Z | 85     | 29.44   |
| 1920-03-05T22:10:01Z | 2020-03-05T22:10:01Z | degrees | average_temperature | coyote_creek | 2019-08-17T00:54:00Z | 80     | 26.67   |
| •••                  | •••                  | •••     | •••                 | •••          | •••                  | •••    | •••     |
