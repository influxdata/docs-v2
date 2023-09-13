---
title: slack package
description: >
  The `slack` package provides functions for sending messages to [Slack](https://slack.com/).
menu:
  flux_v0_ref:
    name: slack 
    parent: stdlib
    identifier: slack
weight: 11
cascade:

  introduced: 0.41.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the comments above the package
declaration in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/slack/slack.flux

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

The `slack` package provides functions for sending messages to [Slack](https://slack.com/).
Import the `slack` package:

```js
import "slack"
```



## Options

```js
option slack.defaultURL = "https://slack.com/api/chat.postMessage"
```
 
### defaultURL

`defaultURL` defines the default Slack API URL used by functions in the `slack` package.




## Functions

{{< children type="functions" show="pages" >}}
