---
title: Calculate a new column based on values in a row
seotitle: Calculate a new column based on values in a row
description: >
  Create a new column based on values in a row.
influxdb/v2.0/tags: [queries]
menu:
  influxdb_2_0:
    name: Calculate a new column
    parent: Common queries
weight: 104
---

Use the with keyboard in a map function to create the new column.

```
import "experimental/csv"
csv.from(url: "https://influx-testdata.s3.amazonaws.com/noaa.csv")
|> filter(fn: (r) => r._measurement == "average_temperature")
|> map(fn: (r) => ({r with celsius: ((r._value - 32.0) * 5.0 / 9.0)} ))
```
|#group   |false  |false|true        |true               |true                          |true                          |false               |false |false             |true        |
|---------|-------|-----|------------|-------------------|------------------------------|------------------------------|--------------------|------|------------------|------------|
|#datatype|string |long |string      |string             |dateTime:RFC3339              |dateTime:RFC3339              |dateTime:RFC3339    |double|double            |string      |
|#default |_result|     |            |                   |                              |                              |                    |      |                  |            |
|         |result |table|_field      |_measurement       |_start                        |_stop                         |_time               |_value|celsius           |location    |
|         |       |0    |degrees     |average_temperature|1920-03-05T22:10:01.711964667Z|2020-03-05T22:10:01.711964667Z|2019-08-17T00:00:00Z|82    |27.77777777777778 |coyote_creek|
|         |       |0    |degrees     |average_temperature|1920-03-05T22:10:01.711964667Z|2020-03-05T22:10:01.711964667Z|2019-08-17T00:06:00Z|73    |22.77777777777778 |coyote_creek|
|         |       |0    |degrees     |average_temperature|1920-03-05T22:10:01.711964667Z|2020-03-05T22:10:01.711964667Z|2019-08-17T00:12:00Z|86    |30                |coyote_creek|
|         |       |0    |degrees     |average_temperature|1920-03-05T22:10:01.711964667Z|2020-03-05T22:10:01.711964667Z|2019-08-17T00:18:00Z|89    |31.666666666666668|coyote_creek|
|         |       |0    |degrees     |average_temperature|1920-03-05T22:10:01.711964667Z|2020-03-05T22:10:01.711964667Z|2019-08-17T00:24:00Z|77    |25                |coyote_creek|
|         |       |0    |degrees     |average_temperature|1920-03-05T22:10:01.711964667Z|2020-03-05T22:10:01.711964667Z|2019-08-17T00:30:00Z|70    |21.11111111111111 |coyote_creek|
|         |       |0    |degrees     |average_temperature|1920-03-05T22:10:01.711964667Z|2020-03-05T22:10:01.711964667Z|2019-08-17T00:36:00Z|84    |28.88888888888889 |coyote_creek|
|         |       |0    |degrees     |average_temperature|1920-03-05T22:10:01.711964667Z|2020-03-05T22:10:01.711964667Z|2019-08-17T00:42:00Z|76    |24.444444444444443|coyote_creek|
|         |       |0    |degrees     |average_temperature|1920-03-05T22:10:01.711964667Z|2020-03-05T22:10:01.711964667Z|2019-08-17T00:48:00Z|85    |29.444444444444443|coyote_creek|
|         |       |0    |degrees     |average_temperature|1920-03-05T22:10:01.711964667Z|2020-03-05T22:10:01.711964667Z|2019-08-17T00:54:00Z|80    |26.666666666666668|coyote_creek|
|         |       |0    |degrees     |average_temperature|1920-03-05T22:10:01.711964667Z|
| ... |
