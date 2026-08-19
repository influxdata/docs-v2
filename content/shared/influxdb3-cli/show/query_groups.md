The `influxdb3 show query_groups` command lists the distributed query groups
configured in your {{< product-name >}} cluster.

## Usage

<!--pytest.mark.skip-->

```bash
# Syntax
influxdb3 show query_groups [OPTIONS]
```

## Options

| Option |            | Description                                                                              |
| :----- | :--------- | :--------------------------------------------------------------------------------------- |
| `-H`   | `--host`   | Host URL of the running {{< product-name >}} server (default is `http://127.0.0.1:8181`) |
|        | `--token`  | Authentication token                                                                      |
|        | `--format` | Output format (`pretty` _(default)_ or `json`)                                            |
|        | `--tls-ca` | Path to a custom TLS certificate authority (for testing or self-signed certificates)      |
|        | `--tls-no-verify` | Disable TLS certificate verification (**Not recommended in production**, useful for self-signed certificates) |
| `-h`   | `--help`   | Print help information                                                                    |
|        | `--help-all` | Print detailed help information                                                         |

### Option environment variables

You can use the following environment variables instead of providing CLI options directly:

| Environment Variable      | Option       |
| :------------------------ | :----------- |
| `INFLUXDB3_HOST_URL`      | `--host`     |
| `INFLUXDB3_AUTH_TOKEN`    | `--token`    |
| `INFLUXDB3_TLS_CA`        | `--tls-ca`   |
| `INFLUXDB3_TLS_NO_VERIFY` | `--tls-no-verify` |

## Examples

### List all query groups in pretty format

<!--pytest.mark.skip-->

```bash
influxdb3 show query_groups
```

### List query groups in JSON format

<!--pytest.mark.skip-->

```bash
influxdb3 show query_groups --format json
```

### List query groups on a remote server

<!--pytest.mark.skip-->

```bash { placeholders="AUTH_TOKEN|INFLUXDB_HOST" }
influxdb3 show query_groups \
  --host INFLUXDB_HOST \
  --token AUTH_TOKEN
```

Replace the following:

- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: Authentication token with sufficient privileges
- {{% code-placeholder-key %}}`INFLUXDB_HOST`{{% /code-placeholder-key %}}: Host URL of the running {{< product-name >}} server
