---
title: Import data
seotitle: Bulk import Parquet data into a database in InfluxDB 3 Enterprise
description: >
  Bulk import your existing Parquet files into a database and table in InfluxDB 3
  Enterprise using the influxdb3 import upload command, and map columns to
  InfluxDB types. Imported data is stored in your object storage.
menu:
  influxdb3_enterprise:
    name: Import data
    parent: Administer InfluxDB
weight: 107
related:
  - /influxdb3/enterprise/reference/cli/influxdb3/import/
---

Bulk import is an {{% product-name %}} feature that requires the
[PachaTree storage engine](/influxdb3/enterprise/performance-preview/)--the
default for new clusters.
On clusters that started on 3.10 or earlier, first run the
[storage engine upgrade](/influxdb3/enterprise/reference/config-options/#upgrade-pacha-tree)
(`--upgrade-pacha-tree`).
Use it to load your existing Parquet files into a database and table.
{{% product-name %}} writes the imported data to your object
storage.
The target database and table must already exist before you import your data
into them.

## How bulk import works

Bulk import reads your generic Parquet files, maps their columns to
{{% product-name %}} types, and writes the resulting rows into an existing table.
Each file becomes a separate import job.

{{% product-name %}} stores the imported data in your object storage and compacts
it automatically.
Rows become queryable after the compactor processes them, not immediately after
the upload completes.

> [!Note]
> Because imported data is queryable only after compaction, expect a delay before
> imported rows appear in query results after `influxdb3 import upload` returns.

## Import Parquet files

Use the `influxdb3 import upload` command to import one or more Parquet files.
For the complete command syntax and flags, see the
[`influxdb3 import`](/influxdb3/enterprise/reference/cli/influxdb3/import/)
CLI reference.

You can pass either of the following as the import source:

- A single Parquet file.
- A directory, which {{% product-name %}} processes recursively for `*.parquet`
  files. {{% product-name %}} creates one import job per file.

To review import jobs, use the `influxdb3 import list` command.

## Map columns to InfluxDB types

Use `--column` flags to map Parquet columns to {{% product-name %}} types.
The following types are supported:

| Type     | Description                  |
| :------- | :--------------------------- |
| `i64`    | Signed 64-bit integer field  |
| `u64`    | Unsigned 64-bit integer field |
| `f64`    | 64-bit float field           |
| `bool`   | Boolean field                |
| `string` | String field                 |
| `time`   | Timestamp                    |
| `tag`    | Tag                          |

Any Parquet column that you don't map with a `--column` flag is imported as a
field.
