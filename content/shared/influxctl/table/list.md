
The `influxctl table list` command lists all tables in the specified database in
an {{< product-name omit=" Clustered" >}} cluster.

## Usage

```sh
influxctl table list [flags] <DATABASE_NAME>
```

## Arguments

| Argument          | Description                 |
| :---------------- | :-------------------------- |
| **DATABASE_NAME** | Name of the target database |

## Flags

| Flag |                   | Description                                                                 |
| :--- | :---------------- | :-------------------------------------------------------------------------- |
|      | `--filter-status` | Only list tables with a specific status (`active` _(default)_ or `deleted`) |
|      | `--format`        | Output format (`table` _(default)_ or `json`)                               |
| `-h` | `--help`          | Output command help                                                         |

{{% caption %}}
_Also see [`influxctl` global flags](/influxdb3/version/reference/cli/influxctl/#global-flags)._
{{% /caption %}}
