---
title: pushbullet.endpoint() function
description: >
  `pushbullet.endpoint()` creates the endpoint for the Pushbullet API and sends a notification of type note.
menu:
  flux_0_x_ref:
    name: pushbullet.endpoint
    parent: pushbullet
    identifier: pushbullet/endpoint
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/pushbullet/pushbullet.flux#L111-L125

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`pushbullet.endpoint()` creates the endpoint for the Pushbullet API and sends a notification of type note.



##### Function type signature

```js
pushbullet.endpoint = (
    ?token: A,
    ?url: string,
) => (mapFn: (r: B) => {C with title: E, text: D}) => (<-tables: stream[B]) => stream[{B with _sent: string}]
```

## Parameters

### url

PushBullet API endpoint URL. Default is `"https://api.pushbullet.com/v2/pushes"`.



### token

Pushbullet API token string.  Default is `""`.



