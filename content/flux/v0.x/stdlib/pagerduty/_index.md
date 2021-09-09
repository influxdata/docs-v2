---
title: Flux pagerduty package
list_title: pagerduty package
description: >
  The Flux `pagerduty` package provides functions for sending data to
  [PagerDuty](https://www.pagerduty.com/).
  Import the `pagerduty` package.
aliases:
  - /influxdb/v2.0/reference/flux/functions/pagerduty/
  - /influxdb/v2.0/reference/flux/stdlib/pagerduty/
  - /influxdb/cloud/reference/flux/stdlib/pagerduty/
menu:
  flux_0_x_ref:
    name: pagerduty
    parent: Standard library
weight: 11
flux/v0.x/tags: [functions, pagerduty, package]
---

The Flux `pagerduty` package provides functions for sending data to
[PagerDuty](https://www.pagerduty.com/).
Import the `pagerduty` package:

```js
import "pagerduty"
```

## Options
The `pagerduty` package provides the following options:

```js
import "pagerduty"

option pagerduty.defaultURL = "https://events.pagerduty.com/v2/enqueue"
```

### defaultURL {data-type="string"}
Default PagerDuty events API URL.
Default is `https://events.pagerduty.com/v2/enqueue`.

## Functions
{{< children type="functions" show="pages" >}}
