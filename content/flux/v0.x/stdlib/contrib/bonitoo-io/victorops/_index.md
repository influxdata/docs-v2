---
title: Flux victorops package
list_title: victorops package
description: >
  The Flux `victorops` package provides functions that send events to
  [VictorOps](https://victorops.com).
menu:
  flux_0_x_ref:
    name: victorops
    parent: bonitoo-io
weight: 202
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/contrib/victorops/
  - /influxdb/cloud/reference/flux/stdlib/contrib/victorops/
flux/v0.x/tags: [functions, victorops, package]
---

The Flux `victorops` package provides functions that send events to
[VictorOps](https://victorops.com).

{{% note %}}
#### VictorOps is now Splunk On-Call
Splunk acquired VictorOps and VictorOps is now
[Splunk On-Call](https://www.splunk.com/en_us/investor-relations/acquisitions/splunk-on-call.html).
{{% /note %}}

Import the `contrib/bonitoo-io/victorops` package:

```js
import "contrib/bonitoo-io/victorops"
```

## Set up VictorOps
To send events to VictorOps with Flux:

1. [Enable the VictorOps REST Endpoint Integration](https://help.victorops.com/knowledge-base/rest-endpoint-integration-guide/).
2. [Create a REST integration routing key](https://help.victorops.com/knowledge-base/routing-keys/).
3. [Create a VictorOps API key](https://help.victorops.com/knowledge-base/api/).

## Functions

{{< children type="functions" show="pages" >}}

{{% note %}}
#### Package author and maintainer
**Github:** [@alespour](https://github.com/alespour), [@bonitoo-io](https://github.com/bonitoo-io)  
**InfluxDB Slack:** [@Ales Pour](https://influxdata.com/slack)
{{% /note %}}
