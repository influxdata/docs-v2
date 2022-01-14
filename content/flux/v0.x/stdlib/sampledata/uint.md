---
title: sampledata.uint() function
description: >
  `sampledata.uint` returns a sample data set with unsigned integer values.
menu:
  flux_0_x_ref:
    name: sampledata.uint
    parent: sampledata
weight: 101
flux/v0.x/tags: [inputs, sample data]
---

`sampledata.uint` returns a sample data set with unsigned integer values.

```js
import "sampledata"

sampledata.uint(
  includeNull: false
)
```

## Parameters

### includeNull {data-type="bool"}
Include _null_ values in the returned dataset.
Default is `false`.

## Examples

- [Return sample data with unsigned integer values](#return-sample-data-with-unsigned-integer-values)
- [Return unsigned integer sample data with null values](#return-unsigned-integer-sample-data-with-null-values)

### Return sample data with unsigned integer values

##### Function
```js
import "sampledata"

sampledata.uint()
```
##### Output tables
{{% flux/sample "uint" %}}

### Return unsigned integer sample data with null values

##### Function
```js
import "sampledata"

sampledata.uint(includeNull: true)
```
##### Output tables
{{% flux/sample "uint" true %}}