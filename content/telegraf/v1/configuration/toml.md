---
title: TOML syntax for Telegraf
description: >
  Learn the TOML configuration language details that matter for Telegraf
  configurations: table types, ordering pitfalls, string escaping, and
  duration values.
menu:
  telegraf_v1:
    name: TOML syntax
    parent: Configure Telegraf
weight: 102
related:
  - /telegraf/v1/configuration/file/
  - /telegraf/v1/configuration/plugin-options/
---

Telegraf configuration files use [TOML](https://toml.io/) as the
configuration language.
This page covers the TOML details that most often cause confusion in Telegraf
configurations.
To validate a configuration file, use a TOML validator or run `telegraf --test`
to validate the file with Telegraf itself.

## Single tables and arrays of tables

Telegraf uses a single table, `[agent]`, for agent-level settings.
Define the `[agent]` table only once across all configuration files, in the
first file Telegraf reads.

Plugins use TOML arrays of tables, written with double brackets, such as
`[[inputs.file]]`.
Define an array-of-tables plugin as many times as you need.
Each definition runs as an independent plugin instance.

```toml
[agent]
  interval = "10s"

[[inputs.file]]
  files = ["/var/log/app-a.log"]

[[inputs.file]]
  files = ["/var/log/app-b.log"]
```

## Table ordering

Some plugin options are themselves tables, such as the table of arbitrary
tags to add to an input's metrics:

```toml
[[inputs.cpu]]
  percpu = false
  totalcpu = true
  [inputs.cpu.tags]
    tag1 = "foo"
    tag2 = "bar"
```

A table like `[inputs.cpu.tags]` must come at the *end* of the plugin
definition: every key-value pair that follows a table header belongs to that
table, regardless of indentation.
The following example shows how this causes problems:

```toml
[[inputs.cpu]]
  totalcpu = true
  [inputs.cpu.tags]
    tag1 = "foo"
    tag2 = "bar"
  percpu = false  # treated as a tag named "percpu", not a plugin option
```

To avoid the ordering problem entirely, use inline table syntax, which can
appear anywhere in the plugin definition:

```toml
[[inputs.cpu]]
  tags = {tag1 = "foo", tag2 = "bar"}
  percpu = false
  totalcpu = true
```

## Basic strings and literal strings

In basic strings (double quotes), backslashes and double quotes must be
escaped.
For example, the following Windows path is invalid TOML:

```toml {lint="false"}
path = "C:\Program Files\"  # invalid TOML
```

Either escape the backslashes or use a literal string (single quotes), which
returns exactly what you type:

```toml
path = "C:\\Program Files\\"
```

```toml
path = 'C:\Program Files\'
```

Because literal strings have no escaping, a literal string can't contain a
single quote.

## Durations

Settings that accept a duration, such as `interval` and `flush_interval`,
take a string that combines an integer value and a time unit.
Valid units are:

- `ns`
- `us` (or `µs`)
- `ms`
- `s`
- `m`
- `h`

```toml
[agent]
  interval = "10s"
  flush_interval = "1m"
```

## Multiple files

TOML itself has no concept of multiple files.
Combining files is a Telegraf convenience.
Telegraf parses each file separately and merges all settings as if they were
one file.
See
[Use multiple configuration files](/telegraf/v1/configuration/file/#use-multiple-configuration-files).
