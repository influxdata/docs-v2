---
title: Variables
description: Flux variables hold values. A variable can only hold values defined by its type.
menu:
  flux_0_x_ref:
    parent: Flux specification
    name: Variables
weight: 104
aliases:
  - /influxdb/v2.0/reference/flux/language/variables/
  - /influxdb/cloud/reference/flux/language/variables/
---

A **variable** represents a storage location for a single value.
Variables are immutable.
Once a variable is given a value, it holds that value for the remainder of its lifetime.

Any [Flux type](/flux/v0.x/spec/types/) can be assigned to a variable.
Use the assignment operator (`=`) to assign a value to a variable identifier.

```js
var1 = "string value"
var2 = 1234
var3 = {firstname: "John", lastname: "Doe"}
```

{{< page-nav prev="/flux/v0.x/spec/lexical-elements/" next="/flux/v0.x/spec/options/" >}}