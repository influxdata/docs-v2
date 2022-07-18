---
title: discord.endpoint() function
description: >
  `discord.endpoint()` sends a single message to a Discord channel using a
  [Discord webhook](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks&?page=3)
  and data from table rows.
menu:
  flux_0_x_ref:
    name: discord.endpoint
    parent: contrib/chobbs/discord
    identifier: contrib/chobbs/discord/endpoint
weight: 301
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/contrib/discord/endpoint/
  - /influxdb/cloud/reference/flux/stdlib/contrib/discord/endpoint/
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/chobbs/discord/discord.flux#L120-L141

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`discord.endpoint()` sends a single message to a Discord channel using a
[Discord webhook](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks&?page=3)
and data from table rows.



##### Function type signature

```js
(
    username: A,
    webhookID: string,
    webhookToken: string,
    ?avatar_url: B,
) => (mapFn: (r: C) => {D with content: E}) => (<-tables: stream[C]) => stream[{C with _sent: string}]
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0.x/function-type-signatures/).{{% /caption %}}

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



