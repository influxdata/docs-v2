
Use the [`influxdb3 show databases` command](/influxdb3/version/reference/cli/influxdb3/show/databases/)
to list databases in {{< product-name >}}.
Provide the following:

  - _(Optional)_ [Output format](#output-formats) with the `--format` option
  - _(Optional)_ [Show deleted databases](list-deleted-databasese) with the
    `--show-deleted` option
  - {{< product-name >}} {{% token-link "admin" "admin" %}} with the `-t`, `--token` option

```sh
influxdb3 show databases
```

### Output formats

The `influxdb3 show databases` command supports output formats:

- `pretty` _(default)_
- `json`
- `jsonl`
- `csv`
<!-- - `parquet` _(must [output to a file](#output-to-a-parquet-file))_ -->

Use the `--format` flag to specify the output format:

```sh
influxdb3 show databases --format json
```

#### Example output

{{< expand-wrapper >}}
{{% expand "View example pretty-formatted output" %}}
{{% influxdb/custom-timestamps %}}
```
+---------------+
| iox::database |
+---------------+
| home          |
| home_actions  |
| noaa          |
+---------------+
```
{{% /influxdb/custom-timestamps %}}
{{% /expand %}}
{{% expand "View example JSON-formatted output" %}}
{{% influxdb/custom-timestamps %}}
```json
[{"iox::database":"home"},{"iox::database":"home_actions"},{"iox::database":"noaa"}]
```
{{% /influxdb/custom-timestamps %}}
{{% /expand %}}
{{% expand "View example JSON-line-formatted output" %}}
{{% influxdb/custom-timestamps %}}
```json
{"iox::database":"home"}
{"iox::database":"home_actions"}
{"iox::database":"noaa"}
```
{{% /influxdb/custom-timestamps %}}
{{% /expand %}}
{{% expand "View example CSV-formatted output" %}}
{{% influxdb/custom-timestamps %}}
```csv
iox::database
home
home_actions
noaa
```
{{% /influxdb/custom-timestamps %}}
{{% /expand %}}
{{< /expand-wrapper >}}

## List deleted databases

To list deleted databases, include the `--show-deleted` option with your
`influxdb3 show databases` command:

```sh
influxdb3 show databases --show-deleted
```

<!-- ### Output to a Parquet file

To output your list of databases to a Parquet file, provide the following
options with the `influxdb3 show databases` command:

- `--format`: `parquet`
- `-o`, `--output`: the filepath to the Parquet file to output to

```sh
influxdb3 query \
  --format parquet \
  --output path/to/databases.parquet
``` -->
