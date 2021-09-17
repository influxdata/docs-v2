---
title: sampledata.bool() function
description: >
  `sampledata.bool` returns a sample data set with boolean values.
menu:
  flux_0_x_ref:
    name: sampledata.bool
    parent: sampledata
weight: 101
flux/v0.x/tags: [inputs, sample data]
---

`sampledata.bool` returns a sample data set with boolean values.

```js
import "sampledata"

sampledata.bool(
  includeNull: false
)
```

## Parameters

### includeNull {data-type="bool"}
Include _null_ values in the returned dataset.
Default is `false`.

## Examples

- [Return sample data with boolean values](#return-sample-data-with-boolean-values)
- [Return boolean sample data with null values](#return-boolean-sample-data-with-null-values)

### Return sample data with boolean values

##### Function
```js
import "sampledata"

sampledata.bool()
```
##### Output tables
{{% flux/sample "bool" %}}

### Return boolean sample data with null values

##### Function
```js
import "sampledata"

sampledata.bool(includeNull: true)
```
##### Output tables
{{% flux/sample "bool" true %}}