
The `influxdb3 show retention` command displays retention policies and effective retention periods for tables in your {{< product-name >}} server.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 show retention [OPTIONS]
```

## Options

| Option |              | Description                                                                              |
| :----- | :----------- | :--------------------------------------------------------------------------------------- |
| `-H`   | `--host`     | Host URL of the running {{< product-name >}} server (default is `http://127.0.0.1:8181`) |
|        | `--token`    | _({{< req >}})_ Authentication token                                                     |
|        | `--database` | Filter retention information by database name                                             |
|        | `--format`   | Output format (`pretty` _(default)_, `json`, `jsonl`, `csv`, or `parquet`)               |
|        | `--tls-ca`   | Path to a custom TLS certificate authority (for testing or self-signed certificates)     |
| `-h`   | `--help`     | Print help information                                                                   |
|        | `--help-all` | Print detailed help information                                                          |

### Option environment variables

You can use the following environment variables to set command options:

| Environment Variable      | Option       |
| :------------------------ | :----------- |
| `INFLUXDB3_HOST_URL`      | `--host`     |
| `INFLUXDB3_DATABASE_NAME` | `--database` |
| `INFLUXDB3_AUTH_TOKEN`    | `--token`    |

## Examples

- [Show retention for all tables](#show-retention-for-all-tables)
- [Show retention for a specific database](#show-retention-for-a-specific-database)
- [Show retention in JSON format](#show-retention-in-json-format)

### Show retention for all tables

<!--pytest.mark.skip-->

```bash
influxdb3 show retention \
  --host http://localhost:8181 \
  --token YOUR_AUTH_TOKEN
```

### Show retention for a specific database

<!--pytest.mark.skip-->

```bash
influxdb3 show retention \
  --host http://localhost:8181 \
  --token YOUR_AUTH_TOKEN \
  --database mydb
```

### Show retention in JSON format

<!--pytest.mark.skip-->

```bash
influxdb3 show retention \
  --host http://localhost:8181 \
  --token YOUR_AUTH_TOKEN \
  --format json
```

## Output

The command displays the following information for each table:

- **Database**: The database name
- **Table**: The table name
- **Retention**: The effective retention period in human-readable format (e.g., "7d" for 7 days, "24h" for 24 hours, "infinite" for no retention)
- **Source**: Where the retention policy is defined (`table`, `database`, or `infinite`)

### Example output

```
Database | Table       | Retention | Source
---------|-------------|-----------|----------
mydb     | cpu         | 7d        | database
mydb     | mem         | 24h       | table
mydb     | disk        | infinite  | infinite
```

Tables with table-level retention policies override the database-level retention. Tables without explicit retention policies inherit the database retention or have infinite retention if none is set.
