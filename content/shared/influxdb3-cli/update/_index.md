The `influxdb3 update` command updates resources in your {{< product-name >}} instance.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 update <SUBCOMMAND>
```

## Subcommands

{{% show-in "enterprise" %}}
| Subcommand                                                         | Description            |
| :----------------------------------------------------------------- | :--------------------- |
| [database](/influxdb3/version/reference/cli/influxdb3/update/database/) | Update a database      |
| [table](/influxdb3/version/reference/cli/influxdb3/update/table/)     | Update a table         |
| [trigger](/influxdb3/version/reference/cli/influxdb3/update/trigger/)   | Update a trigger       |
| help                                                               | Print command help or the help of a subcommand |
{{% /show-in %}}

{{% show-in "core" %}}
| Subcommand                                                         | Description            |
| :----------------------------------------------------------------- | :--------------------- |
| [database](/influxdb3/version/reference/cli/influxdb3/update/database/) | Update a database      |
| [trigger](/influxdb3/version/reference/cli/influxdb3/update/trigger/)   | Update a trigger       |
| help                                                               | Print command help or the help of a subcommand |
{{% /show-in %}}

## Options

| Option |              | Description                     |
| :----- | :----------- | :------------------------------ |
| `-h`   | `--help`     | Print help information          |
|        | `--help-all` | Print detailed help information |