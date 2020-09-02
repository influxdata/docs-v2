---
title: difference() function
description: The `difference()` function computes the difference between subsequent non-null records.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/aggregates/difference
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/aggregates/difference/
menu:
  influxdb_2_0_ref:
    name: difference
    parent: built-in-transformations
weight: 402
related:
  - /{{< latest "influxdb" "v1" >}}/query_language/functions/#difference, InfluxQL – DIFFERENCE()
---

The `difference()` function computes the difference between subsequent records.  
The user-specified columns of numeric type are subtracted while others are kept intact.

_**Function type:** Transformation_  
_**Output data type:** Float_

```js
difference(
  nonNegative: false,
  columns: ["_value"],
  keepFirst: false
)
```

## Parameters

### nonNegative
Indicates if the difference is allowed to be negative.
When set to `true`, if a value is less than the previous value, it is assumed the previous value should have been a zero.

_**Data type:** Boolean_

### columns
The columns to use to compute the difference.
Defaults to `["_value"]`.

_**Data type:** Array of Strings_

### keepFirst
Indicates the first row should be kept.
If `true`, the difference will be `null`.
Defaults to `false`.

_**Data type:** Boolean_

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
|> difference(nonNegative: false, keepfirst: true):
```
###### Output table
| _time | _value | tag |
|:-----:|:------:|:---:|
| 0001  | null   | tv  |
| 0002  | null   | tv  |
| 0003  | -2     | tv  |
| 0004  | 6      | tv  |
| 0005  | null   | tv  |
