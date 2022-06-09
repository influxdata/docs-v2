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
Define your own custom stateChangesOnly function. We will take the function from the source code here and alter it to accommodate more than four levels. Here we account for six different levels instead of just four. 

```js
import "experimental/array"

level1 = "1"
level2 = "2"
level3 = "3"
level4 = "4"
level5 = "5"
level6 = "6"


stateChangesOnly = (tables=<-) => {
    return
        tables
            |> map(
                fn: (r) =>
                    ({r with level_value:
                            if r._level == level6 then
                                6
                            else if r._level == level5 then
                                5
                            else if r._level == level4 then
                                4
                            else if r._level == level3 then
                                3
                            else if r._level == level2 then
                                2
                            else if r._level == level1 then
                                1
                            else
                                0,
                    }),
            )
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
Let’s construct some example data with the array.from() function and map custom levels to it:

```js
array.from(rows: [{_value: 0.0}, 
{_value: 3.0}, 
{_value: 5.0}, 
{_value: 7.0}, 
{_value: 7.5}
{_value: 9.0"}, 
{_value: 11.0}])
|> map(fn: (r) =>({r with _level: if r._value <= 2.0 then "2"
 		     else if r._value <= 4.0 and r._value > 2.0 then 
		        "3"
 		     else if r._value <= 6.0 and r._value > 4.0 then 
		        "4"
 		     else if r._value <= 8.0 and r._value > 6.0 then 
		        "5"
 		     else "6",
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

