---
title: pushbullet.endpoint() function
description: >
  The `pushbullet.endpoint()` function creates the endpoint for the Pushbullet API
  and sends a notification of type `note`.
menu:
  v2_0_ref:
    name: pushbullet.endpoint
    parent: Pushbullet
weight: 202
---

The `pushbullet.endpoint()` function creates the endpoint for the Pushbullet API
and sends a notification of type `note`.

_**Function type:** Output_

```js
import "pushbullet"

pushbullet.endpoint(
  url: "https://api.pushbullet.com/v2/pushes",
  token: ""
)
```

## Parameters

### url
Pushbullet API URL.
Defaults to `https://api.pushbullet.com/v2/pushes`.

_**Data type:** String_

### token
[Pushbullet API token](https://get.pushbullet.help/hc/en-us/articles/215770388-Create-and-regenerate-API-tokens)
to use when interacting with Pushbullet.
Defaults to `""`.

_**Data type:** String_
