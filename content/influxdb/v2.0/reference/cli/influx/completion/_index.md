---
title: influx completion
description: >
  The `influx completion` command outputs `influx` shell completion scripts for a
  specified shell (`bash` or `zsh`).
menu:
  influxdb_2_0_ref:
    name: influx completion
    parent: influx
weight: 101
influxdb/v2.0/tags: [cli, tools]
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

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[bash](#)
[zsh](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
# macOS
$ COMPLETIONS_DIR=`pkg-config --variable=completionsdir bash-completion` # in bash-completion@2, as installed by Homebrew, this is the preferred directory
$ COMPLETIONS_DIR=${COMPLETIONS_DIR:-$BASH_COMPLETION_COMPAT_DIR} # as a backup, use the backwards-compatible-with-v1 directory
$ COMPLETIONS_DIR=${COMPLETIONS_DIR:-$(brew --prefix)/etc/bash_completion.d} # as a final backup, use the hand crafted version of the same
$ influx completion bash > $COMPLETIONS_DIR/influx # whatever completions dir we find, write the influx completions file there

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
