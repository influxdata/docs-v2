---
title: Import data
seotitle: Bulk import Parquet data into a database in InfluxDB 3 Enterprise
description: >
  Bulk import your existing Parquet files into a database and table in InfluxDB 3
  Enterprise using the influxdb3 import upload or influxdb3 import
  from-object-store command, and map columns to InfluxDB types. Imported data
  is stored in your object storage.
menu:
  influxdb3_enterprise:
    name: Import data
    parent: Administer InfluxDB
weight: 107
related:
  - /influxdb3/enterprise/reference/cli/influxdb3/import/
---

Bulk import is an {{% product-name %}} feature that requires the
[upgraded storage engine](/influxdb3/enterprise/reference/internals/storage-engine/)—the
default for new clusters on {{% product-name %}} 3.11+.
On clusters that started on 3.10 or earlier, first run the
[storage engine upgrade](/influxdb3/enterprise/reference/config-options/#upgrade-pacha-tree)
(`--upgrade-pacha-tree`).
Use bulk import to load your existing Parquet files into a database and table.
{{% product-name %}} writes the imported data to your object
storage.
The target database and table must already exist before you import your data
into them.

Bring your Parquet files in with either of the following commands:

- [`influxdb3 import upload`](/influxdb3/enterprise/reference/cli/influxdb3/import/upload/):
  Upload files from a local path, or from an object store URL that your
  machine can reach.
  File bytes stream through the `influxdb3` client.
- [`influxdb3 import from-object-store`](/influxdb3/enterprise/reference/cli/influxdb3/import/from-object-store/):
  Import files that already sit in {{% product-name %}}'s own object store, or
  in an S3 bucket.
  {{% product-name %}} reads the files itself, using its own object store
  credentials, without streaming file bytes through the client.

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
> imported rows appear in query results after an import command returns.

## Permissions

The token you use for an import command needs the following permissions:

| Command | Required action | Example permission |
| :-- | :-- | :-- |
| `influxdb3 import upload` | `write` on the target database | `db:DATABASE_NAME:write` |
| `influxdb3 import from-object-store` | `write` on the target database | `db:DATABASE_NAME:write` |
| `influxdb3 import list` | `describe` on at least one database | `db:DATABASE_NAME:describe` |

An import doesn't create the database, so the token doesn't need the `create`
action.
If the token lacks the `write` action, the import fails with HTTP status `403`
and the following message:

```text
Not authorized to import into database
```

You get this error even when the database doesn't exist.

`influxdb3 import list` returns only the import jobs for databases your token
can describe.
If your token can't describe any database, the command returns an HTTP 403
error.

For more on creating tokens with these permissions, see
[Create a resource token](/influxdb3/enterprise/admin/tokens/resource/create/).

<!-- VERIFIED against live Enterprise 3.12.0-0.rc.2 (2026-09-30): the
permissions above match observed behavior. A non-admin token for a database
that doesn't exist got 403 "Not authorized to import into database", not 404.
The pull path (import from-object-store) was not probed with a non-admin
token. -->

## Upload Parquet files from your machine

Use the `influxdb3 import upload` command to upload one or more Parquet files.
For the complete command syntax and flags, see the
[`influxdb3 import upload`](/influxdb3/enterprise/reference/cli/influxdb3/import/upload/)
CLI reference.

You can pass either of the following as the import source:

- A single Parquet file.
- A directory, which {{% product-name %}} processes recursively for `*.parquet`
  files. {{% product-name %}} creates one import job per file.
- An object store URL, such as `s3://bucket/prefix`.
  `influxdb3` reads credentials from the environment; use `--source-opt` to
  set or override store options.

## Import Parquet files from object storage

Use the `influxdb3 import from-object-store` command to import every Parquet
file found recursively under a prefix directly on the server, without
streaming file bytes through the `influxdb3` client.
For the complete command syntax and flags, see the
[`influxdb3 import from-object-store`](/influxdb3/enterprise/reference/cli/influxdb3/import/from-object-store/)
CLI reference.

The source you pass is either of the following:

- A prefix in {{% product-name %}}'s own object store, for example
  `some/prefix`.
- An `s3://bucket/prefix` URL for an external S3 bucket.
  {{% product-name %}} rejects any other URL scheme with an HTTP 400 error.

> [!Note]
> You can't use your object store's root, or the reserved
> `uploaded_imports/` prefix, as an import source.
> Choose a dedicated prefix for your source files.

### How the server reads the source

{{% product-name %}} uses its own configured object store credentials to read
the source.
You don't send credentials in the command or the request.

- When the source is a prefix in {{% product-name %}}'s own object store,
  staging each file is a copy within that same store.
- When the source is an external S3 bucket, {{% product-name %}}'s own object
  store must also be S3 (or an S3-compatible endpoint set with
  `--aws-endpoint`).
  If it isn't, {{% product-name %}} has no credentials to reach another
  bucket and rejects the request with an HTTP 400 error.
  {{% product-name %}}'s credentials must also be able to read the source
  bucket. This is typically automatic within one AWS account, and otherwise possible
  only when a bucket policy on the source bucket grants that access.

For an external S3 bucket, {{% product-name %}} first tries a true S3
server-side copy: a single request that moves the file directly between
buckets without streaming its bytes through {{% product-name %}}.
Server-side copy applies only when all of the following hold:

- Both the source and destination object stores are S3 (or an S3-compatible
  endpoint set with `--aws-endpoint`).
- {{% product-name %}}'s credentials can read the source bucket and write the
  destination bucket.
- The source file is smaller than 5 GiB.

When any of these doesn't hold, {{% product-name %}} falls back automatically
to streaming the file through itself (never through the `influxdb3`
client) and logs a warning.
Because {{% product-name %}} reads directly from your object store instead of
your machine re-uploading the bytes, importing from a prefix or bucket that
the server can reach directly avoids the round trip through your machine that
`influxdb3 import upload` requires.

Control the server-side copy attempt with the
[`--import-attempt-server-side-copy`](/influxdb3/enterprise/reference/config-options/#import-attempt-server-side-copy)
server option (default `true`).
Set it to `false` to always use the streamed fallback.

## Review import jobs

Use the `influxdb3 import list` command to review import jobs.
For details, see the
[`influxdb3 import list`](/influxdb3/enterprise/reference/cli/influxdb3/import/list/)
CLI reference.

## Map columns to InfluxDB types

Use `--column` flags to map Parquet columns to {{% product-name %}} types when
running `influxdb3 import upload` or `influxdb3 import from-object-store`.
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
field, typed from its Parquet type.
This is true even when the target table already declares the column as a tag.
Map every string tag column, even when the table already declares it.

Without the mapping, the import fails with the following error:

```text
invalid column type for column 'host', expected iox::column_type::tag, got iox::column_type::field::string
```

For example, to import `host` as a tag, add `--column host=tag`.

<!-- VERIFIED against live Enterprise 3.12.0-0.rc.2 (2026-09-30): importing a
Parquet file with an unmapped string column into a table that declares the
column as a tag failed with the error above, through both upload and
object-store pull. The --column type list comes from the CLI error text. -->

## Import into an explicit schema database

In a database that uses
[`explicit` schema mode](/influxdb3/enterprise/admin/databases/enforce-schema/),
every column in the Parquet file must already be declared on the table.
If the file has an undeclared column, the import fails and {{% product-name %}}
creates no import job.
This applies to both `influxdb3 import upload` and
`influxdb3 import from-object-store`.

Declare the columns first with
[`influxdb3 update table`](/influxdb3/enterprise/reference/cli/influxdb3/update/table/)
or a `PATCH` request to `/api/v3/configure/table`.
For more information, see
[Add columns to a table](/influxdb3/enterprise/admin/tables/update/).

In {{% product-name %}} 3.12, the rejection returns HTTP status `500` with an
error message like the following:

```text
Could not modify catalog: column 'usage' (iox::column_type::field::float) is not defined in table 'cpu' of database 'DATABASE_NAME', which uses explicit schemas; add the column with the /api/v3/configure/table API before writing to it
```

<!-- VERIFIED against live Enterprise 3.12.0-0.rc.2 (2026-09-30): both import
paths returned 500 with this message and created no job. The 500 status is
documented as it behaves in 3.12; update it if the status changes before GA. -->

## Troubleshoot imports

### The table doesn't exist

Importing into a table that doesn't exist returns HTTP status `404` with the
following message, in any schema mode:

```text
Table TABLE_NAME does not exist
```

Create the table first.

### Invalid column type for a tag column

The import fails with the following error:

```text
invalid column type for column 'host', expected iox::column_type::tag, got iox::column_type::field::string
```

This error means that you didn't map a string tag column.
Add `--column COLUMN_NAME=tag` for each tag column.
See [Map columns to InfluxDB types](#map-columns-to-influxdb-types).

### Unable to infer data type for a column

The import fails with HTTP status `400` and the following error:

```text
Unable to infer data type for column 'host' based on input parquet file
```

This error means that a string column needs a mapping.
Add a `--column` flag for it.

### Import list shows 0 for the minimum and maximum timestamps

`influxdb3 import list` can show `min_timestamp_ns` and `max_timestamp_ns` as
`0`.
{{% product-name %}} takes the range from the time column's Parquet statistics.
When the file has no statistics that the server can read, the fields are `0`.
A `0` doesn't mean the import failed, and the imported data isn't affected.

<!-- VERIFIED against live Enterprise 3.12.0-0.rc.2 (2026-09-30): the 404 for a
missing table, the 400 "Unable to infer data type" error, and the 0 timestamp
range with correct imported data. -->
