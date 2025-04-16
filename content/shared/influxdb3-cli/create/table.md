
The `influxdb3 create table` command creates a table in a database.

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

> [!Important]
>
> #### Tag and field naming requirements
> 
> Tag and field keys are alphanumeric and must start with a letter or number.
> They can contain dashes (`-`) and underscores (`_`).

### Option environment variables

You can use the following environment variables to set command options:

| Environment Variable      | Option       |
| :------------------------ | :----------- |
| `INFLUXDB3_HOST_URL`      | `--host`     |
| `INFLUXDB3_DATABASE_NAME` | `--database` |
| `INFLUXDB3_AUTH_TOKEN`    | `--token`    |

## Examples

- [Create a table](#create-a-table)
- [Create a table with tag and field columns](#create-a-table-with-tag-and-field-columns)

In the examples below, replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  Database name
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: 
  Authentication token
- {{% code-placeholder-key %}}`TABLE_NAME`{{% /code-placeholder-key %}}: 
  Table name

{{% code-placeholders "(DATABASE|TABLE)_NAME" %}}

### Create a table

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

{{% /code-placeholders %}}
