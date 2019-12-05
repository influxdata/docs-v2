---
title: influx query – Execute queries from the influx CLI
description: >
  The 'influx query' command executes a literal Flux query provided as a string
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
influx query [query literal or @/path/to/query.flux] [flags]
```

## Flags
| Flag           | Description                | Input type |
|:----           |:-----------                |:----------:|
| `-h`, `--help` | Help for the query command |            |
| `--org-id`     | The organization ID        | string     |

{{% influx-cli-global-flags %}}
