---
title: csv.from() function
description: >
  `csv.from()` retrieves [annotated CSV](https://docs.influxdata.com/influxdb/latest/reference/syntax/annotated-csv/) **from a URL**.
menu:
  flux_0_x_ref:
    name: csv.from
    parent: experimental/csv
    identifier: experimental/csv/from
weight: 201
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/csv/csv.flux#L29-L29

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`csv.from()` retrieves [annotated CSV](https://docs.influxdata.com/influxdb/latest/reference/syntax/annotated-csv/) **from a URL**.

**Note:** Experimental `csv.from()` is an alternative to the standard
`csv.from()` function.

##### Function type signature

```js
csv.from = (url: string) => stream[A] where A: Record
```

## Parameters

### url
({{< req >}})
URL to retrieve annotated CSV from.




## Examples

### Query annotated CSV data from a URL

```js
import "experimental/csv"

csv.from(url: "http://example.com/csv/example.csv")
```

