---
title: reduce() function
description: >
  The `reduce()` function aggregates records in each table according to the reducer,
  `fn`, providing a way to create custom table aggregations.
aliases:
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/aggregates/reduce/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/reduce/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/aggregates/reduce/
menu:
  flux_0_x_ref:
    name: reduce
    parent: universe
weight: 102
flux/v0.x/tags: [aggregates, transformations]
related:
  - /{{< latest "influxdb" >}}/query-data/flux/custom-functions/custom-aggregate/
  - /{{< latest "influxdb" >}}/query-data/flux/conditional-logic/
introduced: 0.23.0
---

The `reduce()` function aggregates records in each table according to the reducer,
`fn`, providing a way to create custom aggregations.
The output for each table is the group key of the table with columns corresponding
to each field in the reducer record.
_`reduce()` is an [aggregate function](/flux/v0.x/function-types/#aggregates)._

```js
reduce(
  fn: (r, accumulator) => ({ sum: r._value + accumulator.sum }),
  identity: {sum: 0.0}
)
```

If the reducer record contains a column with the same name as a group key column,
the group key column's value is overwritten, and the outgoing group key is changed.
However, if two reduced tables write to the same destination group key, the function will error.

## Parameters

{{% note %}}
Make sure `fn` parameter names match each specified parameter. To learn why, see [Match parameter names](/flux/v0.x/spec/data-model/#match-parameter-names).
{{% /note %}}

### fn {data-type="function"}
Function to apply to each record with a reducer record ([`identity`](#identity)).

###### fn syntax
```js
// Pattern
fn: (r, accumulator) => ({ identityKey: r.column + accumulator.identityKey })

// Example
fn: (r, accumulator) => ({ sum: r._value + accumulator.sum })
```

{{% note %}}
#### Matching output record keys and types
The output record from `fn` must have the same key names and value types as the [`identity`](#identity).
After operating on a record, the output record is given back to `fn` as the input accumulator.
If the output record keys and value types do not match the `identity` keys and value types,
it will return a type error.
{{% /note %}}

#### r
Record representing each row or record.

#### accumulator
Reducer record defined by [`identity`](#identity).

### identity {data-type="record"}
Defines the reducer record and provides initial values to use when creating a reducer.
May be used more than once in asynchronous processing use cases.
_The data type of values in the `identity` record determine the data type of output values._

###### identity record syntax
```js
// Pattern
identity: {identityKey1: value1, identityKey2: value2}

// Example
identity: {sum: 0.0, count: 0.0}
```

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Important notes

#### Dropped columns
By default, `reduce()` drops any columns that:

1. Are not part of the input table's [group key](/flux/v0.x/get-started/data-model/#group-key).
2. Are not explicitly mapped in the `reduce()` function.

## Examples
{{% flux/sample-example-intro plural=true %}}

- [Compute the sum of the value column](#compute-the-sum-of-the-value-column)
- [Compute the sum and count in a single reducer](#compute-the-sum-and-count-in-a-single-reducer)
- [Compute the product of all values](#compute-the-product-of-all-values)
- [Calculate the average of all values](#calculate-the-average-of-all-values)

#### Compute the sum of the value column
```js
import "sampledata"

sampledata.int()
    |> reduce(
        fn: (r, accumulator) => ({
            sum: r._value + accumulator.sum
        }),
        identity: {sum: 0}
    )
```

{{< expand-wrapper >}}
{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}

##### Input data
{{% flux/sample "int" %}}

{{% /flex-content %}}
{{% flex-content %}}

##### Output data
| tag | sum |
| :-- | --: |
| t1  |  51 |

| tag | sum |
| :-- | --: |
| t2  |  53 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}

#### Compute the sum and count in a single reducer
```js
import "sampledata"

sampledata.int()
    |> reduce(
        fn: (r, accumulator) => ({
          sum: r._value + accumulator.sum,
          count: accumulator.count + 1
        }),
        identity: {sum: 0, count: 0}
    )
```

{{< expand-wrapper >}}
{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}

##### Input data
{{% flux/sample "int" %}}

{{% /flex-content %}}
{{% flex-content %}}

##### Output data
| tag | count | sum |
| :-- | ----: | --: |
| t1  |     6 |  51 |

| tag | count | sum |
| :-- | ----: | --: |
| t2  |     6 |  53 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}

#### Compute the product of all values
```js
import "sampledata"

sampledata.int()
    |> reduce(
        fn: (r, accumulator) => ({
            prod: r._value * accumulator.prod
        }),
        identity: {prod: 1}        
    )
```

{{< expand-wrapper >}}
{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}

##### Input data
{{% flux/sample "int" %}}

{{% /flex-content %}}
{{% flex-content %}}

##### Output data
| tag |    prod |
| :-- | ------: |
| t1  | -142800 |

| tag |   prod |
| :-- | -----: |
| t2  | -56316 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}

#### Calculate the average of all values
```js
import "sampledata"

sampledata.int()
  |> reduce(fn: (r, accumulator) => ({
      count: accumulator.count + 1,
      total: accumulator.total + r._value,
      avg: float(v: (accumulator.total + r._value)) / float(v: accumulator.count)
    }),
    identity: {count: 1, total: 0, avg: 0.0}
  )
```

{{< expand-wrapper >}}
{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}

##### Input data
{{% flux/sample "int" %}}

{{% /flex-content %}}
{{% flex-content %}}

##### Output data
| tag | avg | count | total |
| :-- | --: | ----: | ----: |
| t1  | 8.5 |     7 |    51 |

| tag |               avg | count | total |
| :-- | ----------------: | ----: | ----: |
| t2  | 8.834 |     7 |    53 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}
