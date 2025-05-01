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

<!--pytest.mark.skip-->

```bash
influxdb3 create database \
  --token YOUR_ADMIN_TOKEN \
  my_new_database
```

> [!Tip] 
> Set the token as an environment variable to simplify repeated commands:
> ```bash 
> export INFLUXDB3_AUTH_TOKEN=YOUR_ADMIN_TOKEN
> ```
