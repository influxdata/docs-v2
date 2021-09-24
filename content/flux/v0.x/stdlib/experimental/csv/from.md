---
title: csv.from() function
seotitle: Experimental csv.from() function
list_title: csv.from() (experimental)
description: >
  The experimental `csv.from()` function retrieves annotated CSV from a URL.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/experimental/csv/from/
  - /influxdb/cloud/reference/flux/stdlib/experimental/csv/from/
menu:
  flux_0_x_ref:
    name: csv.from *
    parent: csv-exp
weight: 401
flux/v0.x/tags: [inputs]
introduced: 0.64.0
---

The experimental `csv.from()` function retrieves
[annotated CSV](/{{< latest "influxdb" >}}/reference/syntax/annotated-csv/) **from a URL**.

{{% note %}}
The experimental `csv.from()` function is an alternative to the standard
[`csv.from()` function](/flux/v0.x/stdlib/csv/from/).
{{% /note %}}

{{< keep-url >}}
```js
import "experimental/csv"

csv.from(url: "http://localhost:8086/")
```

## Parameters

### url {data-type="string"}
The URL to retrieve annotated CSV from.

## Examples

##### Query annotated CSV data from a remote URL
```js
import "experimental/csv"

csv.from(url: "http://example.com/csv/example.csv")
  |> filter(fn: (r) => r._measurement == "example-measurement")
```

## Function definition
```js
package csv

import c "csv"
import "experimental/http"

from = (url) => c.from(csv: string(v: http.get(url: url).body))
```
