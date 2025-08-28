---
title: influxdb3 create token \--permission
description: >
  The `influxdb3 create token` command with the `--permission` option creates a new authentication token
  with fine-grained access permissions for specific resources in {{< product-name >}}.
menu:
  influxdb3_enterprise:
    parent: influxdb3 create token
    name: influxdb3 create token --permission
weight: 300
---

The `influxdb3 create token` command with the `--permission` option creates a new authentication token
with fine-grained access permissions for specific resources in {{< product-name >}}.

Fine-grained access permissions allow you to specify the exact actions, such as
`read` and `write` that a token can perform on a specific resource, such as 
a database or a system information endpoint.

## Usage

```bash
influxdb3 create token --permission <PERMISSION> --name <NAME> [OPTIONS]
```

## Options

| Option |                             | Description                                                                                                                                                   |
| :----- | :-------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------ |
|        | `--permission <PERMISSION>` | Permissions in `RESOURCE_TYPE:RESOURCE_NAMES:ACTIONS` format--for example, `db:*:read,write`, `system:*:read`. `--permission` may be specified multiple times |
|        | `--name <NAME>`             | Name of the token                                                                                                                                             |
| `-H`   | `--host <HOST_URL>`         | The host URL of the running InfluxDB 3 Enterprise server [env: INFLUXDB3_HOST_URL=] [default: http://127.0.0.1:8181]                                          |
|        | `--token <AUTH_TOKEN>`      | The {{% token-link "enterprise" "admin" %}} [env: INFLUXDB3_AUTH_TOKEN=]                                                                                      |
|        | `--expiry <DURATION>`       | The token expiration time as a duration (for example, 1h, 7d, 1y). If not set, the token does not expire until revoked                                        |
|        | `--tls-ca <CA_CERT>`        | An optional arg to use a custom CA for testing with self-signed certs [env: INFLUXDB3_TLS_CA=]                                                                |
|        | `--format <FORMAT>`         | Output format (`json` or `text` _(default)_)                                                                                                                  |
| `-h`   | `--help`                    | Print help information                                                                                                                                        |
|        | `--help-all`                | Print detailed help information                                                                                                                               |

## Permission format

The `--permission` option takes a value in the format `RESOURCE_TYPE:RESOURCE_NAMES:ACTIONS`.

- `RESOURCE_TYPE`: Available resource types include:
  - `db` for databases
  - `system` for system information endpoints.
- `RESOURCE_NAMES`: Can be a specific resource name, such as a database name, a
  comma-separated list of names, or `*` to grant access to all resources of the type.
- `ACTIONS`: A list of actions. Available actions depend on the resource type.

## Examples

- [Create a token with read and write access to a database](#create-a-token-with-read-and-write-access-to-a-database)
- [Create a token with read-only access to a database](#create-a-token-with-read-only-access-to-a-database)
- [Create a token with access to multiple databases](#create-a-token-with-access-to-multiple-databases)
- [Create a token with access to all databases](#create-a-token-with-access-to-all-databases)
- [Create a token that expires in seven days](#create-a-token-that-expires-in-seven-days)
- [Create a system token for health information](#create-a-system-token-for-health-information)
- [Create a token with access to all system information ](#create-a-token-with-access-to-all-system-information-)
- [Create a token with multiple permissions](#create-a-token-with-multiple-permissions)
- [Generate an offline permissions (resource) token file](#generate-an-offline-permissions-resource-token-file)

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

### Create a system token for health information

```bash
influxdb3 create token \
  --permission "system:health:read" \
  --name "System health token"
```

### Create a token with access to all system information 

```bash
influxdb3 create token \
  --permission "system:*:read" \
  --name "All system information"
```

### Create a token with multiple permissions

```bash
influxdb3 create token \
  --permission "db:database1:read,write" \
  --permission "system:health:read" \
  --name "Multi-permission token"
```

### Generate an offline permissions (resource) tokens file

Generate an offline permission (resource) tokens file to use if no resource
tokens exist when the server starts. Once started, you can interact with the
server using the provided tokens. Offline permission tokens are designed to help
with automated deployments.

Include the following options:

- `--name` _({{% req %}})_
- `--permissions` _({{% req %}})_
- `--offline` _({{% req %}})_
- `--output-file` _({{% req %}})_
- `--create-databases` _(Optional)_
- `--expiry` _(Optional)_

<!-- pytest.mark.skip -->
```bash { placeholders="TOKEN_(NAME|PERMISSIONS)|DURATION|DATABASE_LIST|path/to/tokens.json" }
influxdb3 create token \
  --name TOKEN_NAME \
  --permission "TOKEN_PERMISSIONS" \
  --expiry DURATION \
  --offline \
  --create-databases DATABASE_LIST \
  --output-file path/to/tokens.json
```

Replace the following:

- {{% code-placeholder-key %}}`TOKEN_NAME`{{% /code-placeholder-key %}}:
  Name for your offline permission token
- {{% code-placeholder-key %}}`TOKEN_PERMISSIONS`{{% /code-placeholder-key %}}:
  [Token permissions](#permissions-format).
- {{% code-placeholder-key %}}`DURATION`{{% /code-placeholder-key %}}:
  Duration for the token to remain valid, in
  [humantime](https://docs.rs/humantime/latest/humantime/fn.parse_duration.html)
  format (for example, `10d` for 10 days or `1y` for 1 year).
- {{% code-placeholder-key %}}`DATABASE_LIST`{{% /code-placeholder-key %}}:
  Comma-separated list of database names to create when starting the
  {{% product-name %}} server using the generated tokens file
- {{% code-placeholder-key %}}`path/to/tokens.json`{{% /code-placeholder-key %}}:
  File path to use for the generated tokens file

{{< expand-wrapper >}}
{{% expand "View example offline permission tokens file" %}}
```json
{
  "create_databases": [
    "db1",
    "db2",
    "db3"
  ],
  "tokens": [
    {
      "token": "apiv3_0XXXX-xxxXxXxxxXX_OxxxX...",
      "name": "example-token",
      "expiry_millis": 1756400061529,
      "permissions": [
        "db:db1,db2:read,write",
        "db:db3:read"
      ]
    }
  ]
}
```
{{% /expand %}}
{{< /expand-wrapper >}}

> [!Note]
> If you write a new offline permission token to an existing permission token file,
> the command appends the new token to the existing output file.
