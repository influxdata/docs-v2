---
title: testing.assertEquals() function
description: The testing.assertEquals() function tests whether two streams have identical data.
aliases:
  - /influxdb/v2.0/reference/flux/functions/tests/assertequals
  - /influxdb/v2.0/reference/flux/functions/testing/assertequals/
  - /influxdb/v2.0/reference/flux/stdlib/testing/assertequals/
  - /influxdb/cloud/reference/flux/stdlib/testing/assertequals/
menu:
  flux_0_x_ref:
    name: testing.assertEquals
    parent: testing
weight: 301
introduced: 0.14.0
---

The `testing.assertEquals()` function tests whether two streams have identical data.
If equal, the function outputs the tested data stream unchanged.
If unequal, the function returns an error.

```js
import "testing"

testing.assertEquals(
  name: "streamEquality",
  got: got,
  want: want
)
```

_The `testing.assertEquals()` function can be used to perform in-line tests in a query._

## Parameters

### name
Unique name given to the assertion.

_**Data type:** String_

### got
The stream containing data to test.
Defaults to piped-forward data (`<-`).

_**Data type:** Record_

### want
The stream that contains the expected data to test against.

_**Data type:** Record_


## Examples

##### Assert of separate streams
```js
import "testing"

want = from(bucket: "backup-example-bucket")
  |> range(start: -5m)

got = from(bucket: "example-bucket")
  |> range(start: -5m)

testing.assertEquals(got: got, want: want)
```

##### Inline assertion
```js
import "testing"

want = from(bucket: "backup-example-bucket")
  |> range(start: -5m)

from(bucket: "example-bucket")
  |> range(start: -5m)
  |> testing.assertEquals(want: want)
```
