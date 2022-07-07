---
title:  Using reduce() to construct a JSON. 
description: >
  Learn how to send multiple points with `http.post()` by creating a JSON object with `reduce()`. 
menu:
  resources:
    parent: How-to guides
weight: 105
---

## Send data in JSON body with `http.post()`
Use the [reduce()](/flux/v0.x/stdlib/universe/reduce/) function to create a JSON object to include as the body with `http.post()`. 

1. Boilerplate. Import packages. The [array](/flux/v0.x/stdlib/array/) package is used to construct tables so you can run this script yourself. The [http package](/flux/v0.x/stdlib/http/) is used to transfer the JSON over http.  
2. Use `array.from()` to query data and construct a table. Or, use another method [to query data with Flux](/influxdb/v2.3/query-data/flux/). 
3. Use the `reduce()` function to start constructing a JSON. The output of reduce is stored in the result `output of reduce`. This table looks like: 

    | field                 | tag                            |
    | :-------------------- | :----------------------------- |
    | example-field:["3"4"1 | {example-tag-key:["bar"bar"bar |

4. Next, use the [map()](/flux/v0.x/stdlib/universe/map/) function to combine the two components together to complete our JSON and store it in the column `final`. Use a second yield() function to store the result as `final JSON`. This table looks like:

    | field                 | tag                            | final                                                     |
    | :-------------------- | :----------------------------- | :-------------------------------------------------------  |
    | example-field:["3"4"1 | {example-tag-key:["bar"bar"bar | {example-tag-key:["bar"bar"bar] , example-field:["3"4"1]} |

5. Use the `findRecord()` function to extract the value from the final column, the JSON. 
6. This example usest the [Post Test Server](https://ptsv2.com/) to grab a URL to dump the JSON and test the `http.post()` function. 

```js
import "array"
import "http"

 
data = array.from(
        rows: [
            {_time: 2020-01-01T00:00:00Z, _field: "example-field", _value: 3, foo: "bar"},
            {_time: 2020-01-01T00:01:00Z, _field: "example-field", _value: 4, foo: "bar"},
            {_time: 2020-01-01T00:02:00Z, _field: "example-field", _value: 1, foo: "bar"},
        ],
    )
  
    |> reduce(
            fn: (r, accumulator) => ({tag:accumulator.tag + "\"" + r.foo, 
                                    field : accumulator.field + "\"" + string(v:r._value)
                                    }),
            identity: {tag: "{example-tag-key:[", 
                    field: "example-field:[" }
    )
    |> yield(name: "output of reduce")
    |> map(fn: (r) => ({ r with tag: r.tag + "]" }))
    |> map(fn: (r) => ({ r with field: r.field + "]}" }))
    |> map(fn: (r) => ({ r with final: r.tag + " , " + r.field}))
    |> yield(name: "final JSON")
    |> findRecord(
        fn: (key) => true,
        idx: 0,
        )


http.post(
    url: "https://ptsv2.com/t/c4x38-1656014222/post",
    headers: {"Content-type": "application/json"},
    data: bytes(v: data.final),
    )
```


