The `influxdb3 delete query_group` command deletes a distributed query group
from your {{< product-name >}} cluster.

## Usage

<!--pytest.mark.skip-->

```bash
# Syntax
influxdb3 delete query_group [OPTIONS] <QUERY_GROUP_ID>
```

## Arguments

- **`QUERY_GROUP_ID`**: (Required) The ID of the query group to delete

## Options

| Option |             | Description                                                                                                    |
| :----- | :---------- | :--------------------------------------------------------------------------------------------------------------- |
| `-H`   | `--host`    | Host URL of the running {{< product-name >}} server (default is `http://127.0.0.1:8181`)                        |
|        | `--token`   | Authentication token                                                                                             |
|        | `--tls-ca`  | Path to a custom TLS certificate authority (for testing or self-signed certificates)                            |
|        | `--tls-no-verify` | Disable TLS certificate verification (**Not recommended in production**, useful for self-signed certificates) |
| `-h`   | `--help`    | Print help information                                                                                            |
|        | `--help-all` | Print detailed help information                                                                                  |

### Option environment variables

You can use the following environment variables instead of providing CLI options directly:

| Environment Variable      | Option       |
| :------------------------ | :----------- |
| `INFLUXDB3_HOST_URL`      | `--host`     |
| `INFLUXDB3_AUTH_TOKEN`    | `--token`    |
| `INFLUXDB3_TLS_CA`        | `--tls-ca`   |
| `INFLUXDB3_TLS_NO_VERIFY` | `--tls-no-verify` |

## Examples

In your commands, replace the following:

- {{% code-placeholder-key %}}`QUERY_GROUP_ID`{{% /code-placeholder-key %}}:
  ID of the query group to delete
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:
  Authentication token with sufficient privileges

### Delete a query group by ID

<!--pytest.mark.skip-->

```bash { placeholders="QUERY_GROUP_ID|AUTH_TOKEN" }
influxdb3 delete query_group QUERY_GROUP_ID --token AUTH_TOKEN
```
