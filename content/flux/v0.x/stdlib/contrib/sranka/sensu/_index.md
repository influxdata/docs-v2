---
title: Flux sensu package
list_title: sensu package
description: >
  The Flux `sensu` package provides functions for sending events to
  [Sensu Go](https://docs.sensu.io/sensu-go/latest/).
  Import the `contrib/sranka/sensu` package.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/contrib/sensu/
  - /influxdb/cloud/reference/flux/stdlib/contrib/sensu/
menu:
  flux_0_x_ref:
    name: sensu
    parent: sranka
weight: 201
v2.0/tags: [functions, teams, sensu, package]
introduced: 0.90.0
---

The Flux `sensu` package provides functions for sending events to
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
