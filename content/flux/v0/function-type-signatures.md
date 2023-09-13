---
title: Function type signatures
description: >
  A **function type signature** describes a function's input parameters and
  types, and the function's output type.
menu:
  flux_v0_ref:
    name: Type signatures
weight: 10
related:
  - /flux/v0/data-types/
  - /flux/v0/spec/types/#type-constraints, Type constraints
---

A **function type signature** describes a function's input parameters and types,
and the function's output type.
Use type signatures to identify data types expected by function parameters and
to understand a function's expected output.

- [Function type signature structure](#function-type-signature-structure)
  - [Parameter notation](#parameter-notation)
- [Type variables](#type-variables)
- [Type notation](#type-notation)
  - [Stream types](#stream-types)
  - [Basic types](#basic-types)
  - [Composite types](#composite-types)
- [Type constraints](#type-constraints)
- [Example function type signatures](#example-function-type-signatures)

## Function type signature structure

```js
(parameter: type) => output-type
```

### Parameter notation

Parameter notation indicates specific behaviors of function parameters.

```js
?  // Optional parameter
<- // Pipe receive – indicates the parameter that, by default, represents
   // the piped-forward value
```

## Type variables

Flux type signatures use **type variables** to represent unique types in the signature.
A type variable is [polymorphic](/flux/v0/spec/types/#polymorphism), meaning
it can be one of many types, and may be constrained by [type constraints](#type-constraints).

Type variables use the following identifier patterns:

```js
A
B
C
t11
// etc.
```

## Type notation

- [Stream types](#stream-types)
- [Basic types](#basic-types)
- [Composite types](#composite-types)

### Stream types

Type signatures identify stream types ([streams of tables](/flux/v0/get-started/data-model/#stream-of-tables))
using the `stream[A]` syntax where `A` is a unique [type variable](#type-variables).
Stream types may included specific column names and column types.

```js
// Stream of tables
stream[A]

// Stream of tables with specific columns, but inferred column types.
stream[{col1: A, col2: B}]

// Stream of tables additional or required "count" column with an
// explicit integer type.
stream[{A with count: int}]
```

### Basic types

Type signatures identify [basic types](/flux/v0/data-types/basic/) with the
following type identifiers:

```js
bool     // boolean type
bytes    // bytes type
duration // duration type
float    // float type
int      // integer type
regexp   // regular expression type
string   // string type
time     // time type
uint     // unsigned integer type
```

### Composite types

Type signatures identify Flux [composite types](/flux/v0/data-types/composite/)
with the following syntaxes:

```js
[A]             // array type
[B: A]          // dictionary type
(param: A) => B // function type
{_value: int}   // record type
```

## Type constraints

Some function parameters are "polymorphic" and can support multiple data types.
Polymorphic parameters are bound by **type constraints**, which define what
types can be used.
Type signatures indicate type constraints for specific values using the
`where A: Constraint` syntax.

For example, the following type signature describes a function that takes a
single parameter, `v` and returns and integer.
`v` can be any type that satisfies the Timeable constraint (duration or time).

```js
(v: A) => int where A: Timeable
```

For more information about the different type constraints and the types each
supports, see [Type constraints](/flux/v0/spec/types/#type-constraints).

## Example function type signatures

- [Function without parameters](#function-without-parameters)
- [Function with parameters](#function-with-parameters)
- [Pass-through transformation](#pass-through-transformation)
- [Basic transformation](#basic-transformation)
- [Transformation that adds a column with an explicit type](#transformation-that-adds-a-column-with-an-explicit-type)

---

#### Function without parameters

The following type signature describes a function that:

- Has no parameters
- Returns a time value

```js
() => time
```

---

#### Function with parameters

The following type signature describes a function that:

- Has two parameters of type `A`:
  - multiplier _(Optional)_
  - v ({{< req >}})
- Returns a value the same type as the two input parameters

```js
(?multiplier: A, v: A) => A
```

---

#### Pass-through transformation

The following type signature describes a
[transformation](/flux/v0/function-types/#transformations) that:

- Takes a stream of tables of type `A` as piped-forward input
- Returns the input stream of tables with an unmodified type

```js
(<-tables: stream[A]) => stream[A]
```

---

#### Basic transformation

The following type signature describes a
[transformation](/flux/v0/function-types/#transformations) that:

- Takes a stream of tables of type `A` as piped-forward input
- Has an `fn` parameter with a function type
  - `fn` uses type `A` as input and returns type `B`
- Returns a new, modified stream of tables of type `B`

```js
(<-tables: stream[A], fn: (r: A) => B,) => stream[B]
```

---

#### Transformation that adds a column with an explicit type
The following type signature describes a
[transformation](/flux/v0/function-types/#transformations) that:

- Takes a stream of tables of type `A` as piped-forward input
- Has a required **tag** parameter of type `B`
  - The `B` type is constrained by the Stringable constraint
- Returns a new, modified stream of tables of type `A` that includes a **tag**
  column with string values

```js
(<-tables: stream[A], tag: B) => stream[{A with tag: string}] where B: Stringable
```
