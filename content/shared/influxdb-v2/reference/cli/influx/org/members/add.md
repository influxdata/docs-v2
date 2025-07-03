
The `influx org members add` command adds a member to an organization in InfluxDB.

## Usage
```
influx org members add [flags]
```

## Flags
| Flag |                 | Description                                                | Input type | {{< cli/mapped >}}   |
| :--- | :-------------- | :--------------------------------------------------------- | :--------: | :------------------- |
| `-h` | `--help`        | Help for the `add` command                                 |            |                      |
|      | `--host`        | HTTP address of InfluxDB (default `http://localhost:8086`) |   string   | `INFLUX_HOST`        |
| `-i` | `--id`          | Organization ID                                            |   string   | `INFLUX_ORG_ID`      |
| `-m` | `--member`      | User ID                                                    |   string   |                      |
| `-n` | `--name`        | Organization name                                          |   string   | `INFLUX_ORG`         |
|      | ` --owner`      | Set new member as an owner                                 |            |                      |
|      | `--skip-verify` | Skip TLS certificate verification                          |            | `INFLUX_SKIP_VERIFY` |
| `-t` | `--token`       | API token                                                  |   string   | `INFLUX_TOKEN`       |

## Examples

{{< cli/influx-creds-note >}}

##### Add a member to an organization
```sh
influx org members add \
  --member 00x0oo0X0xxxo000 \
  --name example-org
```

##### Add a member to an organization and make them an owner
```sh
influx org members add \
  --member 00x0oo0X0xxxo000 \
  --name example-org \
  --owner
```
