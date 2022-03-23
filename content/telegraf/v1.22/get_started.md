---
title: Get started
description: Configure and start Telegraf
menu:
  telegraf_1_22:

    name: Get started
    weight: 25
---

After you've [downloaded and installed Telegraf](/{{< latest "telegraf" >}}/install/), you're ready to begin collecting and sending data. To collect and send data, do the following:

1. [Configure Telegraf](#configure-telegraf)
2. [Start Telegraf](#start-telegraf)
3. Use [plugins available in Telegraf](/{{< latest "telegraf" >}}/plugins/) to gather, transform, and output data.

## Configure Telegraf

Define which plugins Telegraf will use in the configuration file. Each configuration file needs at least one enabled [input plugin](/{{< latest "telegraf" >}}/plugins/inputs/) (where the metrics come from) and at least one enabled [output plugin](/{{< latest "telegraf" >}}/plugins/outputs/) (where the metrics go).

The following example generates a sample configuration file with all available plugins, then uses `filter` flags to enable specific plugins.
{{% note %}} For details on `filter` and other flags, see [Telegraf commands and flags](/{{< latest "telegraf" >}}/commands/). {{% /note %}}

1. Run the following command to create a configuration file:
   ```bash
   telegraf --sample-config > telegraf.conf
   ```
2. Locate the configuration file. The location varies depending on your system:
   * macOS [Homebrew](http://brew.sh/): `/usr/local/etc/telegraf.conf`
   * Linux debian and RPM packages: `/etc/telegraf/telegraf.conf`
   * Standalone Binary: see the next section for how to create a configuration file

   > **Note:** You can also specify a remote URL endpoint to pull a configuration file from. See [Configuration file locations](/telegraf/v1.15/administration/configuration/#configuration-file-locations).

3. Edit the configuration file using `vim` or a text editor. Because this example uses [InfluxDB V2 output plugin](https://github.com/influxdata/telegraf/blob/release-1.21/plugins/outputs/influxdb_v2/README.md), we need to add the InfluxDB URL, authentication token, organization, and bucket details to this section of the configuration file.

4. For this example, specify two inputs (`cpu` and `mem`) with the `--input-filter` flag.
Specify InfluxDB as the output with the `--output-filter` flag.

```bash
telegraf --sample-config --input-filter cpu:mem --output-filter influxdb_v2 > telegraf.conf
```

The resulting configuration will collect CPU and memory data and sends it to InfluxDB V2.

## Start Telegraf

Next, you need to start the Telegraf service and direct it to your configuration file:

### macOS [Homebrew](http://brew.sh/)
```bash
telegraf --config telegraf.conf
```

### Linux (sysvinit and upstart installations)
```bash
sudo service telegraf start
```

### Linux (systemd installations)
```bash
systemctl start telegraf
```
