
The `influxdb3 show databases` command lists databases in your
{{< product-name >}} server.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 show databases [OPTIONS]
```

## Options

| Option |                  | Description                                                                              |
| :----- | :--------------- | :--------------------------------------------------------------------------------------- |
| `-H`   | `--host`         | Host URL of the running {{< product-name >}} server (default is `http://127.0.0.1:8181`) |
| `-d`   | `--database`     | _({{< req >}})_ Name of the database to operate on                                       |
|        | `--token`        | Authentication token                                                                     |
|        | `--show-deleted` | Include databases marked as deleted in the output                                        |
|        | `--format`       | Output format (`pretty` _(default)_, `json`, `jsonl`, `csv`, or `parquet`)               |
| `-h`   | `--help`         | Print help information                                                                   |

### Option environment variables

You can use the following environment variables to set command options:

| Environment Variable      | Option       |
| :------------------------ | :----------- |
| `INFLUXDB3_HOST_URL`      | `--host`     |
| `INFLUXDB3_DATABASE_NAME` | `--database` |
| `INFLUXDB3_AUTH_TOKEN`    | `--token`    |

## Examples

- [List all databases](#list-all-databases)
- [List all databases, including deleted databases](#list-all-databases-including-deleted-databases)
- [List databases in JSON-formatted output](#list-databases-in-json-formatted-output)

### List all databases

<!--pytest.mark.skip-->

```bash
influxdb3 show databases
```

### List all databases, including deleted databases

<!--pytest.mark.skip-->

```bash
influxdb3 show databases --show-deleted
```

### List databases in JSON-formatted output

<!--pytest.mark.skip-->

```bash
influxdb3 show databases --format json
```
