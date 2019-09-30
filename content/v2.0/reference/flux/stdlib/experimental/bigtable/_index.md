---
title: Flux Bigtable package
list_title: Bigtable package
description: >
  The Flux Bigtable package provides tools for working with data in Google Cloud Bigtable databases.
  Import the `experimental/bigtable` package.
menu:
  v2_0_ref:
    name: Bigtable
    parent: Experimental
weight: 201
v2.0/tags: [functions, bigtable, package, google]
---

The Flux Bigtable package provides tools for working with data in
[Google Cloud Bigtable](https://cloud.google.com/bigtable/) databases.

{{% warn %}}
The Bigtable package is currently experimental and is subject to change at any time.
By using it, you accept the [risks of experimental functions](/v2.0/reference/flux/stdlib/experimental/#use-experimental-functions-at-your-own-risk).
{{% /warn %}}

Import the `experimental/bigtable` package:

```js
import "experimental/bigtable"
```

{{< children type="functions" show="pages" >}}
