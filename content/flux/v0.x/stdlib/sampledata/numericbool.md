---
title: sampledata.numericBool() function
description: >
  `sampledata.numericBool` returns a sample data set with numeric boolean values (`[0,1]`).
menu:
  flux_0_x_ref:
    name: sampledata.numericBool
    parent: sampledata
weight: 101
flux/v0.x/tags: [inputs, sample data]
---

`sampledata.numericBool` returns a sample data set with numeric boolean values (`[0,1]`).

```js
import "sampledata"

sampledata.numericBool(
  includeNull: false
)
```

## Parameters

### includeNull {data-type="bool"}
Include _null_ values in the returned dataset.
Default is `false`.

## Examples

- [Return sample data with numeric boolean values](#return-sample-data-with-numeric-boolean-values)
- [Return numeric boolean sample data with null values](#return-numeric-boolean-sample-data-with-null-values)

### Return sample data with numeric boolean values

##### Function
```js
import "sampledata"

sampledata.numericBool()
```
##### Output tables
{{% flux/sample "numericBool" %}}

### Return nuermica boolean sample data with null values

##### Function
```js
import "sampledata"

sampledata.numericBool(includeNull: true)
```
##### Output tables
{{% flux/sample "numericBool" true %}}