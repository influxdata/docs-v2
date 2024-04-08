---
title: pushbullet.pushNote() function
description: >
  `pushbullet.pushNote()` sends a push notification of type "note" to the Pushbullet API.
menu:
  flux_v0_ref:
    name: pushbullet.pushNote
    parent: pushbullet
    identifier: pushbullet/pushNote
weight: 101
flux/v0/tags: [single notification]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/pushbullet/pushbullet.flux#L65-L69

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`pushbullet.pushNote()` sends a push notification of type "note" to the Pushbullet API.



##### Function type signature

```js
(text: A, title: B, ?token: C, ?url: string) => int
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### url

URL of the PushBullet endpoint. Default is `"https://api.pushbullet.com/v2/pushes"`.



### token

API token string.  Defaults to: `""`.



### title
({{< req >}})
Title of the notification.



### text
({{< req >}})
Text to display in the notification.




## Examples

### Send a push notification note to Pushbullet

```js
import "pushbullet"

pushbullet.pushNote(
    token: "mY5up3Rs3Cre7T0k3n",
    data: {"type": "link", "title": "Example title", "text": "Example note text"},
)

```

