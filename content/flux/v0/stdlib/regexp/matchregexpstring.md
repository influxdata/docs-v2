---
title: regexp.matchRegexpString() function
description: >
  `regexp.matchRegexpString()` tests if a string contains any match to a regular expression.
menu:
  flux_v0_ref:
    name: regexp.matchRegexpString
    parent: regexp
    identifier: regexp/matchRegexpString
weight: 101
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/regexp/regexp.flux#L119-L119

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`regexp.matchRegexpString()` tests if a string contains any match to a regular expression.



##### Function type signature

```js
(r: regexp, v: string) => bool
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### r
({{< req >}})
Regular expression used to search `v`.



### v
({{< req >}})
String value to search.




## Examples

- [Test if a string contains a regular expression match](#test-if-a-string-contains-a-regular-expression-match)
- [Filter by rows that contain matches to a regular expression](#filter-by-rows-that-contain-matches-to-a-regular-expression)

### Test if a string contains a regular expression match

```js
import "regexp"

regexp.matchRegexpString(r: /(gopher){2}/, v: "gophergophergopher")// Returns true


```


### Filter by rows that contain matches to a regular expression

```js
import "regexp"
import "sampledata"

sampledata.string()
    |> filter(fn: (r) => regexp.matchRegexpString(r: /_\d/, v: r._value))

```

