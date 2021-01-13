---
title: regexp.quoteMeta() function
description: >
  The `regexp.quoteMeta()` function escapes all regular expression metacharacters inside of a string.
aliases:
  - /influxdb/v2.0/reference/flux/functions/regexp/quotemeta/
  - /influxdb/v2.0/reference/flux/stdlib/regexp/quotemeta/
  - /influxdb/cloud/reference/flux/stdlib/regexp/quotemeta/
menu:
  flux_0_x_ref:
    name: regexp.quoteMeta
    parent: regexp
weight: 301
introduced: 0.33.5
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
