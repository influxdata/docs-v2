
Create a new operator or named admin token.

## Usage

```
influxdb3 create token --admin [OPTIONS]
```

## Options

| Option | Description |
|:-------|:------------|
| `--regenerate` | Regenerates the operator token. Requires `--token` and the current operator token |
| `--name <NAME>` | Name of the token |
| `--expiry <EXPIRY>` | Expires in `duration`, e.g 10d for 10 days 1y for 1 year |
| `--host <host>` | The host URL of the running InfluxDB 3 server [env: INFLUXDB3_HOST_URL=] [default: http://127.0.0.1:8181] |
| `--token <token>` | An existing admin token for the InfluxDB 3 server |
| `--tls-ca <tls-ca>` | An optional arg to use a custom ca for useful for testing with self signed certs |
| `--format <FORMAT>` | Output format for token, supports just json or text [possible values: json, text] |
| `-h`, `--help` | Print help information |
| `--help-all` | Print more detailed help information |

## Examples

### Create an operator token

<!--pytest.mark.skip-->

```bash
influxdb3 create token --admin
```

The output is the raw token string you can use to authenticate future CLI commands and API requests.
For CLI commands, use the `--token` option or the `INFLUXDB3_AUTH_TOKEN` environment variable to pass the token string.

### Use the operator token to create a named admin token

{{% code-placeholders "OPERATOR_TOKEN|TOKEN_NAME|EXPIRY" %}}
<!--pytest.mark.skip-->

```bash
influxdb3 create token \
  --admin \
  --token OPERATOR_TOKEN \
  --name TOKEN_NAME \
  --expiry DURATION 
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`OPERATOR_TOKEN`{{% /code-placeholder-key %}}: Your operator token for the server
- {{% code-placeholder-key %}}`TOKEN_NAME`{{% /code-placeholder-key %}}: Name for your new admin token
- {{% code-placeholder-key %}}`DURATION`{{% /code-placeholder-key %}}: Duration for the token to remain valid, in [humantime](https://docs.rs/humantime/latest/humantime/fn.parse_duration.html) format (for example, `10d` for 10 days or `1y` for 1 year).

### Use the token to create a database

{{% code-placeholders "YOUR_ADMIN_TOKEN|DATABASE_NAME" %}}

<!--pytest.mark.skip-->

```bash
influxdb3 create database \
  --token ADMIN_TOKEN \
  DATABASE_NAME
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`ADMIN_TOKEN`{{% /code-placeholder-key %}}: Your InfluxDB admin token
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: Name for your new database

> [!Note]
> #### Use CLI environment variables
> Set the token as an environment variable to simplify repeated CLI commands:
> 
> ```bash 
> export INFLUXDB3_AUTH_TOKEN=ADMIN_TOKEN
> ```
