
The `influx v1` command provides commands for working with the [InfluxDB 1.x compatibility API](/influxdb/version/reference/api/influxdb-1x/) in InfluxDB {{< current-version >}}.

## Usage
```
influx v1 [flags]
influx v1 [command]
```

## Subcommands
| Subcommand                                             | Description                                                       |
| :----------------------------------------------------- | :---------------------------------------------------------------- |
| [auth](/influxdb/version/reference/cli/influx/v1/auth/)   | Authorization management commands for v1 APIs                     |
| [dbrp](/influxdb/version/reference/cli/influx/v1/dbrp/)   | Database retention policy mapping management commands for v1 APIs |
| [shell](/influxdb/version/reference/cli/influx/v1/shell/) | Start an InfluxQL shell                                           |

## Flags
| Flag |          | Description               |
|:-----|:---------|:--------------------------|
| `-h` | `--help` | Help for the `v1` command |
