---
title: influx stacks update
description: The 'influx stacks update' command updates an InfluxDB stack.
menu:
  v2_0_ref:
    name: influx stacks update
    parent: influx stacks
weight: 201
v2.0/tags: [templates]
---

The `influx stacks update` command updates an InfluxDB stack.

## Usage
```
influx stacks update [flags]
```

## Flags
| Flag |                       | Description                                                | Input type      | {{< cli/mapped >}}    |
|:---- |:---                   |:-----------                                                |:----------:     |:------------------    |
| `-h` | `--help`              | Help for the `update` command                              |                 |                       |
|      | `--hide-headers`      | Hide table headers (default `false`)                       |                 | `INFLUX_HIDE_HEADERS` |
|      | `--host`              | HTTP address of InfluxDB (default `http://localhost:9999`) | string          | `INFLUX_HOST`         |
| `-i` | `--stack-id`          | The stack ID to update                                     | string          |                       |
|      | `--json`              | Output data as JSON (default `false`)                      |                 | `INFLUX_OUTPUT_JSON`  |
|      | `--skip-verify`       | Skip TLS certificate verification                          |                 |                       |
| `-d` | `--stack-description` | Stack description                                          | string          |                       |
| `-n` | `--stack-name`        | Stack name                                                 | string          |                       |
| `-u` | `--template-url`      | Template URLs to associate with a stack                    | list of strings |                       |
| `-t` | `--token`             | Authentication token                                       | string          | `INFLUX_TOKEN`        |

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
