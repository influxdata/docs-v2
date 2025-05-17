
The `influxdb3 create` command creates a resource such as a database or
authentication token.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 create <SUBCOMMAND>
```

## Subcommands

| Subcommand                                                                          | Description                                     |
| :---------------------------------------------------------------------------------- | :---------------------------------------------- |
| [database](/influxdb3/version/reference/cli/influxdb3/create/database/)             | Create a new database                           |
| [file_index](/influxdb3/version/reference/cli/influxdb3/create/file_index/)         | Create a new file index for a database or table |
| [last_cache](/influxdb3/version/reference/cli/influxdb3/create/last_cache/)         | Create a new last value cache                   |
| [distinct_cache](/influxdb3/version/reference/cli/influxdb3/create/distinct_cache/) | Create a new distinct value cache               |
| [table](/influxdb3/version/reference/cli/influxdb3/create/table/)                   | Create a new table in a database                |
| [token](/influxdb3/version/reference/cli/influxdb3/create/token/)                   | Create a new authentication token               |
| [trigger](/influxdb3/version/reference/cli/influxdb3/create/trigger/)               | Create a new trigger for the processing engine  |
| help                                                                                | Print command help or the help of a subcommand  |

## Options

| Option |              | Description                     |
| :----- | :----------- | :------------------------------ |
| `-h`   | `--help`     | Print help information          |
|        | `--help-all` | Print detailed help information |
