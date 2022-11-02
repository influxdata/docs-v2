---
title: Attributes
description: Attributes define a set of properties on the subsequent source code element.
menu:
  flux_0_x_ref:
    parent: Flux specification
    name: Attributes
weight: 112
---

Attributes define a set of properties on the subsequent source code element.

```js
Attributes             = { Attribute } .
Attribute              = "@" identifier AttributeParameters .
AttributeParameters    = "(" [ AttributeParameterList [ "," ] ] ")" .
AttributeParameterList = AttributeParameter { "," AttributeParameter } .
AttributeParameter     = PrimaryExpression
```

The runtime specifies the set of defined attributes and their meaning.

##### Example attributes
```js
@edition("2022.1")
package main
```

{{< page-nav prev="/flux/v0.x/spec/packages/" next="/flux/v0.x/spec/statements/" >}}