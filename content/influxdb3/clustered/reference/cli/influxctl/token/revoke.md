---
title: influxctl token revoke
description: >
  The `influxctl token revoke` command revokes a database token associated with
  an {{% product-name omit=" Clustered" %}} cluster and removes all permissions
  associated with the token.
menu:
  influxdb3_clustered:
    parent: influxctl token
weight: 301
aliases:
  - /influxdb3/clustered/reference/cli/influxctl/token/delete/
---

The `influxctl token revoke` command revokes a database token associated with
an {{% product-name omit=" Clustered" %}} cluster and removes all permissions
associated with the token.

## Usage

```sh
influxctl token revoke <TOKEN_ID> [<TOKEN_ID_N>...]
```

> [!Warning]
> #### Revoking a token is immediate and cannot be undone
> 
> Revoking a database token is a destructive action that takes place immediately
> and cannot be undone.
> 
> #### Rotate revoked tokens
> 
> After revoking a database token, any clients using the revoked token need to
> be updated with a new database token to continue to interact with your
> {{% product-name omit=" Clustered" %}} cluster.

##### Aliases

`delete`

## Arguments

| Argument     | Description                 |
| :----------- | :-------------------------- |
| **TOKEN_ID** | Database token ID to revoke |

## Flags

| Flag |           | Description                                                 |
| :--- | :-------- | :---------------------------------------------------------- |
|      | `--force` | Do not prompt for confirmation to revoke (default is false) |
| `-h` | `--help`  | Output command help                                         |

{{% caption %}}
_Also see [`influxctl` global flags](/influxdb3/clustered/reference/cli/influxctl/#global-flags)._
{{% /caption %}}

## Examples

- [Revoke a database token](#revoke-a-database-token)
- [Revoke multiple database tokens](#revoke-multiple-database-tokens)

In the examples below, replace the following:

- {{% code-placeholder-key %}}`TOKEN_ID`{{% /code-placeholder-key %}}:
  token ID to revoke

### Revoke a database token

{{% code-placeholders "TOKEN_ID" %}}
```sh
influxctl token revoke TOKEN_ID
```
{{% /code-placeholders %}}

### Revoke multiple database tokens

{{% code-placeholders "TOKEN_ID_\d{1}" %}}
```sh
influxctl token revoke TOKEN_ID_1 TOKEN_ID_2
```
{{% /code-placeholders %}}
