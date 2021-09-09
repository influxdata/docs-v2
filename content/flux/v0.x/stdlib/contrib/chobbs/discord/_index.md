---
title: Flux discord package
list_title: discord package
description: >
  The Flux `discord` package provides functions for sending messages to [Discord](https://discord.com/).
  Import the `contrib/chobbs/discord` package.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/contrib/discord/
  - /influxdb/cloud/reference/flux/stdlib/contrib/discord/
menu:
  flux_0_x_ref:
    name: discord
    parent: chobbs
weight: 201
flux/v0.x/tags: [functions, discord, package]
---

The Flux `discord` package provides functions for sending messages to [Discord](https://discord.com/).
Import the `contrib/chobbs/discord` package:

```js
import "contrib/chobbs/discord"
```

## Options
The `contrib/chobbs/discord` package provides the following options:

```js
import "contrib/chobbs/discord"

option discord.discordURL = "https://discordapp.com/api/webhooks/"
```

### discordURL {data-type="string"}
Discord webhook URL.
Default is `https://discordapp.com/api/webhooks/`.

## Functions

{{< children type="functions" show="pages" >}}

{{% note %}}
#### Package author and maintainer
**Github:** [@chobbs](https://github.com/chobbs)  
**InfluxDB Slack:** [@craig](https://influxdata.com/slack)  
{{% /note %}}
