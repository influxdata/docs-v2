
The `influxdb3 create token` command creates a new authentication token.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 create token <SUBCOMMAND>
```

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

This creates an admin token with full access to the system.
