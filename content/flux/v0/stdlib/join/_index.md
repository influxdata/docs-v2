---
title: join package
description: >
  The `join` package provides functions that join two table streams together.
menu:
  flux_v0_ref:
    name: join 
    parent: stdlib
    identifier: join
weight: 11
cascade:
  flux/v0.x/tags: [transformations]
  introduced: 0.172.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the comments above the package
declaration in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/join/join.flux

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

The `join` package provides functions that join two table streams together.
Import the `join` package:

```js
import "join"
```

## Outer joins

The join transformation supports left, right, and full outer joins.

- **Left outer joins** generate at least one output row for each record in the left input stream.
  If a record in the left input stream does not have a match in the right input stream,
  `r` is substituted with a default record in the `as` function.
- **Right outer joins** generate at least one output row for each record in the right input stream.
  If a record in the right input stream does not have a match in the left input stream,
  `l` is substituted with a default record in the `as` function.
- **Full outer joins** generate at least one output row for each record in both input streams.
  If a record in either input stream doesn't have a match in the other input stream,
  one of the arguments to the `as` function is substituted with a default record
  (either `l` or `r`, depending on which one is missing the matching record)

A default record has the same columns as the records in the corresponding input
table, but only group key columns are populated with a value. All other columns
are null.

## Inner joins

Inner joins drop any records that don't have a match in the other input stream. There is no
need to account for default or unmatched records when performing an inner join.


## Functions

{{< children type="functions" show="pages" >}}
