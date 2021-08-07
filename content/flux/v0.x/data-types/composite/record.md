---
title: Work with records
seotitle: Work with records in Flux
list_title: Record
description: >
  A **record** type is a set of key-value pairs.
  Learn how to work with record types in Flux.
menu:
  flux_0_x:
    name: Record
    parent: Composite types
weight: 201
flux/v0.x/tags: ["composite types", "data types"]
list_code_example: |
  ```js
  {foo: "bar", baz: 123.4, quz: -2}
  {"Company Name": "ACME", "Street Address": "123 Main St.", id: 1123445}
  ```
---

A **record** type is a set of key-value pairs (also known as properties).
Keys (also known as labels) are strings.
Values can be any data type.
Each property can have a different value type.

###### On this page:
- [Record syntax](#record-syntax)
- [Reference values in a record](#reference-values-in-a-record)
- [Operate on records](#operate-on-records)

## Record syntax
A **record** literal contains a set of key-value pairs (properties) enclosed in curly brackets (`{}`).
Properties are comma-delimitted.
**Property keys must be strings** and can optionally be enclosed in double quotes (`"`).
If a property key contains whitespace characters or only numeric characters,
you must enclose the property key in double quotes.
Property keys are associated to values by a colon (`:`).
**Values can be any type**.

##### Example records
```js
{foo: "bar", baz: 123.4, quz: -2}

{"Company Name": "ACME", "Street Address": "123 Main St.", id: 1123445}
```

## Reference values in a record
Flux records are **key-indexed**.
To reference values in a record, use **dot notation** or **bracket notation**
and specify the key to reference.

- [Dot notation](#dot-notation)
- [Bracket notation](#bracket-notation)
- [Reference nested records](#reference-nested-records)
- [Reference keys statically](#reference-keys-statically)

### Dot notation
Specify the record to access followed by a period (`.`) and the property key.

```js
c = {
  name: "John Doe",
  address: "123 Main St.",
  id: 1123445
}

c.name
// Returns John Doe

c.id
// Returns 1123445
```

### Bracket notation
Specify the record to access followed by the property key enclosed in double
quotes and square brackets (`[""]`).

{{% note %}}
Use bracket notation to access keys with special or whitespace characters.
{{% /note %}}

```js
c = {
  "Company Name": "ACME",
  "Street Address": "123 Main St.",
  id: 1123445
}

c["Company Name"]
// Returns ACME

c["id"]
// Returns 1123445
```

### Reference nested records
To reference nested records, use chained dot or bracket notation for each nested level.

```js
customer = {
  name: "John Doe",
  address: {
    street: "123 Main St.",
    city: "Pleasantville",
    state: "New York"
  }
}

customer.address.street
// Returns 123 Main St.

customer["address"]["city"]
// Returns Pleasantville

customer["address"].state
// Returns New York
```

### Reference keys statically
**Record keys can only be referenced statically**, meaning you cannot dynamically
specify a key to access. For example:

```js
key = "foo"
o = {foo: "bar", baz: 123.4}

o.key
// Error: type error: record is missing label key
```

_To dynamically reference keys in a composite type, consider using a
[dictionary](/flux/v0.x/data-types/composite/dict/)._

## Operate on records

- [Extend a record](#extend-a-record)
- [List keys in a record](#list-keys-in-a-record)
- [Compare records](#compare-records)

### Extend a record
Use the **`with` operator** to extend a record.
The `with` operator overwrites record properties if the specified keys exists or
adds the new properties if the keys do not exist.

```js
c = {
  name: "John Doe",
  id: 1123445
}

{c with spouse: "Jane Doe", pet: "Spot"}
// Returns {id: 1123445, name: John Doe, pet: Spot, spouse: Jane Doe}
```

### List keys in a record
1. Import the [`experimental` package](/flux/v0.x/stdlib/experimental/).
2. Use [`experimental.objectKeys`](/flux/v0.x/stdlib/experimental/objectkeys/)
   to return an array of keys in a record.

```js
import "experimental"

c = {
  name: "John Doe",
  id: 1123445
}

experimental.objectKeys(o: c)
// Returns [name, id]
```

### Compare records
Use the `==` [comparison operator](/flux/v0.x/spec/operators/#comparison-operators)
to check if two records are equal.
Equality is based on keys, their values, and types.

```js
{id: 1, msg: "hello"} == {id: 1, msg: "goodbye"}
// Returns false

{foo: 12300.0, bar: 34500.0} == {bar: float(v: "3.45e+04"), foo: float(v: "1.23e+04")}
// Returns true
```
