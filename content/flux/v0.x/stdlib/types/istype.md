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
