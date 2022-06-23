---
title: strings.index() function
description: >
  index returns the index of the first instance of a substring in a string. If the substring is not present, it returns -1.
menu:
  flux_ref:
    name: strings.index
    parent: strings
tags: <comma-delimited list of tag strings>
introduced: <metadata-introduced>
deprecated: <metadata-deprecated>
---
​
`strings.index(substr:string, v:string) => int` index returns the index of the first instance of a substring in a string. If the substring is not present, it returns -1.
​


- `substr` is the substring to search for

## Find the first occurrence of a substring

```
import "strings"

data
  |> map(fn: (r) => ({
      r with
      the_index: strings.index(v: r.pageTitle, substr: "the")
    })
  )
```
​
##### Function type signature
```js
strings.index(substr:string, v:string) => int
```
​
## Parameters
​

### 
​

​

​

## Examples
​
