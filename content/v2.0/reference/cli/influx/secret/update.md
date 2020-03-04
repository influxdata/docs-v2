---
title: influx secret update
description: The 'influx secret update' command adds and updates secrets.
menu:
  v2_0_ref:
    name: influx secret update
    parent: influx secret
weight: 101
v2.0/tags: [secrets]
---

The `influx secret update` command adds and updates secrets.
Provide the secret key with the `-k` or `--key` flag.
You may also provide the secret value with the `-v` or `--value` flag.
If you do not provide the secret value with the `-v` or `--value` flag,
enter the value when prompted.

{{% warn %}}
Providing a secret value with the `-v` or `--value` flag may expose the secret
in your command history.
{{% /warn %}}

## Usage
```
influx secret update [flags]
```

## Flags
| Flag            | Description                   | Input type | {{< cli/mapped >}} |
|:----            |:-----------                   |:----------:|:------------------ |
| `-h`, `--help`  | Help for the `update` command |            |                    |
| `-k`, `--key`   | **(Required)** Secret key     | string     |                    |
| `-o`, `--org`   | Organization name             | string     | `INFLUX_ORG`       |
| `--org-id`      | Organization ID               | string     | `INFLUX_ORG_ID`    |
| `-v`, `--value` | Secret value                  | string     |                    |

{{% cli/influx-global-flags %}}
