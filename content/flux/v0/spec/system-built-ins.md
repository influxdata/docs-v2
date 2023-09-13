---
title: System built-ins
description: >
  When a built-in value is not expressible in Flux, its value may be defined by the hosting environment.
  All such values must have a corresponding builtin statement to declare the existence and type of the built-in value.
aliases:
  - /influxdb/v2/reference/flux/language/built-ins/system-built-ins/
  - /influxdb/v2/reference/flux/language/system-built-ins/
  - /influxdb/cloud/reference/flux/language/system-built-ins/
menu:
  flux_v0_ref:
    name: System built-ins
    parent: Flux specification
weight: 114
---

Flux contains many preassigned values. These preassigned values are defined in the source files for the various built-in packages.

When a built-in value is not expressible in Flux, its value may be defined by the hosting environment.
All such values must have a corresponding builtin statement to declare the existence and type of the built-in value.

```js
BuiltinStatement = "builtin" identifier ":" TypeExpression .
TypeExpression   = MonoType ["where" Constraints] .

MonoType     = Tvar | BasicType | ArrayType | StreamType | VectorType | RecordType | FunctionType .
Tvar         = "A" … "Z" .
BasicType    = "int" | "uint" | "float" | "string" | "bool" | "time" | "duration" | "bytes" | "regexp" .
ArrayType    = "[" MonoType "]" .
StreamType   = "stream" "[" MonoType "]" .
VectorType   = "vector" "[" MonoType "]" .
RecordType   = ( "{" [RecordTypeProperties] "}" ) | ( "{" Tvar "with" RecordTypeProperties "}" ) .
FunctionType = "(" [FunctionTypeParameters] ")" "=>" MonoType .

RecordTypeProperties = RecordTypeProperty { "," RecordTypeProperty } .
RecordTypeProperty   = Label ":" MonoType .
Label = identifier | string_lit

FunctionTypeParameters = FunctionTypeParameter { "," FunctionTypeParameter } .
FunctionTypeParameter = [ "<-" | "?" ] identifier ":" MonoType .

Constraints = Constraint { "," Constraint } .
Constraint  = Tvar ":" Kinds .
Kinds       = identifier { "+" identifier } .
```

##### Example

```js
builtin filter : (<-tables: stream[T], fn: (r: T) => bool) => stream[T]
```

{{< page-nav prev="/flux/v0/spec/side-effects/" next="/flux/v0/spec/data-model/" >}}
