---
title: Create a database
description: >
  Use the [`influxctl database create` command](/influxdb3/clustered/reference/cli/influxctl/database/create/) to create a new InfluxDB database in your InfluxDB cluster.
  Provide a database name and an optional retention period.
menu:
  influxdb3_clustered:
    parent: Manage databases
weight: 201
list_code_example: |
  <!--pytest.mark.skip-->
  ##### CLI

  ```sh
  influxctl database create \
    --retention-period 30d \
    --max-tables 500 \
    --max-columns 250 \
    DATABASE_NAME
  ```
related:
  - /influxdb3/clustered/reference/cli/influxctl/database/create/
  - /influxdb3/clustered/admin/custom-partitions/
---

Use the [`influxctl database create` command](/influxdb3/clustered/reference/cli/influxctl/database/create/)
to create a database in your {{< product-name omit=" Clustered" >}} cluster.

1.  If you haven't already, [download and install the `influxctl` CLI](/influxdb3/clustered/reference/cli/influxctl/#download-and-install-influxctl).
2.  Run the `influxctl database create` command and provide the following:

    - _Optional:_ Database [retention period](/influxdb3/clustered/admin/databases/#retention-periods)
      _(default is infinite)_
    - _Optional_: Database table (measurement) limit _(default is 500)_
    - _Optional_: Database column limit _(default is 250)_
    - _Optional_: [InfluxDB tags](/influxdb3/clustered/reference/glossary/#tag)
      to use in the partition template
    - _Optional_: [InfluxDB tag buckets](/influxdb3/clustered/admin/custom-partitions/partition-templates/#tag-bucket-part-templates)
      to use in the partition template
    - _Optional_: A [Rust strftime date and time string](/influxdb3/clustered/admin/custom-partitions/partition-templates/#time-part-templates)
      that specifies the time format in the partition template and determines
      the time interval to partition by _(default is `%Y-%m-%d`)_
    - Database name _(see [Database naming restrictions](#database-naming-restrictions))_

    > [!Note]
    > _{{< product-name >}} supports up to 7 total tags or tag buckets in the partition template._

<!--Allow fail for database create and delete: namespaces aren't reusable-->
<!--pytest.mark.skip-->

{{% code-placeholders "DATABASE_NAME|30d|500|200" %}}

```sh
influxctl database create \
  --retention-period 30d \
  --max-tables 500 \
  --max-columns 250 \
  --template-tag tag1 \
  --template-tag tag2 \
  --template-tag-bucket tag3,100 \
  --template-tag-bucket tag4,300 \
  --template-timeformat '%Y-%m-%d' \
  DATABASE_NAME
```

{{% /code-placeholders %}}

- [Retention period syntax](#retention-period-syntax)
- [Database naming restrictions](#database-naming-restrictions)
- [InfluxQL DBRP naming convention](#influxql-dbrp-naming-convention)
- [Table and column limits](#table-and-column-limits)
  - [Table limit](#table-limit)
  - [Column limit](#column-limit)
  - [Custom partitioning](#custom-partitioning)

## Retention period syntax

Use the `--retention-period` flag to define a specific
[retention period](/influxdb3/clustered/admin/databases/#retention-periods)
for the database.
The retention period value is a time duration value made up of a numeric value
plus a duration unit.
For example, `30d` means 30 days.
A zero duration (`0d`) retention period is infinite and data won't expire.
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

## Database naming restrictions

Database names must adhere to the following naming restrictions:

- Cannot contain whitespace, punctuation, or special characters.
  Only alphanumeric, underscore (`_`), dash (`-`), and forward-slash
  (`/`) characters are permitted.
- Should not start with an underscore (`_`).
- Maximum length of 64 characters.

## InfluxQL DBRP naming convention

In InfluxDB 1.x, data is stored in [databases](/influxdb/v1/concepts/glossary/#database)
and [retention policies](/influxdb/v1/concepts/glossary/#retention-policy-rp).
In {{% product-name %}}, databases and retention policies have been merged into
_databases_, where databases have a retention period, but retention policies
are no longer part of the data model.
Because InfluxQL uses the 1.x data model, a database must be mapped to a v1
database and retention policy (DBRP) to be queryable with InfluxQL.

**When naming a database that you want to query with InfluxQL**, use the following
naming convention to automatically map v1 DBRP combinations to an {{% product-name %}} database:

```text
database_name/retention_policy_name
```

##### Database naming examples

| v1 Database name | v1 Retention Policy name | New database name         |
| :--------------- | :----------------------- | :------------------------ |
| db               | rp                       | db/rp                     |
| telegraf         | autogen                  | telegraf/autogen          |
| webmetrics       | 1w-downsampled           | webmetrics/1w-downsampled |

## Table and column limits

In {{< product-name >}}, table (measurement) and column limits can be
configured using the `--max-tables` and `--max-columns` flags.

### Table limit

**Default maximum number of tables**: 500

Each measurement is represented by a table in a database.
Your database's table limit can be raised beyond the default limit of 500.
InfluxData has production examples of clusters with 20,000+ active tables across
multiple databases.

> [!Warning]
> #### Excessive table counts can impact performance and stability
> 
> High table counts, especially those concurrently receiving writes and queries,
> can increase catalog overhead which can affect performance and stability.
> What constitutes "excessive" depends on multiple factors such as query latency
> requirements, write bandwidth, and cluster capacity to handle rapid backfills.
> If you're considering more than doubling the default limit, test your
> configuration thoroughly.

Increasing your table limit affects your {{% product-name omit=" Clustered" %}}
cluster in the following ways:

{{< expand-wrapper >}}
{{% expand "**May improve query performance** <em style='opacity:.5;font-weight:normal;'>View more info</em>" %}}

Schemas with many measurements that contain
[focused sets of tags and fields](/influxdb3/clustered/write-data/best-practices/schema-design/#design-for-performance) can make it easier for the query engine to
identify what partitions contain the queried data, resulting in better
query performance.

{{% /expand %}}
{{% expand "**More PUTs into object storage** <em style='opacity:.5;font-weight:normal;'>View more info</em>" %}}

By default, {{< product-name >}} partitions
data by measurement and time range and stores each partition as a Parquet
file in your cluster's object store. By increasing the number of measurements
(tables) you can store in your database, you also increase the potential for
more `PUT` requests into your object store as InfluxDB creates more partitions.
Each `PUT` request incurs a monetary cost and will increase the operating cost of
your cluster.

{{% /expand %}}
{{% expand "**More work for the compactor** <em style='opacity:.5;font-weight:normal;'>View more info</em>" %}}

To optimize storage over time, your {{< product-name omit=" Clustered" >}}
cluster contains a compactor that routinely compacts Parquet files in object storage.
With more tables and partitions to compact, the compactor may need to be scaled
(either vertically or horizontally) to keep up with demand, adding to the
operating cost of your cluster.

{{% /expand %}}
{{< /expand-wrapper >}}

### Column limit

**Default maximum number of columns**: 250

Time, fields, and tags are each represented by a column in a table.
Increasing your column limit affects your {{% product-name omit=" Clustered" %}}
cluster in the following ways:

{{< expand-wrapper >}}
{{% expand "May adversely affect query performance" %}}

At query time, the InfluxDB query engine identifies what table contains the queried
data and then evaluates each row in the table to match the conditions of the query.
The more columns that are in each row, the longer it takes to evaluate each row.

Through performance testing, InfluxData has identified 250 columns as the
threshold beyond which query performance may be affected
(depending on the shape of and data types in your schema).

{{% /expand %}}
{{< /expand-wrapper >}}

### Custom partitioning

{{< product-name >}} lets you define a custom partitioning strategy for each database.
A _partition_ is a logical grouping of data stored in [Apache Parquet](https://parquet.apache.org/)
format in the InfluxDB 3 storage engine. By default, data is partitioned by day,
but, depending on your schema and workload, customizing the partitioning
strategy can improve query performance.

Use the `--template-tag`, `--template-tag-bucket, and `--template-timeformat`
flags to define partition template parts used to generate partition keys for the database.
For more information, see [Manage data partitioning](/influxdb3/clustered/admin/custom-partitions/).

> [!Warning]
> #### Partition templates can only be applied on create
> 
> You can only apply a partition template when creating a database.
> You can't update a partition template on an existing database.
