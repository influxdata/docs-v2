---
title: discord.endpoint() function
description: >
  The `discord.endpoint()` function sends a single message to a Discord channel using
  a [Discord webhook](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks&amp?page=3)
  and data from table rows.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/contrib/discord/endpoint/
  - /influxdb/cloud/reference/flux/stdlib/contrib/discord/endpoint/
menu:
  influxdb_2_0_ref:
    name: discord.endpoint
    parent: Discord
weight: 202
---

The `discord.endpoint()` function sends a single message to a Discord channel using
a [Discord webhook](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks&amp?page=3)
and data from table rows.

_**Function type:** Output_

```js
import "contrib/chobbs/discord"

discord.endpoint(
  webhookToken: "mySuPerSecRetTokEn",
  webhookID: "123456789",
  username: "username",
  avatar_url: "https://example.com/avatar_pic.jpg"
)
```

## Parameters

### webhookToken
Discord [webhook token](https://discord.com/developers/docs/resources/webhook).

_**Data type:** String_

### webhookID
Discord [webhook ID](https://discord.com/developers/docs/resources/webhook).

_**Data type:** String_

### username
Override the Discord webhook's default username.

_**Data type:** String_

### avatar_url
Override the Discord webhook's default avatar.

_**Data type:** String_

## Usage
`discord.endpoint` is a factory function that outputs another function.
The output function requires a `mapFn` parameter.

### mapFn
A function that builds the record used to generate the Discord webhook request.
Requires an `r` parameter.

_**Data type:** Function_

`mapFn` accepts a table row (`r`) and returns a record that must include the
following field:

- `content`

_For more information, see the [`discord.send() content` parameter](/influxdb/v2.0/reference/flux/stdlib/contrib/discord/send/#content)._

## Examples

##### Send critical statuses to a Discord channel
```js
import "influxdata/influxdb/secrets"
import "contrib/chobbs/discord"

discordToken = secrets.get(key: "DISCORD_TOKEN")
endpoint = telegram.endpoint(
  webhookToken: discordToken,
  webhookID: "123456789",
  username: "critBot"
)

crit_statuses = from(bucket: "example-bucket")
  |> range(start: -1m)
  |> filter(fn: (r) => r._measurement == "statuses" and status == "crit")

crit_statuses
  |> endpoint(mapFn: (r) => ({
      content: "The status is critical!",
    })
  )()
```

{{% note %}}
#### Package author and maintainer
**Github:** [@chobbs](https://github.com/chobbs)  
**InfluxDB Slack:** [@craig](https://influxdata.com/slack)  
{{% /note %}}
