---
title: Statements
description: Statements control execution in the Flux functional data scripting language.
menu:
  flux_0_x_ref:
    parent: Flux specification
    name: Statements
weight: 112
aliases:
  - /influxdb/v2.0/reference/flux/language/statements/
  - /influxdb/cloud/reference/flux/language/statements/
---

{{% note %}}
This document is a living document and may not represent the current implementation of Flux.
Any section that is not currently implemented is commented with a **[IMPL#XXX]** where
**XXX** is an issue number tracking discussion and progress towards implementation.
{{% /note %}}

A _statement_ controls execution.

```js
Statement = OptionAssignment
          | BuiltinStatement
          | VariableAssignment
          | ReturnStatement
          | ExpressionStatement .
```

## Import declaration

```js
ImportDeclaration = "import" [identifier] string_lit .
```

A package name and an import path is associated with every package.
The import statement takes a package's import path and brings all of the identifiers
defined in that package into the current scope under a namespace.
The import statement defines the namespace through which to access the imported identifiers.
By default the identifier of this namespace is the package name unless otherwise specified.
For example, given a variable `x` declared in package `foo`, importing `foo` and referencing `x` would look like this:

```js
import "import/path/to/package/foo"

foo.x
```

Or this:

```js
import bar "import/path/to/package/foo"

bar.x
```

A package's import path is always absolute.
A package may reassign a new value to an option identifier declared in one of its imported packages.
A package cannot access nor modify the identifiers belonging to the imported packages of its imported packages.
Every statement contained in an imported package is evaluated.

## Return statements

A terminating statement prevents execution of all statements that appear after it in the same block.
A return statement is a terminating statement.

```
ReturnStatement = "return" Expression .
```
## Expression statements

An _expression statement_ is an expression where the computed value is discarded.

```
ExpressionStatement = Expression .
```

##### Examples of expression statements

```js
1 + 1
f()
a
```

{{< page-nav prev="/flux/v0.x/spec/packages/" next="/flux/v0.x/spec/side-effects/" >}}
