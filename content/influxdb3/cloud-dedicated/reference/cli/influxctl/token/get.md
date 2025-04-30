---
title: influxctl token get
description: >
  The `influxctl token get` command returns information about a database token
  in an {{% product-name omit=" Clustered" %}} cluster.
menu:
  influxdb3_cloud_dedicated:
    parent: influxctl token
weight: 301
---

The `influxctl token get` command returns information about a database token
in an {{% product-name omit=" Clustered" %}} cluster.

The `--format` flag lets you print the output in other formats.
The `json` format is available for programmatic parsing by other tooling.
Default: `table`.

## Usage

```sh
influxctl token get [command options] <TOKEN_ID>
```

## Flags

| Flag |                     | Description                                   |
| :--- | :------------------ | :-------------------------------------------- |
|      | `--format`          | Output format (`table` _(default)_ or `json`) |
|      | `--include-revoked` | Allow returning a revoked token               |
| `-h` | `--help`            | Output command help                           |

{{% caption %}}
_Also see [`influxctl` global flags](/influxdb3/cloud-dedicated/reference/cli/influxctl/#global-flags)._
{{% /caption %}}

## Examples

{{% code-placeholders "TOKEN_ID" %}}
```sh
influxctl token get TOKEN_ID
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`TOKEN_ID`{{% /code-placeholder-key %}}: token ID to get
