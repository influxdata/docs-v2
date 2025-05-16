The `influxdb3 create token` command creates a new authentication token.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 create token <SUBCOMMAND>
```

## Commands

| Command | Description                                                                 |
| :----- | :----------- | :------------------------------ |
| `--admin` | Create an admin token for the {{< product-name >}} server. |
{{% show-in "enterprise" %}}| [`--permission`](/influxdb3/enterprise/reference/cli/influxdb3/create/token/permission/) | Create a resource token with fine-grained access permissions. |{{% /show-in %}}

## Options

| Option |          | Description            |
| :----- | :------- | :--------------------- |
|        |`--admin`| Create an admin token  |
| `-h`   | `--help` | Print help information |


## Examples

### Create an admin token

<!--pytest.mark.skip-->

```bash
influxdb3 create token --admin
```

This returns a token string. You can use it to authenticate future requests by setting it with `--token` or the `INFLUXDB3_AUTH_TOKEN` environment variable.

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

- {{% code-placeholder-key %}}`YOUR_ADMIN_TOKEN`{{% /code-placeholder-key %}}: Your InfluxDB admin token
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: Name for your new database

> [!Note] 
> Set the token as an environment variable to simplify repeated commands:
> ```bash 
> export INFLUXDB3_AUTH_TOKEN=YOUR_ADMIN_TOKEN
> ```
