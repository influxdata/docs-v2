---
title: influxctl token get
description: >
  The `influxctl token get` command returns information about a database token
  in an InfluxDB cluster.
menu:
  influxdb_clustered:
    parent: influxctl token
weight: 301
---

The `influxctl token get` command returns information about a database token
in an InfluxDB cluster.

The `--format` option lets you print the output in other formats.
By default, the 'table' format is used, but the 'json' format is
available for programmatic parsing by other tooling.

## Usage

```sh
influxctl token get [command options] <TOKEN_ID>
```

## Flags

| Flag |            | Description                                   |
| :--- | :--------- | :-------------------------------------------- |
|      | `--format` | Output format (`table` _(default)_ or `json`) |
| `-h` | `--help`   | Output command help                           |

## Examples

{{% code-placeholders "TOKEN_ID" %}}
```sh
influxctl token get TOKEN_ID
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`TOKEN_ID`{{% /code-placeholder-key %}}: token ID to delete
