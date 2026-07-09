---
title: influxdb3 import list
description: >
  The `influxdb3 import list` command lists bulk import jobs in an
  InfluxDB 3 Enterprise database.
menu:
  influxdb3_enterprise:
    parent: influxdb3 import
    name: list
weight: 302
related:
  - /influxdb3/enterprise/admin/import-data/
---

The `influxdb3 import list` command lists bulk import jobs for a
{{< product-name >}} database.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 import list [OPTIONS]
```

## Options

| Option |                         | Description                                                          | Default                 | Environment variable      |
| :----- | :---------------------- | :------------------------------------------------------------------- | :---------------------- | :------------------------ |
|        | `--host <HOST_URL>`     | Host URL of the InfluxDB 3 Enterprise server                         | `http://127.0.0.1:8181` | `INFLUXDB3_HOST_URL`      |
|        | `--token <AUTH_TOKEN>`  | Authentication token                                                 |                         | `INFLUXDB3_AUTH_TOKEN`    |
|        | `--database <DATABASE>` | Database name to list jobs for                                       |                         | `INFLUXDB3_DATABASE_NAME` |
|        | `--tls-ca <CA_CERT>`    | Path to a custom TLS certificate authority                           |                         | `INFLUXDB3_TLS_CA`        |
|        | `--tls-no-verify`       | Disable TLS certificate verification (not recommended in production) |                         | `INFLUXDB3_TLS_NO_VERIFY` |
| `-h`   | `--help`                | Print help information                                               |                         |                           |
|        | `--help-all`            | Print detailed help information                                      |                         |                           |

## Examples

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  the name of the database to list import jobs for
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:
  your authentication token

<!--pytest.mark.skip-->

```bash { placeholders="DATABASE_NAME|AUTH_TOKEN" }
influxdb3 import list \
  --host http://localhost:8181 \
  --token AUTH_TOKEN \
  --database DATABASE_NAME
```
