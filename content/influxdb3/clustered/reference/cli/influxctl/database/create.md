---
title: influxctl database create
description: >
  The `influxctl database create` command creates a new database in an InfluxDB cluster.
menu:
  influxdb3_clustered:
    parent: influxctl database
weight: 301
related:
  - /influxdb3/clustered/admin/custom-partitions/define-custom-partitions/
  - /influxdb3/clustered/admin/custom-partitions/partition-templates/
---

The `influxctl database create` command creates a new database with a specified
retention period in an {{< product-name omit=" Clustered" >}} cluster.

The retention period defines the maximum age of data retained in the database,
based on the timestamp of the data.
The retention period value is a time duration value made up of a numeric value
plus a duration unit. For example, `30d` means 30 days.
A zero duration retention period is infinite and data will not expire.
The retention period value cannot be negative or contain whitespace.

{{< flex >}}
{{% flex-content "half" %}}

##### Valid durations units include

- **m**: minute
- **h**: hour
- **d**: day
- **w**: week
- **mo**: month
- **y**: year

{{% /flex-content %}}
{{% flex-content "half" %}}

##### Example retention period values

- `0d`: infinite/none
- `3d`: 3 days
- `6w`: 6 weeks
- `1mo`: 1 month (30 days)
- `1y`: 1 year
- `30d30d`: 60 days
- `2.5d`: 60 hours

{{% /flex-content %}}
{{< /flex >}}

#### Custom partitioning

You can override the default partition template (`%Y-%m-%d`) of the database
with the `--template-tag`, `--template-tag-bucket`, and `--template-timeformat`
flags when you create the database.
Provide a time format using [Rust strftime](/influxdb3/clustered/admin/custom-partitions/partition-templates/#time-part-templates), partition by specific tag, or partition tag values
into a specified number of "buckets."
Each of these can be used as part of the partition template.
Be sure to follow [partitioning best practices](/influxdb3/clustered/admin/custom-partitions/best-practices/).

> [!Note]
> #### Always provide a time format when using custom partitioning
> 
> If defining a custom partition template for your database with any of the
> `--template-*` flags, always include the `--template-timeformat` flag with a
> time format to use in your partition template.
> Otherwise, InfluxDB omits time from the partition template and won't compact partitions.

> [!Warning]
> #### Wait before writing to a new database with the same name as a deleted database
>
> After deleting a database from your {{% product-name omit=" Clustered" %}}
> cluster, you can reuse the name to create a new database, but **wait two to
> three minutes** after deleting the previous database before writing to the new
> database to allow write caches to clear.

## Usage

<!--Skip tests for database create and delete: namespaces aren't reusable-->
<!--pytest.mark.skip-->

```sh
influxctl database create [flags] <DATABASE_NAME>
```

## Arguments

| Argument          | Description            |
| :---------------- | :--------------------- |
| **DATABASE_NAME** | InfluxDB database name |

## Flags

| Flag |                         | Description                                                                                                                              |
| :--- | :---------------------- | :--------------------------------------------------------------------------------------------------------------------------------------- |
|      | `--retention-period`    | [Database retention period ](/influxdb3/clustered/admin/databases/#retention-periods)(default is `0s`, infinite)                                                                                    |
|      | `--max-tables`          | [Maximum tables per database](/influxdb3/clustered/admin/databases/#table-limit) (default is 500, `0` uses default)                                                                             |
|      | `--max-columns`         | [Maximum columns per table](/influxdb3/clustered/admin/databases/#column-limit) (default is 250, `0` uses default)                                                                               |
|      | `--template-tag`        | Tag to add to partition template (can include multiple of this flag)                                                                     |
|      | `--template-tag-bucket` | Tag and number of buckets to partition tag values into separated by a comma--for example: `tag1,100` (can include multiple of this flag) |
|      | `--template-timeformat` | Timestamp format for partition template (default is `%Y-%m-%d`)                                                                          |
| `-h` | `--help`                | Output command help                                                                                                                      |

{{% caption %}}
_Also see [`influxctl` global flags](/influxdb3/clustered/reference/cli/influxctl/#global-flags)._
{{% /caption %}}

## Examples

- [Create a database with an infinite retention period](#create-a-database-with-an-infinite-retention-period)
- [Create a database with a 30-day retention period](#create-a-database-with-a-30-day-retention-period)
- [Create a database with non-default table and column limits](#create-a-database-with-non-default-table-and-column-limits)
- [Create a database with a custom partition template](#create-a-database-with-a-custom-partition-template)

### Create a database with an infinite retention period

<!--Skip tests for database create and delete: namespaces aren't reusable-->
<!--pytest.mark.skip-->

```sh
influxctl database create mydb
```

### Create a database with a 30-day retention period

<!--Skip tests for database create and delete: namespaces aren't reusable-->
<!--pytest.mark.skip-->

```sh
influxctl database create \
  --retention-period 30d \
  mydb
```

### Create a database with non-default table and column limits

<!--Skip tests for database create and delete: namespaces aren't reusable-->
<!--pytest.mark.skip-->

```sh
influxctl database create \
  --max-tables 200 \
  --max-columns 150 \
  mydb
```

### Create a database with a custom partition template

The following example creates a new `mydb` database and applies a partition
template that partitions by two tags (`room` and `sensor-type`) and by day using
the time format `%Y-%m-%d`:

<!--Skip tests for database create and delete: namespaces aren't reusable-->
<!--pytest.mark.skip-->

```sh
influxctl database create \
  --template-tag room \
  --template-tag sensor-type \
  --template-tag-bucket customerID,1000 \
  --template-timeformat '%Y-%m-%d' \
  mydb
```

_For more information about custom partitioning, see
[Manage data partitioning](/influxdb3/clustered/admin/custom-partitions/)._

{{% expand "View command updates" %}}

#### v2.7.0 {date="2024-03-26"}

- Introduce the `--template-tag-bucket` flag to group tag values into buckets
  and partition by each tag bucket.

#### v2.5.0 {date="2024-03-04"}

- Introduce the `--template-tag` and `--template-timeformat` flags that define
  a custom partition template for a database.

{{% /expand %}}
