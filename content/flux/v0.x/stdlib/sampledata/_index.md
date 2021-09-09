---
title: Flux sampledata package
list_title: sampledata package
description: >
  The Flux `sampledata` package provides functions that return basic sample datasets.
  Import the `sampledata` package.
menu:
  flux_0_x_ref:
    name: sampledata
    parent: Standard library
weight: 11
flux/v0.x/tags: [sample data, functions, package]
cascade:
  introduced: 0.128.0
  related:
    - /flux/v0.x/stdlib/influxdata/influxdb/sample/
---

The Flux `sampledata` package provides functions that return basic sample datasets.
Import the `sampledata` package:

```js
import "sampledata"
```

## Constants
The `sampledata` package includes the following constants:

```js
sampledata.start = 2021-01-01T00:00:00Z
sampledata.stop = 2021-01-01T00:01:00Z
```

`sampledata.start` and `sampledata.stop` constants represent the time range that
all data points output by `sampledata` functions are in.

## Functions
{{< children type="functions" show="pages" >}}
