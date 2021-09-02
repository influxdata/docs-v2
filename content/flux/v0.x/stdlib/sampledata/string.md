---
title: sampledata.string() function
description: >
  `sampledata.string` returns a sample data set with string values.
menu:
  flux_0_x_ref:
    name: sampledata.string
    parent: sampledata
weight: 101
flux/v0.x/tags: [inputs, sample data]
---

`sampledata.string` returns a sample data set with string values.

```js
import "sampledata"

sampledata.string(
  includeNull: false
)
```

## Parameters

### includeNull {data-type="bool"}
Include _null_ values in the returned dataset.
Default is `false`.

## Examples

- [Return sample data with string values](#return-sample-data-with-string-values)
- [Return sample data that includes null values](#return-sample-data-that-includes-null-values)

### Return sample data with string values

##### Function
```js
import "sampledata"

sampledata.string()
```
##### Output tables
{{% flux/sample "string" %}}

### Return sample data that includes null values

##### Function
```js
import "sampledata"

sampledata.string(includeNull: true)
```
##### Output tables
{{% flux/sample "string" true %}}