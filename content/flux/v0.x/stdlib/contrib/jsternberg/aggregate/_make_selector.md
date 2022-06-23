---
title: aggregate._make_selector() function
description: >
  
menu:
  flux_ref:
    name: aggregate._make_selector
    parent: aggregate
tags: <comma-delimited list of tag strings>
introduced: <metadata-introduced>
deprecated: <metadata-deprecated>
---
​
`aggregate._make_selector(fn:(values:[A]) => A) => (?column:string, ?fill:B) => {reduce:(state:A, values:[A]) => A, init:(values:[A]) => A, fill:B, compute:(state:C) => C, column:string}` 
​

​
##### Function type signature
```js
aggregate._make_selector(fn:(values:[A]) => A) => (?column:string, ?fill:B) => {reduce:(state:A, values:[A]) => A, init:(values:[A]) => A, fill:B, compute:(state:C) => C, column:string}
```
​
## Parameters
​


## Examples
​
