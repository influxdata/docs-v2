
The `influxdb3 delete` command deletes a resource such as a cache, a database, or a table.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 delete <SUBCOMMAND>
```

## Subcommands

{{% show-in "enterprise" %}}
| Subcommand                                                                          | Description                                    |
| :---------------------------------------------------------------------------------- | :--------------------------------------------- |
| [database](/influxdb3/version/reference/cli/influxdb3/delete/database/)             | Delete a database                              |
| [file_index](/influxdb3/version/reference/cli/influxdb3/delete/file_index/)         | Delete a file index for a database or table    |
| [last_cache](/influxdb3/version/reference/cli/influxdb3/delete/last_cache/)         | Delete a last value cache                      |
| [distinct_cache](/influxdb3/version/reference/cli/influxdb3/delete/distinct_cache/) | Delete a metadata cache                        |
| [table](/influxdb3/version/reference/cli/influxdb3/delete/table/)                   | Delete a table from a database                 |
| [token](/influxdb3/version/reference/cli/influxdb3/delete/token/)                   | Delete an authorization token from the server  |
| [trigger](/influxdb3/version/reference/cli/influxdb3/delete/trigger/)               | Delete a trigger for the processing engine     |
<!-- query_group is not yet operational in v3.11 (page in draft); restore this row when it ships
| [query_group](/influxdb3/version/reference/cli/influxdb3/delete/query_group/)       | Delete a distributed query group                |
-->
| query_group                                                                         | Delete a distributed query group (not yet operational) |
| help                                                                                | Print command help or the help of a subcommand |
{{% /show-in %}}

{{% show-in "core" %}}
| Subcommand                                                                          | Description                                    |
| :---------------------------------------------------------------------------------- | :--------------------------------------------- |
| [database](/influxdb3/version/reference/cli/influxdb3/delete/database/)             | Delete a database                              |
| [last_cache](/influxdb3/version/reference/cli/influxdb3/delete/last_cache/)         | Delete a last value cache                      |
| [distinct_cache](/influxdb3/version/reference/cli/influxdb3/delete/distinct_cache/) | Delete a metadata cache                        |
| [table](/influxdb3/version/reference/cli/influxdb3/delete/table/)                   | Delete a table from a database                 |
| [token](/influxdb3/version/reference/cli/influxdb3/delete/token/)                   | Delete an authorization token from the server  |
| [trigger](/influxdb3/version/reference/cli/influxdb3/delete/trigger/)               | Delete a trigger for the processing engine     |
| help                                                                                | Print command help or the help of a subcommand |
{{% /show-in %}}

## Options

| Option |              | Description                     |
| :----- | :----------- | :------------------------------ |
| `-h`   | `--help`     | Print help information          |
|        | `--help-all` | Print detailed help information |
