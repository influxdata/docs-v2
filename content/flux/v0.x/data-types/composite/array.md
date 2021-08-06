---
title: Work with arrays
seotitle: Work with arrays in Flux
list_title: Array
description: >
  Learn how to work with arrays in Flux.
menu:
  flux_0_x:
    name: Array
    parent: Composite types
weight: 202
flux/v0.x/tags: ["composite types", "data types"]
---

An **array** type is an ordered sequence of values of the same type.

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
Flux uses **zero-based indexing** for array elements.
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
- [Compare arrays](#compare-arrays)

### Iterate over an array
{{% note %}}
Flux currently does not provide a way to iterate over an array.
{{% /note %}}

### Check if a value exists in an array
Use the [`contains` function](/flux/v0.x/stdlib/universe/contains/) to check if
a value exists in an array.

```js
names = ["John", "Jane", "Joe", "Sam"]

contains(value: "Joe", set: names)
// Returns true
```

### Get the length of an array
Use the [`length` function](/flux/v0.x/stdlib/universe/length/) to get the
length of an array (number of elements in the array). 

```js
names = ["John", "Jane", "Joe", "Sam"]

length(arr: names)
// Returns 4
```

### Compare arrays
Use the `==` [comparison operator](/flux/v0.x/spec/operators/#comparison-operators)
to check if two arrays are equal.
Equality is based on values, their type, and order.

```js
[1,2,3,4] == [1,3,2,4]
// Returns false

[12300.0, 34500.0] == [float(v: "1.23e+04"), float(v: "3.45e+04")]
// Returns true
```