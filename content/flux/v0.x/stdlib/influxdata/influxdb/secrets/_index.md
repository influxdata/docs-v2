---
title: secrets package
description: >
  The `secrets` package functions for working with sensitive secrets managed by InfluxDB.
menu:
  flux_0_x_ref:
    name: secrets 
    parent: influxdata/influxdb
    identifier: influxdata/influxdb/secrets
weight: 31
cascade:
  flux/v0.x/tags: [secrets, security]
  introduced: 0.41.0
aliases:
  - /influxdb/v2.0/reference/flux/functions/secrets/
  - /influxdb/v2.0/reference/flux/stdlib/secrets/
  - /influxdb/cloud/reference/flux/stdlib/secrets/
related:
  - /{{< latest "influxdb" >}}/security/secrets/, Manage secrets in InfluxDB
exclude_from:
  oss: ^1\.
  enterprise: ^1\.
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the comments above the package
declaration in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/influxdata/influxdb/secrets/secrets.flux

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

The `secrets` package functions for working with sensitive secrets managed by InfluxDB.
Import the `influxdata/influxdb/secrets` package:

```js
import "influxdata/influxdb/secrets"
```




## Functions

{{< children type="functions" show="pages" >}}
