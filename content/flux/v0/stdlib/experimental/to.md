---
title: experimental.to() function
description: >
  `experimental.to()` writes _pivoted_ data to an InfluxDB 2.x or InfluxDB Cloud bucket.
menu:
  flux_v0_ref:
    name: experimental.to
    parent: experimental
    identifier: experimental/to
weight: 101
flux/v0/tags: [outputs]
introduced: 0.40.0
deprecated: 0.174.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/experimental/experimental.flux#L315-L315

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`experimental.to()` writes _pivoted_ data to an InfluxDB 2.x or InfluxDB Cloud bucket.

{{% warn %}}
#### Deprecated
`experimental.to()` is deprecated in favor of [`wideTo()`](/flux/v0/stdlib/influxdata/influxdb/wideto/),
which is an equivalent function.
{{% /warn %}}

#### Requirements and behavior
- Requires both a `_time` and a `_measurement` column.
- All columns in the group key (other than `_measurement`) are written as tags
  with the column name as the tag key and the column value as the tag value.
- All columns **not** in the group key (other than `_time`) are written as
  fields with the column name as the field key and the column value as the field value.

If using `from()` to query data from InfluxDB, use `pivot()` to transform
data into the structure `experimental.to()` expects.

##### Function type signature

```js
(
    <-tables: stream[A],
    ?bucket: string,
    ?bucketID: string,
    ?host: string,
    ?org: string,
    ?orgID: string,
    ?token: string,
) => stream[A] where A: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### bucket

Name of the bucket to write to.
_`bucket` and `bucketID` are mutually exclusive_.



### bucketID

String-encoded bucket ID to to write to.
_`bucket` and `bucketID` are mutually exclusive_.



### host

URL of the InfluxDB instance to write to.

See [InfluxDB Cloud regions](/influxdb/cloud/reference/regions/)
or [InfluxDB OSS URLs](/influxdb/latest/reference/urls/).
`host` is required when writing to a remote InfluxDB instance.
If specified, `token` is also required.

### org

Organization name.
_`org` and `orgID` are mutually exclusive_.



### orgID

String-encoded organization ID to query.
_`org` and `orgID` are mutually exclusive_.



### token

InfluxDB API token.

**InfluxDB 1.x or Enterprise**: If authentication is disabled, provide an
empty string (`""`). If authentication is enabled, provide your InfluxDB
username and password using the `<username>:<password>` syntax.
`token` is required when writing to another organization or when `host`
is specified.

### tables

Input data. Default is piped-forward data (`<-`).




## Examples

### Pivot and write data to InfluxDB

```js
import "experimental"

from(bucket: "example-bucket")
    |> range(start: -1h)
    |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
    |> experimental.to(bucket: "example-target-bucket")

```

