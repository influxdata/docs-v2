---
title: experimental.preview() function
description: >
  `experimental.preview()` limits the number of rows and tables in the stream.
menu:
  flux_0_x_ref:
    name: experimental.preview
    parent: experimental
weight: 302
flux/v0.x/tags: [transformations]
introduced: 0.167.0
---

`experimental.preview()` limits the number of rows and tables in the stream.

```js
import "experimental"

data
    |> experimental.preview()
```

## Parameters

### nrows {data-type="int"}
Maximum number of rows per table to return. Default is `5`.

### ntables {data-type="int"}
Maximum number of tables to return. Default is `5`.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data (`<-`).

## Examples

### Preview data output
```js
import "experimental"
import "sampledata"

sampledata.int()
    |> experimental.preview(nrows: 3)
```
