---
title: influxctl management revoke
description: >
  The `influxctl management revoke` command revokes management token access
  to your InfluxDB Cloud Dedicated cluster.
menu:
  influxdb_cloud_dedicated:
    parent: influxctl management
weight: 301
---

The `influxctl management revoke` command revokes management token access
to your {{< product-name omit=" Clustered" >}} cluster.
**This operation cannot be undone**.

{{% note %}}
#### Revoked tokens are included when listing tokens

Revoked tokens still appear when
[listing management tokens](/influxdb/cloud-dedicated/reference/cli/influxctl/management/list/),
but they are no longer valid for any operations.
{{% /note %}}

## Usage

```sh
influxctl management revoke [flags] <TOKEN_ID>
```

## Arguments

| Argument     | Description                                                |
| :----------- | :--------------------------------------------------------- |
| **TOKEN_ID** | Token ID to revoke access for (space-delimit multiple IDs) |

## Flags

| Flag |           | Description                              |
| :--- | :-------- | :--------------------------------------- |
|      | `--force` | Do not prompt for confirmation to revoke |
| `-h` | `--help`  | Output command help                      |

{{% caption %}}
_Also see [`influxctl` global flags](/influxdb/cloud-dedicated/reference/cli/influxctl/#global-flags)._
{{% /caption %}}

## Examples

- [Revoke access for a management token](#revoke-access-for-a-management-token)
- [Revoke access for multiple management tokens](#revoke-access-for-multiple-management-tokens)
- [Revoke access for a token and skip confirmation](#revoke-access-for-a-token-and-skip-confirmation)

In the examples below, replace the following:

- {{% code-placeholder-key %}}`TOKEN_ID*`{{% /code-placeholder-key %}}:
  Token ID to revoke access from.

{{% code-placeholders "TOKEN_ID(_[1-2])?" %}}

### Revoke access for a management token

```sh
influxctl management revoke TOKEN_ID
```

### Revoke access for multiple management tokens

```sh
influxctl management revoke TOKEN_ID_1 TOKEN_ID_2
```

### Revoke access for a token and skip confirmation

```sh
influxctl management revoke --force TOKEN_ID
```

{{% /code-placeholder-key %}}
