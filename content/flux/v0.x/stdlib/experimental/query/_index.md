---
title: Flux Query package
list_title: query package
description: >
  The Flux Query package provides functions meant to simplify common InfluxDB queries.
  Import the `experimental/query` package.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/query/
  - /influxdb/cloud/reference/flux/stdlib/experimental/query/
menu:
  flux_0_x_ref:
    name: query
    parent: experimental
weight: 301
flux/v0.x/tags: [package]
introduced: 0.60.0
---

Flux Query functions provide functions meant to simplify common InfluxDB queries.
Import the `experimental/query` package:

```js
import "experimental/query"
```

## Functions
{{< children type="functions" show="pages" >}}

## inBucket()
The primary function in this package is [`query.inBucket()`](/flux/v0.x/stdlib/experimental/query/inbucket/),
which uses all other functions in this package.

```js
import "experimental/query"

query.inBucket(
    bucket: "example-bucket",
    start: -1h,
    stop: now(),
    measurement: "example-measurement",
    fields: ["exampleField1", "exampleField2"],
    predicate: (r) => r.tagA == "foo" and r.tagB != "bar",
)
```
