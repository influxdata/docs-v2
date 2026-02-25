The `influxdb3 create database` command creates a new database in your {{< product-name >}} instance.

Provide a database name and, optionally, specify connection settings and authentication credentials using flags or environment variables.

## Usage

<!--pytest.mark.skip-->

```bash
# Syntax
influxdb3 create database [OPTIONS] <DATABASE_NAME>
```

## Arguments


- **`DATABASE_NAME`**: The name of the database to create. Valid database names are alphanumeric and start with a letter or number. Dashes (-) and underscores (_) are allowed.
  
You can also set the database name using the `INFLUXDB3_DATABASE_NAME` environment variable.

## Options

<!--docs:exclude
--database-name: internal variable, use positional <DATABASE_NAME>
-->

| Option |                      | Description                                                                                                                                      |
| :----- | :------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------- |
| `-H`   | `--host`             | Host URL of the running {{< product-name >}} server (default is `http://127.0.0.1:8181`)                                                         |
|        | `--retention-period` | Database [retention period](/influxdb3/version/reference/glossary/#retention-period) ([duration](/influxdb3/version/reference/glossary/#duration) value, for example: `30d`, `24h`, `1h`) |
|        | `--token`            | Authentication token                                                                                                                             |
|        | `--tls-ca`           | Path to a custom TLS certificate authority (for self-signed or internal certificates)                                                            |
|        | `--tls-no-verify`    | Disable TLS certificate verification. **Not recommended in production.** Useful for testing with self-signed certificates                        |
| `-h`   | `--help`             | Print help information                                                                                                                           |
|        | `--help-all`         | Print detailed help information                                                                                                                  |

### Option environment variables

You can use the following environment variables instead of providing CLI options directly:

| Environment Variable      | Option            |
| :------------------------ | :---------------- |
| `INFLUXDB3_HOST_URL`      | `--host`          |
| `INFLUXDB3_AUTH_TOKEN`    | `--token`         |
| `INFLUXDB3_TLS_NO_VERIFY` | `--tls-no-verify` |

## Examples

The following examples show how to create a database.

In the examples below, replace the following:
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  Database name
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:
  Authentication token

### Create a database (default)

Creates a database using settings from environment variables and defaults.

<!--pytest.mark.skip-->

```bash { placeholders="DATABASE_NAME" }
influxdb3 create database DATABASE_NAME
```

### Create a database with an authentication token

Creates a database using the specified arguments.
Flags override their associated environment variables.

<!--pytest.mark.skip-->

```bash { placeholders="AUTH_TOKEN|DATABASE_NAME" }
influxdb3 create database --token AUTH_TOKEN DATABASE_NAME
```

### Create a database with a retention period

Creates a database with a 30-day retention period.
Data older than 30 days will not be queryable.

<!--pytest.mark.skip-->

```bash { placeholders="DATABASE_NAME" }
influxdb3 create database --retention-period 30d DATABASE_NAME
```

### Create a database with infinite retention

Creates a database with no retention period (data never expires).

<!--pytest.mark.skip-->

```bash { placeholders="DATABASE_NAME" }
influxdb3 create database --retention-period none DATABASE_NAME
```

### Create a database with a 90-day retention period

Creates a database with a 90-day retention period using an authentication token.

<!--pytest.mark.skip-->

```bash { placeholders="AUTH_TOKEN|DATABASE_NAME" }
influxdb3 create database \
  --retention-period 90d \
  --token AUTH_TOKEN \
  DATABASE_NAME
```

### Create a database with a 1-year retention period

Creates a database with a 1-year retention period.

<!--pytest.mark.skip-->

```bash { placeholders="DATABASE_NAME" }
influxdb3 create database --retention-period 1y DATABASE_NAME
```

### Create a database with a combined duration

Creates a database with a retention period of 30 days and 12 hours.

<!--pytest.mark.skip-->

```bash { placeholders="DATABASE_NAME" }
influxdb3 create database --retention-period 30d12h DATABASE_NAME
```

## Retention period duration formats

Retention periods are specified as [duration](/influxdb3/version/reference/glossary/#duration)
values using a numeric value plus a duration unit.

### Valid duration units

| Unit | Description |
|:-----|:------------|
| `h`  | hour        |
| `d`  | day         |
| `w`  | week        |
| `mo` | month (30 days) |
| `y`  | year (365 days) |

> [!Note]
> Minute (`m`) and second (`s`) units are not supported for retention periods.

> [!Warning]
> #### Retention period constraints
>
> - **Minimum for data retention**: The practical minimum retention period is 1 hour (`1h`).
> - **Zero-duration periods**: Setting a retention period to `0<unit>` (for example,
>   `0d` or `0h`) is allowed but marks all data for immediate deletion at query time.
>   _This differs from InfluxDB 1.x and 2.x where `0d` meant infinite retention._
> - **Infinite retention**: Use `none` to set an infinite retention period.

### Example duration values

- `1h` - 1 hour
- `24h` - 24 hours
- `7d` - 7 days
- `4w` - 4 weeks
- `30d` - 30 days
- `1mo` - 1 month (30 days)
- `90d` - 90 days
- `1y` - 1 year (365 days)
- `none` - infinite (data never expires)

You can combine units: `30d12h` (30.5 days), `1y6mo` (545 days)

For complete details about retention periods, see
[Data retention in {{< product-name >}}](/influxdb3/version/reference/internals/data-retention/).
