---
description: "Telegraf plugin for collecting metrics from Control Group"
menu:
  telegraf_v1_ref:
    parent: input_plugins_reference
    name: Control Group
    identifier: input-cgroup
tags: [Control Group, "input-plugins", "configuration", "system"]
introduced: "v1.0.0"
os_support: "linux"
related:
  - /telegraf/v1/configure_plugins/
  - https://github.com/influxdata/telegraf/tree/v1.36.4/plugins/inputs/cgroup/README.md, Control Group Plugin Source
---

# Control Group Input Plugin

This plugin gathers statistics per [control group (cgroup)](https://docs.kernel.org/admin-guide/cgroup-v2.html).

> [!NOTE]
> Consider restricting paths to the set of cgroups you are interested in if you
> have a large number of cgroups, to avoid cardinality issues.

The plugin supports the _single value format_ in the form

```text
VAL\n
```

the _new line separated values format_ in the form

```text
VAL0\n
VAL1\n
```

the _space separated values format_ in the form

```text
VAL0 VAL1 ...\n
```

and the _space separated keys and value, separated by new line format_ in the
form

```text
KEY0 ... VAL0\n
KEY1 ... VAL1\n
```

**Introduced in:** Telegraf v1.0.0
**Tags:** system
**OS support:** linux

[cgroup]: https://docs.kernel.org/admin-guide/cgroup-v2.html

## Global configuration options <!-- @/docs/includes/plugin_config.md -->

In addition to the plugin-specific configuration settings, plugins support
additional global and plugin configuration settings. These settings are used to
modify metrics, tags, and field or create aliases and configure ordering, etc.
See the [CONFIGURATION.md](/telegraf/v1/configuration/#plugins) for more details.

[CONFIGURATION.md]: ../../../docs/CONFIGURATION.md#plugins

## Configuration

```toml @sample.conf
# Read specific statistics per cgroup
# This plugin ONLY supports Linux
[[inputs.cgroup]]
  ## Directories in which to look for files, globs are supported.
  ## Consider restricting paths to the set of cgroups you really
  ## want to monitor if you have a large number of cgroups, to avoid
  ## any cardinality issues.
  # paths = [
  #   "/sys/fs/cgroup/memory",
  #   "/sys/fs/cgroup/memory/child1",
  #   "/sys/fs/cgroup/memory/child2/*",
  # ]
  ## cgroup stat fields, as file names, globs are supported.
  ## these file names are appended to each path from above.
  # files = ["memory.*usage*", "memory.limit_in_bytes"]
```

## Metrics

All measurements have the `path` tag.

## Example Output
