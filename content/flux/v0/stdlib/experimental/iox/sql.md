---
title: iox.sql() function
description: >
  `iox.sql()` executes an SQL query against a bucket in an IOx storage node.
menu:
  flux_v0_ref:
    name: iox.sql
    parent: experimental/iox
    identifier: experimental/iox/sql
weight: 201
flux/v0/tags: [inputs]
introduced: 0.186.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/iox/iox.flux#L56-L56

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`iox.sql()` executes an SQL query against a bucket in an IOx storage node.

This function creates a source that reads data from IOx.

##### Function type signature

```js
(bucket: string, query: string) => stream[A] where A: Record
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### bucket
({{< req >}})
IOx bucket to read data from.



### query
({{< req >}})
SQL query to execute.




## Examples

### Use SQL to query data from IOx

```js
import "experimental/iox"

iox.sql(bucket: "example-bucket", query: "SELECT * FROM measurement")

```

