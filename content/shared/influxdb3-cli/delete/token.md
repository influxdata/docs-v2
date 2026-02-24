
The `influxdb3 delete token` command deletes an authorization token from the {{% product-name %}} server.

## Usage

```bash
# Syntax
influxdb3 delete token [OPTIONS]
```

## Options

| Option             | Description                                                                       | Default | Environment                |
|--------------------|-----------------------------------------------------------------------------------|---------|----------------------------|
| `--token`          | _({{< req >}})_ The token for authentication with the {{% product-name %}} server |         | `INFLUXDB3_AUTH_TOKEN`     |
| `--token-name`     | _({{< req >}})_ The name of the token to be deleted                               |         |                            |
| `--tls-ca`         | Path to a custom TLS certificate authority (for self-signed or internal certificates) |         | `INFLUXDB3_TLS_CA`         |
| `--tls-no-verify`  | Disable TLS certificate verification. **Not recommended in production.** Useful for testing with self-signed certificates |         | `INFLUXDB3_TLS_NO_VERIFY` |
| `-h`, `--help`     | Print help information                                                            |         |                            |
| `--help-all`       | Print detailed help information                                                   |         |                            |

## Examples

In the examples below, replace the following:

- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:
  Authentication token with permission to delete tokens
- {{% code-placeholder-key %}}`TOKEN_TO_DELETE`{{% /code-placeholder-key %}}:
  Name of the token to delete

### Delete a token by name

```bash { placeholders="AUTH_TOKEN|TOKEN_TO_DELETE" }
influxdb3 delete token --token-name TOKEN_TO_DELETE --token AUTH_TOKEN
```

### Show help for the command

```bash
influxdb3 delete token --help
```