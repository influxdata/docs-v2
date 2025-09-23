---
description: "Telegraf plugin for collecting metrics from Linux Sysctl Filesystem"
menu:
  telegraf_v1_ref:
    parent: input_plugins_reference
    name: Linux Sysctl Filesystem
    identifier: input-linux_sysctl_fs
tags: [Linux Sysctl Filesystem, "input-plugins", "configuration", "system"]
introduced: "v1.24.0"
os_support: "linux"
related:
  - /telegraf/v1/configure_plugins/
  - https://github.com/influxdata/telegraf/tree/v1.36.1/plugins/inputs/linux_sysctl_fs/README.md, Linux Sysctl Filesystem Plugin Source
---

# Linux Sysctl Filesystem Input Plugin

This plugin gathers metrics by reading the [system filesystem](https://www.kernel.org/doc/Documentation/sysctl/fs.txt) files on
[Linux](https://kernel.org/) systems.

**Introduced in:** Telegraf v1.24.0
**Tags:** system
**OS support:** linux

[kernel]: https://kernel.org/
[sysfs]: https://www.kernel.org/doc/Documentation/sysctl/fs.txt

## Global configuration options <!-- @/docs/includes/plugin_config.md -->

In addition to the plugin-specific configuration settings, plugins support
additional global and plugin configuration settings. These settings are used to
modify metrics, tags, and field or create aliases and configure ordering, etc.
See the [CONFIGURATION.md](/telegraf/v1/configuration/#plugins) for more details.

[CONFIGURATION.md]: ../../../docs/CONFIGURATION.md#plugins

## Configuration

```toml @sample.conf
# Provides Linux sysctl fs metrics
[[inputs.linux_sysctl_fs]]
  # no configuration
```

## Metrics

`linux_sysctl_fs` metric:

- tags: _none_
- fields:
  - `aio-max-nr` (unsigned integer)
  - `aio-nr` (unsigned integer)
  - `dentry-age-limit` (unsigned integer)
  - `dentry-nr` (unsigned integer)
  - `dentry-unused-nr` (unsigned integer)
  - `dentry-want-pages` (unsigned integer)
  - `dquot-max` (unsigned integer)
  - `dquot-nr` (unsigned integer)
  - `inode-free-nr` (unsigned integer)
  - `inode-nr` (unsigned integer)
  - `inode-preshrink-nr` (unsigned integer)
  - `super-max` (unsigned integer)
  - `super-nr` (unsigned integer)
  - `file-max` (unsigned integer)
  - `file-nr` (unsigned integer)

## Example Output

```text
> linux_sysctl_fs,host=foo dentry-want-pages=0i,file-max=44222i,aio-max-nr=65536i,inode-preshrink-nr=0i,dentry-nr=64340i,dentry-unused-nr=55274i,file-nr=1568i,aio-nr=0i,inode-nr=35952i,inode-free-nr=12957i,dentry-age-limit=45i 1490982022000000000
```
