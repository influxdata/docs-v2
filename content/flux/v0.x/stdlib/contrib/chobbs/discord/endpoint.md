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
  flux_0_x_ref:
    name: discord.endpoint
    parent: discord
weight: 202
flux/v0.x/tags: [notification endpoints]
introduced: 0.74.0
---

The `discord.endpoint()` function sends a single message to a Discord channel using
a [Discord webhook](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks&amp?page=3)
and data from table rows.

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

### webhookToken {data-type="string"}
Discord [webhook token](https://discord.com/developers/docs/resources/webhook).

### webhookID {data-type="string"}
Discord [webhook ID](https://discord.com/developers/docs/resources/webhook).

### username {data-type="string"}
Override the Discord webhook's default username.

### avatar_url {data-type="string"}
Override the Discord webhook's default avatar.

## Usage
`discord.endpoint` is a factory function that outputs another function.
The output function requires a `mapFn` parameter.

### mapFn {data-type="function"}
A function that builds the record used to generate the Discord webhook request.
Requires an `r` parameter.

`mapFn` accepts a table row (`r`) and returns a record that must include the
following field:

- `content`

_For more information, see the [`discord.send() content` parameter](/flux/v0.x/stdlib/contrib/chobbs/discord/send/#content)._

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
