---
title: dict.fromList() function
description: >
  The `dict.fromList()` function creates a dictionary from a list of records with
  `key` and `value` properties.
menu:
  influxdb_2_0_ref:
    name: dict.fromList
    parent: Dictionary
weight: 301
---

The `dict.fromList()` function creates a dictionary from a list of records with
`key` and `value` properties.

```js
import "dict"

dict.fromList(
  pairs: [
    {key: 1, value: "foo"},
    {key: 2, value: "bar"}
  ]
)
```

## Parameters

### pairs
List of records, each containing `key` and `value` properties.

_**Data type:** Array of records_

## Examples
```js
import "dict"

d = dict.fromList(
  pairs: [
    {key: 1, value: "foo"},
    {key: 2, value: "bar"}
  ]
)

dict.get(dict: d, key: 1, default: "")

// Returns foo
````