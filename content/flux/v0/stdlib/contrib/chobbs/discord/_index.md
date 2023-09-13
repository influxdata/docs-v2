---
title: discord package
description: >
  The `discord` package provides functions for sending messages to [Discord](https://discord.com/).
menu:
  flux_v0_ref:
    name: discord 
    parent: contrib/chobbs
    identifier: contrib/chobbs/discord
weight: 31
cascade:

  introduced: 0.69.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the comments above the package
declaration in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/chobbs/discord/discord.flux

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

The `discord` package provides functions for sending messages to [Discord](https://discord.com/).
Import the `contrib/chobbs/discord` package:

```js
import "contrib/chobbs/discord"
```



## Options

```js
option discord.discordURL = "https://discordapp.com/api/webhooks/"
```
 
### discordURL

`discordURL` is the Discord webhook URL.
Default is `https://discordapp.com/api/webhooks/`.




## Functions

{{< children type="functions" show="pages" >}}
