The `influxdb3 debug` command includes diagnostic tools for troubleshooting
your {{< product-name >}} deployment.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 debug <SUBCOMMAND>
```

## Subcommands

{{% show-in "core" %}}

| Subcommand | Description |
| :--------- | :---------- |
| help | Print command help or the help of a subcommand |

{{% /show-in %}}

{{% show-in "enterprise" %}}

| Subcommand | Description |
| :--------- | :---------- |
| help | Print command help or the help of a subcommand |
| [object-store-check](/influxdb3/version/reference/cli/influxdb3/debug/object-store-check/) | Validate object store compatibility |
| [sweep](/influxdb3/version/reference/cli/influxdb3/debug/sweep/) | Read back [orphaned file cleanup](/influxdb3/version/admin/orphaned-file-cleanup/) audit trails as reports |
| [verify-references](/influxdb3/version/reference/cli/influxdb3/debug/verify-references/) | Check that every object the newest compactor checkpoint references exists |

{{% /show-in %}}

## Options

| Option |              | Description                     |
| :----- | :----------- | :------------------------------ |
| `-h`   | `--help`     | Print help information          |
|        | `--help-all` | Print detailed help information |
