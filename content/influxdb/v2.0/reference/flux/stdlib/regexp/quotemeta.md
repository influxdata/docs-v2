---
title: regexp.quoteMeta() function
description: >
  The `regexp.quoteMeta()` function escapes all regular expression metacharacters inside of a string.
aliases:
  - /influxdb/v2.0/reference/flux/functions/regexp/quotemeta/
menu:
  influxdb_2_0_ref:
    name: regexp.quoteMeta
    parent: Regular expressions
weight: 301
---

The `regexp.quoteMeta()` function escapes all regular expression metacharacters inside of a string.

_**Output data type:** String_

```js
import "regexp"

regexp.quoteMeta(v: ".+*?()|[]{}^$")

// Returns "\.\+\*\?\(\)\|\[\]\{\}\^\$"
```

## Parameters

### v
The string that contains regular expression metacharacters to escape.

_**Data type:** String_

## Examples

###### Escape regular expression meta characters in column values
```js
import "regexp"

data
  |> map(fn: (r) => ({
      r with
      notes: r.notes,
      notes_escaped: regexp.quoteMeta(v: r.notes)
    })
  )
```
