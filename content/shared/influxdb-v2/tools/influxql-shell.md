
Use the InfluxQL interactive shell to execute InfluxQL queries with InfluxDB.

- [Map database and retention policies to buckets](#map-database-and-retention-policies-to-buckets)
- [Download and install the influx CLI](#download-and-install-the-influx-cli)
- [Start the InfluxQL shell](#start-the-influxql-shell)
- [Execute InfluxQL queries](#execute-influxql-queries)
- [Use and configure display formats](#use-and-configure-display-formats)
- [InfluxQL shell helper commands](#influxql-shell-helper-commands)

## Map database and retention policies to buckets

InfluxQL queries require a database and retention policy to query data.
In InfluxDB {{% current-version %}}, databases and retention policies have been
combined and replaced with [buckets](/influxdb/version/reference/glossary/#bucket).
To use the InfluxQL to query an InfluxDB {{% current-version %}} bucket, first
map your DBRP combinations to an appropriate bucket.

For information about creating DBRP mappings, see
[Query data with InfluxQL](/influxdb/version/query-data/influxql/).

## Download and install the influx CLI

The InfluxQL REPL is included in the **`influx` CLI (2&period;4+)**.
[Download and install the `influx` CLI](/influxdb/version/tools/influx-cli/#install-the-influx-cli).

## Start the InfluxQL shell

Use the [`influx v1 shell` command](/influxdb/version/reference/cli/influx/v1/shell/)
to start an InfluxQL shell session.

```sh
influx v1 shell
```

### Configure your InfluxDB connection

The `influx v1 shell` command requires the following to connect to InfluxDB:

{{% show-in "v2" %}}- [InfluxDB host](/influxdb/version/reference/urls/){{% /show-in %}}
  {{% show-in "cloud,cloud-serverless" %}}[InfluxDB Cloud region URL](/influxdb/cloud/reference/regions/){{% /show-in %}}
- [Organization name or ID](/influxdb/version/admin/organizations/view-orgs/)
- [API token](/influxdb/version/admin/tokens/)

Use one of the following methods to provide these credentials to the `influx v1 shell` command:

{{< tabs-wrapper >}}
{{% tabs "small" %}}
[CLI config _(Recommended)_](#)
[Command flags](#)
[Environment variables](#)
{{% /tabs %}}
{{% tab-content %}}
<!------------------------------ BEGIN CLI config ----------------------------->

The `influx` CLI lets your configure and store multiple sets of connection
credentials to use with commands.
Each set of credentials is a **CLI config**.
Use CLI configs to provide required credentials to the `influx v1 shell` command.

1. Create a new CLI config and set it to _active_.

    ```sh
    influx config create --config-name <config-name> \
      --host-url http://localhost:8086 \
      --org example-org \
      --token mY5up3Rs3CrE7t0k3N \
      --active
    ```

2. Start an InfluxQL shell

    ```sh
    influx v1 shell
    ```

All `influx` commands use credentials provided by the active CLI config.
For more information about managing CLI configs, see the
[`influx config` documentation](/influxdb/version/reference/cli/influx/config/).

<!------------------------------- END CLI config ------------------------------>
{{% /tab-content %}}
{{% tab-content %}}
<!---------------------------- BEGIN command flags ---------------------------->

Use `influx v1 shell` command flags to provide the required credentials:

```sh
influx v1 shell \
  --host http://localhost:8086 \
  --org example-org \
  --token mY5up3Rs3CrE7t0k3N
```

<!----------------------------- END command flags ----------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!------------------------ BEGIN environment variables ------------------------>

Use environment variables to provided the required credentials.
The `influx` CLI will automatically use the following environment variables for
required credentials if the environment variables are set:

- `INFLUX_HOST`
- `INFLUX_ORG` or `INFLUX_ORG_ID`
- `INFLUX_TOKEN`

```sh
export INFLUX_HOST=http://localhost:8086
export INFLUX_ORG=example-org
export INFLUX_TOKEN=mY5up3Rs3CrE7t0k3N

influx v1 shell
```

<!------------------------- END environment variables ------------------------->
{{% /tab-content %}}
{{< /tabs-wrapper >}}

## Execute InfluxQL queries

Within the InfluxQL shell, execute any InfluxQL query supported by InfluxDB {{< current-version >}}.
For information about what queries are supported see
[InfluxQL support in InfluxDB {{< current-version >}}](/influxdb/version/query-data/influxql/#influxql-support).

View the [InfluxQL documentation (1.11)](/influxdb/v1/query_language/)
for in-depth documentation about the query language.

## Use and configure display formats

The InfluxQL shell outputs query results using different display formats.
Use the [`format` helper command](#format) to specify which display format to use.

{{< tabs-wrapper >}}
{{% tabs %}}
[table _(default)_](#)
[column](#)
[csv](#)
[json](#)
{{% /tabs %}}
{{% tab-content %}}
<!-------------------------------- BEGIN table -------------------------------->

The InfluxQL shell uses the `table` display format by default.
If using another display format and you want to switch back to the `table` format,
run the following _in the InfluxQL shell_.

```sql
format table
```

### Table-formatted results

The table format outputs results in an interactive table format.

{{< img-hd src="/img/influxdb/2-4-influxql-shell-table-format.png" alt="InfluxQL shell table display format" />}}

Results are paginated.
Use `shift + up/down arrow` to navigate between pages.
Use `q` to exit out of the interactive table display.

### Configure the table display format

#### Use scientific notation

To display values using scientific notation, use the [`scientific` helper command](#scientific)
to toggle scientific notation.

#### Specify timestamp precision or format

To specify the precision or format of timestamps returned in results, use the
[`precision` helper command](#precision).

```sql
-- Return results formatted as RFC3339 timestamps
precision rfc3339

-- Return results with second-precision unix timestamps
precision s
```


<!--------------------------------- END table --------------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!-------------------------------- BEGIN column ------------------------------->

To use the `column` format, run the following _in the InfluxQL shell_.

```sql
format column
```

### Column-formatted results

The `column` format displays results in a text-based column format.

```
name: cpu
time            usage_user          usage_system
----            ----------          ------------
1.62767581e+09  5.476026754935672   2.5629805588360313
1.62767581e+09  0.4999999999972715  0.09999999999990905
1.62767581e+09  18.718718718689555  10.810810810692704
1.62767581e+09  6.500000000090222   3.2000000000343425
1.62767581e+09  4.1999999999336435  1.3999999999778812
1.62767581e+09  7.992007992122577   4.095904095946467
1.62767581e+09  0.3000000000054934  0.1000000000010732
```

### Configure the column display format

#### Specify timestamp precision {#specify-timestamp-precision-column}

To specify the precision or format of timestamps returned in results, use the
[`precision` helper command](#precision).

```sql
-- Return results formatted as RFC3339 timestamps
precision rfc3339

-- Return results with second-precision unix timestamps
precision s
```

<!--------------------------------- END column -------------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!--------------------------------- BEGIN csv --------------------------------->

To use the `csv` format, run the following _in the InfluxQL shell_.

```sql
format csv
```

### CSV-formatted results

The `csv` format displays results in CSV format.

```csv
name,time,usage_user,usage_system
cpu,1.62767582e+09,4.207038819798416,3.5194098893833914
cpu,1.62767582e+09,0.19980019980215585,0.19980019980215585
cpu,1.62767582e+09,14.914914914981258,14.114114114162232
cpu,1.62767582e+09,5.805805805828698,4.004004003985887
cpu,1.62767582e+09,2.5025025025339978,1.8018018018273916
cpu,1.62767582e+09,7.299999999874271,5.699999999930733
cpu,1.62767582e+09,0.09999999999647116,0.0999999999987449
```

### Configure the CSV display format

#### Specify timestamp precision {#specify-timestamp-precision-csv}

To specify the precision or format of timestamps returned in results, use the
[`precision` helper command](#precision).

```sql
-- Return results formatted as RFC3339 timestamps
precision rfc3339

-- Return results with second-precision unix timestamps
precision s
```

<!---------------------------------- END csv ---------------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!--------------------------------- BEGIN json -------------------------------->

To use the `json` format, run the following _in the InfluxQL shell_.

```sql
format json
```

### JSON-formatted results

The `csv` format displays results in JSON format.

{{% truncate %}}
```json
{
    "results": [
        {
            "series": [
                {
                    "columns": [
                        "time",
                        "usage_user",
                        "usage_system"
                    ],
                    "name": "cpu",
                    "values": [
                        [
                            1627675850,
                            4.601935685334947,
                            4.139868872973054
                        ],
                        [
                            1627675850,
                            0.3992015968099201,
                            0.2994011976074401
                        ],
                        [
                            1627675850,
                            7.599999999947613,
                            7.299999999995634
                        ],
                        [
                            1627675850,
                            0.3992015968098205,
                            0.4990019960088718
                        ],
                        [
                            1627675850,
                            9.59040959050348,
                            8.49150849158481
                        ],
                        [
                            1627675850,
                            0.2997002996974768,
                            0.39960039959966437
                        ],
                        [
                            1627675850,
                            9.590409590464631,
                            8.691308691326773
                        ]
                    ]
                }
            ],
            "statement_id": 0
        }
    ]
}
```
{{% /truncate %}}

### Configure the JSON display format

#### Pretty print JSON output

By default, the `json` display format returns an unformatted JSON string.
To format the JSON, use the [`pretty` helper command](#pretty) to toggle JSON
pretty printing.

#### Specify timestamp precision {#specify-timestamp-precision-json}

To specify the precision or format of timestamps returned in results, use the
[`precision` helper command](#precision).

```sql
-- Return results formatted as RFC3339 timestamps
precision rfc3339

-- Return results with second-precision unix timestamps
precision s
```

<!---------------------------------- END json --------------------------------->
{{% /tab-content %}}
{{< /tabs-wrapper >}}

## InfluxQL shell helper commands

The InfluxQL shell supports the following helper commands:

- [clear](#clear)
- [exit](#exit)
- [format](#format)
- [gopher](#gopher)
- [help](#help)
- [history](#history)
- [precision](#precision)
- [pretty](#pretty)
- [quit](#quit)
- [scientific](#scientific)
- [use](#use)

### clear

Clear session based-settings such as database.

### exit

Exit the InfluxQL shell.

### format

Specify the data display format.
The InfluxQL supports the following display formats:

- csv
- json
- column
- table _(default)_

```sql
-- Display query output using column display
format column
```

For more information, see [Use and configure display formats](#use-and-configure-display-formats).

### gopher

Print the Go gopher.

### help

Print the InfluxQL shell help options.

### history

View the InfluxQL shell history.

### precision

Specify the format or precision of timestamps.
Use one of the following:

- rfc3339
- h
- m
- s
- ms
- u
- ns _(default)_

```sql
-- Set timestamp precision to seconds
precision s
```

### pretty

Toggle "pretty print" for the [`json` display format](#format).

### quit

Exit the InfluxQL shell

### scientific

Toggle scientific number format for the [`table` display format](#format).

### use

Set the database and retention policy (optional) to use for queries.

```sql
-- Use the exampledb database
use exampledb

-- Use the exampledb database and examplerp retention policy
use exampledb.examplerp
```
