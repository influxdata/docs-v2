---
title: Flux Opsgenie package
list_title: Opsgenie package
description: >
  The Flux Opsgenie package provides functions that send alerts to
  [Atlassian Opsgenie](https://www.atlassian.com/software/opsgenie) using the
  [Opsgenie v2 API](https://docs.opsgenie.com/docs/alert-api#create-alert).
  Import the `contrib/sranka/opsgenie` package.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/contrib/opsgenie/
  - /influxdb/cloud/reference/flux/stdlib/contrib/opsgenie/
menu:
  flux_0_x_ref:
    name: Opsgenie
    parent: contrib
weight: 202
flux/v0.x/tags: [functions, opsgenie, package]
---

The Flux Opsgenie package provides functions that send alerts to
[Atlassian Opsgenie](https://www.atlassian.com/software/opsgenie) using the
[Opsgenie v2 API](https://docs.opsgenie.com/docs/alert-api#create-alert).
Import the `contrib/sranka/opsgenie` package:

```js
import "contrib/sranka/opsgenie"
```

{{< children type="functions" show="pages" >}}

{{% note %}}
#### Package author and maintainer
**Github:** [@sranka](https://github.com/sranka)  
**InfluxDB Slack:** [@sranka](https://influxdata.com/slack)
{{% /note %}}
