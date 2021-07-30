---
title: influx repl
description: >
  The `influx repl` command opens an interactive Read-Eval-Print Loop (REPL)
  from which you can run Flux commands.
influxdb/v2.0/tags: [query]
related:
  - /influxdb/v2.0/reference/cli/influx/#provide-required-authentication-credentials, influx CLI—Provide required authentication credentials
  - /influxdb/v2.0/reference/cli/influx/#flag-patterns-and-conventions, influx CLI—Flag patterns and conventions
---

{{% warn %}}
#### Removed in InfluxDB 2.0 beta-16
The `influx repl` command was removed in **InfluxDB 2.0 beta-16**.
To use the Flux REPL, build the REPL from source.
For more information, see the [Flux GitHub repository](https://github.com/influxdata/flux/#readme).
{{% /warn %}}

The `influx repl` command opens an interactive Read-Eval-Print Loop (REPL)
from which you can run Flux commands.

## Usage
```
influx repl [flags]
```

{{% note %}}
Use **ctrl + d** to exit the REPL.
{{% /note %}}

To use the Flux REPL, you must first authenticate with a [token](/influxdb/v2.0/security/tokens/view-tokens/).

## Flags
| Flag |                   | Description                                                           | Input type | {{< cli/mapped >}}    |
| :--- | :---------------- | :-------------------------------------------------------------------- | :--------: | :-------------------- |
| `-c` | `--active-config` | CLI configuration to use for command                                  |   string   |                       |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) |   string   | `INFLUX_CONFIGS_PATH` |
| `-h` | `--help`          | Help for the `repl` command                                           |            |                       |
|      | `--host`          | HTTP address of InfluxDB (default `http://localhost:8086`)            |   string   | `INFLUX_HOST`         |
|      | `--http-debug`    | Inspect communication with InfluxDB servers.                          |   string   |                       |
| `-o` | `--org`           | Organization name (mutually exclusive with `--org-id`)                |   string   | `INFLUX_ORG`          |
|      | `--org-id`        | Organization ID (mutually exclusive with `--org`)                     |   string   | `INFLUX_ORG_ID`       |
|      | `--skip-verify`   | Skip TLS certificate verification                                     |            |                       |
| `-t` | `--token`         | Authentication token                                                  |   string   | `INFLUX_TOKEN`        |
