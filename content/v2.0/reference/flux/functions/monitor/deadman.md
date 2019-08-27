---
title: monitor.deadman() function
description: The `monitor.deadman()` function ...
menu:
  v2_0_ref:
    name: monitor.deadman
    parent: Monitor
weight: 202
---

The `monitor.deadman()` function ...

_**Function type:** Type conversion_

```js
import "influxdata/influxdb/monitor"

monitor.deadman(...)
```


## Parameters

### v
The value to convert.

_**Data type:** Boolean | Duration | Float | Integer | String | Time | UInteger_

## Examples

### ...
```js
import "influxdata/influxdb/monitor"

from(bucket: "example-bucket")
  |> range(start: -1h)
  |> monitor.deadman(...)
```
