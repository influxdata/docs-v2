---
title: regexp.splitRegexp() function
description: >
  The `regexp.splitRegexp()` function splits a string into substrings separated by
  regular expression matches and returns an array of `i` substrings between matches.
aliases:
  - /influxdb/v2.0/reference/flux/functions/regexp/splitregexp/
  - /influxdb/v2.0/reference/flux/stdlib/regexp/splitregexp/
  - /influxdb/cloud/reference/flux/stdlib/regexp/splitregexp/
menu:
  flux_0_x_ref:
    name: regexp.splitRegexp
    parent: regexp
weight: 301
introduced: 0.33.7
---

The `regexp.splitRegexp()` function splits a string into substrings separated by
regular expression matches and returns an array of `i` substrings between matches.

_**Output data type:** Array of Strings_

```js
import "regexp"

regexp.splitRegexp(r: /a*/, v: "abaabaccadaaae", i: 5)

// Returns ["", "b", "b", "c", "cadaaae"]
```

## Parameters

### r {data-type="regexp"}
The regular expression used to search `v`.

### v {data-type="string"}
The string value to search.

### i {data-type="int"}
The maximum number of substrings to return.
`-1` returns all matching substrings.
