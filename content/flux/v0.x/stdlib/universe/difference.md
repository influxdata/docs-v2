---
title: difference() function
description: The `difference()` function computes the difference between subsequent non-null records.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/aggregates/difference
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/aggregates/difference/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/difference/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/difference/
menu:
  flux_0_x_ref:
    name: difference
    parent: universe
weight: 102
flux/v0.x/tags: [transformations]
related:
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#difference, InfluxQL – DIFFERENCE()
introduced: 0.7.1
---

The `difference()` function computes the difference between subsequent records.  
The user-specified columns of numeric type are subtracted while others are kept intact.

_**Output data type:** Float_

```js
difference(
  nonNegative: false,
  columns: ["_value"],
  keepFirst: false
)
```

## Parameters

### nonNegative {data-type="bool"}
Indicates if the difference is allowed to be negative.
When set to `true`, if a value is less than the previous value, it is assumed the previous value should have been a zero.
Default is `false`.

### columns {data-type="array of strings"}
The columns to use to compute the difference.
Default is `["_value"]`.

### keepFirst {data-type="bool"}
Indicates the first row should be kept.
If `true`, the difference will be `null`.
Default is `false`.

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Subtraction rules for numeric types
- The difference between two non-null values is their algebraic difference;
  or `null`, if the result is negative and `nonNegative: true`;
- `null` minus some value is always `null`;
- Some value `v` minus `null` is `v` minus the last non-null value seen before `v`;
  or `null` if `v` is the first non-null value seen.

## Output tables
For each input table with `n` rows, `difference()` outputs a table with `n - 1` rows.

## Examples

```js
from(bucket: "example-bucket")
  |> range(start: -5m)
  |> difference()
```
```js
from(bucket: "example-bucket")
  |> range(start: -5m)
  |> difference(nonNegative: true)
```

### Example data transformation

###### Input table
| _time | _value | tag |
|:-----:|:------:|:---:|
| 0001  | null   | tv  |
| 0002  | 6      | tv  |
| 0003  | 4      | tv  |
| 0004  | 10     | tv  |
| 0005  | null   | tv  |

#### With nonNegative set to false
```js
|> difference(nonNegative: false)
```
###### Output table
| _time | _value | tag |
|:-----:|:------:|:---:|
| 0002  | null   | tv  |
| 0003  | -2     | tv  |
| 0004  | 6      | tv  |
| 0005  | null   | tv  |

#### With nonNegative set to true
```js
|> difference(nonNegative: true):
```
###### Output table
| _time | _value | tag |
|:-----:|:------:|:---:|
| 0002  | null   | tv  |
| 0003  | null   | tv  |
| 0004  | 6      | tv  |
| 0005  | null   | tv  |


#### With keepFirst set to true
```js
|> difference(nonNegative: false, keepFirst: true):
```
###### Output table
| _time | _value | tag |
|:-----:|:------:|:---:|
| 0001  | null   | tv  |
| 0002  | null   | tv  |
| 0003  | -2     | tv  |
| 0004  | 6      | tv  |
| 0005  | null   | tv  |
