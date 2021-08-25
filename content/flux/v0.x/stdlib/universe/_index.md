---
title: Flux universe package (built-in)
list_title: universe package (built-in)
description: >
  The Flux `universe` package includes all functions that do not require a package import statement and are usable without any extra setup.
  Functions in the `universe` package provide a foundation for working with data using Flux.
aliases:
  - /influxdb/v2.0/reference/flux/functions/built-in/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/
  - /influxdb/cloud/reference/flux/stdlib/built-in/
menu:
  flux_0_x_ref:
    name: universe (built-in)
    identifier: universe
    parent: Standard library
weight: 10
flux/v0.x/tags: [built-in, functions, package]
---

he Flux `universe` package includes all functions that do not require a package import statement and are usable without any extra setup.
The "built-in" functions in the `universe` package provide a foundation for working with data using Flux.

```js
import "sample"

sample.float()
  |> mean()
```

{{< flex >}}
{{% flex-content %}}
##### Input data
{{% flux/sample "float" %}}
{{% /flex-content %}}
{{% flex-content %}}
##### Output data
| tid | _value |
| :-- | -----: |
| t1  |   8.88 |

| tid |            _value |
| :-- | ----------------: |
| t2  | 9.426666666666668 |
{{% /flex-content %}}
{{< /flex >}}

## Functions
{{< children type="functions" >}}
