---
title: influxdb3 import from-object-store
description: >
  The `influxdb3 import from-object-store` command imports Parquet files
  directly from object storage into an InfluxDB 3 Enterprise database and
  table, without streaming file bytes through the client.
menu:
  influxdb3_enterprise:
    parent: influxdb3 import
    name: from-object-store
weight: 302
related:
  - /influxdb3/enterprise/admin/import-data/
---

The `influxdb3 import from-object-store` command imports every Parquet file
found recursively under a prefix into an existing {{< product-name >}}
database and table.
{{< product-name >}} reads the source files itself, using its own object
store credentials, so file bytes never stream through the `influxdb3` client
or the machine that runs it.

This command needs the `write` action on the target database, for example,
`db:DATABASE_NAME:write`.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 import from-object-store [OPTIONS] <SOURCE>
```

## Arguments

| Argument   | Description |
| :--------- | :----------- |
| `<SOURCE>` | Where to read the Parquet files from: a prefix in {{< product-name >}}'s own object store (for example, `some/prefix`), or an `s3://bucket/prefix` URL. Every other URL scheme is rejected with an HTTP 400 error. Every `.parquet` file found recursively under the prefix is imported as its own job. |

## Options

| Option |                              | Description                                                                                                                                                       | Default                 | Environment variable      |
| :----- | :--------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------ | :----------------------- | :------------------------ |
| `-H`   | `--host <HOST_URL>`          | Host URL of the InfluxDB 3 Enterprise server                                                                                                                    | `http://127.0.0.1:8181` | `INFLUXDB3_HOST_URL`      |
|        | `--token <AUTH_TOKEN>`       | Authentication token                                                                                                                                             |                          | `INFLUXDB3_AUTH_TOKEN`    |
| `-d`   | `--database <DATABASE>`      | Target database name                                                                                                                                             |                          |                            |
| `-t`   | `--table <TABLE>`            | Target table name                                                                                                                                                |                          |                            |
|        | `--column <COLUMN>`          | Map a Parquet column to an InfluxDB type: `<column>=<type>`. See [`import upload` column type mapping](/influxdb3/enterprise/reference/cli/influxdb3/import/upload/#column-type-mapping) for supported types. Can be specified multiple times. |                          |                            |
|        | `--tls-ca <CA_CERT>`         | Path to a custom TLS certificate authority                                                                                                                       |                          | `INFLUXDB3_TLS_CA`        |
|        | `--tls-no-verify`            | Disable TLS certificate verification (not recommended in production)                                                                                             |                          | `INFLUXDB3_TLS_NO_VERIFY` |
| `-h`   | `--help`                     | Print help information                                                                                                                                           |                          |                            |
|        | `--help-all`                 | Print detailed help information                                                                                                                                  |                          |                            |

## How the server reads the source

{{< product-name >}} uses its own configured object store credentials to
read the source.
You don't send credentials in the command.

- When `<SOURCE>` names a prefix in {{< product-name >}}'s own object store,
  staging each file is a copy within that same store.
- When `<SOURCE>` names an external S3 bucket, {{< product-name >}}'s own
  object store must also be S3 (or an S3-compatible endpoint set with
  `--aws-endpoint`).
  If it isn't, {{< product-name >}} has no credentials to reach another
  bucket and rejects the request with an HTTP 400 error.
  {{< product-name >}}'s credentials must also be able to read the source
  bucket. This is typically automatic within one AWS account, and otherwise possible
  only when a bucket policy on the source bucket grants that access.

For an external S3 bucket, {{< product-name >}} first tries a true S3
server-side copy: a single request that moves the file directly between
buckets without streaming its bytes through {{< product-name >}}.
Server-side copy applies only when all of the following hold:

- Both the source and destination object stores are S3 (or an S3-compatible
  endpoint set with `--aws-endpoint`).
- {{< product-name >}}'s credentials can read the source bucket and write
  the destination bucket.
- The source file is smaller than 5 GiB.

When any of these doesn't hold, {{< product-name >}} falls back
automatically to streaming the file through itself (never through the
`influxdb3` client) and logs a warning.
Control this behavior with the
[`--import-attempt-server-side-copy`](/influxdb3/enterprise/reference/config-options/#import-attempt-server-side-copy)
server option (default `true`).
Set it to `false` to always use the streamed fallback.

> [!Note]
> You can't use your object store's root, or the reserved
> `uploaded_imports/` prefix, as an import source.
> Choose a dedicated prefix for your source files.

## Examples

- [Import from the server's own object store](#import-from-the-servers-own-object-store)
- [Import from an S3 bucket](#import-from-an-s3-bucket)
- [Import with column type mapping](#import-with-column-type-mapping)

In the examples below, replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  the name of the target database
- {{% code-placeholder-key %}}`TABLE_NAME`{{% /code-placeholder-key %}}:
  the name of the target table
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:
  your authentication token

### Import from the server's own object store

<!--pytest.mark.skip-->

```bash { placeholders="DATABASE_NAME|TABLE_NAME|AUTH_TOKEN" }
influxdb3 import from-object-store \
  --host http://localhost:8181 \
  --token AUTH_TOKEN \
  --database DATABASE_NAME \
  --table TABLE_NAME \
  parquet-imports/2025-01/
```

### Import from an S3 bucket

<!--pytest.mark.skip-->

```bash { placeholders="DATABASE_NAME|TABLE_NAME|AUTH_TOKEN" }
influxdb3 import from-object-store \
  --host http://localhost:8181 \
  --token AUTH_TOKEN \
  --database DATABASE_NAME \
  --table TABLE_NAME \
  s3://my-bucket/parquet-exports/
```

### Import with column type mapping

<!--pytest.mark.skip-->

```bash { placeholders="DATABASE_NAME|TABLE_NAME|AUTH_TOKEN" }
influxdb3 import from-object-store \
  --host http://localhost:8181 \
  --token AUTH_TOKEN \
  --database DATABASE_NAME \
  --table TABLE_NAME \
  --column timestamp=time \
  --column host=tag \
  --column cpu_usage=f64 \
  s3://my-bucket/parquet-exports/
```
