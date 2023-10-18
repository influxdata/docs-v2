---
title: pushbullet.pushData() function
description: >
  `pushbullet.pushData()` sends a push notification to the Pushbullet API.
menu:
  flux_v0_ref:
    name: pushbullet.pushData
    parent: pushbullet
    identifier: pushbullet/pushData
weight: 101
flux/v0.x/tags: [single notification]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/pushbullet/pushbullet.flux#L37-L42

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`pushbullet.pushData()` sends a push notification to the Pushbullet API.



##### Function type signature

```js
(data: A, ?token: B, ?url: string) => int
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### url

URL of the PushBullet endpoint. Default is `"https://api.pushbullet.com/v2/pushes"`.



### token

API token string.  Default is `""`.



### data
({{< req >}})
Data to send to the endpoint. Data is JSON-encoded and sent to the Pushbullet's endpoint.

For how to structure data, see the [Pushbullet API documentation](https://docs.pushbullet.com/#create-push).


## Examples

### Send a push notification to Pushbullet

```js
import "pushbullet"

pushbullet.pushData(
    token: "mY5up3Rs3Cre7T0k3n",
    data: {
        "type": "link",
        "title": "Example title",
        "body": "Example nofication body",
        "url": "http://example-url.com",
    },
)

```

