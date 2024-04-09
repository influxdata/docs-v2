---
title: discord.endpoint() function
description: >
  `discord.endpoint()` sends a single message to a Discord channel using a
  [Discord webhook](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks&?page=3)
  and data from table rows.
menu:
  flux_v0_ref:
    name: discord.endpoint
    parent: contrib/chobbs/discord
    identifier: contrib/chobbs/discord/endpoint
weight: 301
flux/v0/tags: [notification endpoints, transformations]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/chobbs/discord/discord.flux#L125-L146

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`discord.endpoint()` sends a single message to a Discord channel using a
[Discord webhook](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks&?page=3)
and data from table rows.

### Usage
`discord.endpoint` is a factory function that outputs another function.
The output function requires a `mapFn` parameter.

#### mapFn
A function that builds the record used to generate the Discord webhook request.
Requires an `r` parameter.

`mapFn` accepts a table row (`r`) and returns a record that must include the following field:

- `content`

For more information, see the `discord.send()` `content` parameter.

##### Function type signature

```js
(
    username: A,
    webhookID: string,
    webhookToken: string,
    ?avatar_url: B,
) => (mapFn: (r: C) => {D with content: E}) => (<-tables: stream[C]) => stream[{C with _sent: string}]
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

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



### avatar_url

Override the Discord webhook’s default avatar.




## Examples

### Send critical statuses to a Discord channel

```js
import "influxdata/influxdb/secrets"
import "contrib/chobbs/discord"

discordToken = secrets.get(key: "DISCORD_TOKEN")
endpoint =
    telegram.endpoint(webhookToken: discordToken, webhookID: "123456789", username: "critBot")

crit_statuses =
    from(bucket: "example-bucket")
        |> range(start: -1m)
        |> filter(fn: (r) => r._measurement == "statuses" and status == "crit")

crit_statuses
    |> endpoint(mapFn: (r) => ({content: "The status is critical!"}))()

```

