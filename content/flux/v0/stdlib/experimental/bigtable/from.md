---
title: bigtable.from() function
description: >
  `bigtable.from()` retrieves data from a [Google Cloud Bigtable](https://cloud.google.com/bigtable/) data source.
menu:
  flux_v0_ref:
    name: bigtable.from
    parent: experimental/bigtable
    identifier: experimental/bigtable/from
weight: 201
flux/v0.x/tags: [inputs]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/bigtable/bigtable.flux#L42-L44

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`bigtable.from()` retrieves data from a [Google Cloud Bigtable](https://cloud.google.com/bigtable/) data source.



##### Function type signature

```js
(instance: string, project: string, table: string, token: string) => stream[A] where A: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### token
({{< req >}})
Google Cloud IAM token to use to access the Cloud Bigtable database.

For more information, see the following:
- [Cloud Bigtable Access Control](https://cloud.google.com/bigtable/docs/access-control)
- [Google Cloud IAM How-to guides](https://cloud.google.com/iam/docs/how-to)
- [Setting Up Authentication for Server to Server Production Applications on Google Cloud](https://cloud.google.com/docs/authentication/production)

### project
({{< req >}})
Cloud Bigtable project ID.



### instance
({{< req >}})
Cloud Bigtable instance ID.



### table
({{< req >}})
Cloud Bigtable table name.




## Examples

### Query Google Cloud Bigtable

```js
import "experimental/bigtable"

bigtable.from(
    token: "example-token",
    project: "example-project",
    instance: "example-instance",
    table: "example-table",
)

```

