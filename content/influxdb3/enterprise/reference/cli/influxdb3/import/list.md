---
title: influxdb3 import list
description: >
  The `influxdb3 import list` command lists bulk import jobs for the InfluxDB 3
  Enterprise databases your token can describe.
menu:
  influxdb3_enterprise:
    parent: influxdb3 import
    name: list
weight: 303
related:
  - /influxdb3/enterprise/admin/import-data/
---

The `influxdb3 import list` command lists bulk import jobs.
{{< product-name >}} returns only the import jobs for databases that your
token can describe. For example, a token with `db:*:describe` sees import
jobs for every database, and a token with `db:DATABASE_NAME:describe` sees
only import jobs for `DATABASE_NAME`.
This command needs the `describe` action on at least one database, and
returns an HTTP 403 error if your token can't describe any database.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 import list [OPTIONS]
```

## Options

| Option |                         | Description                                                          | Default                 | Environment variable      |
| :----- | :---------------------- | :------------------------------------------------------------------- | :---------------------- | :------------------------ |
| `-H`   | `--host <HOST_URL>`     | Host URL of the InfluxDB 3 Enterprise server                         | `http://127.0.0.1:8181` | `INFLUXDB3_HOST_URL`      |
|        | `--token <AUTH_TOKEN>`  | Authentication token                                                 |                         | `INFLUXDB3_AUTH_TOKEN`    |
|        | `--tls-ca <CA_CERT>`    | Path to a custom TLS certificate authority                           |                         | `INFLUXDB3_TLS_CA`        |
|        | `--tls-no-verify`       | Disable TLS certificate verification (not recommended in production) |                         | `INFLUXDB3_TLS_NO_VERIFY` |
| `-h`   | `--help`                | Print help information                                               |                         |                           |
|        | `--help-all`            | Print detailed help information                                      |                         |                           |

## Examples

Replace the following:

- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:
  your authentication token

<!--pytest.mark.skip-->

```bash { placeholders="AUTH_TOKEN" }
influxdb3 import list \
  --host http://localhost:8181 \
  --token AUTH_TOKEN
```
