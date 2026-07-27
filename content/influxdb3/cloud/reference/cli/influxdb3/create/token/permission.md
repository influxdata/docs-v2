---
title: influxdb3 create token \--permission
description: >
  The `influxdb3 create token` command with the `--permission` option creates a
  database token with fine-grained access permissions for specific resources in
  {{< product-name >}}.
menu:
  influxdb3_cloud:
    parent: influxdb3 create token
    name: influxdb3 create token --permission
weight: 300
---

The `influxdb3 create token` command with the `--permission` option creates a
database token with fine-grained access permissions for specific resources in
{{< product-name >}}.

Fine-grained access permissions let you specify the exact actions, such as
`read` and `write`, that a token can perform on a specific resource, such as a
database.

## Usage

```bash
influxdb3 create token --permission <PERMISSION> --name <NAME> [OPTIONS]
```

## Options

| Option |                             | Description                                                                                              |
| :----- | :-------------------------- | :------------------------------------------------------------------------------------------------------ |
|        | `--permission <PERMISSION>` | Permissions in `RESOURCE_TYPE:RESOURCE_NAMES:ACTIONS` format—for example, `db:*:read,write`. `--permission` may be specified multiple times |
|        | `--name <NAME>`             | Name of the token                                                                                       |
| `-H`   | `--host <HOST_URL>`         | The host URL of your {{% product-name %}} instance [env: INFLUXDB3_HOST_URL=]                            |
|        | `--token <AUTH_TOKEN>`      | Your {{% token-link %}} [env: INFLUXDB3_AUTH_TOKEN=]                                                     |
|        | `--expiry <DURATION>`       | The token expiration time as a duration (for example, 1h, 7d, 1y). If not set, the token does not expire until revoked |
|        | `--format <FORMAT>`         | Output format (`json` or `text` _(default)_)                                                            |
| `-h`   | `--help`                    | Print help information                                                                                  |
|        | `--help-all`                | Print detailed help information                                                                         |

## Permission format

The `--permission` option takes a value in the format
`RESOURCE_TYPE:RESOURCE_NAMES:ACTIONS`.

- `RESOURCE_TYPE`: Use `db` for databases.
- `RESOURCE_NAMES`: A specific database name, a comma-separated list of names, or
  `*` to grant access to all databases.
- `ACTIONS`: A list of actions—`read`, `write`, or both.

## Examples

- [Create a token with read and write access to a database](#create-a-token-with-read-and-write-access-to-a-database)
- [Create a token with read-only access to a database](#create-a-token-with-read-only-access-to-a-database)
- [Create a token with access to multiple databases](#create-a-token-with-access-to-multiple-databases)
- [Create a token with access to all databases](#create-a-token-with-access-to-all-databases)
- [Create a token that expires in seven days](#create-a-token-that-expires-in-seven-days)

### Create a token with read and write access to a database

```bash
influxdb3 create token \
  --permission "db:my_database:read,write" \
  --name "Read/write token for my_database"
```

### Create a token with read-only access to a database

```bash
influxdb3 create token \
  --permission "db:my_database:read" \
  --name "Read-only token for my_database"
```

### Create a token with access to multiple databases

```bash
influxdb3 create token \
  --permission "db:database1,database2:read,write" \
  --name "Multi-database token"
```

### Create a token with access to all databases

```bash
influxdb3 create token \
  --permission "db:*:read,write" \
  --name "All databases token"
```

### Create a token that expires in seven days

```bash
influxdb3 create token \
  --permission "db:my_database:read,write" \
  --name "Expiring token" \
  --expiry 7d
```
