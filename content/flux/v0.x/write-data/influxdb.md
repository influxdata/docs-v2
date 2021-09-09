---
title: Write to InfluxDB
list_title: InfluxDB
description: >
  Use [`to()`](/flux/v0.x/stdlib/universe/to/) or [`experimental.to()`](/flux/v0.x/stdlib/experimental/to/)
  to write data to InfluxDB using Flux.
menu:
  flux_0_x:
    name: InfluxDB
    parent: Write to data sources
    identifier: write-influxdb
weight: 101
related:
  - /flux/v0.x/stdlib/universe/to/
  - /flux/v0.x/stdlib/experimental/to/
list_code_example: |
  ```js
  data
    |> to(bucket: "example-bucket")
  ```
---

To write data to InfluxDB using Flux, use [`to()`](/flux/v0.x/stdlib/universe/to/)
or [`experimental.to()`](/flux/v0.x/stdlib/experimental/to/).
Provide the following parameters to both functions:

- **bucket** or **bucketID**: _InfluxDB bucket name_ or _bucket ID_ to write to.
- **org** or **orgID**: _InfluxDB organization name_ or _organization ID_ to write to.
- **host**: [InfluxDB URL](/{{< latest "influxdb" >}}/reference/urls/) or
  [InfluxDB Cloud region](/influxdb/cloud/reference/regions) URL.
- **token**: [InfluxDB API token](/{{< latest "influxdb" >}}/security/tokens/).


- [Write data to InfluxDB](#write-data-to-influxdb)
- [Write pivoted data to InfluxDB](#write-pivoted-data-to-influxdb)

---

## Write data to InfluxDB
Use [`to()`](/flux/v0.x/stdlib/universe/to/) to write data structured using the standard 
[InfluxDB v2.x and InfluxDB Cloud data structure](/{{< latest "influxdb" >}}/reference/key-concepts/data-elements/).
Data must include, at a minimum, the following columns:

- `_time`
- `_measurement`
- `_field`
- `_value`

_All other columns are written to InfluxDB as [tags](/{{< latest "influxdb" >}}/reference/key-concepts/data-elements/#tags)._

Given the following input [stream of tables](/flux/v0.x/get-started/data-model/#stream-of-tables):

| _time                | _measurement | id  | loc | _field | _value |
| :------------------- | :----------- | :-- | :-- | -----: | -----: |
| 2021-01-01T00:00:00Z | m            | 001 | SF  |   temp |   72.1 |
| 2021-01-01T01:00:00Z | m            | 001 | SF  |   temp |   71.8 |
| 2021-01-01T02:00:00Z | m            | 001 | SF  |   temp |   71.2 |

| _time                | _measurement | id  | loc | _field | _value |
| :------------------- | :----------- | :-- | :-- | -----: | -----: |
| 2021-01-01T00:00:00Z | m            | 001 | SF  |    hum |   40.5 |
| 2021-01-01T01:00:00Z | m            | 001 | SF  |    hum |   50.1 |
| 2021-01-01T02:00:00Z | m            | 001 | SF  |    hum |   52.8 |

`to()` generates the following [line protocol](/{{< latest "influxdb" >}}/reference/syntax/line-protocol/)
and writes it to InfluxDB:

```
m,id=001,loc=SF temp=72.1,hum=40.5 1609459200000000000
m,id=001,loc=SF temp=71.8,hum=50.1 1609462800000000000
m,id=001,loc=SF temp=71.2,hum=52.8 1609466400000000000
```

### Examples

- [Write data to a bucket in the same InfluxDB organization](#write-data-to-a-bucket-in-the-same-influxdb-organization)
- [Write data to a bucket in a different InfluxDB organization](#write-data-to-a-bucket-in-a-different-influxdb-organization)
- [Write data to a remote InfluxDB bucket](#write-data-to-a-remote-influxdb-bucket)

#### Write data to a bucket in the same InfluxDB organization
```js
data
  |> to(bucket: "example-bucket")
```

#### Write data to a bucket in a different InfluxDB organization
```js
data
  |> to(
    bucket: "example-bucket",
    org: "example-org",
    token: "mY5uPeRs3Cre7tok3N"
  )
```

#### Write data to a remote InfluxDB bucket
```js
data
  |> to(
    bucket: "example-bucket",
    org: "example-org",
    token: "mY5uPeRs3Cre7tok3N",
    host: "https://myinfluxdbdomain.com/8086"
  )
```

---

## Write pivoted data to InfluxDB
Use [`experimental.to()`](/flux/v0.x/stdlib/experimental/to/) to write
[pivoted](/flux/v0.x/stdlib/universe/pivot/) data to InfluxDB.
Input data must have the following columns:

- `_time`
- `_measurement`

All columns **in the [group key](/flux/v0.x/get-started/data-model/#group-key)**
other than `_time` and `_measurement` are written to InfluxDB as [tags](/{{< latest "influxdb" >}}/reference/key-concepts/data-elements/#tags).
Columns **not in the group key** are written to InfluxDB as [fields](/{{< latest "influxdb" >}}/reference/key-concepts/data-elements/#fields).

{{% note %}}
`_start` and `_stop` columns are ignored.
{{% /note %}}

**To write pivoted data to InfluxDB:**

1. Import the `experimental` package.
2. Use `experimental.to()` to write pivoted data to an InfluxDB bucket.

```js
import "experimental"

data
  |> experimental.to(bucket: "example-bucket")
```

Given the following input [stream of tables](/flux/v0.x/get-started/data-model/#stream-of-tables):

{{< flux/group-key "[_measurement, id, loc]" >}}

| _time                | _measurement | id  | loc | min | max | mean |
| :------------------- | :----------- | :-- | :-- | --: | --: | ---: |
| 2021-01-01T00:00:00Z | m            | 001 | FR  |   2 |   6 |  4.0 |
| 2021-01-01T01:00:00Z | m            | 001 | FR  |   2 |  18 | 10.0 |
| 2021-01-01T02:00:00Z | m            | 001 | FR  |   1 |  13 |  7.0 |

| _time                | _measurement | id  | loc | min | max | mean |
| :------------------- | :----------- | :-- | :-- | --: | --: | ---: |
| 2021-01-01T00:00:00Z | m            | 001 | BK  |   4 |   4 |  4.0 |
| 2021-01-01T01:00:00Z | m            | 001 | BK  |   3 |   5 |  4.0 |
| 2021-01-01T02:00:00Z | m            | 001 | BK  |   5 |   8 |  6.5 |

`experimental.to()` generates the following [line protocol](/{{< latest "influxdb" >}}/reference/syntax/line-protocol/)
and writes it to InfluxDB:

```
m,id=001,loc=FR min=2i,max=6i,mean=4 1609459200000000000
m,id=001,loc=FR min=2i,max=18i,mean=10 1609462800000000000
m,id=001,loc=FR min=1i,max=13i,mean=7 1609466400000000000
m,id=001,loc=BK min=4i,max=4i,mean=4 1609459200000000000
m,id=001,loc=BK min=3i,max=5i,mean=4 1609462800000000000
m,id=001,loc=BK min=5i,max=3i,mean=6.5 1609466400000000000
```

### Examples

- [Write pivoted data to a bucket in the same InfluxDB organization](#write-pivoted-data-to-a-bucket-in-the-same-influxdb-organization)
- [Write pivoted data to a bucket in a different InfluxDB organization](#write-pivoted-data-to-a-bucket-in-a-different-influxdb-organization)
- [Write pivoted data to a remote InfluxDB bucket](#write-pivoted-data-to-a-remote-influxdb-bucket)

#### Write pivoted data to a bucket in the same InfluxDB organization
```js
import "experimental"

data
  |> experimental.to(bucket: "example-bucket")
```

#### Write pivoted data to a bucket in a different InfluxDB organization
```js
import "experimental"

data
  |> experimental.to(
    bucket: "example-bucket",
    org: "example-org",
    token: "mY5uPeRs3Cre7tok3N"
  )
```

#### Write pivoted data to a remote InfluxDB bucket
```js
import "experimental"

data
  |> experimental.to(
    bucket: "example-bucket",
    org: "example-org",
    token: "mY5uPeRs3Cre7tok3N",
    host: "https://myinfluxdbdomain.com/8086"
  )
```
