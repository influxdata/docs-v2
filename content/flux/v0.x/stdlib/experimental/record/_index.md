---
title: Flux experimental record package
list_title: record package
description: >
  The Flux experimental `record` package provides tools for working with Flux
  [records](/flux/v0.x/data-types/composite/record/).
  Import the `experimental/record` package.
menu:
  flux_0_x_ref:
    name: record
    parent: experimental
weight: 301
flux/v0.x/tags: [package]
introduced: 0.131.0
---

The Flux experimental `record` package provides tools for working with Flux
[records](/flux/v0.x/data-types/composite/record/).
Import the `experimental/record` package.

```
import "experimental/record"
```

{{% warn %}}
#### This package is an interim solution
The `experimental/record` package is an interim solution for
[influxdata/flux#3461](https://github.com/influxdata/flux/issues/3461)
and will either be removed after this issue is resolved or promoted out of
the experimental package if other uses are found.
{{% /warn %}}

## Constants
The `experimental/record` package provides the following constants:

```js
record.any = {} // polymorphic record with unconstrained property types
```

### record.any
Currently, default function parameter values constrain the parameter's type.
`record.any` is a polymorphic record value that can be used as a default
record value when input record property types are not known.

```js
addFoo = (r=record.any) => ({ r with foo: "bar" })

addFoo(r: {})
// Returns {foo: "bar"}

addFoo(r: {baz: "quz", int: 123})
// {baz: "quz", int: 123, foo: "bar"}
```

