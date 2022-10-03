---
title: Work with dynamic types
seotitle: Work with Flux dynamic types
list_title: Dynamic types
description: >
  ...
menu:
  flux_0_x:
    name: Dynamic types
    parent: Work with Flux types
weight: 101
flux/v0.x/tags: [dynamic types, data types]
# draft: true
---

A **dynamic** type is a wrapper for data whose type is not known until runtime.
Dynamic types help when working with data from external sources (like JSON) 
that support types that do not have a equivalent Flux type.

## Dynamic syntax
Flux does not provide a literal syntax for dynamic types.
To cast a value to a dynamic type:

1. Import the `experimental/dynamic` package.
2. Use `dynamic.dynamic()` to convert a value to a dynamic type.

```js
import "experimental/dynamic"

dynamic.dynamic(v: "Example string")

// Returns dynamic(Example string)
```

## Reference values in a dynamic type

<!-- WIP -->
```