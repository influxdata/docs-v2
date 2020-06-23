---
title: influx query
description: >
  The `influx query` command executes a literal Flux query provided as a string
  or a literal Flux query contained in a file by specifying the file prefixed with an '@' sign.
menu:
  v2_0_ref:
    name: influx query
    parent: influx
weight: 101
v2.0/tags: [query]
---

The `influx query` command executes a literal Flux query provided as a string
or a literal Flux query contained in a file by specifying the file prefixed with an `@` sign.

## Usage
```
influx query [query literal] [flags]
```

## Flags
| Flag |            | Description                  | Input type | {{< cli/mapped >}} |
|:---- |:---        |:-----------                  |:----------:|:------------------ |
| `-f` | `--file`   | Path to Flux script file     | string     |                    |
| `-h` | `--help`   | Help for the `query` command |            |                    |
| `-o` | `--org`    | Organization name            | string     | `INFLUX_ORG`       |
|      | `--org-id` | Organization ID              | string     | `INFLUX_ORG_ID`    |


{{% cli/influx-global-flags %}}
