---
title: csv.from() function
description: >
  `csv.from()` retrieves [annotated CSV](/influxdb/v2/reference/syntax/annotated-csv/) **from a URL**.
menu:
  flux_v0_ref:
    name: csv.from
    parent: experimental/csv
    identifier: experimental/csv/from
weight: 201
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/csv/csv.flux#L43-L43

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`csv.from()` retrieves [annotated CSV](/influxdb/v2/reference/syntax/annotated-csv/) **from a URL**.

{{% warn %}}
#### Deprecated
Experimental `csv.from()` is deprecated in favor of a combination of [`requests.get()`](/flux/v0/stdlib/http/requests/get/) and [`csv.from()`](/flux/v0/stdlib/csv/from/).
{{% /warn %}}

**Note:** Experimental `csv.from()` is an alternative to the standard
`csv.from()` function.

##### Function type signature

```js
(url: string) => stream[A] where A: Record
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### url
({{< req >}})
URL to retrieve annotated CSV from.




## Examples

- [Query annotated CSV data from a URL using the requests package](#query-annotated-csv-data-from-a-url-using-the-requests-package)
- [Query annotated CSV data from a URL](#query-annotated-csv-data-from-a-url)

### Query annotated CSV data from a URL using the requests package

```js
import "csv"
import "http/requests"

response = requests.get(url: "http://example.com/csv/example.csv")

csv.from(csv: string(v: response.body))

```


### Query annotated CSV data from a URL

```js
import "experimental/csv"

csv.from(url: "http://example.com/csv/example.csv")

```

