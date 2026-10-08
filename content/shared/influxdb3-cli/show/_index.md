The `influxdb3 show` command lists resources in your {{< product-name >}} server.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 show <SUBCOMMAND>
```

## Subcommands

| Subcommand                                                              | Description                                     |
| :----------------------------------------------------------------------| :----------------------------------------------- |
| [databases](/influxdb3/version/reference/cli/influxdb3/show/databases/) | List database                                   |
| [plugins](/influxdb3/version/reference/cli/influxdb3/show/plugins/)     | List loaded plugins                             |
| [system](/influxdb3/version/reference/cli/influxdb3/show/system/)       | Display system table data                       |
| [tokens](/influxdb3/version/reference/cli/influxdb3/show/tokens/)       | List authentication tokens                      |
| help                                                                    | Print command help or the help of a subcommand  |

{{% show-in "enterprise" %}}
Additional {{% product-name %}} subcommands:

| Subcommand                                                           | Description                  |
| :--------------------------------------------------------------------| :----------------------------- |
| [license](/influxdb3/version/reference/cli/influxdb3/show/license/) | Display license information  |
| [nodes](/influxdb3/version/reference/cli/influxdb3/show/nodes/)     | Display node information     |
<!-- query_groups is not yet operational in v3.11 (page in draft); restore this row when it ships
| [query_groups](/influxdb3/version/reference/cli/influxdb3/show/query_groups/) | List distributed query groups |
-->
| query_groups | List distributed query groups (not yet operational) |
{{% /show-in %}}

## Options

| Option |              | Description                     |
| :----- | :----------- | :------------------------------ |
| `-h`   | `--help`     | Print help information          |
|        | `--help-all` | Print detailed help information |
