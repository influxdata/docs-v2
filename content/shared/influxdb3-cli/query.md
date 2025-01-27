
The `influxdb3 query` command executes a query against a running
{{< product-name >}} server.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 query [OPTIONS] --database <DATABASE_NAME> [QUERY]...
```

##### Aliases

`query`, `q`

## Arguments

- **QUERY**: The query to execute. Provide the query in one of the following ways:

  - a string on the command line
  - a path to a file that contains the query using the `--file` option
  - from stdin

## Options

| Option |              | Description                                                                              |
| :----- | :----------- | :--------------------------------------------------------------------------------------- |
| `-H`   | `--host`     | Host URL of the running {{< product-name >}} server (default is `http://127.0.0.1:8181`) |
| `-d`   | `--database` | _({{< req >}})_ Name of the database to operate on                                       |
|        | `--token`    | Authentication token                                                                     |
| `-l`   | `--language` | Query language of the query string (`sql` _(default)_ or `influxql`)                     |
|        | `--format`   | Output format (`pretty` _(default)_, `json`, `jsonl`, `csv`, `parquet`)                  |
| `-o`   | `--output`   | Output query results to the specified file                                               |
| `-f`   | `--file`     | File containing the query to execute                                                     |
| `-h`   | `--help`     | Print help information                                                                   |

### Option environment variables

You can use the following environment variables to set command options:

| Environment Variable      | Option       |
| :------------------------ | :----------- |
| `INFLUXDB3_HOST_URL`      | `--host`     |
| `INFLUXDB3_DATABASE_NAME` | `--database` |
| `INFLUXDB3_AUTH_TOKEN`    | `--token`    |

## Examples

- [Query data using SQL](#query-data-using-sql)
- [Query data using InfluxQL](#query-data-using-influxql)
- [Query data and return JSON-formatted results](#query-data-and-return-json-formatted-results)
- [Query data and write results to a file](#query-data-and-write-results-to-a-file)

In the examples below, replace
{{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
with the name of the database to query.

{{% code-placeholders "DATABASE_NAME" %}}

### Query data using SQL

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[string](#)
[file](#)
[stdin](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
<!--pytest.mark.skip-->

```bash
influxdb3 query --database DATABASE_NAME 'SELECT * FROM home'
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!--pytest.mark.skip-->

```bash
influxdb3 query --database DATABASE_NAME --file ./query.sql
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!--pytest.mark.skip-->

```bash
cat ./query.sql | influxdb3 query --database DATABASE_NAME
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

### Query data using InfluxQL

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
  --language influxql \
  --database DATABASE_NAME \
  'SELECT * FROM home'
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!--pytest.mark.skip-->

```bash
influxdb3 query \
  --language influxql \
  --database DATABASE_NAME \
  --file ./query.influxql
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!--pytest.mark.skip-->

```bash
cat ./query.influxql | influxdb3 query \
  --language influxql \
  --database DATABASE_NAME
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

### Query data and return JSON-formatted results

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
  --format json \
  --database DATABASE_NAME \
  'SELECT * FROM home'
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!--pytest.mark.skip-->

```bash
influxdb3 query \
  --format json \
  --database DATABASE_NAME \
  --file ./query.sql
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!--pytest.mark.skip-->

```bash
cat ./query.sql | influxdb3 query \
  --format json \
  --database DATABASE_NAME
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

### Query data and write results to a file

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
  --output /path/to/results.txt \
  --database DATABASE_NAME \
  'SELECT * FROM home'
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!--pytest.mark.skip-->

```bash
influxdb3 query \
  --output /path/to/results.txt \
  --database DATABASE_NAME \
  --file ./query.sql
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!--pytest.mark.skip-->

```bash
cat ./query.sql | influxdb3 query \
  --output /path/to/results.txt \
  --database DATABASE_NAME
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

{{% /code-placeholders %}}
