---
title: Work with strings
list_title: String
description: >
  Learn how to work with string data types in Flux.
menu:
  flux_0_x:
    name: String
    parent: Basic types
weight: 201
flux/v0.x/tags: ["basic types", "data types"]
aliases:
  - /influxdb/v2.0/reference/flux/language/string-interpolation/
  - /influxdb/cloud/reference/flux/language/string-interpolation/
related:
  - /flux/v0.x/stdlib/universe/string/
  - /flux/v0.x/stdlib/universe/tostring/
  - /flux/v0.x/stdlib/strings/
---

A **string** type represents a sequence of characters.
Strings are immutable and cannot be modified once created.

**Type name**: `string`

###### On this page:
- [String syntax](#string-syntax)
- [Convert data types to strings](#convert-data-types-to-strings)
- [Operate on strings](#operate-on-strings)
- [Interpolate strings](#interpolate-strings)
- [Concatenate strings](#concatenate-strings)

## String syntax
To format a sequence of characters as a string, begin and end the sequence with double quotes (`"`).

```js
"This is a string"
```

## Convert data types to strings
Use the [`string()` function](/flux/v0.x/stdlib/universe/string/) to convert
other [basic types](/flux/v0.x/data-types/basic/) to strings.

```js
string(v: 42)
```

The following data types can be converted to strings:

- boolean
- bytes
- duration
- float
- int
- uint
- time

### Convert columns to strings

#### Convert the \_value column to strings
Use the [`toString()` function](/flux/v0.x/stdlib/universe/tostring/) to convert
the `_value` column to strings.

```js
data
  |> toString()
```

{{< flex >}}
{{% flex-content %}}
##### Given the following input:
| \_time               | \_value _<span style="opacity:.5">(int)</span>_ |
| :------------------- | ----------------------------------------------: |
| 2021-01-01T00:00:00Z |                                               1 |
| 2021-01-01T02:00:00Z |                                               2 |
| 2021-01-01T03:00:00Z |                                               3 |
| 2021-01-01T04:00:00Z |                                               4 |
{{% /flex-content %}}

{{% flex-content %}}
##### The example above returns:
| \_time               | \_value _<span style="opacity:.5">(string)</span>_ |
| :------------------- | -------------------------------------------------: |
| 2021-01-01T00:00:00Z |                                                  1 |
| 2021-01-01T02:00:00Z |                                                  2 |
| 2021-01-01T03:00:00Z |                                                  3 |
| 2021-01-01T04:00:00Z |                                                  4 |
{{% /flex-content %}}
{{< /flex >}}

#### Convert other columns to strings
To convert columns other than `_value` to strings:

1. Use [`map()`](/flux/v0.x/stdlib/universe/map/) to iterate over and rewrite rows.
2. Use [`string()`](/flux/v0.x/stdlib/universe/string/) to convert columns values to strings.

```js
data
  |> map(fn: (r) => ({ r with level: string(v: r.level) }))
```
{{< flex >}}
{{% flex-content %}}
##### Given the following input:
| \_time               | level _<span style="opacity:.5">(int)</span>_ |
| :------------------- | --------------------------------------------: |
| 2021-01-01T00:00:00Z |                                             1 |
| 2021-01-01T02:00:00Z |                                             2 |
| 2021-01-01T03:00:00Z |                                             3 |
| 2021-01-01T04:00:00Z |                                             4 |
{{% /flex-content %}}

{{% flex-content %}}
##### The example above returns:
| \_time               | level _<span style="opacity:.5">(string)</span>_ |
| :------------------- | -----------------------------------------------: |
| 2021-01-01T00:00:00Z |                                                1 |
| 2021-01-01T02:00:00Z |                                                2 |
| 2021-01-01T03:00:00Z |                                                3 |
| 2021-01-01T04:00:00Z |                                                4 |
{{% /flex-content %}}
{{< /flex >}}

## Operate on strings
Use functions in the [Flux strings package](/flux/v0.x/stdlib/strings/) to perform
operations including:

- [Compare two strings](/flux/v0.x/stdlib/strings/compare/)
- [Replace substrings in a string](/flux/v0.x/stdlib/strings/replace/)
- [Return the length of a string](/flux/v0.x/stdlib/strings/strlen/)
- [Split a string into an array](/flux/v0.x/stdlib/strings/split/)
- [Join an array into a string](/flux/v0.x/stdlib/strings/joinstr/)
- [and more](/flux/v0.x/stdlib/strings/)

## Interpolate strings
To interpolate strings in another Flux string, enclose embedded [expressions](/flux/v0.x/spec/expressions/)
in a dollar sign and curly braces `${}`.
Flux replaces the placeholder with the result of the embedded expression and
returns a string literal.

```js
name = "John"
"My name is ${name}."
// My name is John.

d = 1m
"the answer is ${d}"
// the answer is 1m

t0 = 2016-06-13T17:43:50Z
"the answer is ${t0}"
// the answer is 2016-06-13T17:43:50.000000000Z

p = {name: "John", age: 42}
"My name is ${p.name} and I'm ${p.age} years old."
// My name is John and I'm 42 years old.
```

_String interpolation expressions must satisfy the
[Stringable constraint](/flux/v0.x/spec/types/#stringable-constraint)._

## Concatenate strings
To concatenate Flux strings, use the `+` operator between string values or
[expressions](/flux/v0.x/spec/expressions/) that resolve to strings.
Flux resolves expressions and returns a single concatenated string.

{{% note %}}
Concatenated expressions must resolve to strings.
{{% /note %}}

```js
name = "John"
"My name is " + name + "."
// My name is John.

d = 1m
"the answer is " + string(v: d)
// the answer is 1m

t0 = 2016-06-13T17:43:50Z
"the answer is " + string(v: t0)
// the answer is 2016-06-13T17:43:50.000000000Z

p = {name: "John", age: 42}
"My name is " + p.name + " and I'm " + string(v: p.age) + " years old."
// My name is John and I'm 42 years old.
```

{{% note %}}
#### String interpolation vs concatenation
Flux supports both [string interpolation](#interpolate-strings) and
[string concatenation](#concatenate-strings).
String interpolation is a more concise method for achieving the same result.
{{% /note %}}
