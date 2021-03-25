---
title: String interpolation
description: >
  Flux string interpolation evaluates string literals containing one or more placeholders
  and returns a result with placeholders replaced with their corresponding values.
menu:
  influxdb_2_0_ref:
    parent: Flux specification
    name: String interpolation
weight: 211
---

Flux string interpolation evaluates string literals containing one or more placeholders
and returns a result with placeholders replaced with their corresponding values.

## String interpolation syntax
To use Flux string interpolation, enclose embedded [expressions](/influxdb/v2.0/reference/flux/language/expressions/)
in a dollar sign and curly braces `${}`.
Flux replaces the content between the braces with the result of the expression and
returns a string literal.

```js
name = "John"

"My name is ${name}."

// My name is John.
```

String interpolation expressions must satisfy the Stringable constraint.

##### Arbitrary expression interpolation example:
```js
n = duration(v: "1m") 
"the answer is ${n}"
// the answer is 1m

t0 = time(v: "2016-06-13T17:43:50.1004002Z")
"the answer is ${t0}"
// the answer is 2016-06-13T17:43:50.1004002Z
```

## Use dot notation to interpolate record values
[Records](/influxdb/v2.0/reference/flux/language/expressions/#record-literals) consist of key-value pairs.
Use [dot notation](/influxdb/v2.0/reference/flux/language/expressions/#member-expressions)
to interpolate values from a record.

```js
person = {
  name: "John",
  age: 42
}

"My name is ${person.name} and I'm ${string(v: person.age)} years old."

// My name is John and I'm 42 years old.
```

Flux returns each record in query results as a record.
In Flux row functions, each row record is represented by `r`.
Use dot notation to interpolate specific column values from the `r` record.

##### Use string interpolation to add a human-readable message
```js
from(bucket: "example-bucket")
  |> range(start: -30m)
  |> map(fn: (r) => ({
      r with
      human-readable: "${r._field} is ${r._value} at ${string(v: r._time)}."
  }))
```

## String interpolation versus concatenation
Flux supports both string interpolation and string concatenation.
String interpolation is a more concise method for achieving the same result.

```js
person = {
  name: "John",
  age: 42
}

// String interpolation
"My name is ${person.name} and I'm ${string(v: person.age)} years old."

// String concatenation
"My name is " + person.name + " and I'm " + string(v: person.age) + " years old."

// Both return: My name is John and I'm 42 years old.
```

{{% note %}}
Check and notification message templates configured in the InfluxDB user interface
**do not** support string concatenation.
{{% /note %}}
