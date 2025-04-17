
Use the [`influxdb3 create token --admin` subcommand](/influxdb3/version/reference/cli/influxdb3/create/token/)
or the [HTTP API](/influxdb3/version/api/v3/)
to create an [admin token](/influxdb3/version/admin/tokens/admin/) for your {{< product-name omit="Clustered" >}} instance.
An admin token grants full access to all actions for your InfluxDB 3 instance.

> [!Note]
> #### Store secure tokens in a secret store
> 
> Token strings are returned _only_ on token creation.
> We recommend storing database tokens in a **secure secret store**.
> If you lose the admin token string, you must regenerate the token.

## Create an admin token

- [Use the influxdb3 CLI](#use-the-influxdb3-cli)
- [Use the HTTP API](#use-the-http-api) 

### Use the influxdb3 CLI

Use the `influxdb3 create token --admin` command:

```bash
influxdb3 create token --admin
```

The command returns the token string in plain text.

To use the token as the default for later commands, and to persist the token
across sessions, assign the token string to the `INFLUXDB3_AUTH_TOKEN` environment variable.

> [!Caution]
> Protect your admin token. Anyone with access to the admin token has full control over your {{< product-name >}} instance.