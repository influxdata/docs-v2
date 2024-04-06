---
title: Telegraf commands and flags
description: The `telegraf` command starts and runs all the processes necessary for Telegraf to function.
menu:
  telegraf_v1_ref:
    name: Telegraf commands
    weight: 25
---

The `telegraf` command starts and runs all the processes necessary for Telegraf to function.

## Usage

```
telegraf [commands]
telegraf [flags]
```

## Commands

| Command                                   | Description                                  |
| :---------------------------------------- | :------------------------------------------- |
| [config](/telegraf/v1/commands/config/)   | Generate and migrate Telegraf configurations |
| [secrets](/telegraf/v1/commands/secrets/) | Manage secrets in secret stores              |
| [plugins](/telegraf/v1/commands/plugins/) | Print available plugins                      |
| [version](/telegraf/v1/commands/version/) | Print current version to stdout              |

## Global flags {id="telegraf-global-flags"}

| Flag                             | Description                                                                                                                                       |
| :------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--config <file>`                | Configuration file to load.                                                                                                                       |
| `--config-directory <directory>` | Directory containing additional `*.conf` files.                                                                                                   |
| `--test-wait`                    | Number of seconds to wait for service inputs to complete in test or once mode.                                                                    |
| `--usage <plugin>`               | Print plugin usage (example: `telegraf --usage mysql`).                                                                                           |
| `--pprof-addr <address>`         | pprof address to listen on. Disabled by default.                                                                                                  |
| `--watch-config`                 | Restart Telegraf on local configuration changes. Use either fs notifications (`notify`) or polling (`poll`). Disabled by default.                 |
| `--pidfile <file>`               | File to write PID to.                                                                                                                             |
| `--password <password>`          | Password to unlock secret stores.                                                                                                                 |
| `--old-env-behavior`             | Switch back to pre-v1.27 environment replacement behavior.                                                                                        |
| `--once`                         | Gather metrics once, write them, and exit.                                                                                                        |
| `--debug`                        | Enable debug logging.                                                                                                                             |
| `--quiet`                        | Run in quiet mode.                                                                                                                                |
| `--unprotected`                  | Do not protect secrets in memory.                                                                                                                 |
| `--test`                         | Gather metrics once and print them.                                                                                                               |
| `--deprecation-list`             | Print all deprecated plugins or plugin options.                                                                                                   |
| `--input-list`                   | Print available input plugins.                                                                                                                    |
| `--output-list`                  | Print available output plugins.                                                                                                                   |
| `--version`                      | ({{< req "Deprecated" >}}) Print Telegraf version.                                                                                                |
| `--sample-config`                | ({{< req "Deprecated" >}}) Print full sample configuration.                                                                                       |
| `--plugin-directory <directory>` | ({{< req "Deprecated" >}}) Directory containing `*.so` files to search recursively for plugins. Found plugins are loaded, tagged, and identified. |
| `--section-filter <filter>`      | Filter configuration sections to output (`agent`, `global_tags`, `outputs`, `processors`, `aggregators` and `inputs`). Separator is `:`.          |
| `--input-filter <filter>`        | Filter input plugins to enable. Separator is `:`.                                                                                                 |
| `--output-filter`                | Filter output plugins to enable. Separator is `:`.                                                                                                |
| `--aggregator-filter <filter>`   | Filter aggregators to enable. Separator is `:`.                                                                                                   |
| `--processor-filter <filter>`    | Filter processor plugins to enable. Separator is `:`.                                                                                             |
| `--secretstore-filter <filter>`  | Filter secretstore plugins to enable. Separator is `:`.                                                                                           |


## Examples

- [Generate a Telegraf configuration file](#generate-a-telegraf-configuration-file)
- [Generate a configuration with only specific plugins](#generate-a-configuration-with-only-specific-plugins)
- [Run a single Telegraf configuration and output metrics to stdout](#run-a-single-telegraf-configuration-and-output-metrics-to-stdout)
- [Run Telegraf with all plugins defined in configuration file](#run-telegraf-with-all-plugins-defined-in-configuration-file)
- [Run Telegraf, but only enable specific plugins](#run-telegraf-but-only-enable-specific-plugins)
- [Run Telegraf with pprof](#run-telegraf-with-pprof)

### Generate a Telegraf configuration file

```sh
telegraf config > telegraf.conf
```

### Generate a configuration with only specific plugins

```sh
telegraf config \
  --input-filter cpu \
  --output-filter influxdb
```

### Run a single Telegraf configuration and output metrics to stdout

```sh
telegraf --config telegraf.conf --test
```

### Run Telegraf with all plugins defined in configuration file

```sh
telegraf --config telegraf.conf
```

### Run Telegraf, but only enable specific plugins

```sh
telegraf \
  --config telegraf.conf \
  --input-filter cpu:mem \
  --output-filter influxdb
```

### Run Telegraf with pprof

```sh
telegraf \
  --config telegraf.conf \
  --pprof-addr localhost:6060
```
