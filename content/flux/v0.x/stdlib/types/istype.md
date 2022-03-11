---
title: types.isType() function
description: >
  `types.isType()` tests if a value is a specified
  [Flux basic type](/flux/v0.x/data-types/basic/) or
  [regular expression type](/flux/v0.x/data-types/regexp/).
menu:
  flux_0_x_ref:
    name: types.isType
    parent: types
weight: 101
flux/v0.x/tags: [tests, types]
---

`types.isType()` tests if a value is a specified
[Flux basic type](/flux/v0.x/data-types/basic/) or
[regular expression type](/flux/v0.x/data-types/regexp/).

```js
import "types"

types.isType(v: 12, type: "int")

// Returns true
```

## Parameters

### v
({{< req >}})
Value to test.

### type {data-type="string"}
({{< req >}})
Flux basic type.

**Supported values:**

- string
- bytes
- int
- uint
- float
- bool
- time
- duration
- regexp

## Examples

### Filter fields by type
```js
import "strings"

data
    |> filter(fn: (r) => types.isType(v: r._value, type: "string"))
```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}
{{< flex >}}
{{% flex-content %}}

##### Input data

| _time                | _field | _value <span style="opacity:.5">(int)</span> |
| :------------------- | :----- | -------------------------------------------: |
| 2022-01-01T00:00:00Z | foo    |                                           12 |
| 2022-01-01T00:01:00Z | foo    |                                           15 |
| 2022-01-01T00:02:00Z | foo    |                                            9 |

| _time                | _field | _value <span style="opacity:.5">(string)</span> |
| :------------------- | :----- | ----------------------------------------------: |
| 2022-01-01T00:00:00Z | bar    |                                        0jCcsMYM |
| 2022-01-01T00:01:00Z | bar    |                                        jHvuDw35 |
| 2022-01-01T00:02:00Z | bar    |                                        HE5uCIC2 |

{{% /flex-content %}}
{{% flex-content %}}

##### Output data

| _time                | _field | _value <span style="opacity:.5">(string)</span> |
| :------------------- | :----- | ----------------------------------------------: |
| 2022-01-01T00:00:00Z | bar    |                                        0jCcsMYM |
| 2022-01-01T00:01:00Z | bar    |                                        jHvuDw35 |
| 2022-01-01T00:02:00Z | bar    |                                        HE5uCIC2 |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}


### Aggregate or select data based on type
```
# import "csv"
# import "sampledata"
import "types"

< nonNumericData = data
    |> filter(fn: (r) => types.isType(v: r._value, type: "string") or types.isType(v: r._value, type: "bool"))
    |> aggregateWindow(every: 30s, fn: last)

numericData = data
    |> filter(fn: (r) => types.isType(v: r._value, type: "int") or types.isType(v: r._value, type: "float"))
    |> aggregateWindow(every: 30s, fn: mean)

> union(tables: [nonNumericData, numericData])
```
<!--

##### Input data

| _time                | _field | _value <span style="opacity:.5">(int)</span> |
|:---------------------|--------|----------------------------------------------|
| 2021-01-01T00:00:00Z | x      | -2.18                                        |
| 2021-01-01T00:00:10Z | x      | 10.92                                        |
| 2021-01-01T00:00:20Z | x      | 7.35                                         |
| 2021-01-01T00:00:30Z | x      | 17.53                                        |
| 2021-01-01T00:00:40Z | x      | 15.23                                        |
| 2021-01-01T00:00:50Z | x       | 4.43                                         |

##### Output data

| _time                | _field | _value <span style="opacity:.5">(string)</span> |

// #
// # data = csv.from(
// #     csv: "
// # #group,false,false,false,true,false
// # #datatype,string,long,dateTime:RFC3339,string,double
// # #default,_result,,,,
// # ,result,table,_time,type,_value
// # ,,0,,float,
// # ,,0,,float,
// # ,,0,,float,
// # ,,0,,float,
// # ,,0,,float,
// # ,,0,,float,
// #
// # #group,false,false,false,true,false
// # #datatype,string,long,dateTime:RFC3339,string,boolean
// # #default,_result,,,,
// # ,result,table,_time,type,_value
// # ,,0,2021-01-01T00:00:00Z,bool,true
// # ,,0,2021-01-01T00:00:10Z,bool,true
// # ,,0,2021-01-01T00:00:20Z,bool,false
// # ,,0,2021-01-01T00:00:30Z,bool,true
// # ,,0,2021-01-01T00:00:40Z,bool,false
// # ,,0,2021-01-01T00:00:50Z,bool,false
// #
// # #group,false,false,false,true,false
// # #datatype,string,long,dateTime:RFC3339,string,string
// # #default,_result,,,,
// # ,result,table,_time,type,_value
// # ,,0,2021-01-01T00:00:00Z,string,smpl_g9qczs
// # ,,0,2021-01-01T00:00:10Z,string,smpl_0mgv9n
// # ,,0,2021-01-01T00:00:20Z,string,smpl_phw664
// # ,,0,2021-01-01T00:00:30Z,string,smpl_guvzy4
// # ,,0,2021-01-01T00:00:40Z,string,smpl_5v3cce
// # ,,0,2021-01-01T00:00:50Z,string,smpl_s9fmgy
// #
// # #group,false,false,false,false,true
// # #datatype,string,long,dateTime:RFC3339,long,string
// # #default,_result,,,,
// # ,result,table,_time,_value,type
// # ,,0,2021-01-01T00:00:00Z,-2,int
// # ,,0,2021-01-01T00:00:10Z,10,int
// # ,,0,2021-01-01T00:00:20Z,7,int
// # ,,0,2021-01-01T00:00:30Z,17,int
// # ,,0,2021-01-01T00:00:40Z,15,int
// # ,,0,2021-01-01T00:00:50Z,4,int
// # ",
// # )
// #     |> range(start: sampledata.start, stop: sampledata.stop)

  -->
