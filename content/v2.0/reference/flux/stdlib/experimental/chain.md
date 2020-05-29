---
title: experimental.chain() function
description: >
  The `experimental.chain()` function ...
menu:
  v2_0_ref:
    name: experimental.chain
    parent: Experimental
weight: 302
---

The `experimental.chain()` function ...

_**Function type:** miscellaneous_

```js
import "experimental"

experimental.chain(
  first: ,
  second:
)
```

{{% note %}}
The `experimental.chain()` function is only necessary in the following use cases:

- ...
{{% /note %}}


## Parameters

### first
...

_**Data type:** Stream of tables_

### second
...

_**Data type:** Stream of tables_

## Examples

### ...
```js
import "experimental"

table1 = from(bucket: "example-bucket")
  |> range(start: -12mo)
  |> filter(fn: (r) => r._measurement == "example-measurement1")

table2 = from(bucket: "example-bucket")
  |> range(start: -12mo)
  |> filter(fn: (r) => r._measurement == "example-measurement2")

experimental.chain(
  first: table1,
  second: table2
)
```
