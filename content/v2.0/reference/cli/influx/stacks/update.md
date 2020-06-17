---
title: influx stacks udpate
description: The 'influx stacks udpate' command updates an InfluxDB stack.
menu:
  v2_0_ref:
    name: influx stacks udpate
    parent: influx stacks
weight: 201
v2.0/tags: [templates]
---

The `influx stacks udpate` command updates an InfluxDB stack.

## Usage
```
influx stacks udpate [flags]
```

## Flags
| Flag |                       | Description                             | Input type      | {{< cli/mapped >}}    |
|:---- |:---                   |:-----------                             |:----------:     |:------------------    |
| `-h` | `--help`              | Help for the `update` command           |                 |                       |
|      | `--hide-headers`      | Hide table headers (default `false`)    |                 | `INFLUX_HIDE_HEADERS` |
| `-i` | `--stack-id`          | The stack ID to update                  | string          |                       |
|      | `--json`              | Output data as JSON (default `false`)   |                 | `INFLUX_OUTPUT_JSON`  |
| `-d` | `--stack-description` | Stack description                       | string          |                       |
| `-n` | `--stack-name`        | Stack name                              | string          |                       |
| `-u` | `--template-url`      | Template URLs to associate with a stack | list of strings |                       |

{{% cli/influx-global-flags %}}

## Examples
```sh
# Update a stack with a name and description
influx stack update \
  -i ab12cd34ef56 \
  -n "New stack name" \
  -d "New stack description"

# Update a stack with a name and urls to associate with stack.
influx stack update \
  -i ab12cd34ef56 \
  -n "New stack name" \
  --template-url https://example.com/template-1.yml \
  --template-url https://example.com/template-2.yml
```
