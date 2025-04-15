
The `influxdb3 test` command tests InfluxDB 3 resources, such as plugins.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 test <SUBCOMMAND>
```

## Subcommands

| Subcommand                                                                | Description                                    |
| :------------------------------------------------------------------------ | :--------------------------------------------- |
| [wal_plugin](/influxdb3/version/reference/cli/influxdb3/test/wal_plugin/) | Test a write-ahead log (WAL) plugin            |
| help                                                                      | Print command help or the help of a subcommand |

## Options

| Option |              | Description                     |
| :----- | :----------- | :------------------------------ |
| `-h`   | `--help`     | Print help information          |
|        | `--help-all` | Print detailed help information |
