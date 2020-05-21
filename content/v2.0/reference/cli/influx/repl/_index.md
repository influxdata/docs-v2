---
title: influx repl
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

## Notes

Variables in the Flux REPL are immutable.
Once you assign a variable, it cannot be changed in the current session.

## Flags
| Flag           | Description                 | Input type | {{< cli/mapped >}} |
|:----           |:-----------                 |:----------:|:------------------ |
| `-h`, `--help` | Help for the `repl` command |            |                    |
| `-o`, `--org`  | Organization name           | string     | `INFLUX_ORG`       |
| `--org-id`     | Organization ID             | string     | `INFLUX_ORG_ID`    |

{{% cli/influx-global-flags %}}
