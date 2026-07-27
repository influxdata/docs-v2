---
title: influxdb3 create token \--admin
description: >
  The `influxdb3 create token --admin` subcommand creates a named token with full administrative privileges for server actions.
menu:
  influxdb3_cloud:
    parent: influxdb3 create token
    name: influxdb3 create token --admin
weight: 400
canonical: self
---

Create a named administrator token.

> [!Note]
> #### Operator tokens in InfluxDB 3 Cloud
>
> InfluxData manages the operator token for your {{% product-name %}} instance.
> The operator token never expires and cannot be edited or deleted.

## Usage

```
influxdb3 create token --admin [OPTIONS]
```

## Options {.no-shorthand}

| Option         | Description                                                                                                   |
| :------------- | :------------------------------------------------------------------------------------------------------------ |
| `--name`       | Name of the token                                                                                             |
| `--expiry`     | Expires in `duration`--for example, 10d for 10 days or 1y for 1 year                                         |
| `--host`       | The host URL of the running InfluxDB 3 server [env: `INFLUXDB3_HOST_URL=`] [default: `http://127.0.0.1:8181`] |
| `--token`      | An existing administrator token for the InfluxDB 3 server                                                     |
| `--tls-ca`     | An optional arg to use a custom CA for useful for testing with self-signed certs                              |
| `--format`     | Output format for token [possible values: `json`, `text`]                                                     |
| `-h`, `--help` | Print help information                                                                                        |
| `--help-all`   | Print more detailed help information                                                                          |

## Examples

- [Create a named administrator token](#create-a-named-administrator-token)
- [Use the token to create a database](#use-the-token-to-create-a-database)

### Create a named administrator token

Use an existing administrator token to create a named administrator token.

<!--pytest.mark.skip-->

```bash { placeholders="ADMIN_TOKEN|TOKEN_NAME|DURATION" }
influxdb3 create token \
  --admin \
  --token ADMIN_TOKEN \
  --name TOKEN_NAME \
  --expiry DURATION
```

Replace the following:

- {{% code-placeholder-key %}}`ADMIN_TOKEN`{{% /code-placeholder-key %}}: Your InfluxDB administrator token
- {{% code-placeholder-key %}}`TOKEN_NAME`{{% /code-placeholder-key %}}: Name for your new administrator token
- {{% code-placeholder-key %}}`DURATION`{{% /code-placeholder-key %}}: Duration for the token to remain valid, in [humantime](https://docs.rs/humantime/latest/humantime/fn.parse_duration.html) format (for example, `10d` for 10 days or `1y` for 1 year).

### Use the token to create a database

<!--pytest.mark.skip-->

```bash { placeholders="ADMIN_TOKEN|DATABASE_NAME" }
influxdb3 create database \
  --token ADMIN_TOKEN \
  DATABASE_NAME
```

Replace the following:

- {{% code-placeholder-key %}}`ADMIN_TOKEN`{{% /code-placeholder-key %}}: Your InfluxDB administrator token
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: Name for your new database

> [!Note]
> #### Use CLI environment variables
>
> Set the token as an environment variable to simplify repeated CLI commands:
>
> ```bash
> export INFLUXDB3_AUTH_TOKEN=ADMIN_TOKEN
> ```
