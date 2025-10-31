The `influxdb3 show` command lists resources in your {{< product-name >}} server.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 show <SUBCOMMAND>
```

## Subcommands

| Subcommand                                                              | Description                                                         |                             |                  |
| :---------------------------------------------------------------------- | :------------------------------------------------------------------ | --------------------------- | ---------------- |
| [databases](/influxdb3/version/reference/cli/influxdb3/show/databases/) | List database                                                       |                             |                  |
| {{% show-in "enterprise" %}}                                            | [license](/influxdb3/version/reference/cli/influxdb3/show/license/) | Display license information | {{% /show-in %}} |
| [plugins](/influxdb3/version/reference/cli/influxdb3/show/plugins/)     | List loaded plugins                                                 |                             |                  |
| [system](/influxdb3/version/reference/cli/influxdb3/show/system/)       | Display system table data                                           |                             |                  |
| [tokens](/influxdb3/version/reference/cli/influxdb3/show/tokens/)       | List authentication tokens                                          |                             |                  |
| help                                                                    | Print command help or the help of a subcommand                      |                             |                  |

## Options

| Option |              | Description                     |
| :----- | :----------- | :------------------------------ |
| `-h`   | `--help`     | Print help information          |
|        | `--help-all` | Print detailed help information |
