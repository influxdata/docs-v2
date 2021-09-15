---
title: Work with dictionaries
seotitle: Work with dictionaries in Flux
list_title: Dictionary
description: >
  A **dictionary** type is a collection of key-value pairs with keys of the same
  type and values of the same type.
  Learn how to work with dictionaries in Flux.
menu:
  flux_0_x:
    name: Dictionary
    parent: Composite types
weight: 203
flux/v0.x/tags: ["composite types", "data types"]
related:
  - /flux/v0.x/stdlib/dict/
list_code_example: |
  ```js
  [0: "Sun", 1: "Mon", 2: "Tue"]

  ["red": "#FF0000", "green": "#00FF00", "blue": "#0000FF"]
  
  [1.0: {stable: 12, latest: 12}, 1.1: {stable: 3, latest: 15}]
  ```
---

A **dictionary** type is a collection of key-value pairs with keys of the same
type and values of the same type.

###### On this page:
- [Dictionary syntax](#dictionary-syntax)
- [Reference dictionary values](#reference-dictionary-values)
- [Operate on dictionaries](#operate-on-dictionaries)

## Dictionary syntax
A **dictionary** literal contains a set of key-value pairs (also known as elements)
enclosed in square brackets (`[]`).
Elements are comma-delimited.
Keys must all be the same type.
Values must all be the same type.
Keys are associated to values by a colon (`:`).

##### Example dictionaries
```js
[0: "Sun", 1: "Mon", 2: "Tue"]

["red": "#FF0000", "green": "#00FF00", "blue": "#0000FF"]

[1.0: {stable: 12, latest: 12}, 1.1: {stable: 3, latest: 15}]
```

## Reference dictionary values
Flux dictionaries are **key-indexed**. 
To reference values in a dictionary:

1. Import the [`dict` package](/flux/v0.x/stdlib/dict/).
2. Use [`dict.get()`](/flux/v0.x/stdlib/dict/get/) and provide the following parameters:

    - **dict**: Dictionary to reference
    - **key**: Key to reference
    - **default**: Default value to return if the key does not exist

```js
import "dict"

positions = [
  "Manager": "Jane Doe",
  "Asst. Manager": "Jack Smith",
  "Clerk": "John Doe"
]

dict.get(dict: positions, key: "Manager", default: "Unknown position")
// Returns Jane Doe

dict.get(dict: positions, key: "Teller", default: "Unknown position")
// Returns Unknown position
```

## Operate on dictionaries

- [Create a dictionary from a list](#create-a-dictionary-from-a-list)
- [Insert a key-value pair into a dictionary](#insert-a-key-value-pair-into-a-dictionary)
- [Remove a key-value pair from a dictionary](#remove-a-key-value-pair-from-a-dictionary)

### Create a dictionary from a list
1. Import the [`dict` package](/flux/v0.x/stdlib/dict/).
2. Use [`dict.fromList()`](/flux/v0.x/stdlib/dict/fromlist/) to create a dictionary
   from an **[array](/flux/v0.x/data-types/composite/array/) of [records](/flux/v0.x/data-types/composite/record/)**.
   Each record must have a **key** and **value** property.

```js
import "dict"

list = [
  {key: "k1", value: "v1"},
  {key: "k2", value: "v2"}
]

dict.fromList(pairs: list)
// Returns [k1: v1, k2: v2]
```
  
### Insert a key-value pair into a dictionary
1. Import the [`dict` package](/flux/v0.x/stdlib/dict/).
2. Use [`dict.insert()`](/flux/v0.x/stdlib/dict/insert/) to insert a key-value
   pair into a dictionary. If the key already exists, it's overwritten with the new value.
  
```js
import "dict"

exampleDict = ["k1": "v1", "k2": "v2"]

dict.insert(
  dict: exampleDict,
  key: "k3",
  value: "v3"
)
// Returns [k1: v1, k2: v2, k3: v3]
```

### Remove a key-value pair from a dictionary
1. Import the [`dict` package](/flux/v0.x/stdlib/dict/).
2. Use [`dict.remove()`](/flux/v0.x/stdlib/dict/remove/) to remove a key-value
   pair from a dictionary.

```js
import "dict"

exampleDict = ["k1": "v1", "k2": "v2"]

dict.remove(
  dict: exampleDict,
  key: "k2"
)
// Returns [k1: v1]
```
