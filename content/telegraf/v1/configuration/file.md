---
title: Telegraf configuration file
description: >
  Learn the structure of the Telegraf configuration file, how to generate one,
  where Telegraf looks for configuration, and how to load configuration from
  multiple files or a remote URL.
menu:
  telegraf_v1:
    name: Configuration file
    parent: Configure Telegraf
weight: 101
related:
  - /telegraf/v1/configuration/toml/
  - /telegraf/v1/configuration/agent/
  - /telegraf/v1/commands/
---

The Telegraf configuration file is written in
[TOML](/telegraf/v1/configuration/toml/) and is composed of three sections:

- **`[global_tags]`**: tags applied to all metrics that Telegraf gathers.
- **`[agent]`**: settings that control how Telegraf itself runs.
  See [Agent settings](/telegraf/v1/configuration/agent/).
- **Plugin tables**: one table for each plugin instance you enable, such as
  `[[inputs.cpu]]` or `[[outputs.influxdb_v2]]`.
  See [Common plugin options](/telegraf/v1/configuration/plugin-options/).

The following example shows the shape of a minimal configuration file:

```toml
[global_tags]
  dc = "us-east-1"

[agent]
  interval = "10s"
  flush_interval = "10s"

[[inputs.cpu]]
  percpu = true

[[outputs.influxdb_v2]]
  urls = ["http://localhost:8086"]
```

To be valid, **a configuration must enable at least one input plugin and at
least one output plugin**.
If either is missing, Telegraf exits at startup with an invalid-configuration
error.
The exception is running `telegraf --test`, which prints gathered metrics to
standard output and doesn't require an output plugin.

## Generate a configuration file

Use the `telegraf config` command to generate a configuration file that
includes all available plugins with documented defaults:

```sh
telegraf config > telegraf.conf
```

To generate a file that enables only specific plugins, use the
`--input-filter` and `--output-filter` flags with colon-separated plugin
names:

```sh
telegraf config --input-filter cpu:mem:net:swap --output-filter influxdb_v2:kafka
```

For the full list of commands and flags, see
[Telegraf commands](/telegraf/v1/commands/) or run `telegraf --help`.

> [!Note]
> #### Windows PowerShell v5 encoding
>
> In PowerShell 5, the default encoding is UTF-16LE, but Telegraf expects a
> UTF-8 configuration file.
> Specify the output encoding when generating the file:
>
> ```powershell
> telegraf.exe config | Out-File -Encoding utf8 telegraf.conf
> ```
>
> PowerShell 6 and later, the Command Prompt, and Git Bash produce UTF-8 by
> default.

## Configuration file locations

When starting Telegraf, use the `--config` flag to specify the configuration
file location:

- A file name and path, for example: `--config /etc/telegraf/telegraf.conf`
- A remote URL, for example: `--config "http://example.com/telegraf.conf"`
  (see [Load configuration from a URL](#load-configuration-from-a-url))

Use the `--config-directory` flag to also load every file ending in `.conf`
in the specified directory.

On most systems, the default locations are `/etc/telegraf/telegraf.conf` for
the main configuration file and `/etc/telegraf/telegraf.d` for the
configuration directory.
On Windows, the defaults are `telegraf.conf` and the `telegraf.d` directory
in the Telegraf installation directory.

## Use multiple configuration files

Telegraf combines all loaded files into one effective configuration: each
file is parsed separately, and all settings merge as if they were one file.
Splitting configuration across files is a common way to manage many plugin
definitions.

Keep the following in mind:

- Every file must be valid TOML on its own.
  Telegraf doesn't concatenate files before parsing, so a plugin definition
  can't be split across files.
- Define the `[agent]` table only once, in the first file that Telegraf
  reads.
- Any plugin can be defined multiple times, across any of the files.

If you need to assemble one plugin definition from fragments, concatenate the
fragments into a valid configuration file with your own tooling before
starting Telegraf.

To automatically reload local configuration files when they change, start
Telegraf with the `--watch-config` flag.

## Load configuration from a URL

Pass an HTTP or HTTPS URL to `--config` to load configuration from a remote
endpoint, such as a configuration service or an object store.

[Telegraf Controller](/telegraf/controller/) serves managed configurations
over a URL. Point each agent's `--config` flag at the configuration URL that
Telegraf Controller provides for it.
See [Use Telegraf configurations](/telegraf/controller/configs/use/) in the
Telegraf Controller documentation.

Telegraf controls remote configuration behavior with two flags:

- `--config-url-retry-attempts`: the number of times to attempt to fetch a
  remote configuration during startup.
  The default is 3; set to -1 for unlimited attempts.
- `--config-url-watch-interval`: how often to check the URL for an updated
  configuration.
  Disabled by default.
  At each interval, Telegraf sends an HTTP HEAD request and compares the
  `Last-Modified` header; if the value changes, Telegraf reloads with the new
  configuration.
  If the check fails, Telegraf logs a warning and keeps running the existing
  configuration.
