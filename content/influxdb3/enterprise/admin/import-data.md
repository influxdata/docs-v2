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

To run `influxdb3 import upload` or `influxdb3 import from-object-store`, use a
token with the `write` action on the target database, for example,
`db:DATABASE_NAME:write`.
An import doesn't create the database, so the token doesn't need the `create`
action.

To run `influxdb3 import list`, use a token with the `describe` action on at
least one database, for example, `db:DATABASE_NAME:describe`.
{{% product-name %}} filters the list to only the import jobs for databases
your token can describe, and returns an HTTP 403 error if your token can't
describe any database.

For more on creating tokens with these permissions, see
[Create a resource token](/influxdb3/enterprise/admin/tokens/resource/create/).

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
field.
