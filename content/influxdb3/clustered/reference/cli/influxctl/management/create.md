---
title: influxctl management create
description: >
  The `influxctl management create` command creates a management token used to
  perform administrative tasks in an InfluxDB cluster.
menu:
  influxdb3_clustered:
    parent: influxctl management
weight: 301
related:
  - /influxdb3/clustered/admin/tokens/management/create/
---

The `influxctl management create` command creates a management token to be used
with an {{< product-name omit=" Clustered" >}} cluster.
Management tokens authorize a user to perform administrative tasks on the
InfluxDB instance such as creating and deleting databases, managing users, and
other administrative tasks.

> [!Note]
> Management tokens do not provide access to databases or data in databases.
> Only _database tokens_ with "read" or "write" permissions can access data in
> databases.

The optional `--expires-at` flag defines the token expiration date and time.
Provide an RFC3999 date string--for example: `{{< datetime/current-date offset=1 >}}`.
If not set, the token does not expire until revoked.

The `--format` flag lets you print the output in other formats.
The `json` format is available for programmatic parsing by other tooling.
Default: `table`.

> [!Note]
> #### Store secure tokens in a secret store
> 
> Management token strings are returned _only_ on token creation.
> Store management tokens in a **secure secret store**.

## Usage

```sh
influxctl management create [flags]
```

## Flags

| Flag |                 | Description                                   |
| :--- | :-------------- | :-------------------------------------------- |
|      | `--description` | Management token description                  |
|      | `--expires-at`  | Token expiration date                         |
|      | `--format`      | Output format (`table` _(default)_ or `json`) |
| `-h` | `--help`        | Output command help                           |

{{% caption %}}
_Also see [`influxctl` global flags](/influxdb3/clustered/reference/cli/influxctl/#global-flags)._
{{% /caption %}}

## Examples

- [Create a management token with no expiration](#create-a-management-token-with-no-expiration)
- [Create a management token with an expiration and description](#create-a-management-token-with-an-expiration-and-description)

### Create a management token with no expiration

```sh
influxctl management create
```

### Create a management token with an expiration and description

{{% code-placeholders "RFC3339_EXPIRATION|TOKEN_DESCRIPTION" %}}
```sh
influxctl management create \
  --expires-at RFC3339_EXPIRATION \
  --description "TOKEN_DESCRIPTION"
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`RFC3339_EXPIRATION`{{% /code-placeholder-key %}}:
  An RFC3339 date string to expire the token at--for example:
  `{{< datetime/current-date offset=1 >}}`.
- {{% code-placeholder-key %}}`TOKEN_DESCRIPTION`{{% /code-placeholder-key %}}:
  Management token description.