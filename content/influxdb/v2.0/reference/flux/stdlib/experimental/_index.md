---
title: Flux Experimental package
list_title: Experimental package
description: >
  The Flux Experimental package includes experimental functions that perform various tasks.
  Experimental functions are subject to change at any time and are not recommended for production use.
menu:
  influxdb_2_0_ref:
    name: Experimental
    parent: Flux standard library
weight: 202
influxdb/v2.0/tags: [functions, experimental, package]
---

The Flux Experimental package includes experimental functions that perform various tasks.

{{% warn %}}
### Use experimental functions at your own risk
Experimental functions are subject to change and are **not recommended for production use**.
At any time, experimental functions and packages may:

- be moved or promoted to a permanent location
- undergo API changes
- stop working with no planned fixes
- be removed without warning nor published explanation

**By using experimental functions and packages, you agree to these risks.**
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
