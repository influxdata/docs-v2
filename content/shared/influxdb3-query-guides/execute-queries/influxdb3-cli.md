
Use the [`influxdb3 query` command](/influxdb3/version/reference/cli/influxdb3/query/)
to query data in {{< product-name >}} with SQL or InfluxQL.

Provide the following with your command:

- **Authorization token**: Your {{< product-name >}} {{% token-link "admin" "admin" %}}
  with read permissions on the database.
  Provide this using one of the following:
  
  - `--token` command option
  - `INFLUXDB3_AUTH_TOKEN` environment variable

- **Database name**: The name of the database to query.
  Provide this using one of the following:
  
  - `-d`, `--database` command option
  - `INFLUXDB3_DATABASE_NAME` environment variable

- **Query language** <em class="op65">(Optional)</em>: The query language of the query.
  Use the `-l`, `--language` option to specify one of the following query languages:
  
  - `sql` _(default)_
  - `influxql`

- **Query**: SQL or InfluxQL query to execute. Provide the query in one of the 
  following ways:
  
  - a string
  - the `--file` option and the path to a file that contains the query
  - from stdin

{{% code-placeholders "(DATABASE|AUTH)_(TOKEN|NAME)" %}}

{{< tabs-wrapper >}}
{{% tabs %}}
[SQL](#)
[InfluxQL](#)
{{% /tabs %}}

{{% tab-content %}}

<!--------------------------------- BEGIN SQL --------------------------------->

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[string](#)
[file](#)
[stdin](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
<!--pytest.mark.skip-->

```bash
influxdb3 query \
  --token AUTH_TOKEN \
  --database DATABASE_NAME \
  "SELECT * FROM home"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!--pytest.mark.skip-->

```bash
influxdb3 query \
  --token AUTH_TOKEN \
  --database DATABASE_NAME \
  --file ./query.sql
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!--pytest.mark.skip-->

```bash
cat ./query.sql | influxdb3 query --token AUTH_TOKEN --database DATABASE_NAME
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

<!---------------------------------- END SQL ---------------------------------->

{{% /tab-content %}}

{{% tab-content %}}

<!------------------------------- BEGIN INFLUXQL ------------------------------>

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[string](#)
[file](#)
[stdin](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
<!--pytest.mark.skip-->

```bash
influxdb3 query \
  --token AUTH_TOKEN \
  --language influxql \
  --database DATABASE_NAME \
  "SELECT * FROM home"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!--pytest.mark.skip-->

```bash
influxdb3 query \
  --token AUTH_TOKEN \
  --language influxql \
  --file ./query.influxql
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!--pytest.mark.skip-->

```bash
cat ./query.influxql | influxdb3 query \
  --token AUTH_TOKEN \
  --language influxql \
  --database DATABASE_NAME
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

<!-------------------------------- END INFLUXQL ------------------------------->

{{% /tab-content %}}
{{< /tabs-wrapper >}}

{{% /code-placeholders %}}

In the examples above and below, replace the following:

<!-- - {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:
  Database token with read access to the queried database -->
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  Name of the database to query

## Output format

The `influxdb3 query` command supports the following output formats:

- `pretty` _(default)_
- `json`
- `jsonl`
- `csv`
- `parquet` _(must [output to a file](#output-query-results-to-a-parquet-file))_

Use the `--format` flag to specify the output format:

{{% code-placeholders "(DATABASE|AUTH)_(TOKEN|NAME)" %}}
{{% influxdb/custom-timestamps %}}
```sh
influxdb3 query \
  --token AUTH_TOKEN \
  --database DATABASE_NAME \
  --format json \
  "SELECT * FROM home WHERE time >= '2022-01-01T08:00:00Z' LIMIT 5"
```
{{% /influxdb/custom-timestamps %}}
{{% /code-placeholders %}}

{{< expand-wrapper >}}
{{% expand "View example pretty-formatted results" %}}
{{% influxdb/custom-timestamps %}}
```
+----+------+-------------+------+---------------------+
| co | hum  | room        | temp | time                |
+----+------+-------------+------+---------------------+
| 0  | 35.9 | Living Room | 21.1 | 2022-01-01T08:00:00 |
| 0  | 35.9 | Kitchen     | 21.0 | 2022-01-01T08:00:00 |
| 0  | 35.9 | Living Room | 21.4 | 2022-01-01T09:00:00 |
| 0  | 36.2 | Kitchen     | 23.0 | 2022-01-01T09:00:00 |
| 0  | 36.0 | Living Room | 21.8 | 2022-01-01T10:00:00 |
+----+------+-------------+------+---------------------+
```
{{% /influxdb/custom-timestamps %}}
{{% /expand %}}
{{% expand "View example JSON-formatted results" %}}
{{% influxdb/custom-timestamps %}}
```json
[{"co":0,"hum":35.9,"room":"Living Room","temp":21.1,"time":"2022-01-01T08:00:00"},{"co":0,"hum":35.9,"room":"Kitchen","temp":21.0,"time":"2022-01-01T08:00:00"},{"co":0,"hum":35.9,"room":"Living Room","temp":21.4,"time":"2022-01-01T09:00:00"},{"co":0,"hum":36.2,"room":"Kitchen","temp":23.0,"time":"2022-01-01T09:00:00"},{"co":0,"hum":36.0,"room":"Living Room","temp":21.8,"time":"2022-01-01T10:00:00"}]
```
{{% /influxdb/custom-timestamps %}}
{{% /expand %}}
{{% expand "View example JSON-line-formatted results" %}}
{{% influxdb/custom-timestamps %}}
```json
{"co":0,"hum":35.9,"room":"Living Room","temp":21.1,"time":"2022-01-01T08:00:00"}
{"co":0,"hum":35.9,"room":"Kitchen","temp":21.0,"time":"2022-01-01T08:00:00"}
{"co":0,"hum":35.9,"room":"Living Room","temp":21.4,"time":"2022-01-01T09:00:00"}
{"co":0,"hum":36.2,"room":"Kitchen","temp":23.0,"time":"2022-01-01T09:00:00"}
{"co":0,"hum":36.0,"room":"Living Room","temp":21.8,"time":"2022-01-01T10:00:00"}
```
{{% /influxdb/custom-timestamps %}}
{{% /expand %}}
{{% expand "View example CSV-formatted results" %}}
{{% influxdb/custom-timestamps %}}
```csv
co,hum,room,temp,time
0,35.9,Living Room,21.1,2022-01-01T08:00:00
0,35.9,Kitchen,21.0,2022-01-01T08:00:00
0,35.9,Living Room,21.4,2022-01-01T09:00:00
0,36.2,Kitchen,23.0,2022-01-01T09:00:00
0,36.0,Living Room,21.8,2022-01-01T10:00:00
```
{{% /influxdb/custom-timestamps %}}
{{% /expand %}}
{{< /expand-wrapper >}}

## Output query results to a Parquet file

To output query results to a Parquet file, provide the following options with
the `influxdb3 query` command:

- `--format`: `parquet`
- `-o`, `--output`: the filepath to the Parquet file to store results in

{{% code-placeholders "(DATABASE|AUTH)_(TOKEN|NAME)" %}}
{{% influxdb/custom-timestamps %}}
```sh
influxdb3 query \
  --token AUTH_TOKEN \
  --database DATABASE_NAME \
  --format parquet \
  --output path/to/results.parquet \
  "SELECT * FROM home WHERE time >= '2022-01-01T08:00:00Z' LIMIT 5"
```
{{% /influxdb/custom-timestamps %}}
{{% /code-placeholders %}}
