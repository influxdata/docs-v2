---
title: Telegraf commands and flags
description: >
  The `telegraf` command starts and runs all the processes necessary for
  Telegraf to function. Complete reference for Telegraf commands and global
  flags.
menu:
  telegraf_v1_ref:
    name: Telegraf commands
weight: 3
related:
  - /telegraf/v1/configuration/
  - /telegraf/v1/administer/troubleshoot/
---

The `telegraf` command starts and runs all the processes necessary for
Telegraf to function.

## Usage

```
telegraf [commands]
telegraf [flags]
```

## Commands

| Command                                   | Description                                  |
| :---------------------------------------- | :------------------------------------------- |
| [config](/telegraf/v1/commands/config/)   | Generate and migrate Telegraf configurations |
| [plugins](/telegraf/v1/commands/plugins/) | Print available plugins                      |
| [secrets](/telegraf/v1/commands/secrets/) | Manage secrets in secret stores              |
| [service](/telegraf/v1/commands/service/) | Manage the Telegraf Windows service (Windows only) |
| [version](/telegraf/v1/commands/version/) | Print current version to stdout              |

## Global flags {id="telegraf-global-flags"}

### Load configuration

| Flag                                  | Description                                                                                                                          |
| :------------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------- |
| `--config <file>`                     | Configuration file to load. Can be a local path or a URL. Repeat to load multiple files.                                             |
| `--config-directory <directory>`      | Directory containing additional `*.conf` files. Repeat to load multiple directories.                                                 |
| `--config-url-retry-attempts <count>` | Number of attempts to obtain a remote configuration from a URL during startup. Set to `-1` for unlimited attempts. Default is `3`.   |
| `--config-url-watch-interval <duration>` | Time duration to check for updates to URL-based configuration files. Disabled by default.                                         |
| `--watch-config <method>`             | Restart Telegraf on local configuration changes. Use filesystem notifications (`notify`) on Linux, BSD, and macOS, or polling (`poll`), required on Windows. Disabled by default. |
| `--watch-interval <duration>`         | Time duration to check for updates to local configuration files. Use with `--watch-config poll`. Disabled by default.                |
| `--watch-debounce-interval <duration>` | Time duration to wait after a configuration change before reloading.                                                                |

### Run modes

| Flag                   | Description                                                                                                      |
| :--------------------- | :---------------------------------------------------------------------------------------------------------------- |
| `--test`               | Gather metrics once, print them, and exit. Test mode runs inputs, processors, and aggregators, but not outputs.  |
| `--test-wait <seconds>` | Number of seconds to wait for service inputs to complete in test or once mode.                                  |
| `--once`               | Gather metrics once, write them to the configured outputs, and exit.                                             |

### Select plugins

| Flag                             | Description                                                                                                                              |
| :------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| `--input-filter <filter>`        | Filter input plugins to enable. Separator is `:`.                                                                                        |
| `--output-filter <filter>`       | Filter output plugins to enable. Separator is `:`.                                                                                       |
| `--processor-filter <filter>`    | Filter processor plugins to enable. Separator is `:`.                                                                                    |
| `--aggregator-filter <filter>`   | Filter aggregator plugins to enable. Separator is `:`.                                                                                   |
| `--secretstore-filter <filter>`  | Filter secret store plugins to enable. Separator is `:`.                                                                                 |
| `--section-filter <filter>`      | Filter configuration sections to output (`agent`, `global_tags`, `outputs`, `processors`, `aggregators`, and `inputs`). Separator is `:`. |
| `--select <selector>`            | Enable only plugins with [labels](/telegraf/v1/configuration/labels-selectors/) matching the given key-value selection. Repeat for OR logic; multiple pairs in one option combine with AND. |

### Print information

| Flag                           | Description                                             |
| :----------------------------- | :------------------------------------------------------- |
| `--usage <plugin>`             | Print plugin usage (example: `telegraf --usage mysql`). |
| `--input-list`                 | Print available input plugins.                          |
| `--output-list`                | Print available output plugins.                         |
| `--deprecation-list`           | Print all deprecated plugins or plugin options.         |
| `--print-plugin-config-source` | Print the source for a given plugin.                    |
| `--help`, `-h`                 | Print help and exit.                                    |

### Secrets and environment

| Flag                       | Description                                                                                         |
| :------------------------- | :--------------------------------------------------------------------------------------------------- |
| `--password <password>`    | Password to unlock secret stores.                                                                   |
| `--unprotected`            | Do not protect secrets in memory.                                                                   |
| `--strict-env-handling`    | Enforce strict and secure handling of environment variables. Doesn't work with non-string settings. |
| `--non-strict-env-handling` | Allow unsafe non-strict handling of environment variables to replace non-string settings.          |
| `--old-env-behavior`       | Switch back to pre-v1.27 environment replacement behavior.                                          |

### Logging and debugging

| Flag                     | Description                                             |
| :----------------------- | :------------------------------------------------------- |
| `--debug`                | Enable debug logging.                                   |
| `--quiet`                | Run in quiet mode.                                      |
| `--pprof-addr <address>` | pprof address to listen on. Disabled by default.        |
| `--pidfile <file>`       | File to write the process ID (PID) to.                  |

### Deprecated flags

| Flag                             | Description                                                             |
| :------------------------------- | :----------------------------------------------------------------------- |
| `--version`                      | Print Telegraf version. Use [`telegraf version`](/telegraf/v1/commands/version/) instead. |
| `--sample-config`                | Print full sample configuration. Use [`telegraf config`](/telegraf/v1/commands/config/) instead. |
| `--plugin-directory <directory>` | Directory containing `*.so` files to search recursively for plugins. Found plugins are loaded, tagged, and identified. |

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
  --output-filter influxdb_v3
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
  --output-filter influxdb_v3
```

### Run Telegraf with pprof

```sh
telegraf \
  --config telegraf.conf \
  --pprof-addr localhost:6060
```
