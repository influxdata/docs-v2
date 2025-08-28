
Create an operator token or named admin token.

## Usage

```
influxdb3 create token --admin [OPTIONS]
```

## Options {.no-shorthand}

| Option          | Description                                                                                                   |
| :-------------- | :------------------------------------------------------------------------------------------------------------ |
| `--regenerate`  | Regenerates the operator token. Requires `--token` and the current operator token                             |
| `--name`        | Name of the token                                                                                             |
| `--expiry`      | Expires in `duration`--for example, 10d for 10 days 1y for 1 year                                             |
| `--host`        | The host URL of the running InfluxDB 3 server [env: `INFLUXDB3_HOST_URL=`] [default: `http://127.0.0.1:8181`] |
| `--token`       | An existing admin token for the InfluxDB 3 server                                                             |
| `--tls-ca`      | An optional arg to use a custom ca for useful for testing with self signed certs                              |
| `--format`      | Output format for token [possible values: `json`, `text`]                                                     |
| `--offline`     | Generate token without connecting to server (for automation)                                                  |
| `--output-file` | File path to save the token (required with `--offline`)                                                       |
| `-h`, `--help`  | Print help information                                                                                        |
| `--help-all`    | Print more detailed help information                                                                          |

## Examples

- [Create an operator token](#create-an-operator-token)
- [Use the operator token to create a named admin token](#use-the-operator-token-to-create-a-named-admin-token)
- [Use the token to create a database](#use-the-token-to-create-a-database)
- [Generate an offline admin token](#generate-an-offline-admin-token)

### Create an operator token

The operator token is a special token that has full administrative privileges on the InfluxDB server and doesn't expire.
The first admin token you create becomes the operator token for the instance.
You can create an operator token using the `--admin` flag without any additional options.

<!--pytest.mark.skip-->

```bash
influxdb3 create token --admin
```

The output is the raw token string you can use to authenticate future CLI commands and API requests.
For CLI commands, use the `--token` option or the `INFLUXDB3_AUTH_TOKEN` environment variable to pass the token string.

### Use the operator token to create a named admin token

<!--pytest.mark.skip-->

```bash { placeholders="OPERATOR_TOKEN|TOKEN_NAME|EXPIRY" }
influxdb3 create token \
  --admin \
  --token OPERATOR_TOKEN \
  --name TOKEN_NAME \
  --expiry DURATION 
```

Replace the following:

- {{% code-placeholder-key %}}`OPERATOR_TOKEN`{{% /code-placeholder-key %}}: Your operator token for the server
- {{% code-placeholder-key %}}`TOKEN_NAME`{{% /code-placeholder-key %}}: Name for your new admin token
- {{% code-placeholder-key %}}`DURATION`{{% /code-placeholder-key %}}: Duration for the token to remain valid, in [humantime](https://docs.rs/humantime/latest/humantime/fn.parse_duration.html) format (for example, `10d` for 10 days or `1y` for 1 year).

### Use the token to create a database

<!--pytest.mark.skip-->

```bash { placeholders="YOUR_ADMIN_TOKEN|DATABASE_NAME" }
influxdb3 create database \
  --token ADMIN_TOKEN \
  DATABASE_NAME
```

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

### Generate an offline admin token

Generate an offline admin token file to use if no tokens exist when the server
starts. Once started, you can interact with the server using the provided token.
Offline admin tokens are designed to help with automated deployments.

Include the following options:

- `--offline` _({{% req %}})_
- `--output-file` _({{% req %}})_
- `--name` _(default is `_admin`)_
- `--expiry` _(Optional)_

<!-- pytest.mark.skip -->

```bash { placeholders="TOKEN_NAME|DURATION|path/to/admin-token.json" }
influxdb3 create token --admin \
  --name TOKEN_NAME \
  --expiry DURATION \
  --offline \
  --output-file path/to/admin-token.json
```

Replace the following:

- {{% code-placeholder-key %}}`TOKEN_NAME`{{% /code-placeholder-key %}}: Name for your offline admin token
- {{% code-placeholder-key %}}`DURATION`{{% /code-placeholder-key %}}: Duration for the token to remain valid, in [humantime](https://docs.rs/humantime/latest/humantime/fn.parse_duration.html) format (for example, `10d` for 10 days or `1y` for 1 year).
- {{% code-placeholder-key %}}`path/to/admin-token.json`{{% /code-placeholder-key %}}: File path to use for the generated token file

{{< expand-wrapper >}}
{{% expand "View example offline admin token file" %}}
```json
{
  "token": "apiv3_0XXXX-xxxXxXxxxXX_OxxxX...",
  "name": "example-admin-token",
  "expiry_millis": 1756400061529
}
```
{{% /expand %}}
{{< /expand-wrapper >}}
