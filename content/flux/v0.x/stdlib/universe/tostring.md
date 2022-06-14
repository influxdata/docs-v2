---
title: toString() function
description: The `toString()` function converts all values in the `_value` column to strings.
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/type-conversions/tostring
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/type-conversions/tostring/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/type-conversions/tostring/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/type-conversions/tostring/
menu:
  flux_0_x_ref:
    name: toString
    parent: universe
weight: 102
flux/v0.x/tags: [type-conversions, transformations]
introduced: 0.7.0
---

The `toString()` function converts all values in the `_value` column to strings.

```js
toString()
```

{{% note %}}
To convert values in a column other than `_value`, use `map()` and `string()`
as shown in [this example](/flux/v0.x/stdlib/universe/string/#convert-all-values-in-a-column-to-string-values).
{{% /note %}}

##### Supported data types

- bool
- bytes
- duration
- float
- int
- time
- uint

## Parameters

### tables {data-type="stream of tables"}
Input data.
Default is piped-forward data ([`<-`](/flux/v0.x/spec/expressions/#pipe-expressions)).

## Examples
{{% flux/sample-example-intro %}}

#### Convert a float value column to a string column
```js
import "sampledata"

sampledata.float()
    |> toString()
```

{{< expand-wrapper >}}
{{% expand "View input and output" %}}
{{< flex >}}
{{% flex-content %}}

##### Input data
{{% flux/sample "float" %}}

{{% /flex-content %}}
{{% flex-content %}}

##### Output data
| tag | _time                | _value _<span style="opacity:.5;font-weight:300">(string)</span>_ |
| :-- | :------------------- | ----------------------------------------------------------------: |
| t1  | 2021-01-01T00:00:00Z |                                                             -2.18 |
| t1  | 2021-01-01T00:00:10Z |                                                             10.92 |
| t1  | 2021-01-01T00:00:20Z |                                                              7.35 |
| t1  | 2021-01-01T00:00:30Z |                                                             17.53 |
| t1  | 2021-01-01T00:00:40Z |                                                             15.23 |
| t1  | 2021-01-01T00:00:50Z |                                                              4.43 |

| tag | _time                | _value _<span style="opacity:.5;font-weight:300">(string)</span>_ |
| :-- | :------------------- | ----------------------------------------------------------------: |
| t2  | 2021-01-01T00:00:00Z |                                                             19.85 |
| t2  | 2021-01-01T00:00:10Z |                                                              4.97 |
| t2  | 2021-01-01T00:00:20Z |                                                             -3.75 |
| t2  | 2021-01-01T00:00:30Z |                                                             19.77 |
| t2  | 2021-01-01T00:00:40Z |                                                             13.86 |
| t2  | 2021-01-01T00:00:50Z |                                                              1.86 |
{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}
