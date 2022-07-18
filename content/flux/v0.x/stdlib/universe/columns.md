---
title: columns() function
description: >
  `columns()` returns the column labels in each input table.
menu:
  flux_0_x_ref:
    name: columns
    parent: universe
    identifier: universe/columns
weight: 101
flux/v0.x/tags: [transformations]
introduced: 0.14.0
aliases:
  - /influxdb/v2.0/reference/flux/functions/transformations/columns
  - /influxdb/v2.0/reference/flux/functions/built-in/transformations/columns/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/transformations/columns/
  - /influxdb/cloud/reference/flux/stdlib/built-in/transformations/columns/
related:
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-schema/#show-measurements, InfluxQL – SHOW MEASUREMENTS  
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-schema/#show-field-keys, InfluxQL – SHOW FIELD KEYS  
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-schema/#show-tag-keys, InfluxQL – SHOW TAG KEYS  
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-schema/#show-tag-keys, InfluxQL – SHOW SERIES
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/universe/universe.flux#L113-L113

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`columns()` returns the column labels in each input table.

For each input table, `columns` outputs a table with the same group key
columns and a new column containing the column labels in the input table.
Each row in an output table contains the group key value and the label of one
 column of the input table.
Each output table has the same number of rows as the number of columns of the
input table.

##### Function type signature

```js
(<-tables: stream[A], ?column: string) => stream[B] where A: Record, B: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0.x/function-type-signatures/).{{% /caption %}}

## Parameters

### column

Name of the output column to store column labels in.
Default is "_value".



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### List all columns per input table

```js
import "sampledata"

sampledata.string()
    |> columns(column: "labels")

```

