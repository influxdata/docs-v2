---
title: influxdb3 import upload
description: >
  The `influxdb3 import upload` command uploads one or more Parquet files into
  an InfluxDB 3 Enterprise database and table.
menu:
  influxdb3_enterprise:
    parent: influxdb3 import
    name: upload
weight: 301
related:
  - /influxdb3/enterprise/admin/import-data/
---

The `influxdb3 import upload` command uploads one or more Parquet files into
an existing {{< product-name >}} database and table.
Each file becomes a separate import job.
Imported data is written to your object storage and becomes queryable after
the compactor processes it.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 import upload [OPTIONS] [PATH]
```

## Arguments

| Argument | Description |
| :------- | :---------- |
| `[PATH]` | Path to a Parquet file or a directory. If a directory, all `*.parquet` files are processed recursively and one import job is created per file. |

## Options

| Option |                                   | Description                                                                                                                                                                                  | Default                   | Environment variable        |
| :----- | :-------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------ | :-------------------------- |
|        | `--host <HOST_URL>`               | Host URL of the InfluxDB 3 Enterprise server                                                                                                                                                 | `http://127.0.0.1:8181`   | `INFLUXDB3_HOST_URL`        |
|        | `--token <AUTH_TOKEN>`            | Authentication token                                                                                                                                                                         |                           | `INFLUXDB3_AUTH_TOKEN`      |
|        | `--database <DATABASE>`           | Target database name                                                                                                                                                                         |                           | `INFLUXDB3_DATABASE_NAME`   |
|        | `--table <TABLE>`                 | Target table name                                                                                                                                                                            |                           |                             |
|        | `--column <COLUMN>`               | Map a Parquet column to an InfluxDB type: `<column>:<type>`. Supported types: `i64`, `u64`, `f64`, `bool`, `string`, `time`, `tag`. Can be specified multiple times. Unmapped columns default to field values. | |                             |
|        | `--tls-ca <CA_CERT>`              | Path to a custom TLS certificate authority                                                                                                                                                   |                           | `INFLUXDB3_TLS_CA`          |
|        | `--tls-no-verify`                 | Disable TLS certificate verification (not recommended in production)                                                                                                                         |                           | `INFLUXDB3_TLS_NO_VERIFY`   |
| `-h`   | `--help`                          | Print help information                                                                                                                                                                       |                           |                             |
|        | `--help-all`                      | Print detailed help information                                                                                                                                                              |                           |                             |

## Column type mapping

The `--column` option maps Parquet columns to InfluxDB data types.
Specify the option multiple times to map multiple columns.
Unmapped columns default to field values.

| Type     | Description                  |
| :------- | :--------------------------- |
| `i64`    | Signed 64-bit integer field  |
| `u64`    | Unsigned 64-bit integer field |
| `f64`    | 64-bit float field           |
| `bool`   | Boolean field                |
| `string` | String field                 |
| `time`   | Timestamp column             |
| `tag`    | Tag column                   |

## Examples

In the examples below, replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  the name of the target database
- {{% code-placeholder-key %}}`TABLE_NAME`{{% /code-placeholder-key %}}:
  the name of the target table
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:
  your authentication token

### Upload a single Parquet file

<!--pytest.mark.skip-->

```bash { placeholders="DATABASE_NAME|TABLE_NAME|AUTH_TOKEN" }
influxdb3 import upload \
  --host http://localhost:8181 \
  --token AUTH_TOKEN \
  --database DATABASE_NAME \
  --table TABLE_NAME \
  /path/to/data.parquet
```

### Upload all Parquet files in a directory

<!--pytest.mark.skip-->

```bash { placeholders="DATABASE_NAME|TABLE_NAME|AUTH_TOKEN" }
influxdb3 import upload \
  --host http://localhost:8181 \
  --token AUTH_TOKEN \
  --database DATABASE_NAME \
  --table TABLE_NAME \
  /path/to/parquet-directory/
```

### Upload with column type mapping

<!--pytest.mark.skip-->

```bash { placeholders="DATABASE_NAME|TABLE_NAME|AUTH_TOKEN" }
influxdb3 import upload \
  --host http://localhost:8181 \
  --token AUTH_TOKEN \
  --database DATABASE_NAME \
  --table TABLE_NAME \
  --column timestamp:time \
  --column host:tag \
  --column cpu_usage:f64 \
  /path/to/metrics.parquet
```
