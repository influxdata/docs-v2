---
title: Update a database
description: >
  Use the [`influxctl database update` command](/influxdb/cloud-dedicated/reference/cli/influxctl/database/update/)
  to update a database in your InfluxDB Cloud Dedicated cluster.
menu:
  influxdb_cloud_dedicated:
    parent: Manage databases
weight: 201
list_code_example: |
  ```sh
  influxctl database update DATABASE_NAME \
    --retention-period 30d \
    --max-tables 500 \
    --max-tables 250
  ```
related:
  - /influxdb/cloud-dedicated/reference/cli/influxctl/database/update/
---

Use the [`influxctl database update` command](/influxdb/cloud-dedicated/reference/cli/influxctl/database/update/)
to update a database in your {{< product-name omit=" Clustered" >}} cluster.

1.  If you haven't already, [download and install the `influxctl` CLI](/influxdb/cloud-dedicated/reference/cli/influxctl/#download-and-install-influxctl).
2.  Run the `influxctl database update` command and provide the following:

    - Database name
    - _Optional_: Database [retention period](/influxdb/cloud-dedicated/admin/databases/#retention-periods)
      _(default is infinite)_
    - _Optional_: Database table (measurement) limit _(default is 500)_
    - _Optional_: Database column limit _(default is 250)_

{{% code-placeholders "DATABASE_NAME|30d|500|200" %}}
```sh
influxctl database update DATABASE_NAME \
  --retention-period 30d \
  --max-tables 500 \
  --max-tables 250
```
{{% /code-placeholders %}}

{{% warn %}}
#### Database names can't be updated

The `influxctl database update` command uses the database name to identify which
database to apply updates to. The database name itself can't be updated.
{{% /warn %}}

- [Retention period syntax](#retention-period-syntax)
- [Database naming restrictions](#database-naming-restrictions)
- [InfluxQL DBRP naming convention](#influxql-dbrp-naming-convention)
- [Table and column limits](#table-and-column-limits)

## Retention period syntax

Use the `--retention-period` flag to define a specific
[retention period](/influxdb/cloud-dedicated/admin/databases/#retention-periods)
for the database.
The retention period value is a time duration value made up of a numeric value
plus a duration unit. For example, `30d` means 30 days.
A zero duration retention period is infinite and data will not expire.
The retention period value cannot be negative or contain whitespace.

{{< flex >}}
{{% flex-content %}}

##### Valid durations units include

- **m**: minute
- **h**: hour
- **d**: day
- **w**: week
- **mo**: month
- **y**: year

{{% /flex-content %}}
{{% flex-content %}}

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

- Must contain two or more characters
- Cannot start with an underscore (`_`)
- Cannot contain whitespace characters, double quotes (`"`), or percent signs (`%`)

## InfluxQL DBRP naming convention

In InfluxDB 1.x, data is stored in [databases](/influxdb/v1/concepts/glossary/#database)
and [retention policies](/influxdb/v1/concepts/glossary/#retention-policy-rp).
In InfluxDB Cloud Dedicated, databases and retention policies have been merged into
_databases_, where databases have a retention period, but retention policies
are no longer part of the data model.
Because InfluxQL uses the 1.x data model, a database must be mapped to a v1
database and retention policy (DBRP) to be queryable with InfluxQL.

**When naming a database that you want to query with InfluxQL**, use the following
naming convention to automatically map v1 DBRP combinations to a database:

```sh
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
Each measurement is represented by a table.
Time, fields, and tags are each represented by a column.

**Default maximum number of tables**: 500  
**Default maximum number of columns**: 250

{{% warn %}}
Setting table and column limits above the default limits may adversely affect
database performance.
{{% /warn %}}
