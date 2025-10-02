
The `influxctl table` command and its subcommands manage tables in an
{{% product-name omit=" Clustered" %}} cluster.

## Usage

```sh
influxctl table [subcommand] [flags]
```

## Subcommands

| Subcommand                                                             | Description                        |
| :--------------------------------------------------------------------- | :--------------------------------- |
| [create](/influxdb3/version/reference/cli/influxctl/table/create/)     | Create a table                     |
| [delete](/influxdb3/version/reference/cli/influxctl/table/delete/)     | Delete a table                     |
| [iceberg](/influxdb3/version/reference/cli/influxctl/table/iceberg/)   | Manage iceberg exports for a table |
| [list](/influxdb3/version/reference/cli/influxctl/table/list/)         | List tables                        |
| [rename](/influxdb3/version/reference/cli/influxctl/table/rename/)     | Rename a table                     |
| [undelete](/influxdb3/version/reference/cli/influxctl/table/undelete/) | Undelete a deleted table           |
| help, h                                                                | Output command help                |

## Flags

| Flag |          | Description         |
| :--- | :------- | :------------------ |
| `-h` | `--help` | Output command help |

{{% caption %}}
_Also see [`influxctl` global flags](/influxdb3/version/reference/cli/influxctl/#global-flags)._
{{% /caption %}}
