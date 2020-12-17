---
title: influx stacks update
description: The 'influx stacks update' command updates an InfluxDB stack.
menu:
  influxdb_2_0_ref:
    name: influx stacks update
    parent: influx stacks
weight: 201
influxdb/v2.0/tags: [templates]
---

The `influx stacks update` command updates an InfluxDB stack.

## Usage
```
influx stacks update [flags]
```

## Flags
| Flag |                       | Description                                                           | Input type      | {{< cli/mapped >}}    |
|:---- |:---                   |:-----------                                                           |:----------:     |:------------------    |
|      | `--addResource`       | Associate an existing resource with a stack                           | string          |                       |
| `-c` | `--active-config`     | CLI configuration to use for command                                  | string          |                       |
|      | `--configs-path`      | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`) | string          |`INFLUX_CONFIGS_PATH`  |
| `-f` | `--export-file`       | Destination for exported template                                     | string          |                       |
| `-h` | `--help`              | Help for the `update` command                                         |                 |                       |
|      | `--hide-headers`      | Hide table headers (default `false`)                                  |                 | `INFLUX_HIDE_HEADERS` |
|      | `--host`              | HTTP address of InfluxDB (default `http://localhost:8086`)            | string          | `INFLUX_HOST`         |
| `-i` | `--stack-id`          | The stack ID to update                                                | string          |                       |
|      | `--json`              | Output data as JSON (default `false`)                                 |                 | `INFLUX_OUTPUT_JSON`  |
|      | `--skip-verify`       | Skip TLS certificate verification                                     |                 |                       |
| `-d` | `--stack-description` | Stack description                                                     | string          |                       |
| `-n` | `--stack-name`        | Stack name                                                            | string          |                       |
| `-u` | `--template-url`      | Template URLs to associate with a stack                               | list of strings |                       |
| `-t` | `--token`             | Authentication token                                                  | string          | `INFLUX_TOKEN`        |

{{% warn %}}
#### Export an updated template
To prevent accidental changes, we **strongly recommend** exporting a new template
any time you add additional resources to a stack using the `--addResource` flag
with the `influx stack update` command.
The updated stack will differ from the previous template.
If you apply the outdated template, InfluxDB will revert the updates and remove
the added resources.
{{% /warn %}}

## Examples

{{< cli/influx-creds-note >}}

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

# Update a stack with new resources to manage
influx stacks update \
	--stack-id ab12cd34ef56 \
	--addResource=Bucket=12ab34cd56ef \
	--addResource=Dashboard=98zy76xw54vu

# Update a stack with new resources to manage
# and export the updated stack as a template.
influx stacks update \
	--stack-id ab12cd34ef56 \
	--addResource=Bucket=12ab34cd56ef \
	--export-file /path/to/template-file.yml
```
