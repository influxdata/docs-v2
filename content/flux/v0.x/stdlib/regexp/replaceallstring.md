---
title: regexp.replaceAllString() function
description: >
  The `regexp.replaceAllString()` function replaces all regular expression matches
  in a string with a specified replacement.
aliases:
  - /influxdb/v2.0/reference/flux/functions/regexp/replaceallstring/
  - /influxdb/v2.0/reference/flux/stdlib/regexp/replaceallstring/
  - /influxdb/cloud/reference/flux/stdlib/regexp/replaceallstring/
menu:
  flux_0_x_ref:
    name: regexp.replaceAllString
    parent: regexp
weight: 301
introduced: 0.33.6
---

The `regexp.replaceAllString()` function replaces all regular expression matches
in a string with a specified replacement.

_**Output data type:** String_

```js
import "regexp"

regexp.replaceAllString(r: /a(x*)b/, v: "-ab-axxb-", t: "T")

// Returns "-T-T-"
```

## Parameters

### r {data-type="regexp"}
The regular expression used to search `v`.

### v {data-type="string"}
The string value to search.

### t {data-type="string"}
The replacement for matches to `r`.

## Examples

###### Replace regular expression matches in string column values
```js
import "regexp"

data
  |> map(fn: (r) => ({
      r with
      message: r.message,
      updated_message: regexp.replaceAllString(
        r: /cat|bird|ferret/,
        v: r.message,
        t: "dog"
      )
  }))
```
