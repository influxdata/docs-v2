---
title: Telegraf commands and flags
description: The `telegraf` command starts and runs all the processes necessary for Telegraf to function.
menu:
  telegraf_1_20:
    name: Commands
    weight: 20
    parent: Administration
---

The `telegraf` command starts and runs all the processes necessary for Telegraf to function.

## Usage

```
telegraf [commands]
telegraf [flags]
```

## Commands

+-----------+------------------------------------------------+
| Command   | Description                                    |
+-----------+------------------------------------------------+
| `config`  | Print out full sample configuration to stdout. |
+-----------+------------------------------------------------+
| `version` | Print version to stdout.                       |
+-----------+------------------------------------------------+

## Flags

+------------------------+--------------------------------------------------------------------------------------------------------------------------------+
| Flag                   | Description                                                                                                                    |
+------------------------+--------------------------------------------------------------------------------------------------------------------------------+
| `--aggregator-filter <filter>`  | Filter the aggregators to enable. Separator is `:`.                                                                            |
+------------------------+--------------------------------------------------------------------------------------------------------------------------------+
| `--config <file>`          | Specify the configuration file to load.                                                                                        |
+------------------------+--------------------------------------------------------------------------------------------------------------------------------+
| `--config-directory <directory>`   | Specify a directory containing additional *.conf files                                                                         |
+------------------------+--------------------------------------------------------------------------------------------------------------------------------+
| `--watch-config`       | Telegraf will restart on local config changes.                                                                                 |
|                        |  Monitor changes using either fs notifications or polling. Valid values are `inotify` or `poll`.                               |
|                        |  Monitoring is off by default.                                                                                                 |
+------------------------+--------------------------------------------------------------------------------------------------------------------------------+
| `--plugin-directory <directory>`   | Specify the directory containing *.so files to search recursively for plugins. Any plugin found will be loaded, tagged, and identified. |
+------------------------+--------------------------------------------------------------------------------------------------------------------------------+
| `--debug`              | Enable debug logging.                                                                                                          |
+------------------------+--------------------------------------------------------------------------------------------------------------------------------+
| `--input-filter <filter>`      | Filter the inputs to enable. Separator is `:`.                                                                                 |
+------------------------+--------------------------------------------------------------------------------------------------------------------------------+
| `--input-list`         | Print available input plugins.                                                                                                 |
+------------------------+--------------------------------------------------------------------------------------------------------------------------------+
| `--output-filter `     | Filter the outputs to enable. Separator is `:`.                                                                                |
+------------------------+--------------------------------------------------------------------------------------------------------------------------------+
| `--output-list`        | Print available output plugins.                                                                                                |
+------------------------+--------------------------------------------------------------------------------------------------------------------------------+
| `--pidfile <file>`           | Specify the file to write PID to.                                                                                          |
+------------------------+--------------------------------------------------------------------------------------------------------------------------------+
| `--pprof-addr <address>`         | Specify pprof address to listen on. This flag  will not activate pprof if empty.                                               |
|                        |                                                                                                                                |
+------------------------+--------------------------------------------------------------------------------------------------------------------------------+
| `--processor-filter <filter>`  | Filter the processors to enable. Separator is `:`.                                                                             |
+------------------------+--------------------------------------------------------------------------------------------------------------------------------+
| `--quiet`              | Run in quiet mode.                                                                                                             |
+------------------------+--------------------------------------------------------------------------------------------------------------------------------+
| `--section-filter <filter>`     | Filter config sections to output. Separator is `:`.                                                                            |
|                        |  Valid values are `agent`, `global_tags`, `outputs`, `processors`, `aggregators` and `inputs`.                                 |
+------------------------+--------------------------------------------------------------------------------------------------------------------------------+
| `--sample-config`      | Print out full sample configuration.                                                                                           |
+------------------------+--------------------------------------------------------------------------------------------------------------------------------+
| `--once`               | Enable once mode: gather metrics once, write them, and exit.                                                                   |
+------------------------+--------------------------------------------------------------------------------------------------------------------------------+
| `--test`               | Enable test mode: gather metrics once and print them.                                                                          |
+------------------------+--------------------------------------------------------------------------------------------------------------------------------+
| `--test-wait`          | Wait up to the specified number of seconds for service inputs to complete in test or once mode.                                |
+------------------------+--------------------------------------------------------------------------------------------------------------------------------+
| `--usage <plugin>`              | Print usage for a plugin. For example, `telegraf --usage mysql`.                                                               |
+------------------------+--------------------------------------------------------------------------------------------------------------------------------+
| `--version`            | Display the version and exit.                                                                                                  |
+------------------------+--------------------------------------------------------------------------------------------------------------------------------+

## Examples

### Generate a telegraf config file

`telegraf config > telegraf.conf`

### Generate config with only CPU input and InfluxDB output plugins defined

`telegraf --input-filter cpu --output-filter influxdb config`

### Run a single Telegraf collection, outputting metrics to stdout

`telegraf --config telegraf.conf --test`

### Run telegraf with all plugins defined in config file:**

`telegraf --config telegraf.conf`

### Run Telegraf, enabling the CPU and memory inputs and InfluxDB output plugins:**

`telegraf --config telegraf.conf --input-filter cpu:mem --output-filter influxdb`

### Run Telegraf with pprof

`telegraf --config telegraf.conf --pprof-addr localhost:6060`
