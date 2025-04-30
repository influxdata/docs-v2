
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
