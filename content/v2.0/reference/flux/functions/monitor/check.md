---
title: monitor.check() function
description: The `monitor.check()` function ...
menu:
  v2_0_ref:
    name: monitor.check
    parent: Monitor
weight: 202
---

The `monitor.check()` function ...

_**Function type:** Type conversion_

```js
import "influxdata/influxdb/monitor"

monitor.check(...)
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
  |> monitor.check(...)
```
