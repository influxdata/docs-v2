---
title: Create a database
description: >
  Use the [`influxctl database create` command](/influxdb/clustered/reference/cli/influxctl/database/create/)
  to create a new InfluxDB database in your InfluxDB cluster.
  Provide a database name and an optional retention period.
menu:
  influxdb_clustered:
    parent: Manage databases
weight: 201
list_code_example: |
  ```sh
  influxctl database create --retention-period 30d <DATABASE_NAME>
  ```
---

Use the [`influxctl database create` command](/influxdb/clustered/reference/cli/influxctl/database/create/)
to create a database in your InfluxDB cluster.

1.  If you haven't already, [download and install the `influxctl` CLI](/influxdb/clustered/reference/cli/influxctl/#download-and-install-influxctl).
2.  Run the `influxctl database create` command and provide the following:

    - _(Optional)_ Database [retention period](/influxdb/clustered/admin/databases/#retention-periods)
      (default is infinite)
    - Database name _(see [Database naming restrictions](#database-naming-restrictions))_

```sh
influxctl database create --retention-period 30d <DATABASE_NAME>
```

{{% warn %}}
#### Retention periods cannot be updated

Retention periods cannot be changed after a database is created.
To move to a different retention period, create a new database with the retention
period you want and migrate existing data to the new database.
{{% /warn %}}

- [Retention period syntax](#retention-period-syntax)
- [Database naming restrictions](#database-naming-restrictions)
- [InfluxQL DBRP naming convention](#influxql-dbrp-naming-convention)

## Retention period syntax

Use the `--retention-period` flag to define a specific
[retention period](/influxdb/clustered/admin/databases/#retention-periods)
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

In InfluxDB 1.x, data is stored in [databases](/{{< latest "influxdb" "v1" >}}/concepts/glossary/#database)
and [retention policies](/{{< latest "influxdb" "v1" >}}/concepts/glossary/#retention-policy-rp).
In InfluxDB Clustered, databases and retention policies have been merged into
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
