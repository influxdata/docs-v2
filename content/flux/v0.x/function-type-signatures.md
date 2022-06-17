---
title: Function type signatures
description: >
  A **function type signature** describes a function's input parameters and
  types, and the function's output type.
menu:
  flux_0_x_ref:
    name: Type signatures
weight: 10
related:
  - /flux/v0.x/data-types/
  - /flux/v0.x/spec/types/#type-constraints, Type constraints
---

A **function type signature** describes a function's input parameters and types,
and the function's output type.
Use type signatures to identify data types expected by function parameters and
to understand a function's expected output.

- [Function type signature structure](#function-type-signature-structure)
- [Type notation](#type-notation)
- [Parameter notation](#parameter-notation)
- [Type constraints](#type-constraints)
- [Example function type signatures](#example-function-type-signatures)

## Function type signature structure

```js
(parameter: type) => output-type
```

## Type notation

- [Stream types](#stream-types)
- [Basic types](#basic-types)
- [Composite types](#composite-types)
- [Regular expression types](#regular-expression-types)

### Stream types

Type signatures idenitify stream types ([streams of tables](/flux/v0.x/get-started/data-model/#stream-of-tables))
using the `stream[A]` syntax where `A` is a unique identifier.
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

Type signatures identify [basic types](/flux/v0.x/data-types/basic/) with the
following type identifiers:

```js
bool     // boolean type
bytes    // bytes type
duration // duration type
float    // float type
int      // integer type
string   // string type
time     // time type
uint     // unsigned integer type
```

### Composite types

Type signatures identify Flux [composite types](/flux/v0.x/data-types/composite/)
with the following syntaxes:

```js
[A]             // array type
[B: A]          // dictionary type
(param: A) => B // function type
{}              // record type
```

### Regular expression types
```js
regexp // regular expression type
```

## Parameter notation

Parameter notation indicates specific behaviors of function parameters.

```js
?  // Optional parameter
<- // Pipe receive – indicates the parameter, by default, represents
   // the piped-forward value or stream of tables
```

## Type constraints

Some function parameters are "polymorphic" and can support multiple data types.
Polymorphic parameters are bound by **type constraints**, which define what
types can be used.
Type signatures indicate type contraints for specific values using the
`where A: Constraint` syntax.

For more information about the different type constraints and the types each
supports, see [Type constraints](/flux/v0.x/spec/types/#type-constraints).

```js
(v: A) => int where A: Timeable
```

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

- Has two parameters:
  - multiplier _(Optional)_
  - v ({{< req >}})
- Returns a value the same type as the two input parameters

```js
(?multiplier: A, v: A) => A
```

---

#### Pass-through transformation
The following type signature describes a
[transformation](/flux/v0.x/function-types/#transformations) that:

- Takes a stream of tables as piped-forward input
- Returns the input stream of tables unmodified

```js
(<-tables: stream[A]) => stream[A]
```

---

#### Basic transformation
The following type signature describes a
[transformation](/flux/v0.x/function-types/#transformations) that:

- Takes a stream of tables as piped-forward input
- Returns a new, modified stream of tables

```js
(<-tables: stream[A]) => stream[B]
```

---

#### Transformation that adds a column with an explicit type
The following type signature describes a
[transformation](/flux/v0.x/function-types/#transformations) that:

- Takes a stream of tables as piped-forward input
- Has a required **tag** parameter
- Returns a new, modified stream of tables that includes a **tag** column with
  string values

```js
(<-tables: stream[A], tag: B) => stream[{A with tag: string}]
```
