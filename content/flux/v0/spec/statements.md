---
title: Statements
description: Statements control execution in the Flux functional data scripting language.
menu:
  flux_v0_ref:
    parent: Flux specification
    name: Statements
weight: 112
aliases:
  - /influxdb/v2/reference/flux/language/statements/
  - /influxdb/cloud/reference/flux/language/statements/
---

A _statement_ controls execution.

```js
Statement      = [ Attributes ] StatementInner .
StatementInner = OptionAssignment
                | BuiltinStatement
                | VariableAssignment
                | ReturnStatement
                | ExpressionStatement
                | TestcaseStatement .
```

## Return statements

A terminating statement prevents execution of all statements that appear after it in the same block.
A return statement is a terminating statement.

```
ReturnStatement = "return" Expression .
```
## Expression statements

An _expression statement_ is an expression where the computed value is discarded.

```
ExpressionStatement = Expression .
```

##### Examples of expression statements

```js
1 + 1
f()
a
```

#### Testcase statements

A _testcase_ statement defines a test case.

{{% note %}}
Testcase statements only work within the context of a Flux developement environment.
{{% /note %}}

```js
TestcaseStatement = "testcase" identifier [ TestcaseExtention ] Block .
TestcaseExtention = "extends" string_lit
```

Test cases are defined as a set of statements with special scoping rules.
Each test case statement in a file is considered to be its own main package.
In effect, all statements in package scope and all statements contained within
the test case statement are flattened into a single main package and executed.
Use the `testing` package from the standard library to control the pass failure
of the test case.

Test extension augments an existing test case with more statements or attributes.
A special function call, `super()`, must be made inside the body of a test case
extension. All statements from the parent test case will be executed in its place.


##### Basic testcase for addition
```js
import "testing"

testcase addition {
    testing.assertEqualValues(got: 1 + 1, want: 2)
}
```

##### Example testcase extension to prevent feature regession

```js
@feature({vectorization: true})
testcase vector_addition extends "basics_test.addition" {
    super()
}
```

{{< page-nav prev="/flux/v0/spec/packages/" next="/flux/v0/spec/side-effects/" >}}
