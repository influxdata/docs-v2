
The `influx config create` command creates a InfluxDB connection configuration
and stores it in a local file:

| OS/Platform                  | CLI config file path                |
| :--------------------------- | :---------------------------------- |
| macOS                        | `~/.influxdbv2/configs`             |
| Linux (installed as binary)  | `~/.influxdbv2/configs`             |
| Linux (installed as service) | `~/var/lib/influxdb/configs`        |
| Windows                      | `%USERPROFILE%\.influxdbv2\configs` |
| Docker (DockerHub)           | `/etc/influxdb2/configs`            |
| Docker (Quay.io)             | `/root/.influxdbv2/configs`         |
| Kubernetes                   | `/etc/influxdb2/configs`            |

To view CLI connection configurations after creating them, use [influx config list](/influxdb/version/reference/cli/influx/config/list/).

{{% note %}}
**Note:** If you create multiple connection configurations (for example, separate admin and user configurations), use [`influx config <config-name>`](/influxdb/version/reference/cli/influx/config/) to switch to the configuration you want to use.
{{% /note %}}

## Usage
```
influx config create [flags]
```

## Flags
| Flag |                       | Description                                                                | Input type | {{< cli/mapped >}}    |
| :--- | :-------------------- | :------------------------------------------------------------------------- | :--------: | :-------------------- |
| `-a` | `--active`            | Set the specified connection to be the active configuration.               |            |                       |
| `-n` | `--config-name`       | ({{< req >}}) Name of the new configuration.                               |   string   |                       |
| `-h` | `--help`              | Help for the `create` command                                              |            |                       |
|      | `--hide-headers`      | Hide table headers (default `false`)                                       |            | `INFLUX_HIDE_HEADERS` |
| `-u` | `--host-url`          | ({{< req >}}) Connection URL for the new configuration.                    |   string   |                       |
|      | `--json`              | Output data as JSON (default `false`)                                      |            | `INFLUX_OUTPUT_JSON`  |
| `-o` | `--org`               | Organization name                                                          |   string   |                       |
| `-t` | `--token`             | API token                                                                  |   string   | `INFLUX_TOKEN`        |
| `-p` | `--username-password` | **(OSS only)** Username (and optionally password) to use for authentication.
Include `username:password` to ensure a session is automatically authenticated. Include `username` (without password) to prompt for a password before creating the session.                                                                       |   string   |

## Examples

- [Create a connection configuration and set it active](#create-a-connection-configuration-and-set-it-active)
- [Create a connection configuration without setting it active](#create-a-connection-configuration-without-setting-it-active)
{{% show-in "v2" %}}- [Create a connection configuration that uses a username and password](#create-a-connection-configuration-that-uses-a-username-and-password){{% /show-in %}}

#### Create a connection configuration and set it active
```sh
influx config create --active \
  -n config-name \
  -u http://localhost:8086 \
  -t mySuP3rS3cr3tT0keN \
  -o example-org
```

#### Create a connection configuration without setting it active
```sh
influx config create \
  -n config-name \
  -u http://localhost:8086 \
  -t mySuP3rS3cr3tT0keN \
  -o example-org
```

{{% show-in "v2" %}}

#### Create a connection configuration that uses a username and password

The **`influx` CLI 2&period;4.0+** lets you create connection configurations
that authenticate with **InfluxDB OSS 2&period;4+** using the username and
password combination that you would use to log into the InfluxDB user interface (UI).
The CLI retrieves a session cookie and stores it, unencrypted, in your
[configs path](/influxdb/version/reference/internals/file-system-layout/#configs-path).

Use the `--username-password`, `-p` option to provide your username and password
using the `<username>:<password>` syntax.
If no password is provided, the CLI will prompt for a password after each
command that requires authentication.

```sh
influx config create \
  -n config-name \
  -u http://localhost:8086 \
  -p example-user:example-password \
  -o example-org
```

{{% /show-in %}}
