---
title: influx completion
description: >
  The 'influx completion' command outputs `influx` shell completion scripts for a
  specified shell (`bash` or `zsh`).
menu:
  v2_0_ref:
    name: influx completion
    parent: influx
weight: 101
v2.0/tags: [cli, tools]
---

The `influx completion` command outputs `influx` shell completion scripts for a
specified shell (`bash` or `zsh`).

## Usage
```
influx completion [bash|zsh] [flags]
```

## Flags
| Flag           | Description                       |
|:----           |:-----------                       |
| `-h`, `--help` | Help for the `completion` command |

{{% cli/influx-global-flags %}}

## Install completion scripts

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[bash](#)
[zsh](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
# macOS
$ source $(brew --prefix)/etc/bash_completion
$ source <(influx completion bash)

# Ubuntu
$ source /etc/bash-completion
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

{{% note %}}
To permanantly install `influx` completion scripts in your shell, add the installation
command from above to your `.bashrc` or `.zshrc`.
{{% /note %}}
