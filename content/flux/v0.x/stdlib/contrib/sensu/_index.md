---
title: Flux Sensu package
list_title: Sensu package
description: >
  The Flux Sensu package provides functions for sending events to
  [Sensu Go](https://docs.sensu.io/sensu-go/latest/).
  Import the `contrib/sranka/sensu` package.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/contrib/sensu/
  - /influxdb/cloud/reference/flux/stdlib/contrib/sensu/
menu:
  flux_0_x_ref:
    name: Sensu
    parent: Contributed
weight: 202
v2.0/tags: [functions, teams, sensu, package]
---

The Flux Sensu package provides functions for sending events to
[Sensu Go](https://docs.sensu.io/sensu-go/latest/).
Import the `contrib/sranka/sensu` package:

```js
import "contrib/sranka/sensu"
```

{{< children type="functions" show="pages" >}}

## Sensu API Key authentication
The Flux Sensu package only supports [Sensu API key authentication](https://docs.sensu.io/sensu-go/latest/api/#authenticate-with-an-api-key).
All `sensu` functions require an `apiKey` parameter to successfully authenticate
with your Sensu service.
For information about managing Sensu API keys, see the
[Sensu APIKeys API documentation](https://docs.sensu.io/sensu-go/latest/api/apikeys/).

{{% note %}}
#### Package author and maintainer
**Github:** [@sranka](https://github.com/sranka)  
**InfluxDB Slack:** [@sranka](https://influxdata.com/slack)
{{% /note %}}
