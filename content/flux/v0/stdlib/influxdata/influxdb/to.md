---
title: to() function
description: >
  `to()` writes data to an InfluxDB Cloud or 2.x bucket and returns the written data.
menu:
  flux_v0_ref:
    name: to
    parent: influxdata/influxdb
    identifier: influxdata/influxdb/to
weight: 201
flux/v0.x/tags: [outputs]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/influxdata/influxdb/influxdb.flux#L314-L329

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`to()` writes data to an InfluxDB Cloud or 2.x bucket and returns the written data.

### Output data requirements
`to()` writes data structured using the standard InfluxDB Cloud and v2.x data
structure that includes, at a minimum, the following columns:

- `_time`
- `_measurement`
- `_field`
- `_value`

All other columns are written to InfluxDB as
[tags](/influxdb/cloud/reference/key-concepts/data-elements/#tags).

**Note**: `to()` drops rows with null `_time` values and does not write them
to InfluxDB.

#### to() does not require a package import
`to()` is part of the `influxdata/influxdb` package, but is part of the
Flux prelude and does not require an import statement or package namespace.

##### Function type signature

```js
(
    <-tables: stream[A],
    ?bucket: string,
    ?bucketID: string,
    ?fieldFn: (r: A) => B,
    ?host: string,
    ?measurementColumn: string,
    ?org: string,
    ?orgID: string,
    ?tagColumns: [string],
    ?timeColumn: string,
    ?token: string,
) => stream[A] where A: Record, B: Record
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

### timeColumn

Time column of the output. Default is `"_time"`.



### measurementColumn

Measurement column of the output. Default is `"_measurement"`.



### tagColumns

Tag columns in the output. Defaults to all columns with type
`string`, excluding all value columns and columns identified by `fieldFn`.



### fieldFn

Function that maps a field key to a field value and returns a record.
Default is `(r) => ({ [r._field]: r._value })`.



### tables

Input data. Default is piped-forward data (`<-`).




## Examples

- [Write data to InfluxDB](#write-data-to-influxdb)
- [Customize measurement, tag, and field columns in the to() operation](#customize-measurement-tag-and-field-columns-in-the-to-operation)
- [Write to multiple InfluxDB buckets](#write-to-multiple-influxdb-buckets)

### Write data to InfluxDB

```js
data =
    array.from(
        rows: [
            {
                _time: 2021-01-01T00:00:00Z,
                _measurement: "m",
                tag1: "a",
                _field: "temp",
                _value: 100.1,
            },
            {
                _time: 2021-01-01T00:01:00Z,
                _measurement: "m",
                tag1: "a",
                _field: "temp",
                _value: 99.8,
            },
            {
                _time: 2021-01-01T00:02:00Z,
                _measurement: "m",
                tag1: "a",
                _field: "temp",
                _value: 99.1,
            },
            {
                _time: 2021-01-01T00:03:00Z,
                _measurement: "m",
                tag1: "a",
                _field: "temp",
                _value: 98.6,
            },
        ],
    )

data
    |> to(
        bucket: "example-bucket",
        org: "example-org",
        token: "mYSuP3rSecR37t0k3N",
        host: "http://localhost:8086",
    )

```

The example above produces the following line protocol and sends it to the
InfluxDB `/api/v2/write` endpoint:

```txt
m,tag1=a temp=100.1 1609459200000000000
m,tag1=a temp=99.8 1609459260000000000
m,tag1=a temp=99.1 1609459320000000000
m,tag1=a temp=98.6 1609459380000000000
```


### Customize measurement, tag, and field columns in the to() operation

```js
data =
    array.from(
        rows: [
            {
                _time: 2021-01-01T00:00:00Z,
                tag1: "a",
                tag2: "b",
                hum: 53.3,
                temp: 100.1,
            },
            {
                _time: 2021-01-01T00:01:00Z,
                tag1: "a",
                tag2: "b",
                hum: 53.4,
                temp: 99.8,
            },
            {
                _time: 2021-01-01T00:02:00Z,
                tag1: "a",
                tag2: "b",
                hum: 53.6,
                temp: 99.1,
            },
            {
                _time: 2021-01-01T00:03:00Z,
                tag1: "a",
                tag2: "b",
                hum: 53.5,
                temp: 98.6,
            },
        ],
    )

data
    |> to(
        bucket: "example-bucket",
        measurementColumn: "tag1",
        tagColumns: ["tag2"],
        fieldFn: (r) => ({"hum": r.hum, "temp": r.temp}),
    )

```

The example above produces the following line protocol and sends it to the
InfluxDB `/api/v2/write` endpoint:

```txt
a,tag2=b hum=53.3,temp=100.1 1609459200000000000
a,tag2=b hum=53.4,temp=99.8 1609459260000000000
a,tag2=b hum=53.6,temp=99.1 1609459320000000000
a,tag2=b hum=53.5,temp=98.6 1609459380000000000
```


### Write to multiple InfluxDB buckets

The example below does the following:

1. Writes data to `bucket1` and returns the data as it is written.
2. Applies an empty group key to group all rows into a single table.
3. Counts the number of rows.
4. Maps columns required to write to InfluxDB.
5. Writes the modified data to `bucket2`.

```js
data
    |> to(bucket: "bucket1")
    |> group()
    |> count()
    |> map(
        fn: (r) => ({r with _time: now(), _measurement: "writeStats", _field: "numPointsWritten"}),
    )
    |> to(bucket: "bucket2")

```

