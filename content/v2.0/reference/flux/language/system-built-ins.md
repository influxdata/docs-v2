---
title: System built-ins
description: >
  When a built-in value is not expressible in Flux, its value may be defined by the hosting environment.
  All such values must have a corresponding builtin statement to declare the existence and type of the built-in value.
aliases:
  - /v2.0/reference/flux/language/built-ins/system-built-ins/
menu:
  v2_0_ref:
    name: System built-ins
    parent: Flux specification
weight: 206
---

When a built-in value is not expressible in Flux, its value may be defined by the hosting environment.
All such values must have a corresponding builtin statement to declare the existence and type of the built-in value.

```js
BuiltinStatement = "builtin" identifier ":" TypeExpression .
```

##### Example

```js
builtin from : (bucket: string, bucketID: string) -> stream
```
