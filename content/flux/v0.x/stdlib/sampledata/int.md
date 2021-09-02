---
title: sampledata.int() function
description: >
  `sampledata.int` returns a sample data set with integer values.
menu:
  flux_0_x_ref:
    name: sampledata.int
    parent: sampledata
weight: 101
flux/v0.x/tags: [inputs, sample data]
---

`sampledata.int` returns a sample data set with integer values.

```js
import "sampledata"

sampledata.int(
  includeNull: false
)
```

## Parameters

### includeNull {data-type="bool"}
Include _null_ values in the returned dataset.
Default is `false`.

## Examples

- [Return sample data with integer values](#return-sample-data-with-integer-values)
- [Return sample data that includes null values](#return-sample-data-that-includes-null-values)

### Return sample data with integer values

##### Function
```js
import "sampledata"

sampledata.int()
```
##### Output tables
{{% flux/sample "int" %}}

### Return sample data that includes null values

##### Function
```js
import "sampledata"

sampledata.int(includeNull: true)
```
##### Output tables
{{% flux/sample "int" true %}}