The `influxdb3 create token` command creates a new authentication token. This returns the raw token string. Use it to authenticate future CLI commands and API requests.

> [!Important]
> InfluxDB displays the raw token string only once. Be sure to copy and securely store it.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 create token <SUBCOMMAND>
```

## Commands

| Command | Description                                                                 |
| :----- | :----------- | :------------------------------ |
| [`--admin`](/influxdb3/version/reference/cli/influxdb3/create/token/admin/) | Create an operator or named admin token for the {{< product-name >}} server. |
{{% show-in "enterprise" %}}| [`--permission`](/influxdb3/enterprise/reference/cli/influxdb3/create/token/permission/) | Create a resource token with fine-grained access permissions. |{{% /show-in %}}

## Options

| Option |          | Description            |
| :----- | :------- | :--------------------- |
|        |`--admin`| Create an admin token  |
| `-h`   | `--help` | Print help information |


