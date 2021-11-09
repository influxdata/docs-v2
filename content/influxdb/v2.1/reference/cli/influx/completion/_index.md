---
title: influx completion
description: >
  The `influx completion` command outputs `influx` shell completion scripts for a
  specified shell (`bash` or `zsh`).
menu:
  influxdb_2_1_ref:
    name: influx completion
    parent: influx
weight: 101
influxdb/v2.1/tags: [cli, tools]
related:
  - /influxdb/v2.1/reference/cli/influx/#provide-required-authentication-credentials, influx CLI—Provide required authentication credentials
  - /influxdb/v2.1/reference/cli/influx/#flag-patterns-and-conventions, influx CLI—Flag patterns and conventions
metadata: [influx CLI 2.0.0+, InfluxDB 2.0.0+]
---

The `influx completion` command outputs `influx` shell completion scripts for a
specified shell (`bash` or `zsh`).

## Usage
```
influx completion [bash|zsh] [flags]
```

## Flags
| Flag |          | Description                       |
|:---- |:---      |:-----------                       |
| `-h` | `--help` | Help for the `completion` command |

## Install completion scripts

Add the appropriate installation command below to your `.bashrc` or `.zshrc`.

#### Completion snippets in .bashrc or .zshrc
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[bash](#)
[zsh](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
# macOS
$ source $(brew --prefix)/etc/bash_completion.d
$ source <(influx completion bash)

# Ubuntu
$ source /etc/bash_completion.d
$ source <(influx completion bash)
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sh
# macOS
$ source <(influx completion zsh)

# Ubuntu
$ source <(influx completion zsh)
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}
