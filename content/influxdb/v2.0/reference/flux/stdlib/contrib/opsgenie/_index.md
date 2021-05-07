---
title: Flux Opsgenie package
list_title: Opsgenie package
description: >
  The Flux Opsgenie package provides functions that send alerts to
  [Atlassian Opsgenie](https://www.atlassian.com/software/opsgenie) using the
  [Opsgenie v2 API](https://docs.opsgenie.com/docs/alert-api#create-alert).
  Import the `contrib/sranka/opsgenie` package.
menu:
  influxdb_2_0_ref:
    name: Opsgenie
    parent: Contributed
weight: 202
influxdb/v2.0/tags: [functions, opsgenie, package]
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
