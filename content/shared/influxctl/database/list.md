
The `influxctl database list` command lists all databases in an InfluxDB Cloud
Dedicated cluster.

The `--format` flag lets you print the output in other formats.
The `json` format is available for programmatic parsing by other tooling.
Default: `table`.

## Usage

```sh
influxctl database list [--format=table|json]
```

## Flags

| Flag |            | Description                                   |
| :--- | :--------- | :-------------------------------------------- |
|      | `--format` | Output format (`table` _(default)_ or `json`) |
| `-h` | `--help`   | Output command help                           |

{{% caption %}}
_Also see [`influxctl` global flags](/influxdb3/version/reference/cli/influxctl/#global-flags)._
{{% /caption %}}
