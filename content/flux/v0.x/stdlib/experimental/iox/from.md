---
title: iox.from() function
description: >
  `iox.from()` queries data from the specified bucket and measurement in an IOx
  storage node.
menu:
  flux_0_x_ref:
    name: iox.from
    parent: iox
weight: 401
flux/v0.x/tags: [iox, inputs]
introduced: 0.152.0
---

{{% warn %}}
`iox.from()` is in active development and has not been fully implemented.
This function acts as a placeholder as the implementation is completed.
{{% /warn %}}

`iox.from()` queries data from the specified bucket and measurement in an
[IOx](https://github.com/influxdata/influxdb_iox) storage node.

```js
import "experimental/iox"

iox.from(
    bucket: "example-bucket",
    measurement: "example-measurement",
)
```

Output data is "pivoted" on the time column and includes columns for each
returned tag and field per time value.

## Parameters

### bucket {data-type="string"}
IOx bucket to read data from.

### measurement {data-type="string"}
Measurement to read data from.

