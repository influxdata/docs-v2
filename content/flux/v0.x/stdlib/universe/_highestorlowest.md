---
title: universe._highestOrLowest() function
description: >
  _highestOrLowest is a helper function, which reduces all groups into a single group by specific tags and a reducer function,
  then it selects the highest or lowest records based on the column and the _sortLimit function.
  The default reducer assumes no reducing needs to be performed.
menu:
  flux_ref:
    name: universe._highestOrLowest
    parent: universe
tags: <comma-delimited list of tag strings>
introduced: <metadata-introduced>
deprecated: <metadata-deprecated>
---
​
`universe._highestOrLowest(<-tables:[D], _sortLimit:(<-:[B], columns:[string], n:A) => C, n:A, reducer:(<-:[D]) => [B], ?column:string, ?groupColumns:[string]) => C where B: Record, D: Record` _highestOrLowest is a helper function, which reduces all groups into a single group by specific tags and a reducer function,
then it selects the highest or lowest records based on the column and the _sortLimit function.
The default reducer assumes no reducing needs to be performed.
​

​
##### Function type signature
```js
universe._highestOrLowest(<-tables:[D], _sortLimit:(<-:[B], columns:[string], n:A) => C, n:A, reducer:(<-:[D]) => [B], ?column:string, ?groupColumns:[string]) => C where B: Record, D: Record
```
​
## Parameters
​


## Examples
​
