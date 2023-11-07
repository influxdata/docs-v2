---
title: sampledata package
description: >
  The `sampledata` package provides functions that return basic sample datasets.
menu:
  flux_v0_ref:
    name: sampledata 
    parent: stdlib
    identifier: sampledata
weight: 11
cascade:
  flux/v0/tags: [sample data]
  introduced: 0.128.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the comments above the package
declaration in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/sampledata/sampledata.flux

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

The `sampledata` package provides functions that return basic sample datasets.
Import the `sampledata` package:

```js
import "sampledata"
```

## Constants

```js
sampledata.start = 2021-01-01T00:00:00Z
sampledata.stop = 2021-01-01T00:01:00Z
```

- **sampledata.start** represents the earliest time included in sample datasets.
- **sampledata.stop** represents the latest time included in sample datasets.


## Functions

{{< children type="functions" show="pages" >}}
