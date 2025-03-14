---
title: influxctl management revoke
description: >
  The `influxctl management revoke` command revokes management token access
  to your InfluxDB cluster.
menu:
  influxdb3_clustered:
    parent: influxctl management
weight: 301
related:
  - /influxdb3/clustered/admin/tokens/management/revoke/
---

The `influxctl management revoke` command revokes management token access
to your {{< product-name omit=" Clustered" >}} cluster.
**This operation cannot be undone**.

> [!Note]
> #### Revoked tokens are included when listing tokens
> 
> Revoked tokens still appear when
> [listing management tokens](/influxdb3/clustered/reference/cli/influxctl/management/list/),
> but they are no longer valid for any operations.

## Usage

```sh
influxctl management revoke [flags] <TOKEN_ID>[ ... TOKEN_ID_N]
```

## Arguments

| Argument     | Description                                                |
| :----------- | :--------------------------------------------------------- |
| **TOKEN_ID** | Token ID(s) to revoke access from (space-delimit multiple IDs) |

## Flags

| Flag |           | Description                              |
| :--- | :-------- | :--------------------------------------- |
|      | `--force` | Do not prompt for confirmation to revoke |
| `-h` | `--help`  | Output command help                      |

{{% caption %}}
_Also see [`influxctl` global flags](/influxdb3/clustered/reference/cli/influxctl/#global-flags)._
{{% /caption %}}

## Examples

- [Revoke access from a management token](#revoke-access-from-a-management-token)
- [Revoke access from multiple management tokens](#revoke-access-from-multiple-management-tokens)
- [Revoke access from a token and skip confirmation](#revoke-access-from-a-token-and-skip-confirmation)

In the examples below, replace the following:

- {{% code-placeholder-key %}}`TOKEN_ID*`{{% /code-placeholder-key %}}:
  Token ID to revoke access from.

{{% code-placeholders "TOKEN_ID(_[1-2])?" %}}

### Revoke access from a management token

```sh
influxctl management revoke TOKEN_ID
```

### Revoke access from multiple management tokens

```sh
influxctl management revoke TOKEN_ID_1 TOKEN_ID_2
```

### Revoke access from a token and skip confirmation

```sh
influxctl management revoke --force TOKEN_ID
```

{{% /code-placeholder-key %}}
