---
title: influxctl management list
description: >
  The `influxctl management list` command lists all management tokens used to
  perform administrative tasks in an InfluxDB cluster.
menu:
  influxdb_clustered:
    parent: influxctl management
weight: 301
---

The `influxctl management list` command lists all management tokens used to
perform administrative tasks in an {{< product-name omit=" Clustered" >}} cluster.
It returns the token description and other relevant information.

{{% note %}}
#### Management token strings are not retrievable

The actual management token string is not printed and is only returned when
creating the token.

#### Revoked tokens are included in output

Revoked tokens still appear when listing management tokens, but they are no
longer valid for any operations.
{{% /note %}}

The `--format` flag lets you print the output in other formats.
The `json` format is available for programmatic parsing by other tooling.
Default: `table`.

## Usage

```sh
influxctl management list [--format=table|json]
```

## Flags

| Flag |            | Description                                   |
| :--- | :--------- | :-------------------------------------------- |
|      | `--format` | Output format (`table` _(default)_ or `json`) |
| `-h` | `--help`   | Output command help                           |

{{% caption %}}
_Also see [`influxctl` global flags](/influxdb/clustered/reference/cli/influxctl/#global-flags)._
{{% /caption %}}