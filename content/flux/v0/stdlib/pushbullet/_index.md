---
title: pushbullet package
description: >
  The `pushbullet` package provides functions for sending data to Pushbullet.
menu:
  flux_v0_ref:
    name: pushbullet 
    parent: stdlib
    identifier: pushbullet
weight: 11
cascade:

  introduced: 0.66.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the comments above the package
declaration in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/pushbullet/pushbullet.flux

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

The `pushbullet` package provides functions for sending data to Pushbullet.
Import the `pushbullet` package:

```js
import "pushbullet"
```



## Options

```js
option pushbullet.defaultURL = "https://api.pushbullet.com/v2/pushes"
```
 
### defaultURL

`defaultURL` is the default Pushbullet API URL used by functions in the `pushbullet` package.




## Functions

{{< children type="functions" show="pages" >}}
