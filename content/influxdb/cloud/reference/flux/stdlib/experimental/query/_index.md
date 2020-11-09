---
title: Flux Query package
list_title: Query package
description: >
  The Flux Query package provides functions meant to simplify common InfluxDB queries.
  Import the `experimental/query` package.
menu:
  influxdb_cloud_ref:
    name: Query
    parent: Experimental
weight: 301
influxdb/v2.0/tags: [package]
---

Flux Query functions provide functions meant to simplify common InfluxDB queries.
Import the `experimental/query` package:

```js
import "experimental/query"
```

{{< children type="functions" show="pages" >}}

## inBucket()
The primary function in this package is [`query.inBucket()`](/influxdb/cloud/reference/flux/stdlib/experimental/query/inbucket/),
which uses all other functions in this package.

```js
import "experimental/query"

query.inBucket(
  bucket: "example-bucket",
  start: -1h,
  stop: now(),
  measurement: "example-measurement",
  fields: ["exampleField1", "exampleField2"],
  predicate: (r) => r.tagA == "foo" and r.tagB != "bar"
)
```
