---
title: testing.assertEmpty() function
description: The testing.assertEmpty() function tests if an input stream is empty.
aliases:
  - /influxdb/v2.0/reference/flux/functions/testing/assertempty/
  - /influxdb/v2.0/reference/flux/stdlib/testing/assertempty/
  - /influxdb/cloud/reference/flux/stdlib/testing/assertempty/
menu:
  flux_0_x_ref:
    name: testing.assertEmpty
    parent: Testing
weight: 301
introduced: 0.18.0
---

The `testing.assertEmpty()` function tests if an input stream is empty.
If not empty, the function returns an error.

_**Function type:** Test_  

```js
import "testing"

testing.assertEmpty()
```

_The `testing.assertEmpty()` function can be used to perform in-line tests in a query._

## Examples

#### Check if there is a difference between streams
This example uses the [`testing.diff()` function](/influxdb/v2.0/reference/flux/stdlib/testing/diff)
which outputs the diff for the two streams.
The `.testing.assertEmpty()` function checks to see if the diff is empty.

```js
import "testing"

got = from(bucket: "example-bucket")
  |> range(start: -15m)
want = from(bucket: "backup_example-bucket")
  |> range(start: -15m)
got
  |> testing.diff(want: want)
  |> testing.assertEmpty()
```
