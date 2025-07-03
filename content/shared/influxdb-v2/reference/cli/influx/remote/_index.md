
> [!Important]
> Configure InfluxDB Edge Data Replication remotes and replication streams to
> replicate data from InfluxDB OSS to remote buckets on InfluxDB Cloud, InfluxDB
> Enterprise, or another InfluxDB OSS instance. Currently, you cannot configure
> remotes and replication streams on InfluxDB Cloud.

Use the `influx remote` command to manage connections to remote instances of InfluxDB.
Remote connections are used to replicate data on write at the bucket level.

## Usage
```
influx remote [command options] [arguments...]
```

## Subcommands

|  Subcommand                                                 |  Description                           |
|:--------------------------------------------------------------|--------------------------------------|
| [`create`](/influxdb/version/reference/cli/influx/remote/create) | Create a new remote connection       |
| [`delete`](/influxdb/version/reference/cli/influx/remote/delete) | Delete a remote connection |
| [`list`](/influxdb/version/reference/cli/influx/remote/list)     | List remote connections          |
| [`update`](/influxdb/version/reference/cli/influx/remote/update) | Update a remote connection |

## Flags
| Flag |          | Description                   |
|:-----|:---------|:------------------------------|
| `-h` | `--help` | Help for the `remote` command |
