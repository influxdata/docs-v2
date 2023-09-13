---
title: discord.send() function
description: >
  `discord.send()` sends a single message to a Discord channel using a Discord webhook.
menu:
  flux_v0_ref:
    name: discord.send
    parent: contrib/chobbs/discord
    identifier: contrib/chobbs/discord/send
weight: 301
flux/v0.x/tags: [single notification]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/chobbs/discord/discord.flux#L53-L71

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`discord.send()` sends a single message to a Discord channel using a Discord webhook.



##### Function type signature

```js
(
    content: A,
    username: B,
    webhookID: string,
    webhookToken: string,
    ?avatar_url: C,
) => int
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### webhookToken
({{< req >}})
Discord [webhook token](https://discord.com/developers/docs/resources/webhook).



### webhookID
({{< req >}})
Discord [webhook ID](https://discord.com/developers/docs/resources/webhook).



### username
({{< req >}})
Override the Discord webhook’s default username.



### content
({{< req >}})
Message to send to Discord (2000 character limit).



### avatar_url

Override the Discord webhook’s default avatar.




## Examples

### Send the last reported status to Discord

```js
import "contrib/chobbs/discord"
import "influxdata/influxdb/secrets"

token = secrets.get(key: "DISCORD_TOKEN")

lastReported =
    from(bucket: "example-bucket")
        |> range(start: -1m)
        |> filter(fn: (r) => r._measurement == "statuses")
        |> last()
        |> findRecord(fn: (key) => true, idx: 0)

discord.send(
    webhookToken: token,
    webhookID: "1234567890",
    username: "chobbs",
    content: "The current status is \"${lastReported.status}\".",
    avatar_url: "https://staff-photos.net/pic.jpg",
)

```

