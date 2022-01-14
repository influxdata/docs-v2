---
title: Flux experimental package
list_title: experimental package
description: >
  The Flux experimental package includes experimental functions that perform various tasks.
  Experimental functions are subject to change at any time and are not recommended for production use.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/
  - /influxdb/cloud/reference/flux/stdlib/experimental/
menu:
  flux_0_x_ref:
    name: experimental
    parent: Standard library
weight: 11
flux/v0.x/tags: [functions, experimental, package]
---

The Flux Experimental package includes experimental functions that perform various tasks.

{{% warn %}}
### Experimental functions are subject to change
Please note that experimental packages and functions and may: 

- be moved or promoted to a permanent location
- undergo API changes
- stop working with no planned fixes
- be removed without warning or explanation
{{% /warn %}}

## Experimental functions
The following functions are part of the base experimental package.
To use them, import the `experimental` package.

```js
import "experimental"
```

{{< children type="functions" show="pages" >}}

## Experimental packages
Experimental packages require different import paths than base experimental functions.

{{< children show="sections" >}}
