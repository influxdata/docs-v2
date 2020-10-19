---
title: Convert results to JSON and post to an endpoint
description: Post results to a URL endpoint
menu:
  influxdb_2_0:
    name: Convert results to JSON
    parent: Common tasks
weight: 203
influxdb/v2.0/tags: [tasks]
---

Use [`json.encode()`](/influxdb/v2.0/reference/flux/stdlib/json/encode/) to convert a value into JSON bytes, then use [`http.post()`](/influxdb/v2.0/reference/flux/stdlib/http/post/) to send them to a URL endpoint. The following example will make a separate `http` call for each record.

```
import "http"
import "json"
import "experimental/csv"
csv.from(url: "https://influx-testdata.s3.amazonaws.com/noaa.csv")
|> filter(fn: (r) => r._measurement == "average_temperature")
|> mean()
|> map(fn: (r) => ({ r with jsonStr: string(v: json.encode(v: {"location":r.location,"mean":r._value}))}))
|> map(fn: (r) => ({r with status_code: http.post(url: "http://somehost.com/", headers: {x:"a", y:"b"}, data: bytes(v: r.jsonStr))}))
```
