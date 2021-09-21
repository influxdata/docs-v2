---
title: to() function
description: The `to()` function writes data to an InfluxDB v2.0 bucket.
aliases:
  - /flux/v0.x/stdlib/universe/to
  - /influxdb/v2.0/reference/flux/functions/outputs/to
  - /influxdb/v2.0/reference/flux/functions/built-in/outputs/to/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/outputs/to/
  - /influxdb/cloud/reference/flux/stdlib/built-in/outputs/to/
menu:
  flux_0_x_ref:
    name: to
    parent: influxdb-pkg
weight: 301
flux/v0.x/tags: [outputs]
related:
  - /flux/v0.x/stdlib/experimental/to/
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-data/#the-into-clause, InfluxQL – SELECT INTO
introduced: 0.7.0
---

The `to()` function writes data to an **InfluxDB v2.0** bucket.

```js
to(
  bucket: "my-bucket",
  org: "my-org",
  host: "localhost:8086",
  token: "mY5uP3rS3cRe7t0k3n",
  timeColumn: "_time",
  tagColumns: ["tag1", "tag2", "tag3"],
  fieldFn: (r) => ({ r._field: r._value })
)

// OR

to(
  bucketID: "1234567890",
  orgID: "0987654321",
  host: "localhost:8086",
  token: "mY5uP3rS3cRe7t0k3n",
  timeColumn: "_time",
  tagColumns: ["tag1", "tag2", "tag3"],
  fieldFn: (r) => ({ r._field: r._value })
)
```

{{% note %}}
#### to() does not require a package import
`to()` is part of the `influxdata/influxdb` package, but is included with the
[`universe` package](/flux/v0.x/stdlib/universe/) by default and does not require
an import statement or package namespace.
{{% /note %}}

### Output data requirements
`to()` writes data structured using the standard 
[InfluxDB v2.x and InfluxDB Cloud data structure](/{{< latest "influxdb" >}}/reference/key-concepts/data-elements/)
that includes, at a minimum, the following columns:

- `_time`
- `_measurement`
- `_field`
- `_value`

_All other columns are written to InfluxDB as [tags](/{{< latest "influxdb" >}}/reference/key-concepts/data-elements/#tags)._

{{% note %}}
The `to()` function ignores rows with a null `_time` value and does not write
them to InfluxDB.
{{% /note %}}

## Parameters

{{% note %}}
You must provide a `bucket` or `bucketID` and an `org` or `orgID`.
{{% /note %}}

### bucket {data-type="string"}
Bucket to write data to.
_`bucket` and `bucketID` are mutually exclusive._

### bucketID {data-type="string"}
Bucket ID to write data to.
_`bucketID` and `bucket` are mutually exclusive._

### org {data-type="string"}
InfluxDB organization name.
_`org` and `orgID` are mutually exclusive._

### orgID {data-type="string"}
InfluxDB organization ID.
_`orgID` and `org` are mutually exclusive._

### host {data-type="string"}
[InfluxDB URL](/{{< latest "influxdb" >}}/reference/urls/) or
[InfluxDB Cloud region](/influxdb/cloud/reference/regions) URL to write to.

{{% warn %}}
_`host` is required when writing to a remote InfluxDB instance.
If specified, [`token`](#token) is also required._
{{% /warn %}}

### token {data-type="string"}
[InfluxDB API token](/{{< latest "influxdb" >}}/security/tokens).

{{% warn %}}
_`token` is required when writing to another organization or when writing to a remote InfluxDB [`host`](#host)._
{{% /warn %}}

### timeColumn {data-type="string"}
Time column of the output.
Default is `"_time"`.

### tagColumns {data-type="array of strings"}
Tag columns in the output.
Defaults to all columns with type `string`, excluding all value columns and columns
identified by [`fieldFn`](#fieldfn).

### fieldFn {data-type="function"}
Function that takes a record from the input table and returns a record.
For each record from the input table, `fieldFn` returns a record that maps the
output field key to the output value.
Default is `(r) => ({ [r._field]: r._value })`
_**Output data type:** Record_

{{% note %}}
Make sure `fieldFn` parameter names match each specified parameter.
To learn why, see [Match parameter names](/flux/v0.x/spec/data-model/#match-parameter-names).
{{% /note %}}

## Examples

### Default to() operation

Given the following table:

| _time | _start | _stop | _measurement | _field | _value |
| ----- | ------ | ----- | ------------ | ------ | ------ |
| 0005  | 0000   | 0009  | "a"          | "temp" | 100.1  |
| 0006  | 0000   | 0009  | "a"          | "temp" | 99.3   |
| 0007  | 0000   | 0009  | "a"          | "temp" | 99.9   |

The default `to` operation:

```js
// ...
|> to(bucket:"my-bucket", org:"my-org")
```

is equivalent to writing the above data using the following line protocol:

```
_measurement=a temp=100.1 0005
_measurement=a temp=99.3 0006
_measurement=a temp=99.9 0007
```

### Custom to() operation

The `to()` functions default operation can be overridden. For example, given the following table:

| _time | _start | _stop | tag1 | tag2 | hum  | temp  |
| ----- | ------ | ----- | ---- | ---- | ---- | ----- |
| 0005  | 0000   | 0009  | "a"  | "b"  | 55.3 | 100.1 |
| 0006  | 0000   | 0009  | "a"  | "b"  | 55.4 | 99.3  |
| 0007  | 0000   | 0009  | "a"  | "b"  | 55.5 | 99.9  |

The operation:

```js
// ...
|> to(
  bucket:"my-bucket",
  org:"my-org",
  tagColumns:["tag1"],
  fieldFn: (r) => ({"hum": r.hum, "temp": r.temp})
)
```

is equivalent to writing the above data using the following line protocol:

```
_tag1=a hum=55.3,temp=100.1 0005
_tag1=a hum=55.4,temp=99.3 0006
_tag1=a hum=55.5,temp=99.9 0007
```
