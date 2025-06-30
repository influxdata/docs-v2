
The `influxctl table iceberg enable` command enables Iceberg-compatible exports
for a table in an InfluxDB Cloud Dedicated cluster.

{{% show-in "clustered" %}}
> [!Warning]
> #### Only available with InfluxDB Cloud Dedicated
>
> Iceberg-compatible exports are currently only available with InfluxDB Cloud
> Dedicated, not InfluxDB Clustered. The `influxctl table iceberg` command and
> its subcommands can only be used with InfluxDB Cloud Dedicated.
{{% /show-in %}}

## Usage

```sh
influxctl table iceberg enable [flags] <DATABASE_NAME> <TABLE_NAME>
```

## Arguments

| Argument          | Description                                |
| :---------------- | :----------------------------------------- |
| **DATABASE_NAME** | Name of the target database                |
| **TABLE_NAME**    | Name of table to enable Iceberg exports on |

## Flags

| Flag |          | Description         |
| :--- | :------- | :------------------ |
| `-h` | `--help` | Output command help |

{{% caption %}}
_Also see [`influxctl` global flags](/influxdb3/version/reference/cli/influxctl/#global-flags)._
{{% /caption %}}
