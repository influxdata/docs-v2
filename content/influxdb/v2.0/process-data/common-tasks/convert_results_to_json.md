---
title: Convert results to JSON and post to an endpoint
seotitle: CConvert results to JSON and post to an endpoint
description:
menu:
  influxdb_2_0:
    name: Convert results to JSON
    parent: Common tasks
weight: 201
influxdb/v2.0/tags: [tasks]
---

Use json.encode() and http.post(). The following will make a separate http call for each record.

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
