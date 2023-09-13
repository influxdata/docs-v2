---
title: Work with arrays
seotitle: Work with arrays in Flux
list_title: Array
description: >
  An **array** type is an ordered sequence of values of the same type.
  Learn how to work with arrays in Flux.
menu:
  flux_v0:
    name: Array
    parent: Composite types
weight: 202
flux/v0.x/tags: ["composite types", "data types"]
related:
  - /flux/v0/stdlib/universe/length/
  - /flux/v0/stdlib/array/
list_code_example: |
  ```js
  ["1st", "2nd", "3rd"]

  [1.23, 4.56, 7.89]

  [10, 25, -15]
  ```
---

An **array** type is an ordered sequence of values of the same type.

- [Array syntax](#array-syntax)
- [Reference values in an array](#reference-values-in-an-array)
- [Operate on arrays](#operate-on-arrays)

## Array syntax
An array literal contains a sequence of values (also known as elements) enclosed
in square brackets (`[]`).
Values are comma-separated and must be the same type.

##### Example arrays
```js
["1st", "2nd", "3rd"]

[1.23, 4.56, 7.89]

[10, 25, -15]
```

## Reference values in an array
Use **bracket notation** to reference reference a value in an array. 
Flux arrays use **zero-based indexing**.
Provide the index of the value to reference.

```js
arr = ["1st", "2nd", "3rd"]

arr[0]
// Returns 1st

arr[2]
// Returns 3rd
```

## Operate on arrays

- [Iterate over an array](#iterate-over-an-array)
- [Check if a value exists in an array](#check-if-a-value-exists-in-an-array)
- [Get the length of an array](#get-the-length-of-an-array)
- [Create a stream of tables from an array](#create-a-stream-of-tables-from-an-array)
- [Compare arrays](#compare-arrays)
- [Filter an array](#filter-an-array)
- [Merge two arrays](#merge-two-arrays)
- [Return the string representation of an array](#return-the-string-representation-of-an-array)
- [Include the string representation of an array in a table](#include-the-string-representation-of-an-array-in-a-table)

### Iterate over an array
1. Import the [`experimental/array` package](/flux/v0/stdlib/experimental/array/).
2. Use [`array.map`](/flux/v0/stdlib/experimental/array/map/) to iterate over
   elements in an array, apply a function to each element, and then return a new
   array.

```js
import "experimental/array"

a = [
    {fname: "John", lname: "Doe", age: 42},
    {fname: "Jane", lname: "Doe", age: 40},
    {fname: "Jacob", lname: "Dozer", age: 21},
]

a |> array.map(fn: (x) => ({statement: "${x.fname} ${x.lname} is ${x.age} years old."}))

// Returns
// [
//     {statement: "John Doe is 42 years old."},
//     {statement: "Jane Doe is 40 years old."},
//     {statement: "Jacob Dozer is 21 years old."}
// ]
```

### Check if a value exists in an array
Use the [`contains` function](/flux/v0/stdlib/universe/contains/) to check if
a value exists in an array.

```js
names = ["John", "Jane", "Joe", "Sam"]

contains(value: "Joe", set: names)
// Returns true
```

### Get the length of an array
Use the [`length` function](/flux/v0/stdlib/universe/length/) to get the
length of an array (number of elements in the array). 

```js
names = ["John", "Jane", "Joe", "Sam"]

length(arr: names)
// Returns 4
```

### Create a stream of tables from an array
1. Import the [`array` package](/flux/v0/stdlib/array/).
2. Use [`array.from()`](/flux/v0/stdlib/array/from/) to return a
   [stream of tables](/flux/v0/get-started/data-model/#stream-of-tables).
   The input array must be an array of [records](/flux/v0/data-types/composite/record/).
   Each key-value pair in the record represents a column and its value.

```js
import "array"

arr = [
    {fname: "John", lname: "Doe", age: "37"},
    {fname: "Jane", lname: "Doe", age: "32"},
    {fname: "Jack", lname: "Smith", age: "56"},
]

array.from(rows: arr)
```

##### Output
| fname | lname | age |
| :---- | :---- | --: |
| John  | Doe   |  37 |
| Jane  | Doe   |  32 |
| Jack  | Smith |  56 |

### Compare arrays
Use the `==` [comparison operator](/flux/v0/spec/operators/#comparison-operators)
to check if two arrays are equal.
Equality is based on values, their type, and order.

```js
[1,2,3,4] == [1,3,2,4]
// Returns false

[12300.0, 34500.0] == [float(v: "1.23e+04"), float(v: "3.45e+04")]
// Returns true
```

### Filter an array
1. Import the [`experimental/array` package](/flux/v0/stdlib/experimental/array/).
2. Use [`array.filter`](/flux/v0/stdlib/experimental/array/filter/) to iterate
   over and evaluate elements in an array with a predicate function and then
   return a new array with only elements that match the predicate.

```js
import "experimental/array"

a = [1, 2, 3, 4, 5]

a |> array.filter(fn: (x) => x >= 3)
// Returns [3, 4, 5]
```

### Merge two arrays
1. Import the [`experimental/array` package](/flux/v0/stdlib/experimental/array/).
2. Use [`array.concat`](/flux/v0/stdlib/experimental/array/concat/) to merge 
   two arrays.

```js
import "experimental/array"

a = [1, 2, 3]
b = [4, 5, 6]

a |> array.concat(v: b)
// Returns [1, 2, 3, 4, 5, 6]
```

### Return the string representation of an array
Use [`display()`](/flux/v0/stdlib/universe/display/) to return Flux literal 
representation of an array as a string.

```js
arr = [1, 2, 3]

display(v: arr)

// Returns "[1, 2, 3]"
```

### Include the string representation of an array in a table
Use [`display()`](/flux/v0/stdlib/universe/display/) to return Flux literal
representation of an array as a string and include it as a column value.

```js
import "sampledata"

sampledata.string()
    |> map(fn: (r) => ({_time: r._time, exampleArray: display(v: [r.tag, r._value])}))
```

#### Output
| _time <em style="opacity:.5">(time)</em> | exampleArray <em style="opacity:.5">(string)</em> |
| :--------------------------------------- | :----------------------------------------------- |
| 2021-01-01T00:00:00Z                     | [t1, smpl_g9qczs]                                |
| 2021-01-01T00:00:10Z                     | [t1, smpl_0mgv9n]                                |
| 2021-01-01T00:00:20Z                     | [t1, smpl_phw664]                                |
| 2021-01-01T00:00:30Z                     | [t1, smpl_guvzy4]                                |
| 2021-01-01T00:00:40Z                     | [t1, smpl_5v3cce]                                |
| 2021-01-01T00:00:50Z                     | [t1, smpl_s9fmgy]                                |
| 2021-01-01T00:00:00Z                     | [t2, smpl_b5eida]                                |
| 2021-01-01T00:00:10Z                     | [t2, smpl_eu4oxp]                                |
| 2021-01-01T00:00:20Z                     | [t2, smpl_5g7tz4]                                |
| 2021-01-01T00:00:30Z                     | [t2, smpl_sox1ut]                                |
| 2021-01-01T00:00:40Z                     | [t2, smpl_wfm757]                                |
| 2021-01-01T00:00:50Z                     | [t2, smpl_dtn2bv]                                |
