---
title: to() function
description: The `to()` function writes data to an InfluxDB v2.0 bucket.
aliases:
  - /influxdb/v2.0/reference/flux/functions/outputs/to
  - /influxdb/v2.0/reference/flux/functions/built-in/outputs/to/
  - /influxdb/v2.0/reference/flux/stdlib/built-in/outputs/to/
  - /influxdb/cloud/reference/flux/stdlib/built-in/outputs/to/
menu:
  influxdb_2_0_ref:
    name: to
    parent: built-in-outputs
weight: 401
related:
  - /{{< latest "influxdb" "v1" >}}/query_language/explore-data/#the-into-clause, InfluxQL – SELECT INTO
introduced: 0.7.0
---

The `to()` function writes data to an **InfluxDB v2.0** bucket.

_**Function type:** Output_

```js
to(
  bucket: "my-bucket",
  org: "my-org",
  timeColumn: "_time",
  tagColumns: ["tag1", "tag2", "tag3"],
  fieldFn: (r) => ({ [r._field]: r._value })
)

// OR

to(
  bucketID: "1234567890",
  orgID: "0987654321",
  timeColumn: "_time",
  tagColumns: ["tag1", "tag2", "tag3"],
  fieldFn: (r) => ({ [r._field]: r._value })
)
```

### Output data requirements
The `to()` function converts output data into line protocol and writes it to InfluxDB.
Line protocol requires each record to have a timestamp, a measurement, a field, and a value.
All output data must include the following columns:

- `_time`
- `_measurement`
- `_field`
- `_value`

{{% note %}}
The `to()` function ignores rows with a null `_time` value and does not write
them to InfluxDB.
{{% /note %}}

## Parameters

{{% note %}}
You must provide a `bucket` or `bucketID` and an `org` or `orgID`.
{{% /note %}}

### bucket
Bucket name to write to.
`bucket` and `bucketID` are mutually exclusive.

_**Data type:** String_

### bucketID
Bucket ID to write to.
`bucketID` and `bucket` are mutually exclusive.

_**Data type:** String_

### org
InfluxDB organization name.
_`org` and `orgID` are mutually exclusive._

_**Data type:** String_

### orgID
InfluxDB organization ID.
`orgID` and `org` are mutually exclusive.

_**Data type:** String_

### host
Remote InfluxDB host to write to.
_If specified, a [`token`](#token) is required._

_**Data type:** String_

### token
[Authorization token](/influxdb/v2.0/reference/) to use when writing to a remote InfluxDB host.
_Required when a [`host`](#host) is specified._

_**Data type:** String_

### timeColumn
Time column of the output.
Default is `"_time"`.

_**Data type:** String_

### tagColumns
Tag columns in the output.
Defaults to all columns with type `string`, excluding all value columns and columns
identified by [`fieldFn`](#fieldfn).

_**Data type:** Array of strings_

### fieldFn
Function that takes a record from the input table and returns a record.
For each record from the input table, `fieldFn` returns a record that maps the
output field key to the output value.
Default is `(r) => ({ [r._field]: r._value })`

_**Data type:** Function_  
_**Output data type:** Record_

{{% note %}}
Make sure `fieldFn` parameter names match each specified parameter.
To learn why, see [Match parameter names](/influxdb/v2.0/reference/flux/language/data-model/#match-parameter-names).
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
| introduced: 0.7.0
----- | ------ | ----- | ---- | ---- | ---- | ----- |
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
