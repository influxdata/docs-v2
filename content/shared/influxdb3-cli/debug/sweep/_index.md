
The `influxdb3 debug sweep` command reads back the audit trail that
[orphaned file cleanup](/influxdb3/version/admin/orphaned-file-cleanup/)
writes each time it runs.
Both subcommands work directly against object storage.
They take the same object store connection options as `influxdb3 serve`
and don't need a running {{< product-name >}} server.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 debug sweep <SUBCOMMAND>
```

## Subcommands

| Subcommand | Description |
| :--------- | :---------- |
| [list](/influxdb3/version/reference/cli/influxdb3/debug/sweep/list/) | List recorded cleanup passes, oldest to newest |
| [report](/influxdb3/version/reference/cli/influxdb3/debug/sweep/report/) | Read one pass's audit trail back as a report |
| help | Print command help or the help of a subcommand |

## Options

| Option |              | Description                     |
| :----- | :----------- | :------------------------------ |
| `-h`   | `--help`     | Print help information          |
|        | `--help-all` | Print detailed help information |
