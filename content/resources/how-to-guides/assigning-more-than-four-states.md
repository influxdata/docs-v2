---
title: Assign custom states to data
description: >
  Learn how overcome a limitation of the `monitor.stateChanges()` function and assign custom states to your data. 
menu:
  resources:
    parent: How-to guides
weight: 101
---
## Problem
Users want to use the monitor package and take advantage of functions like monitor.stateChanges(). However, the monitor.stateChanges() function only 

## Solution 1
Define your own custom `stateChangesOnly()` function. Use the function from the source code here and alter it to accommodate more than four levels. Here we account for six different levels instead of just four.

```js
import "dict"
import "experimental"

stateChangesOnly = (tables=<-) => {
    levelInts =
        [
            "customLevel1": 1,
            "customLevel2": 2,
            "customLevel3": 3,
            "customLevel4": 4,
            "customLevel5": 5,
            "customLevel6": 6,
        ]

    return
        tables
            |> map(fn: (r) => ({r with level_value: dict.get(dict: levelInts, key: r._level, default: 0)}))
            |> duplicate(column: "_level", as: "____temp_level____")
            |> drop(columns: ["_level"])
            |> rename(columns: {"____temp_level____": "_level"})
            |> sort(columns: ["_source_timestamp", "_time"], desc: false)
            |> difference(columns: ["level_value"])
            |> filter(fn: (r) => r.level_value != 0)
            |> drop(columns: ["level_value"])
            |> experimental.group(mode: "extend", columns: ["_level"])
}
```

Construct some example data with [`array.from()`](/flux/v0.x/stdlib/array/from/) and map custom levels to it:

```js
array.from(
    rows: [
        {_value: 0.0},
        {_value: 3.0},
        {_value: 5.0},
        {_value: 7.0},
        {_value: 7.5},
        {_value: 9.0},
        {_value: 11.0},
    ],
)
    |> map(
        fn: (r) =>
            ({r with _level:
                    if r._value <= 2.0 then
                        "customLevel2"
                    else if r._value <= 4.0 and r._value > 2.0 then
                        "customLevel3"
                    else if r._value <= 6.0 and r._value > 4.0 then
                        "customLevel4"
                    else if r._value <= 8.0 and r._value > 6.0 then
                        "customLevel5"
                    else
                        "customLevel6",
            }),
    )
```
Where the example data looks like:

| _value | _level |  
| ------ | ------ | 
| 0.0    | "2"    | 
| 3.0    | "3"    |
| 5.0    | "4"    |
| 7.0    | "5"    |
| 7.5    | "5"    |
| 9.0    | "6"    |
| 11.0   | "6"    |

Now we can apply our custom stateChangesOnly() function: 

```js
|> stateChangesOnly()
```

Where the result looks like:

| _value | _level |  
| ------ | ------ | 
| 3.0    | "3"    |
| 5.0    | "4"    |
| 7.0    | "5"    |
| 9.0    | "6"    |

