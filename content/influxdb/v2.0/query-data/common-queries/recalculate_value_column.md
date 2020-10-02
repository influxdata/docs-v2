---
title: Recalculate the `_value` column in place
seotitle: Recalculate the `_value` column in place
description: >
  .
influxdb/v2.0/tags: [queries]
menu:
  influxdb_2_0:
    name: Recalculate the `_value` column
    parent: Common queries
weight: 104
---

Use “with `_value`” in a map function.

```
import "experimental/csv"
csv.from(url: "https://influx-testdata.s3.amazonaws.com/noaa.csv")
|> filter(fn: (r) => r._measurement == "average_temperature")
|> map(fn: (r) => ({r with _value: ((r._value - 32.0) * 5.0 / 9.0)} ))
```

|#group   |false  |false|true        |true               |true                          |true                          |false               |false |true              |
|---------|-------|-----|------------|-------------------|------------------------------|------------------------------|--------------------|------|------------------|
|#datatype|string |long |string      |string             |dateTime:RFC3339              |dateTime:RFC3339              |dateTime:RFC3339    |double|string            |
|#default |_result|     |            |                   |                              |                              |                    |      |                  |
|         |result |table|_field      |_measurement       |_start                        |_stop                         |_time               |_value|location          |
|         |       |0    |degrees     |average_temperature|1920-03-05T22:10:01.711964667Z|2020-03-05T22:10:01.711964667Z|2019-08-17T00:00:00Z|27.77777777777778|coyote_creek      |
|         |       |0    |degrees     |average_temperature|1920-03-05T22:10:01.711964667Z|2020-03-05T22:10:01.711964667Z|2019-08-17T00:06:00Z|22.77777777777778|coyote_creek      |
|         |       |0    |degrees     |average_temperature|1920-03-05T22:10:01.711964667Z|2020-03-05T22:10:01.711964667Z|2019-08-17T00:12:00Z|30    |coyote_creek      |
|         |       |0    |degrees     |average_temperature|1920-03-05T22:10:01.711964667Z|2020-03-05T22:10:01.711964667Z|2019-08-17T00:18:00Z|31.666666666666668|coyote_creek      |
|         |       |0    |degrees     |average_temperature|1920-03-05T22:10:01.711964667Z|2020-03-05T22:10:01.711964667Z|2019-08-17T00:24:00Z|25    |coyote_creek      |
|         |       |0    |degrees     |average_temperature|1920-03-05T22:10:01.711964667Z|2020-03-05T22:10:01.711964667Z|2019-08-17T00:30:00Z|21.11111111111111|coyote_creek      |
|         |       |0    |degrees     |average_temperature|1920-03-05T22:10:01.711964667Z|2020-03-05T22:10:01.711964667Z|2019-08-17T00:36:00Z|28.88888888888889|coyote_creek      |
|         |       |0    |degrees     |average_temperature|1920-03-05T22:10:01.711964667Z|2020-03-05T22:10:01.711964667Z|2019-08-17T00:42:00Z|24.444444444444443|coyote_creek      |
|         |       |0    |degrees     |average_temperature|1920-03-05T22:10:01.711964667Z|2020-03-05T22:10:01.711964667Z|2019-08-17T00:48:00Z|29.444444444444443|coyote_creek      |
|         |       |0    |degrees     |average_temperature|1920-03-05T22:10:01.711964667Z|2020-03-05T22:10:01.711964667Z|2019-08-17T00:54:00Z|26.666666666666668|coyote_creek      |
|         |       |0    |degrees     |average_temperature|1920-03-05T22:10:01.711964667Z|2020-03-05T22:10:01.711964667Z|2019-08-17T01:00:00Z|21.11111111111111|coyote_creek      |
| ... |
