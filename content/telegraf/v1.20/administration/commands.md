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



| Command   | Description                                    |
| :-------- | :--------------------------------------------- |
| `config`  | Print out full sample configuration to stdout. |
| `version` | Print version to stdout.                       |

## Flags

| Flag                             | Description                                                                                                                       |
| :------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------- |
| `--aggregator-filter <filter>`   | Filter aggregators to enable. Separator is `:`.                                                                                   |
| `--config <file>`                | Configuration file to load.                                                                                                       |
| `--config-directory <directory>` | Directory containing additional `*.conf` files                                                                                    |
| `--watch-config`                 | Restart Telegraf on local config changes. Use either fs notifications (`inotify`) or polling (`poll`). Disabled by default        |
| `--plugin-directory <directory>` | Directory containing `*.so` files to search recursively for plugins. Found plugins are loaded, tagged, and identified.            |
| `--debug`                        | Enable debug logging.                                                                                                             |
| `--input-filter <filter>`        | Filter inputs to enable. Separator is `:`.                                                                                        |
| `--input-list`                   | Print available input plugins.                                                                                                    |
| `--output-filter`                | Filter outputs to enable. Separator is `:`.                                                                                       |
| `--output-list`                  | Print available output plugins.                                                                                                   |
| `--pidfile <file>`               | File to write PID to.                                                                                                             |
| `--pprof-addr <address>`         | pprof address to listen on. Disabled by default.                                                                                  |
| `--processor-filter <filter>`    | Filter processors to enable. Separator is `:`.                                                                                    |
| `--quiet`                        | Run in quiet mode.                                                                                                                |
| `--section-filter <filter>`      | Filter config sections to output (`agent`, `global_tags`, `outputs`, `processors`, `aggregators` and `inputs`). Separator is `:`. |
| `--sample-config`                | Print full sample configuration.                                                                                                  |
| `--once`                         | Gather metrics once, write them, and exit.                                                                                        |
| `--test`                         | Gather metrics once and print them.                                                                                               |
| `--test-wait`                    | Number of seconds to wait for service inputs to complete in test or once mode.                                                    |
| `--usage <plugin>`               | Print plugin usage (example: `telegraf --usage mysql`).                                                                           |
| `--version`                      | Print Telegraf version                                                                                                            |

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

```sh
telegraf --config telegraf.conf --input-filter cpu:mem --output-filter influxdb
```

### Run Telegraf with pprof

```sh
telegraf --config telegraf.conf --pprof-addr localhost:6060
```
