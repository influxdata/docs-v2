---
title: Work with functions
seotitle: Work with functions in Flux
list_title: Function
description: >
  A **function** type is a set of parameters that perform an operation.
  Learn how to work with functions in flux.
menu:
  flux_0_x:
    name: Function
    parent: Composite types
weight: 204
flux/v0.x/tags: ["composite types", "data types"]
related:
  - /flux/v0.x/define-functions/
list_code_example: |
  ```js
  () => 1
  
  (a, b) => a + b
  
  (a, b, c=2) => { 
      d = a + b
      return d / c
  }
  ```
---

A **function** type is a set of parameters that perform an operation.

- [Function syntax](#function-syntax)
- [Define functions](#define-functions)

## Function syntax
A Flux **function** literal contains the following:

- Zero or more parameters enclosed in parentheses (`()`)
    - Parameters are comma separated
    - Parameters must be named (no positional params)
    - Optionally assign a default value for each parameter with the `=`
      [assignment operator](/flux/v0.x/spec/operators/#assignment-operators).
      Parameters without a default value require user input and are considered **required parameters**.
- `=>` [arrow operator](/flux/v0.x/spec/operators/#function-operators) to pass parameters into the function body.
- Function body to define function operations and return a response.

##### Example functions
```js
// Function that returns the value 1
() => 1

// Function that returns the sum of a and b
(a, b) => a + b

// Function with default values
(x=1, y=1) => x * y

// Function with a block body
(a, b, c) => { 
    d = a + b
    return d / c
}
```

## Define functions
_For information about defining custom functions, see [Define custom functions](/flux/v0.x/define-functions/)._



