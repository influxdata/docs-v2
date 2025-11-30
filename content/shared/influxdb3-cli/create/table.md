
The `influxdb3 create table` command creates a new table in a specified database. Tables must include at least one tag column and can optionally include field columns with defined data types.

> [!Note]
> InfluxDB automatically creates tables when you write line protocol data. Use this command 
> only if you need to define a custom schema or apply a custom partition template before 
> writing data.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 create table [OPTIONS] \
  --tags [<TAGS>...] \
  --database <DATABASE_NAME> \
  --token <AUTH_TOKEN> \
  <TABLE_NAME>
```

## Arguments

- **TABLE_NAME**: The name of the table to create.

## Options
<!--docs:exclude
--table-name: internal variable, use positional <TABLE_NAME>
-->

{{% hide-in "enterprise" %}}
| Option |              | Description                                                                              |
| :----- | :----------- | :--------------------------------------------------------------------------------------- |
| `-H`   | `--host`     | Host URL of the running {{< product-name >}} server (default is `http://127.0.0.1:8181`) |
| `-d`   | `--database` | _({{< req >}})_ Name of the database to operate on                                       |
|        | `--token`    | _({{< req >}})_ Authentication token                                                     |
|        | `--tags`     | _({{< req >}})_ Comma-separated list of tag columns to include in the table              |
|        | `--fields`   | Comma-separated list of field columns and their types to include in the table            |
|        | `--tls-ca`   | Path to a custom TLS certificate authority (for testing or self-signed certificates)     |
| `-h`   | `--help`     | Print help information                                                                   |
|        | `--help-all` | Print detailed help information                                                          |
{{% /hide-in %}}

<!-- Using the show-in shortcode for only the retention-period option breaks the formatting in Core -->
{{% show-in "enterprise" %}}
| Option |                      | Description                                                                                                                                      |
| :----- | :------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------- |
| `-H`   | `--host`             | Host URL of the running {{< product-name >}} server (default is `http://127.0.0.1:8181`)                                                         |
| `-d`   | `--database`         | _({{< req >}})_ Name of the database to operate on                                                                                               |
|        | `--retention-period` | [Retention period](/influxdb3/version/reference/glossary/#retention-period) ([duration](/influxdb3/version/reference/glossary/#duration) value, for example: `30d`, `24h`, `1h`) for data in the table|
|        | `--token`            | _({{< req >}})_ Authentication token                                                                                                             |
|        | `--tags`             | _({{< req >}})_ Comma-separated list of tag columns to include in the table                                                                      |
|        | `--fields`           | Comma-separated list of field columns and their types to include in the table                                                                    |
|        | `--tls-ca`           | Path to a custom TLS certificate authority (for testing or self-signed certificates)                                                             |
| `-h`   | `--help`             | Print help information                                                                                                                           |
|        | `--help-all`         | Print detailed help information                                                                                                                  |
{{% /show-in %}}

> [!Important]
>
> #### Tag and field naming requirements
> 
> Tag and field keys are alphanumeric and must start with a letter or number.
> They can contain dashes (`-`) and underscores (`_`).

### Option environment variables

You can use the following environment variables to set options instead of passing them via CLI flags:

| Environment Variable      | Option       |
| :------------------------ | :----------- |
| `INFLUXDB3_HOST_URL`      | `--host`     |
| `INFLUXDB3_DATABASE_NAME` | `--database` |
| `INFLUXDB3_AUTH_TOKEN`    | `--token`    |

## Examples

In the following examples, replace each placeholder with your actual values:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  The database name
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: 
  Authentication token
- {{% code-placeholder-key %}}`TABLE_NAME`{{% /code-placeholder-key %}}: 
  A name for the new table

{{% code-placeholders "DATABASE_NAME|TABLE_NAME|AUTH_TOKEN" %}}

### Create an empty table

<!--pytest.mark.skip-->

```bash
influxdb3 create table \
  --tags tag1,tag2,tag3 \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  TABLE_NAME
```

### Create a table with tag and field columns

<!--pytest.mark.skip-->

```bash
influxdb3 create table \
  --tags room,sensor_id \
  --fields temp:float64,hum:float64,co:int64 \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  TABLE_NAME
```

{{% show-in "enterprise" %}}
### Create a table with a retention period

<!--pytest.mark.skip-->

```bash
influxdb3 create table \
  --tags room,sensor_id \
  --fields temp:float64,hum:float64 \
  --retention-period 7d \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  TABLE_NAME
```
{{% /show-in %}}

### Verification

Use the `SHOW TABLES` query to verify that the table was created successfully:

<!--pytest.mark.skip-->

```bash
influxdb3 query \
  --database my_test_db \
  --token AUTH_TOKEN \
  "SHOW TABLES"

Example output:

+---------------+--------------------+----------------------------+------------+
| table_catalog | table_schema       | table_name                 | table_type |
+---------------+--------------------+----------------------------+------------+
| public        | iox                | my_sensor_table            | BASE TABLE |
| public        | system             | distinct_caches            | BASE TABLE |
| public        | system             | last_caches                | BASE TABLE |
| public        | system             | parquet_files              | BASE TABLE |
+---------------+--------------------+----------------------------+------------+
```

> [!Note]
> `SHOW TABLES` is an SQL query. It isn't supported in InfluxQL.

{{% /code-placeholders %}}
