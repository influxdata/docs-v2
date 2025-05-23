
The `influx v1 auth` subcommands provide authorization management for the
[InfluxDB 1.x compatibility API](/influxdb/version/reference/api/influxdb-1x/).

InfluxDB {{< current-version >}} uses [API tokens](/influxdb/version/admin/tokens/) to authorize API requests.
The [1.x compatibility API](/influxdb/version/reference/api/influxdb-1x/) lets clients authenticate with InfluxDB {{< current-version >}} using the InfluxDB 1.x convention of username and password.

{{% note %}}
v1-compatible authorizations are separate from the credentials used to log
into the InfluxDB user interface.
{{% /note %}}

## Usage
```
influx v1 auth [flags]
influx v1 auth [command]
```

#### Command aliases
`auth`, `authorization`

## Commands

| Command                                                                     | Description                                  |
|:----------------------------------------------------------------------------|:---------------------------------------------|
| [create](/influxdb/version/reference/cli/influx/v1/auth/create/)             | Create authorization                         |
| [delete](/influxdb/version/reference/cli/influx/v1/auth/delete/)             | Delete authorization                         |
| [list](/influxdb/version/reference/cli/influx/v1/auth/list/)                 | List authorizations                          |
| [set-active](/influxdb/version/reference/cli/influx/v1/auth/set-active/)     | Activate an authorization                    |
| [set-inactive](/influxdb/version/reference/cli/influx/v1/auth/set-inactive/) | Deactivate an authorization                  |
| [set-password](/influxdb/version/reference/cli/influx/v1/auth/set-password/) | Set a password for an existing authorization |

## Flags
| Flag |          | Description                     |
|:-----|:---------|:--------------------------------|
| `-h` | `--help` | Help for the `v1 auth ` command |
