---
title: Query InfluxDB
list_title: InfluxDB
description: >
  Use [`from()`](/flux/v0.x/stdlib/universe/from/) and [`range`](/flux/v0.x/stdlib/universe/range/)
  to query data from InfluxDB using Flux.
menu:
  flux_0_x:
    name: InfluxDB
    parent: Query data sources
weight: 101
related:
  - /influxdb/cloud/query-data/optimize-queries/, Optimize Flux queries for InfluxDB
list_code_example: |
  ```js
  from(bucket: "example-bucket")
    |> range(start: -1h)
  ```
---

To query data from InfluxDB using Flux, use [`from()`](/flux/v0.x/stdlib/universe/from/)
and [`range`](/flux/v0.x/stdlib/universe/range/).
Provide the following parameters to each function:

- **from()**:
  - **bucket** or **bucketID**: _InfluxDB bucket name_ or _bucket ID_ to query.
- **range()**:
  - **start**: Earliest time to return results from.

{{% note %}}
InfluxDB requires queries to be time-bound, so `from()` must always be followed by
[`range()`](/flux/v0.x/stdlib/universe/range/).
{{% /note %}}

```js
from(bucket: "example-bucket")
  |> range(start: -1h)
```



## Query InfluxDB Cloud or 2.x remotely
To query InfluxDB Cloud or 2.x remotely, provide the following parameters
in addition to **bucket** or **bucketID**.

- **host**: [InfluxDB Cloud region URL](/influxdb/cloud/reference/urls/) or
  [InfluxDB URL](/{{< latest "influxdb" >}}/reference/urls/)
- **org** or **orgID**: InfluxDB organization name or ID
- **token**: InfluxDB [authentication token](/influxdb/cloud/security/tokens/)

```js
from(
  bucket: "example-bucket",
  host: "http://localhost:8086",
  org: "example-org",
  token: "mYSup3r5Ecr3T70keN"
)
```

## Query InfluxDB 1.x
To query InfluxDB 1.x, use the `database-name/retention-policy-name` naming
convention for your bucket name.
For example, to query data from the `autogen` retention policy in the `telegraf` database:

```js
from(bucket: "telegraf/autogen")
  |> range(start: -30m)
```

To query the [default retention policy](/{{< latest "influxdb" "v1" >}}/query_language/manage-database/#create-a-retention-policy) in a database, use the same bucket naming
convention, but do not provide a retention policy:

```js
from(bucket: "telegraf/")
  |> range(start: -30m)
```


## Results structure
`from()` and `range()` return a [stream of tables](/flux/v0.x/get-started/data-structure/#stream-of-tables)
grouped by [series](/influxdb/cloud/reference/glossary/#series)
(measurement, tag set, and field).
Each table includes the following columns:

- **_start**: Query range start time (defined by `range()`)
- **_stop**: Query range stop time (defined by `range()`)
- **_time**: Data timestamp
- **_measurement**: Measurement name
- **_field**: Field key
- **_value**: Field value
- **Tag columns**: A column for each tag where the column label is the tag key
  and the column value is the tag value

{{% note %}}
#### Columns with the underscore prefix
Columns with the underscore (`_`) prefix are considered "system" columns.
Some Flux functions require these columns.
{{% /note %}}

### Example InfluxDB query results

{{% caption %}}
Hover over highlighted text to view description.
{{% /caption %}}

| _start                                                    | _stop                                                    | _time                                              | _measurement                             | {{< tooltip "Tag key" "host" >}}    | _field                            |                              _value |
| :-------------------------------------------------------- | :------------------------------------------------------- | :------------------------------------------------- | :--------------------------------------- | :---------------------------------- | :-------------------------------- | ----------------------------------: |
| 2021-01-01T00:00:00Z                                      | 2021-01-02T00:00:00Z                                     | 2021-01-01T00:00:00Z                               | foo                                      | host1                               | bar                               |                                 1.2 |
| {{< tooltip "Time range start" "2021-01-01T00:00:00Z" >}} | {{< tooltip "Time range stop" "2021-01-02T00:00:00Z" >}} | {{< tooltip "Timestamp" "2021-01-01T01:00:00Z" >}} | {{< tooltip "Measurement name" "foo" >}} | {{< tooltip "Tag value" "host1" >}} | {{< tooltip "Field key" "bar" >}} | {{< tooltip "Field value" "1.6" >}} |
| 2021-01-01T00:00:00Z                                      | 2021-01-02T00:00:00Z                                     | 2021-01-01T02:00:00Z                               | foo                                      | host1                               | bar                               |                                 2.1 |

| _start               | _stop                | _time                | _measurement | host  | _field | _value |
| :------------------- | :------------------- | :------------------- | :----------- | :---- | :----- | -----: |
| 2021-01-01T00:00:00Z | 2021-01-02T00:00:00Z | 2021-01-01T00:00:00Z | foo          | host2 | bar    |    1.2 |
| 2021-01-01T00:00:00Z | 2021-01-02T00:00:00Z | 2021-01-01T01:00:00Z | foo          | host2 | bar    |    1.7 |
| 2021-01-01T00:00:00Z | 2021-01-02T00:00:00Z | 2021-01-01T02:00:00Z | foo          | host2 | bar    |    2.1 |

{{% note %}}
#### Structure results like InfluxQL
[InfluxQL](/{{< latest "influxdb" "v1" >}}/query_language/) returns each field as
a column where the column label is the field key and the column value is the field value.
To structure results similarly with Flux, use [`pivot()`](/flux/v0.x/stdlib/universe/pivot/)
or [`schema.fieldsAsCols()`](/flux/v0.x/stdlib/influxdata/influxdb/schema/fieldsascols/)
to pivot fields into columns.
{{% /note %}}
