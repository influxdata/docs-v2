---
title: influx apply
description: The 'influx apply' command applies InfluxDB templates.
menu:
  v2_0_ref:
    name: influx apply
    parent: influx
weight: 101
aliases:
  - /v2.0/reference/cli/influx/pkg/
v2.0/tags: [templates]
---

The `influx apply` command applies InfluxDB templates.
_For information about finding and using InfluxDB templates, see
[Use InfluxDB templates](/v2.0/influxdb-templates/use/)._

## Usage
```
influx apply [flags]
```

#### Aliases
`apply`, `pkg`

## Flags
| Flag                      | Description                                                                                 | Input Type | {{< cli/mapped >}}   |
|:----                      |:-----------------------------                                                               |:---------- |:------------------   |
| `-c`, `--disable-color`   | Disable color in output                                                                     |            |                      |
| `--disable-table-borders` | Disable table borders                                                                       |            |                      |
| `-e`, `--encoding`        | Encoding of the input stream                                                                | string     |                      |
| `--env-ref`               | Environment references to provide with the template (format: `--env-ref=REF_KEY=REF_VALUE`) | string     |                      |
| `-f`, `--file`            | Path to template file                                                                       | string     |                      |
| `--force`                 | Ignore warnings about destructive changes                                                   |            |                      |
| `-h`, `--help`            | Help for the `apply` command                                                                |            |                      |
| `--json`                  | Output data as JSON                                                                         |            | `INFLUX_OUTPUT_JSON` |
| `-o`, `--org`             | Organization name that owns the bucket                                                      | string     | `INFLUX_ORG`         |
| `--org-id`                | Organization ID that owns the bucket                                                        | string     | `INFLUX_ORG_ID`      |
| `-q`, `--quiet`           | Disable output printing                                                                     |            |                      |
| `-R`, `--recurse`         | Recurse through files in the directory specified in `-f`, `--file`                          |            |                      |
| `--secret`                | Secrets to provide with the template (format: `--secret=SECRET_KEY=SECRET_VALUE`)           | string     |                      |
| `--stack-id`              | Stack ID to associate when applying the template                                            | string     |                      |
| `-u`, `--template-url`    | URL of template file                                                                        | string     |                      |

{{% cli/influx-global-flags %}}

## Examples
```sh
# Apply a template from a file
influx apply -f path/to/template.json

# Apply a stack that has associated templates.
influx apply --stack-id $STACK_ID

# Apply a template associated with a stack.
# Stacks make template application idempotent.
influx apply -f path/to/template.json --stack-id $STACK_ID

# Apply multiple template files together
influx apply \
  -f path/to/template_1.json \
  -f path/to/template_2.yml

# Apply a template from a URL
influx apply -u https://raw.githubusercontent.com/influxdata/community-templates/master/docker/docker.yml

# Apply a template from STDIN
cat template.json | influx apply --encoding json

# Apply all templates in a directory
influx apply -f path/to/template_directory

# Recurse through a directory and its subdirectories and apply all templates
influx apply -R -f path/to/template_directory

# Apply templates from multiple from many sources – directory, file, and URL
influx apply \
  -f path/to/template.yml
  -f path/to/templates_directory
  -u https://example.com/template.json
```
