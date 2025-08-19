
The `influxdb3 show system` command displays data from {{< product-name >}}
system tables.

## Usage

<!--pytest.mark.skip-->

```bash
 influxdb3 show system [OPTIONS] --database <DATABASE_NAME> <SUBCOMMAND>
```

##### Aliases

`system`, `s`

## Subcommands

| Subcommand                                                                    | Description                                    |
| :---------------------------------------------------------------------------- | :--------------------------------------------- |
| [summary](/influxdb3/version/reference/cli/influxdb3/show/system/summary)        | Summarize system table data                    |
| [table](/influxdb3/version/reference/cli/influxdb3/show/system/table/)           | Retrieve entries from a specific system table  |
| [table-list](/influxdb3/version/reference/cli/influxdb3/show/system/table-list/) | List available system tables                   |
| help                                                                          | Print command help or the help of a subcommand |

## Options

| Option |              | Description                                                                              |
| :----- | :----------- | :--------------------------------------------------------------------------------------- |
| `-H`   | `--host`     | Host URL of the running {{< product-name >}} server (default is `http://127.0.0.1:8181`) |
| `-d`   | `--database` | _({{< req >}})_ Name of the database to operate on                                       |
|        | `--token`    | Authentication token                                                                     |
| `-h`   | `--help`     | Print help information                                                                   |
|        | `--help-all` | Print detailed help information                                                          |

### Option environment variables

You can use the following environment variables to set command options:

| Environment Variable      | Option       |
| :------------------------ | :----------- |
| `INFLUXDB3_HOST_URL`      | `--host`     |
| `INFLUXDB3_DATABASE_NAME` | `--database` |
| `INFLUXDB3_AUTH_TOKEN`    | `--token`    |
