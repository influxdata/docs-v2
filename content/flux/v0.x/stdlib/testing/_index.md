---
title: Flux testing package
list_title: Testing package
description: >
  The Flux testing package provides functions that test piped-forward data in specific ways.
  Import the `testing` package.
aliases:
  - /influxdb/v2.0/reference/flux/functions/testing/
  - /influxdb/v2.0/reference/flux/stdlib/testing/
  - /influxdb/cloud/reference/flux/stdlib/testing/
menu:
  flux_0_x_ref:
    name: testing
    parent: Standard library
weight: 11
flux/v0.x/tags: [testing, functions, package]
---

Flux testing functions test piped-forward data in specific ways and return errors if the tests fail.
Import the `testing` package:

```js
import "testing"
```

## Functions
{{< children type="functions" show="pages" >}}
