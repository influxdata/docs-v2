---
title: json.parse() function
description: >
  `json.parse()` takes JSON data as bytes and returns a value.
menu:
  flux_v0_ref:
    name: json.parse
    parent: experimental/json
    identifier: experimental/json/parse
weight: 201
flux/v0.x/tags: [type-conversions]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/json/json.flux#L136-L136

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`json.parse()` takes JSON data as bytes and returns a value.

JSON types are converted to Flux types as follows:

| JSON type | Flux type |
| --------- | --------- |
| boolean   | boolean   |
| number    | float     |
| string    | string    |
| array     | array     |
| object    | record    |

##### Function type signature

```js
(data: bytes) => A
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### data
({{< req >}})
JSON data (as bytes) to parse.




## Examples

- [Parse and use JSON data to restructure tables](#parse-and-use-json-data-to-restructure-tables)
- [Parse JSON and use array functions to manipulate into a table](#parse-json-and-use-array-functions-to-manipulate-into-a-table)

### Parse and use JSON data to restructure tables

```js
import "experimental/json"

data
    |> map(
        fn: (r) => {
            jsonData = json.parse(data: bytes(v: r._value))

            return {
                _time: r._time,
                _field: r._field,
                a: jsonData.a,
                b: jsonData.b,
                c: jsonData.c,
            }
        },
    )

```

{{< expand-wrapper >}}
{{% expand "View example input and output" %}}

#### Input data

| _time                | _field  | _value               |
| -------------------- | ------- | -------------------- |
| 2021-01-01T00:00:00Z | foo     | {"a":1,"b":2,"c":3}  |
| 2021-01-01T01:00:00Z | foo     | {"a":4,"b":5,"c":6}  |
| 2021-01-01T02:00:00Z | foo     | {"a":7,"b":8,"c":9}  |
| 2021-01-01T00:00:00Z | bar     | {"a":10,"b":9,"c":8} |
| 2021-01-01T01:00:00Z | bar     | {"a":7,"b":6,"c":5}  |
| 2021-01-01T02:00:00Z | bar     | {"a":4,"b":3,"c":2}  |


#### Output data

| _field  | _time                | a  | b  | c  |
| ------- | -------------------- | -- | -- | -- |
| foo     | 2021-01-01T00:00:00Z | 1  | 2  | 3  |
| foo     | 2021-01-01T01:00:00Z | 4  | 5  | 6  |
| foo     | 2021-01-01T02:00:00Z | 7  | 8  | 9  |
| bar     | 2021-01-01T00:00:00Z | 10 | 9  | 8  |
| bar     | 2021-01-01T01:00:00Z | 7  | 6  | 5  |
| bar     | 2021-01-01T02:00:00Z | 4  | 3  | 2  |

{{% /expand %}}
{{< /expand-wrapper >}}

### Parse JSON and use array functions to manipulate into a table

```js
import "experimental/json"
import "experimental/array"

jsonStr =
    bytes(
        v:
            "{
     \"node\": {
         \"items\": [
             {
                 \"id\": \"15612462\",
                 \"color\": \"red\",
                 \"states\": [
                     {
                         \"name\": \"ready\",
                         \"duration\": 10
                     },
                     {
                         \"name\": \"closed\",
                         \"duration\": 13
                     },
                     {
                         \"name\": \"pending\",
                         \"duration\": 3
                     }
                 ]
             },
             {
                 \"id\": \"15612462\",
                 \"color\": \"blue\",
                 \"states\": [
                     {
                         \"name\": \"ready\",
                         \"duration\": 5
                     },
                     {
                         \"name\": \"closed\",
                         \"duration\": 0
                     },
                     {
                         \"name\": \"pending\",
                         \"duration\": 16
                     }
                 ]
             }
         ]
     }
}",
    )

data = json.parse(data: jsonStr)

// Map over all items in the JSON extracting
// the id, color and pending duration of each.
// Construct a table from the final records.
array.from(
    rows:
        data.node.items
            |> array.map(
                fn: (x) => {
                    pendingState =
                        x.states
                            |> array.filter(fn: (x) => x.name == "pending")
                    pendingDur =
                        if length(arr: pendingState) == 1 then
                            pendingState[0].duration
                        else
                            0.0

                    return {id: x.id, color: x.color, pendingDuration: pendingDur}
                },
            ),
)

```

{{< expand-wrapper >}}
{{% expand "View example output" %}}

#### Output data

| id       | color  | pendingDuration  |
| -------- | ------ | ---------------- |
| 15612462 | red    | 3                |
| 15612462 | blue   | 16               |

{{% /expand %}}
{{< /expand-wrapper >}}
