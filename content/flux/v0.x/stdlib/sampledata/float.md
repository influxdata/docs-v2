---
title: sampledata.float() function
description: >
  `sampledata.float` returns a sample data set with float values.
menu:
  flux_0_x_ref:
    name: sampledata.float
    parent: sampledata
weight: 101
flux/v0.x/tags: [inputs, sample data]
---

`sampledata.float` returns a sample data set with float values.

```js
import "sampledata"

sampledata.float(
  includeNull: false
)
```

## Parameters

### includeNull {data-type="bool"}
Include _null_ values in the returned dataset.
Default is `false`.

## Examples

- [Return sample data with float values](#return-sample-data-with-float-values)
- [Return float sample data with null values](#return-float-sample-data-with-null-values)

### Return sample data with float values

##### Function
```js
import "sampledata"

sampledata.float()
```
##### Output tables
{{% flux/sample "float" %}}

### Return float sample data with null values

##### Function
```js
import "sampledata"

sampledata.float(includeNull: true)
```
##### Output tables
{{% flux/sample "float" true %}}