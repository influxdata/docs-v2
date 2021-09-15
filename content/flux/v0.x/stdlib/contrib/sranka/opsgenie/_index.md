---
title: Flux opsgenie package
list_title: opsgenie package
description: >
  The Flux `opsgenie` package provides functions that send alerts to
  [Atlassian Opsgenie](https://www.atlassian.com/software/opsgenie) using the
  [Opsgenie v2 API](https://docs.opsgenie.com/docs/alert-api#create-alert).
  Import the `contrib/sranka/opsgenie` package.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/contrib/opsgenie/
  - /influxdb/cloud/reference/flux/stdlib/contrib/opsgenie/
menu:
  flux_0_x_ref:
    name: opsgenie
    parent: sranka
weight: 201
flux/v0.x/tags: [functions, opsgenie, package]
introduced: 0.84.0
---

The Flux `opsgenie` package provides functions that send alerts to
[Atlassian Opsgenie](https://www.atlassian.com/software/opsgenie) using the
[Opsgenie v2 API](https://docs.opsgenie.com/docs/alert-api#create-alert).
Import the `contrib/sranka/opsgenie` package:

```js
import "contrib/sranka/opsgenie"
```

{{< children type="functions" show="pages" >}}
