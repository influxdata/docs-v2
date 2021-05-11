---
title: sensu.toSensuName() function
description: >
  The `sensu.toSensuName()` function translates a string value to a Sensu name by
  replacing non-alphanumeric characters (`[a-zA-Z0-9_.-]`) with underscores (`_`).
menu:
  flux_0_x_ref:
    name: sensu.toSensuName
    parent: sensu
weight: 301
introduced: 0.90.0
---

The `sensu.toSensuName()` function translates a string value to a Sensu name by
replacing non-alphanumeric characters (`[a-zA-Z0-9_.-]`) with underscores (`_`).

```js
import "contrib/sranka/sensu"

sensu.toSensuName(v: "Example string 1.2?")

// Returns "Example_string_1.2_"
```

## Parameters

### v {data-type="string"}
({{< req >}})
String to operate on.

_**Data type:** String_

{{% note %}}
#### Package author and maintainer
**Github:** [@sranka](https://github.com/sranka)  
**InfluxDB Slack:** [@sranka](https://influxdata.com/slack)
{{% /note %}}
