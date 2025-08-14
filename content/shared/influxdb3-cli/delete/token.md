
The `influxdb3 delete token` command deletes an authorization token from the {{% product-name %}} server.

## Usage

```bash
influxdb3 delete token [OPTIONS]
```

## Options

| Option         | Description                                                                       | Default | Environment            |
|----------------|-----------------------------------------------------------------------------------|---------|------------------------|
| `--token`      | _({{< req >}})_ The token for authentication with the {{% product-name %}} server |         | `INFLUXDB3_AUTH_TOKEN` |
| `--token-name` | _({{< req >}})_ The name of the token to be deleted                               |         |                        |
| `--tls-ca`     | An optional arg to use a custom ca for useful for testing with self signed certs  |         | `INFLUXDB3_TLS_CA`     |
| `-h`   | `--help`             | Print help information                                                                                                                           |
|        | `--help-all`         | Print detailed help information                                                                                                                  |

## Examples

### Delete a token by name

```bash
influxdb3 delete token --token-name TOKEN_TO_DELETE --token AUTH_TOKEN
```

### Show help for the command

```bash
influxdb3 delete token --help
```