---
title: Select Telegraf plugins with labels and selectors
description: >
  Enable or disable Telegraf plugin instances at startup by adding labels to
  plugin definitions and passing selectors with the --select flag.
menu:
  telegraf_v1:
    name: Labels and selectors
    parent: Configure Telegraf
weight: 109
related:
  - /telegraf/v1/configuration/file/
  - /telegraf/v1/configuration/plugin-options/
  - /telegraf/controller/configs/use/
---

Labels and selectors let you enable or disable plugin instances at startup
without editing the configuration file: add labels to plugins in the
configuration, then pass selectors on the command line.
Inspired by Kubernetes labels, this is useful when many Telegraf instances
share one configuration source, such as a configuration managed with
[Telegraf Controller](/telegraf/controller/configs/use/), and each instance
should run only a subset of the configured plugins.

## Add labels to plugins

Add an optional `labels` table to any input, output, processor, or
aggregator plugin:

```toml
[[inputs.cpu]]
  [inputs.cpu.labels]
    app = "payments"
    region = "us-east"
    env = "prod"
```

Label keys and values are plain strings that can contain alphanumeric
characters, dots (`.`), dashes (`-`), and underscores (`_`).
Neither keys nor values can contain wildcard characters.

> [!Important]
> `labels` is a TOML table, so with explicit table syntax it must come at the
> *end* of the plugin definition.
> See [Table ordering](/telegraf/v1/configuration/toml/#table-ordering).

## Select plugins at startup

Pass one or more `--select` flags when starting Telegraf.
Each `--select` value is a semicolon-separated list of key-value pairs:

```text
<key>=<value>[;<key>=<value>]
```

- Pairs within a single `--select` value combine with logical AND: all must
  match.
- Multiple `--select` flags combine with logical OR: a plugin is enabled if
  it matches any selector set.
- Selector values support glob patterns: `*` matches any number of
  characters and `?` matches a single character (for example,
  `region=us-*`).
  Selector keys don't support wildcards.
- Repeating the same key within a single `--select` value causes an error at
  startup; using the same key in *different* `--select` flags is allowed.

<!--pytest.mark.skip-->

```bash
telegraf --config config.conf --config-directory directory/ \
  --select="app=payments;region=us-*" \
  --select="env=prod"
```

## Matching behavior

Telegraf matches selectors against each plugin's labels to decide whether
the plugin instance is enabled:

| Telegraf run state | Plugin has labels | Behavior                                                        |
| :----------------- | :---------------- | :-------------------------------------------------------------- |
| With `--select`    | Yes               | Enabled only if a selector matches the labels                   |
| With `--select`    | No                | Enabled (backward compatible)                                   |
| Without `--select` | Yes               | Enabled (no selector to compare against)                        |
| Without `--select` | No                | Enabled (default behavior)                                      |

A selector matches when every key-value pair in it matches a label on the
plugin; labels the selector doesn't mention are ignored.

| `--select` flags               | Plugin labels                | Result   |
| :----------------------------- | :--------------------------- | :------- |
| `app=web`                      | `app="web"`                  | Selected |
| `app=web`                      | `app="api"`                  | Skipped  |
| `app=web`                      | `app="web", region="us-east"`| Selected |
| `app=web;region=us-west`       | `app="web", region="us-east"`| Skipped  |
| `env=prod*`                    | `env="production"`           | Selected |
| `env=prod`, `env=staging`      | `env="qa"`                   | Skipped  |
| `app=web;env=prod`, `app=api;env=prod` | `app="api", env="prod"` | Selected |
