---
title: Write to InfluxDB
list_title: InfluxDB
description: >
  Use [`to()`](/flux/v0/stdlib/influxdata/influxdb/to/) or [`experimental.to()`](/flux/v0/stdlib/experimental/to/)
  to write data to InfluxDB using Flux.
menu:
  flux_v0:
    name: InfluxDB
    parent: Write to data sources
    identifier: write-influxdb
weight: 101
related:
  - /flux/v0/stdlib/influxdata/influxdb/to/
  - /flux/v0/stdlib/experimental/to/
list_code_example: |
  ```js
  data
      |> to(bucket: "example-bucket")
  ```
---

To write data to InfluxDB using Flux, use [`to()`](/flux/v0/stdlib/influxdata/influxdb/to/)
or [`experimental.to()`](/flux/v0/stdlib/experimental/to/).
Provide the following parameters to both functions:

- **bucket** or **bucketID**: _InfluxDB bucket name_ or _bucket ID_ to write to.
- **org** or **orgID**: _InfluxDB organization name_ or _organization ID_ to write to.
- **host**: [InfluxDB URL](/influxdb/v2/reference/urls/) or
  [InfluxDB Cloud region](/influxdb/cloud/reference/regions) URL.
- **token**: [InfluxDB API token](/influxdb/v2/security/tokens/).

##### Write options
- [Write data to InfluxDB](#write-data-to-influxdb)
- [Write pivoted data to InfluxDB](#write-pivoted-data-to-influxdb)

---

## Write data to InfluxDB
Use [`to()`](/flux/v0/stdlib/influxdata/influxdb/to/) to write data structured using the standard 
[InfluxDB v2.x and InfluxDB Cloud data structure](/influxdb/v2/reference/key-concepts/data-elements/).
Data must include, at a minimum, the following columns:

- `_time`
- `_measurement`
- `_field`
- `_value`

_All other columns are written to InfluxDB as [tags](/influxdb/v2/reference/key-concepts/data-elements/#tags)._

Given the following input [stream of tables](/flux/v0/get-started/data-model/#stream-of-tables):

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

`to()` generates the following [line protocol](/influxdb/v2/reference/syntax/line-protocol/)
and writes it to InfluxDB:

```
m,id=001,loc=SF temp=72.1,hum=40.5 1609459200000000000
m,id=001,loc=SF temp=71.8,hum=50.1 1609462800000000000
m,id=001,loc=SF temp=71.2,hum=52.8 1609466400000000000
```

### Example: Write data to a bucket

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[In the same org](#)
[In a different org](#)
[On a remote host](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```js
data
    |> to(bucket: "example-bucket")
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```js
data
    |> to(bucket: "example-bucket", org: "example-org", token: "mY5uPeRs3Cre7tok3N")
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```js
data
    |> to(
        bucket: "example-bucket",
        org: "example-org",
        token: "mY5uPeRs3Cre7tok3N",
        host: "https://myinfluxdbdomain.com/8086",
    )
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

## Write pivoted data to InfluxDB
Use [`experimental.to()`](/flux/v0/stdlib/experimental/to/) to write
[pivoted](/flux/v0/stdlib/universe/pivot/) data to InfluxDB.
Input data must have the following columns:

- `_time`
- `_measurement`

All columns **in the [group key](/flux/v0/get-started/data-model/#group-key)**
other than `_time` and `_measurement` are written to InfluxDB as [tags](/influxdb/v2/reference/key-concepts/data-elements/#tags).
Columns **not in the group key** are written to InfluxDB as [fields](/influxdb/v2/reference/key-concepts/data-elements/#fields).

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

Given the following input [stream of tables](/flux/v0/get-started/data-model/#stream-of-tables):

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

`experimental.to()` generates the following [line protocol](/influxdb/v2/reference/syntax/line-protocol/)
and writes it to InfluxDB:

```
m,id=001,loc=FR min=2i,max=6i,mean=4 1609459200000000000
m,id=001,loc=FR min=2i,max=18i,mean=10 1609462800000000000
m,id=001,loc=FR min=1i,max=13i,mean=7 1609466400000000000
m,id=001,loc=BK min=4i,max=4i,mean=4 1609459200000000000
m,id=001,loc=BK min=3i,max=5i,mean=4 1609462800000000000
m,id=001,loc=BK min=5i,max=3i,mean=6.5 1609466400000000000
```

### Example: Write pivoted data to InfluxDB

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[In the same org](#)
[In a different org](#)
[On a remote host](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```js
import "experimental"

data
    |> experimental.to(bucket: "example-bucket")
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```js
import "experimental"

data
    |> experimental.to(bucket: "example-bucket", org: "example-org", token: "mY5uPeRs3Cre7tok3N")
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```js
import "experimental"

data
    |> experimental.to(
        bucket: "example-bucket",
        org: "example-org",
        token: "mY5uPeRs3Cre7tok3N",
        host: "https://myinfluxdbdomain.com/8086",
    )
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}
