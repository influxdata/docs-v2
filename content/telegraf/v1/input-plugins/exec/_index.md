---
description: "Telegraf plugin for collecting metrics from Exec"
menu:
  telegraf_v1_ref:
    parent: input_plugins_reference
    name: Exec
    identifier: input-exec
tags: [Exec, "input-plugins", "configuration", "system"]
introduced: "v0.1.5"
os_support: "freebsd, linux, macos, solaris, windows"
related:
  - /telegraf/v1/configure_plugins/
  - https://github.com/influxdata/telegraf/tree/v1.37.2/plugins/inputs/exec/README.md, Exec Plugin Source
---

# Exec Input Plugin

This plugin executes the given `commands` on every interval and parses metrics
from their output in any one of the supported [data formats](/telegraf/v1/data_formats/input).
This plugin can be used to poll for custom metrics from any source.

**Introduced in:** Telegraf v0.1.5
**Tags:** system
**OS support:** all

[data_formats]: /docs/DATA_FORMATS_INPUT.md

## Global configuration options <!-- @/docs/includes/plugin_config.md -->

Plugins support additional global and plugin configuration settings for tasks
such as modifying metrics, tags, and fields, creating aliases, and configuring
plugin ordering. See [CONFIGURATION.md](/telegraf/v1/configuration/#plugins) for more details.

[CONFIGURATION.md]: ../../../docs/CONFIGURATION.md#plugins

## Configuration

```toml @sample.conf
# Read metrics from one or more commands that can output to stdout
[[inputs.exec]]
  ## Commands array
  commands = []

  ## Environment variables
  ## Array of "key=value" pairs to pass as environment variables
  ## e.g. "KEY=value", "USERNAME=John Doe",
  ## "LD_LIBRARY_PATH=/opt/custom/lib64:/usr/local/libs"
  # environment = []

  ## Timeout for each command to complete.
  # timeout = "5s"

  ## Measurement name suffix
  ## Used for separating different commands
  # name_suffix = ""

  ## Ignore Error Code
  ## If set to true, a non-zero error code in not considered an error and the
  ## plugin will continue to parse the output.
  # ignore_error = false

  ## Data format
  ## By default, exec expects JSON. This was done for historical reasons and is
  ## different than other inputs that use the influx line protocol. Each data
  ## format has its own unique set of configuration options, read more about
  ## them here:
  ## https://github.com/influxdata/telegraf/blob/master/docs/DATA_FORMATS_INPUT.md
  # data_format = "json"
```

Glob patterns in the `command` option are matched on every run, so adding new
scripts that match the pattern will cause them to be picked up immediately.

## Example

This script produces static values, since no timestamp is specified the values
are at the current time. Ensure that int values are followed with `i` for proper
parsing.

```sh
#!/bin/sh
echo 'example,tag1=a,tag2=b i=42i,j=43i,k=44i'
```

It can be paired with the following configuration and will be run at the
`interval` of the agent.

```toml
[[inputs.exec]]
  commands = ["sh /tmp/test.sh"]
  timeout = "5s"
  data_format = "influx"
```

## Common Issues

### My script works when I run it by hand, but not when Telegraf is running as a service

This may be related to the Telegraf service running as a different user. The
official packages run Telegraf as the `telegraf` user and group on Linux
systems.

### With a PowerShell on Windows, the output of the script appears to be truncated

You may need to set a variable in your script to increase the number of columns
available for output:

```shell
$host.UI.RawUI.BufferSize = new-object System.Management.Automation.Host.Size(1024,50)
```

## Metrics

## Example Output
