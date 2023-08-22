---
title: Get started
description: Configure and start Telegraf
menu:
  telegraf_1_27:
    name: Get started
    weight: 30
aliases:
  - /telegraf/v1.27/introduction/getting-started/
  - /telegraf/v1.27/get_started/
---

After you've [downloaded and installed Telegraf](/telegraf/v1.27/install/), you're ready to begin collecting and sending data. To collect and send data, do the following:

1. [Configure Telegraf](#configure-telegraf)
2. [Start Telegraf](#start-telegraf)
3. Use [plugins available in Telegraf](/telegraf/v1.27/plugins/) to gather, transform, and output data.

## Configure Telegraf

Define which plugins Telegraf will use in the configuration file. Each configuration file needs at least one enabled [input plugin](/telegraf/v1.27/plugins/inputs/) (where the metrics come from) and at least one enabled [output plugin](/telegraf/v1.27/plugins/outputs/) (where the metrics go).

The following example generates a sample configuration file with all available plugins, then uses `filter` flags to enable specific plugins.

{{% note %}}
For details on `filter` and other flags, see [Telegraf commands and flags](/telegraf/v1.27/commands/).
{{% /note %}}

1. Run the following command to create a configuration file:
   ```bash
   telegraf --sample-config > telegraf.conf
   ```
2. Locate the configuration file. The location varies depending on your system:
   * macOS [Homebrew](http://brew.sh/): `/usr/local/etc/telegraf.conf`
   * Linux debian and RPM packages: `/etc/telegraf/telegraf.conf`
   * Standalone Binary: see the next section for how to create a configuration file

   > **Note:** You can also specify a remote URL endpoint to pull a configuration file from. See [Configuration file locations](/telegraf/v1.27/configuration/#configuration-file-locations).

3. Edit the configuration file using `vim` or a text editor. Because this example uses [InfluxDB V2 output plugin](https://github.com/influxdata/telegraf/blob/release-1.21/plugins/outputs/influxdb_v2/README.md), we need to add the InfluxDB URL, authentication token, organization, and bucket details to this section of the configuration file.

  > **Note:** For more configuration file options, see [Configuration options](/telegraf/v1.27/configuration/).

4. For this example, specify two inputs (`cpu` and `mem`) with the `--input-filter` flag.
Specify InfluxDB as the output with the `--output-filter` flag.

```bash
telegraf --sample-config --input-filter cpu:mem --output-filter influxdb_v2 > telegraf.conf
```

The resulting configuration will collect CPU and memory data and sends it to InfluxDB V2.

For an overview of how to configure a plugin, watch the following video:

{{< youtube a0js7wiQEJ4 >}}


## Set environment variables

Add environment variables anywhere in the configuration file by prepending them with `$`.
For strings, variables must be in quotes (for example, `"$STR_VAR"`).
For numbers and Booleans, variables must be unquoted (for example, `$INT_VAR`, `$BOOL_VAR`).

You can also set environment variables using the Linux `export` command: `export password=mypassword`

> **Note:** We recommend using environment variables for sensitive information.

### Example: Telegraf environment variables

In the Telegraf environment variables file (`/etc/default/telegraf`):

```sh
USER="alice"
INFLUX_URL="http://localhost:8086"
INFLUX_SKIP_DATABASE_CREATION="true"
INFLUX_PASSWORD="monkey123"
```

In the Telegraf configuration file (`/etc/telegraf.conf`):

```sh
[global_tags]
  user = "${USER}"

[[inputs.mem]]

[[outputs.influxdb]]
  urls = ["${INFLUX_URL}"]
  skip_database_creation = ${INFLUX_SKIP_DATABASE_CREATION}
  password = "${INFLUX_PASSWORD}"
```

The environment variables above add the following configuration settings to Telegraf:

```sh
[global_tags]
  user = "alice"

[[outputs.influxdb]]
  urls = "http://localhost:8086"
  skip_database_creation = true
  password = "monkey123"

```

## Start Telegraf

Next, you need to start the Telegraf service and direct it to your configuration file:

### macOS [Homebrew](http://brew.sh/)
```bash
telegraf --config telegraf.conf
```

### Linux (systemd installations)
```bash
systemctl start telegraf
```
