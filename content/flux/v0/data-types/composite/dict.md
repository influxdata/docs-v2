---
title: Work with dictionaries
seotitle: Work with dictionaries in Flux
list_title: Dictionary
description: >
  A **dictionary** type is a collection of key-value pairs with keys of the same
  type and values of the same type.
  Learn how to work with dictionaries in Flux.
menu:
  flux_v0:
    name: Dictionary
    parent: Composite types
weight: 203
flux/v0.x/tags: ["composite types", "data types"]
related:
  - /flux/v0/stdlib/dict/
list_code_example: |
  ```js
  [0: "Sun", 1: "Mon", 2: "Tue"]

  ["red": "#FF0000", "green": "#00FF00", "blue": "#0000FF"]
  
  [1.0: {stable: 12, latest: 12}, 1.1: {stable: 3, latest: 15}]
  ```
---

A **dictionary** type is a collection of key-value pairs with keys of the same
type and values of the same type.

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

1. Import the [`dict` package](/flux/v0/stdlib/dict/).
2. Use [`dict.get()`](/flux/v0/stdlib/dict/get/) and provide the following parameters:

    - **dict**: Dictionary to reference
    - **key**: Key to reference
    - **default**: Default value to return if the key does not exist

```js
import "dict"

positions =
    [
        "Manager": "Jane Doe",
        "Asst. Manager": "Jack Smith",
        "Clerk": "John Doe",
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
- [Return the string representation of a dictionary](#return-the-string-representation-of-a-dictionary)
- [Include the string representation of a dictionary in a table](#include-the-string-representation-of-a-dictionary-in-a-table)

### Create a dictionary from a list
1. Import the [`dict` package](/flux/v0/stdlib/dict/).
2. Use [`dict.fromList()`](/flux/v0/stdlib/dict/fromlist/) to create a dictionary
   from an **[array](/flux/v0/data-types/composite/array/) of [records](/flux/v0/data-types/composite/record/)**.
   Each record must have a **key** and **value** property.

```js
import "dict"

list = [{key: "k1", value: "v1"}, {key: "k2", value: "v2"}]

dict.fromList(pairs: list)
// Returns [k1: v1, k2: v2]
```
  
### Insert a key-value pair into a dictionary
1. Import the [`dict` package](/flux/v0/stdlib/dict/).
2. Use [`dict.insert()`](/flux/v0/stdlib/dict/insert/) to insert a key-value
   pair into a dictionary. If the key already exists, it's overwritten with the new value.
  
```js
import "dict"

exampleDict = ["k1": "v1", "k2": "v2"]

dict.insert(dict: exampleDict, key: "k3", value: "v3")
// Returns [k1: v1, k2: v2, k3: v3]
```

### Remove a key-value pair from a dictionary
1. Import the [`dict` package](/flux/v0/stdlib/dict/).
2. Use [`dict.remove()`](/flux/v0/stdlib/dict/remove/) to remove a key-value
   pair from a dictionary.

```js
import "dict"

exampleDict = ["k1": "v1", "k2": "v2"]

dict.remove(dict: exampleDict, key: "k2")
// Returns [k1: v1]
```

### Return the string representation of a dictionary
Use [`display()`](/flux/v0/stdlib/universe/display/) to return Flux literal
representation of a dictionary as a string.

```js
x = ["a": 1, "b": 2, "c": 3]

display(v: x)

// Returns "[a: 1, b: 2, c: 3]"
```

### Include the string representation of a dictionary in a table
Use [`display()`](/flux/v0/stdlib/universe/display/) to return Flux literal
representation of a dictionary as a string and include it as a column value.

```js
import "sampledata"

sampledata.string()
    |> map(fn: (r) => ({_time: r._time, exampleDict: display(v: ["tag": r.tag, "value":r._value])}))
```

#### Output

| \_time <em style="opacity:.5">(time)</em> | exampleDict <em style="opacity:.5">(string)</em> |
| :---------------------------------------- | :----------------------------------------------- |
| 2021-01-01T00:00:00Z                      | [tag: t1, value: smpl_g9qczs]                    |
| 2021-01-01T00:00:10Z                      | [tag: t1, value: smpl_0mgv9n]                    |
| 2021-01-01T00:00:20Z                      | [tag: t1, value: smpl_phw664]                    |
| 2021-01-01T00:00:30Z                      | [tag: t1, value: smpl_guvzy4]                    |
| 2021-01-01T00:00:40Z                      | [tag: t1, value: smpl_5v3cce]                    |
| 2021-01-01T00:00:50Z                      | [tag: t1, value: smpl_s9fmgy]                    |
| 2021-01-01T00:00:00Z                      | [tag: t2, value: smpl_b5eida]                    |
| 2021-01-01T00:00:10Z                      | [tag: t2, value: smpl_eu4oxp]                    |
| 2021-01-01T00:00:20Z                      | [tag: t2, value: smpl_5g7tz4]                    |
| 2021-01-01T00:00:30Z                      | [tag: t2, value: smpl_sox1ut]                    |
| 2021-01-01T00:00:40Z                      | [tag: t2, value: smpl_wfm757]                    |
| 2021-01-01T00:00:50Z                      | [tag: t2, value: smpl_dtn2bv]                    |
