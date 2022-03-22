---
title: Get started
description: Install Telegraf on your operating system.
menu:
  telegraf_1_22:

    name: Get started
    weight: 25
---

Use Telegraf to collect and write metrics into InfluxDB and other supported outputs.


## Configure Telegraf


Before starting the Telegraf server, create or edit the initial configuration file. Each configuration file needs at least one [input plugin]((/{{< latest "telegraf" >}}/plugins/inputs/) (where the metrics come from) and at least one [output plugin](({{< latest "telegraf" >}}/plugins/outputs/) (where the metrics go).

The following example generates a sample configuration file with all available plugins, then uses `filter` flags to enable specific plugins. For a complete list of commands and flags, see .

1. Run the following command to create a configuration file:
```bash
telegraf --sample-config > telegraf.conf
```

2. Locate the configuration file:
* macOS [Homebrew](http://brew.sh/): `/usr/local/etc/telegraf.conf`
* Linux debian and RPM packages: `/etc/telegraf/telegraf.conf`
* Standalone Binary: see the next section for how to create a configuration file

> **Note:** You can also specify a remote URL endpoint to pull a configuration file from. See [Configuration file locations](/telegraf/v1.15/administration/configuration/#configuration-file-locations).

3. Edit the configuration file?
  - This example doesn't show that.
  - Ask sam: vim or use text editor. Each plugin has its own corresponding readme.

4. Simplify this configuration file by specifying which plugins you want to use with `filter` flags.
For this example, you can specify two inputs (`cpu` and `mem`) with the `--input-filter` flag.
Specify InfluxDB as the output with the `--output-filter` flag.

```bash
telegraf --sample-config --input-filter cpu:mem --output-filter influxdb_v2 > telegraf.conf
```

The resulting config will have `cpu` and `mem` reading metrics about the system's cpu usage and memory usage, and then output this data to InfluxDB. Note that after running the following command, the output plugin `influxdb_v2` will still need to be configured with your url, organization and bucket.


## Start Telegraf service

Start the Telegraf service and direct it to the relevant configuration file or URL to pull a configuration file from a remote endpoint:

### macOS [Homebrew](http://brew.sh/)
```bash
telegraf --config telegraf.conf
```

<!--so for the other ones, you have to do a custom start but not mac?-->

### Linux (sysvinit and upstart installations)
```bash
sudo service telegraf start
```

### Linux (systemd installations)
```bash
systemctl start telegraf
```

## Results

Telegraf starts collecting and writing data to the specified output.

That's it! You ready to use Telegraf to collect metrics and write them to your output of choice.
