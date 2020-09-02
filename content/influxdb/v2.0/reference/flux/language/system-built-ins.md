---
title: System built-ins
description: >
  When a built-in value is not expressible in Flux, its value may be defined by the hosting environment.
  All such values must have a corresponding builtin statement to declare the existence and type of the built-in value.
aliases:
  - /influxdb/v2.0/reference/flux/language/built-ins/system-built-ins/
menu:
  influxdb_2_0_ref:
    name: System built-ins
    parent: Flux specification
weight: 206
---

Flux contains many preassigned values. These preassigned values are defined in the source files for the various built-in packages.

When a built-in value is not expressible in Flux, its value may be defined by the hosting environment.
All such values must have a corresponding builtin statement to declare the existence and type of the built-in value.

```js
BuiltinStatement = "builtin" identifer ":" TypeExpression .
TypeExpression   = MonoType ["where" Constraints] .

MonoType = Tvar | Basic | Array | Record | Function .
Tvar     = "A" … "Z" .
Basic    = "int" | "uint" | "float" | "string" | "bool" | "time" | "duration" | "bytes" | "regexp" .
Array    = "[" MonoType "]" .
Record   = ( "{" [Properties] "}" ) | ( "{" Tvar "with" Properties "}" ) .
Function = "(" [Parameters] ")" "=>" MonoType .

Properties = Property { "," Property } .
Property   = identifier ":" MonoType .

Parameters = Parameter { "," Parameter } .
Parameter  = [ "<-" | "?" ] identifier ":" MonoType .

Constraints = Constraint { "," Constraint } .
Constraint  = Tvar ":" Kinds .
Kinds       = identifier { "+" identifier } .
```

##### Example

```js
builtin filter : (<-tables: [T], fn: (r: T) => bool) => [T]
```
