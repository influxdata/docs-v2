
The `influx config` command displays the active InfluxDB connection configuration
and manages multiple connection configurations stored, by default, in `~/.influxdbv2/configs`.
Each connection includes a URL, token, associated organization, and active setting.
InfluxDB reads the token from the active connection configuration, so you don't
have to manually enter a token to log into InfluxDB.

## Usage
```
influx config [flags]
influx config [command]
influx config <config-name>
```

##### Quickly switch between configurations
```sh
# Syntax
influx config <config-name>

# Example
influx config local-config
```

To quickly switch back to the previous configuration, use the following command:

```sh
influx config -
```

## Examples
```sh
# Show the active connection configuration
influx config

# Set a connection configuration as active
influx config local-config
```

## Subcommands
| Subcommand                                                   | Description                              |
|:----                                                         |:-----------                              |
| [create](/influxdb/version/reference/cli/influx/config/create/) | Create a connection configuration        |
| [list](/influxdb/version/reference/cli/influx/config/list/)     | List connection configurations           |
| [delete](/influxdb/version/reference/cli/influx/config/rm/)     | Delete a connection configuration        |
| [set](/influxdb/version/reference/cli/influx/config/set/)       | Set or update a connection configuration |

## Flags
| Flag |          | Description                   |
|:---- |:---      |:-----------                   |
| `-h` | `--help` | Help for the `config` command |
