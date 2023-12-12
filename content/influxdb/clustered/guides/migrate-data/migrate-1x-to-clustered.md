---
title: Migrate data from InfluxDB 1.x to InfluxDB Clustered
description: >
  To migrate data from a TSM-powered InfluxDB 1.x (OSS or Enterprise) to an
  InfluxDB cluster, export the data as line protocol and
  write the exported data to your InfluxDB Clustered database.
menu:
  influxdb_clustered:
    name: Migrate from 1.x to Clustered
    parent: Migrate data
weight: 103
related:
  - /influxdb/clustered/admin/databases/
  - /influxdb/clustered/admin/tokens/
  - /influxdb/clustered/primers/api/v1/
  - /influxdb/clustered/primers/api/v2/
alt_links:
  cloud-serverless: /influxdb/cloud-serverless/guides/migrate-data/migrate-1x-to-serverless/
  cloud-dedicated: /influxdb/cloud-dedicated/guides/migrate-data/migrate-1x-to-cloud-dedicated/
---

To migrate data from an InfluxDB 1.x OSS or Enterprise instance to InfluxDB Clustered,
export the data as line protocol and write the exported data to an InfluxDB database.

<!-- BEGIN TOC -->

- [Before you migrate](#before-you-migrate)
- [Tools to use](#tools-to-use)
- [Migrate data](#migrate-data)

<!-- END TOC -->

## Before you migrate

Before you migrate from InfluxDB 1.x to {{< product-name >}}, there
are schema design practices supported by the TSM storage engine that are not
supported in the InfluxDB v3 storage engine. Specifically, InfluxDB v3 enforces the following schema restrictions:

- You can't use duplicate names for tags and fields.
- By default, measurements can contain up to 250 columns where each column
  represents time, a field, or a tag.

_For more information, see [Schema restrictions](/influxdb/clustered/write-data/best-practices/schema-design/#schema-restrictions)._

If your schema does not adhere to these restrictions, you must update your schema
before migrating to {{< product-name >}}.

{{< expand-wrapper >}}
{{% expand "Fix duplicate tag and field names" %}}

If your current schema in InfluxDB 1.x includes tags and fields with the same
name, rename either the duplicate tag key or field key.
The simplest way to do this is to directly modify the line protocol exported in
[step 1 of Migrate data below](#migrate-data-step-1) before writing it to
{{< product-name >}}.

For example, the following line protocol includes both a tag and field named `temp`.

```
home,room=Kitchen,temp=F co=0i,hum=56.6,temp=71.0 1672531200000000000
```

To be able to write this line protocol to {{< product-name >}}, update the `temp`
tag key to `tempScale`:

```
home,room=Kitchen,tempScale=F co=0i,hum=56.6,temp=71.0 1672531200000000000
```

{{% /expand %}}
{{% expand "Fix measurements with more than 250 total columns" %}}

If in your current schema, the total number of tags, fields, and time
columns in a single measurement exceeds 250, we recommend updating your schema
before migrating to {{< product-name >}}.

Although you can [increase the column limit](/influxdb/clustered/admin/databases/create/#table-and-column-limits)
per measurement when creating a database, it may adversely affect query performance.

Because tags are metadata used to identify specific series, we recommend
splitting groups of fields across multiple measurements.

**In your InfluxDB 1.x instance**:

1.  [Create a new database](/influxdb/v1/query_language/manage-database/#create-database)
    to store the modified data in.
2.  Identify what fields could be grouped together in a measurement and not exceed
    the 250 column limit.
3.  Query each group of fields from the existing database and write them into a
    unique measurement in the new database:

{{< flex >}}
{{% flex-content "half" %}}

##### Write one set of fields to a new measurement

```sql
SELECT 
  field1,
  field2,
  field3,
  field4
INTO
  "new-database".."new-measurement-1"
FROM
  "example-measurement"
GROUP BY *
```

{{% /flex-content %}}
{{% flex-content "half" %}}

##### Write another set of fields to new measurement

```sql
SELECT 
  field5,
  field6,
  field7,
  field8
INTO
  "new-database".."new-measurement-2"
FROM
  "example-measurement"
GROUP BY *
```

{{% /flex-content %}}
{{< /flex >}}

When exporting your data as line protocol in [step 1 of Migrate data below](#migrate-data-step-1),
only export the newly created database that contains measurements with separate
groups of fields.

#### If duplicating data is not feasible

If duplicating data into a new database isn't feasible, you can directly modify
the [exported line protocol](#migrate-data-step-1) to group certain fields into
unique measurements.
For example:

```
example-measurement field1=0,field2=0,field3=0,field4=0,field5=0,field6=0,field7=0,field8=0 1672531200000000000
```

Would become:

```
new-measurement-1 field1=0,field2=0,field3=0,field4=0 1672531200000000000
new-measurement-2 field5=0,field6=0,field7=0,field8=0 1672531200000000000
```

{{% /expand %}}
{{< /expand-wrapper >}}

## Tools to use

The migration process uses the following tools:

- **`influx_inspect` utility**:
  The [`influx_inspect` utility](/influxdb/v1/tools/influx_inspect/#export)
  is packaged with InfluxDB 1.x OSS and Enterprise.
- **[`influxctl` admin CLI](/influxdb/clustered/reference/cli/influxctl/)**.
- [v1 API `/write` endpoint](/influxdb/clustered/primers/api/v1/) or [v2 API `/api/v2/write` endpoint](/influxdb/clustered/primers/api/v2/) and API client libraries.


## Migrate data

<span id="migrate-data-step-1"></span>

1. **Export data from your InfluxDB 1.x instance as line protocol.**

    Use the **InfluxDB 1.x `influx_inspect export` utility** to export data as
    line protocol and store it in a file.
    Include the following:

    - ({{< req "Required" >}}) `-lponly` flag to export line protocol without InfluxQL DDL or DML.
    - ({{< req "Required" >}}) `-out` flag with a path to an output file.
      Default is `~/.influxdb/export`. _Any subsequent export commands without
      the output file defined will overwrite the existing export file._
    - `-compress` flag to use gzip to compress the output.
    - `-datadir` flag with the path to your InfluxDB 1.x `data` directory.
      Only required if the `data` directory is at a non-default location.
      For information about default locations, see
      [InfluxDB OSS 1.x file system layout](/influxdb/v1/concepts/file-system-layout/#file-system-layout)
      or [InfluxDB Enterprise 1.x file system layout](/enterprise_influxdb/v1/concepts/file-system-layout/#file-system-layout).
    - `-waldir` flag with the path to your InfluxDB 1.x `wal` directory.
      Only required if the `wal` directory is at a non-default location.
      For information about default locations, see
      [InfluxDB OSS 1.x file system layout](/influxdb/v1/concepts/file-system-layout/#file-system-layout)
      or [InfluxDB Enterprise 1.x file system layout](/enterprise_influxdb/v1/concepts/file-system-layout/#file-system-layout).
    - `-database` flag with a specific database name to export.
      By default, all databases are exported.
    - `-retention` flag with a specific retention policy to export.
      By default, all retention policies are exported.
    - `-start` flag with an RFC3339 timestamp that defines the earliest time to export.
      Default is `1677-09-20T16:27:54-07:44`.
    - `-end` flag with an RFC3339 timestamp that defines the latest time to export.
      Default is `2262-04-11T16:47:16-07:00`.

    {{% note %}}
We recommend exporting each database and retention policy combination separately
to easily write the exported data into corresponding InfluxDB Clustered
databases.
    {{% /note %}}

    ##### Export all data in a database and retention policy to a file
    ```sh
    influx_inspect export \
      -lponly \
      -database example-db \
      -retention example-rp \
      -out path/to/export-file.lp
    ```

    ##### View more export command examples:
    {{< expand-wrapper >}}
{{% expand "Export all data to a file" %}}

```sh
influx_inspect export \
  -lponly \
  -out path/to/export-file.lp.gzip
```

{{% /expand %}}

{{% expand "Export all data to a compressed file" %}}

```sh
influx_inspect export \
  -lponly \
  -compress \
  -out path/to/export-file.lp.gzip
```

{{% /expand %}}

{{% expand "Export data within time bounds to a file" %}}

```sh
influx_inspect export \
  -lponly \
  -start 2020-01-01T00:00:00Z \
  -end 2023-01-01T00:00:00Z \
  -out path/to/export-file.lp
```

{{% /expand %}}

{{% expand "Export a database and all its retention policies to a file" %}}

```sh
influx_inspect export \
  -lponly \
  -database example-db \
  -out path/to/export-file.lp
```

{{% /expand %}}

{{% expand "Export a specific database and retention policy to a file" %}}

```sh
influx_inspect export \
  -lponly \
  -database example-db \
  -retention example-rp \
  -out path/to/export-file.lp
```

{{% /expand %}}

{{% expand "Export all data from _non-default_ `data` and `wal` directories" %}}

```sh
influx_inspect export \
  -lponly \
  -datadir path/to/influxdb/data/ \
  -waldir path/to/influxdb/wal/ \
  -out path/to/export-file.lp
```

{{% /expand %}}
    {{< /expand-wrapper >}}

2. Create InfluxDB Clustered databases for each InfluxDB 1.x database and retention policy combination.

    {{% note %}}
**If coming from InfluxDB v1**, the concepts of databases and retention policies
have been combined into a single concept--database. Retention policies are no
longer part of the InfluxDB data model. However, InfluxDB Clustered does
support InfluxQL, which requires databases and retention policies.
See [InfluxQL DBRP naming convention](/influxdb/clustered/admin/databases/create/#influxql-dbrp-naming-convention).

**If coming from InfluxDB v2, InfluxDB Cloud (TSM), or InfluxDB Cloud Serverless**,
_database_ and _bucket_ are synonymous.
    {{% /note %}}

    {{< expand-wrapper >}}
{{% expand "View example 1.x databases and retention policies as InfluxDB Clustered databases" %}}
If you have the following InfluxDB 1.x data structure:

- example-db <span style="opacity:.5;">_(database)_</span>
  - autogen <span style="opacity:.5;">_(retention policy)_</span>
  - historical-1mo <span style="opacity:.5;">_(retention policy)_</span>
  - historical-6mo <span style="opacity:.5;">_(retention policy)_</span>
  - historical-1y <span style="opacity:.5;">_(retention policy)_</span>

You would create the following InfluxDB {{< current-version >}} databases:

- example-db/autogen
- example-db/historical-1mo
- example-db/historical-6mo
- example-db/historical-1y

{{% /expand %}}
    {{< /expand-wrapper >}}

    Use the [`influxctl database create` command](/influxdb/clustered/reference/cli/influxctl/database/create/)
    to [create a database](/influxdb/clustered/admin/databases/create/) in your InfluxDB cluster.

    Provide the following arguments:

    - _(Optional)_ Database [retention period](/influxdb/clustered/admin/databases/#retention-periods)
      (default is infinite)
    - Database name _(see [Database naming restrictions](#database-naming-restrictions))_

    ```sh
    influxctl database create --retention-period 30d <DATABASE_NAME>
    ```

    To learn more about databases in InfluxDB Clustered, see [Manage databases](/influxdb/clustered/admin/databases/).

3. **Create a database token for writing to your InfluxDB Clustered database.**

    Use the [`influxctl token create` command](/influxdb/clustered/admin/tokens/create/)
    to [create a database token](/influxdb/clustered/admin/tokens/create/) with
    _write_ permission to your database.

    Provide the following:

    - Permission grants
      - `--read-database`: Grants read access to a database
      - `--write-database` Grants write access to a database
    - Token description

    ```sh
    influxctl token create \
      --read-database example-db \
      --write-database example-db \
      "Read/write token for example-db database"
    ```

4. **Write the exported line protocol to your InfluxDB cluster.**
    
    Use the v1 API or v2 API endpoints to write data to your InfluxDB cluster.

    Choose from the following options:

    - The [v1 API `/write` endpoint](/influxdb/clustered/primers/api/v1/) with v1 client libraries or HTTP clients.
    - The [v2 API `/api/v2/write` endpoint](/influxdb/clustered/primers/api/v2/) with v2 client libraries or HTTP clients.
    
    Write each export file to the target database.

    {{% warn %}}
  #### v2.x influx CLI not supported

  Don't use the `influx` CLI with InfluxDB Clustered.
  While it may coincidentally work, it isn't officially supported.

  For help finding the best workflow for your situation, [contact Support](https://support.influxdata.com/).
    {{% /warn %}}
