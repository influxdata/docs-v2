
The `influxctl table iceberg` command and its subcommands enable or disable
Iceberg-compatible exports for a table in an InfluxDB Cloud Dedicated cluster.

{{% show-in "clustered" %}}
> [!Warning]
> #### Only available with InfluxDB Cloud Dedicated
>
> Iceberg-compatible exports are currently only available with InfluxDB Cloud
> Dedicated, not InfluxDB Clustered. `influxctl table iceberg` command and its
> subcommands can only be used with InfluxDB Cloud Dedicated.
{{% /show-in %}}

## Usage

```sh
influxctl table iceberg [subcommand] [flags]
```

## Subcommands

| Subcommand                                                                   | Description                         |
| :--------------------------------------------------------------------------- | :---------------------------------- |
| [enable](/influxdb3/version/reference/cli/influxctl/table/iceberg/enable/)   | Enable Iceberg exports for a table  |
| [disable](/influxdb3/version/reference/cli/influxctl/table/iceberg/disable/) | Disable Iceberg exports for a table |
| help, h                                                                      | Output command help                 |

## Flags

| Flag |          | Description         |
| :--- | :------- | :------------------ |
| `-h` | `--help` | Output command help |

{{% caption %}}
_Also see [`influxctl` global flags](/influxdb3/version/reference/cli/influxctl/#global-flags)._
{{% /caption %}}
