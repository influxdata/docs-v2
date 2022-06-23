---
title: influxdb._mask() function
description: >
  _mask will hide the given columns from downstream
  transformations. It will not perform any copies and
  it will not regroup. This should only be used when
  the user knows it can't cause a key conflict.
menu:
  flux_ref:
    name: influxdb._mask
    parent: influxdb
tags: <comma-delimited list of tag strings>
introduced: <metadata-introduced>
deprecated: <metadata-deprecated>
---
​
`influxdb._mask(<-tables:[A], columns:[string]) => [B] where A: Record, B: Record` _mask will hide the given columns from downstream
transformations. It will not perform any copies and
it will not regroup. This should only be used when
the user knows it can't cause a key conflict.
​

​
##### Function type signature
```js
influxdb._mask(<-tables:[A], columns:[string]) => [B] where A: Record, B: Record
```
​
## Parameters
​


## Examples
​
