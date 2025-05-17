The `influxdb3 create database` command creates a new database in your {{< product-name >}} instance.

Provide a database name and, optionally, specify connection settings and authentication credentials using flags or environment variables.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 create database [OPTIONS] <DATABASE_NAME>
```

## Arguments


- **`DATABASE_NAME`**: The name of the database to create. Valid database names are alphanumeric and start with a letter or number. Dashes (-) and underscores (_) are allowed.
  
You can also set the database name using the `INFLUXDB3_DATABASE_NAME` environment variable.

## Options

| Option |              | Description                                                                              |
| :----- | :----------- | :--------------------------------------------------------------------------------------- |
| `-H`   | `--host`     | Host URL of the running {{< product-name >}} server (default is `http://127.0.0.1:8181`) |
|        | `--token`    | Authentication token                                                                     |
|        | `--tls-ca`   | Path to a custom TLS certificate authority (for testing or self-signed certificates)     |
| `-h`   | `--help`     | Print help information                                                                   |
|        | `--help-all` | Print detailed help information                                                          |

### Option environment variables

You can use the following environment variables instead of providing CLI options directly:

| Environment Variable      | Option       |
| :------------------------ | :----------- |
| `INFLUXDB3_HOST_URL`      | `--host`     |
| `INFLUXDB3_AUTH_TOKEN`    | `--token`    |

## Examples

The following examples show how to create a database.

In your commands replace the following:
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  Database name
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: 
  Authentication token

{{% code-placeholders "DATABASE_NAME|AUTH_TOKEN" %}}

### Create a database (default)

Creates a database using settings from environment variables and defaults.

<!--pytest.mark.skip-->

```bash
influxdb3 create database DATABASE_NAME
```

### Create a database with an authentication token

Creates a database using the specified arguments.
Flags override their associated environment variables.

<!--pytest.mark.skip-->

```bash
influxdb3 create database --token AUTH_TOKEN DATABASE_NAME
```

{{% /code-placeholders %}}
