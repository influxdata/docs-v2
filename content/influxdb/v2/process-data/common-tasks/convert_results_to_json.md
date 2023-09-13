---
title: Convert results to JSON
seotitle: Convert results to JSON and send them to a URL
description: >
  Use `json.encode()` to convert query results to JSON and `http.post()` to send them
  to a URL endpoint.
menu:
  influxdb_v2:
    name: Convert results to JSON
    parent: Common tasks
weight: 203
influxdb/v2/tags: [tasks]
---
{{% note %}}
This example uses [NOAA water sample data](/influxdb/v2/reference/sample-data/#noaa-water-sample-data).
{{% /note %}}

Send each record to a URL endpoint using the HTTP POST method. This example uses [`json.encode()`](/flux/v0/stdlib/json/encode/) to convert a value into JSON bytes, then uses [`http.post()`](/flux/v0/stdlib/http/post/) to send them to a URL endpoint.

The following query:
  - Uses [`filter()`](/flux/v0/stdlib/universe/filter/) to filter the `average_temperature` measurement.
  - Uses [`mean()`](/flux/v0/stdlib/universe/mean/) to calculate the average value from results.
  - Uses [`map()`](/flux/v0/stdlib/universe/map/) to create a new column, `jsonStr`, and build a JSON object using column values from the query. It then byte-encodes the JSON object and stores it as a string in the `jsonStr` column.
  - Uses [`http.post()`](/flux/v0/stdlib/http/post/) to send the `jsonStr` value from each record to an HTTP endpoint.


```js
import "http"
import "json"

from(bucket: "noaa")
    |> filter(fn: (r) => r._measurement == "average_temperature")
    |> mean()
    |> map(fn: (r) => ({r with jsonStr: string(v: json.encode(v: {"location": r.location, "mean": r._value}))}))
    |> map(
        fn: (r) => ({
            r with
            status_code: http.post(
                url: "http://somehost.com/",
                headers: {x: "a", y: "b"},
                data: bytes(v: r.jsonStr)
            )
        })
    )
```
