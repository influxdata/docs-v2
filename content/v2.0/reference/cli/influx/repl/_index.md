---
title: influx repl – Enter an interactive REPL
description: >
  The 'influx repl' command opens and interactive read-eval-print-loop (REPL)
  from which you can run Flux commands.
menu:
  v2_0_ref:
    name: influx repl
    parent: influx
weight: 101
v2.0/tags: [query]
---

The `influx repl` command opens and interactive read-eval-print-loop (REPL)
from which you can run Flux commands.

## Usage
```
influx repl [flags]
```

{{% note %}}
Use **ctrl + d** to exit the REPL.
{{% /note %}}

To use the Flux REPL, you must first authenticate with a [token](/v2.0/security/tokens/view-tokens/).

## Flags
| Flag           | Description                     | Input type |
|:----           |:-----------                     |:----------:|
| `-h`, `--help` | Help for the `repl` command     |            |
| `-o`, `--org`  | The name of the organization    | string     |
| `--org-id`     | The ID of organization to query | string     |

{{% influx-cli-global-flags %}}
