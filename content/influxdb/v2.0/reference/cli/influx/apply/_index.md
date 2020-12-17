---
title: influx apply
description: The `influx apply` command applies InfluxDB templates.
menu:
  influxdb_2_0_ref:
    name: influx apply
    parent: influx
weight: 101
aliases:
  - /influxdb/v2.0/reference/cli/influx/pkg/
influxdb/v2.0/tags: [templates]
---

The `influx apply` command applies InfluxDB templates.
_For information about finding and using InfluxDB templates, see
[Use InfluxDB templates](/influxdb/v2.0/influxdb-templates/use/)._

## Usage
```
influx apply [flags]
```

## Flags
| Flag |                           | Description                                                                                 | Input Type | {{< cli/mapped >}}   |
|:---- |:---                       |:-----------------------------                                                               |:---------- |:------------------   |
| `-c` | `--active-config`         | CLI configuration to use for command                                                        | string     |                      |
|      | `--configs-path`          | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`)                       | string     |`INFLUX_CONFIGS_PATH` |
|      | `--disable-color`         | Disable color in output                                                                     |            |                      |
|      | `--disable-table-borders` | Disable table borders                                                                       |            |                      |
| `-e` | `--encoding`              | Encoding of the input stream                                                                | string     |                      |
|      | `--env-ref`               | Environment references to provide with the template (format: `--env-ref=REF_KEY=REF_VALUE`) | string     |                      |
| `-f` | `--file`                  | Path to template file (supports HTTP(S) URLs or file paths)                                 | string     |                      |
|      | `--filter`                | Resources to skip when applying the template (filter by `kind` or `resource`)               | string     |                      |
|      | `--force`                 | Ignore warnings about destructive changes                                                   |            |                      |
| `-h` | `--help`                  | Help for the `apply` command                                                                |            |                      |
|      | `--host`                  | HTTP address of InfluxDB (default `http://localhost:8086`)                                  | string     | `INFLUX_HOST`        |
|      | `--json`                  | Output data as JSON                                                                         |            | `INFLUX_OUTPUT_JSON` |
| `-o` | `--org`                   | Organization name that owns the bucket                                                      | string     | `INFLUX_ORG`         |
|      | `--org-id`                | Organization ID that owns the bucket                                                        | string     | `INFLUX_ORG_ID`      |
| `-q` | `--quiet`                 | Disable output printing                                                                     |            |                      |
| `-R` | `--recurse`               | Recurse through files in the directory specified in `-f`, `--file`                          |            |                      |
|      | `--secret`                | Secrets to provide with the template (format: `--secret=SECRET_KEY=SECRET_VALUE`)           | string     |                      |
|      | `--skip-verify`           | Skip TLS certificate verification                                                           |            |                      |
|      | `--stack-id`              | Stack ID to associate when applying the template                                            | string     |                      |
| `-t` | `--token`                 | Authentication token                                                                        | string     | `INFLUX_TOKEN`       |

## Examples

{{< cli/influx-creds-note >}}

```sh
# Apply a template from a file.
influx apply -f path/to/template.json

# Apply a template from a URL.
influx apply -f https://raw.githubusercontent.com/influxdata/community-templates/master/docker/docker.yml

# Apply a stack that has associated templates.
influx apply --stack-id $STACK_ID

# Apply a template associated with a stack.
# Stacks make template application idempotent.
influx apply -f path/to/template.json --stack-id $STACK_ID

# Apply multiple template files together.
influx apply \
  -f path/to/template_1.json \
  -f path/to/template_2.yml

# Apply a template from STDIN.
cat template.json | influx apply --encoding json

# Apply all templates in a directory.
influx apply -f path/to/template_directory

# Recurse through a directory and its subdirectories and apply all templates.
influx apply -R -f path/to/template_directory

# Apply templates from multiple sources – directory, file, and URL.
influx apply \
  -f path/to/template.yml
  -f path/to/templates_directory
  -u https://example.com/template.json

# Apply a template, but skip resources. The following example skips all buckets
# and the dashboard whose metadata.name field matches "example-dashboard".

# Filter format:
#	--filter=kind=Bucket
#	--filter=resource=Label:$Label_TMPL_NAME

influx apply \
	-f path/to/template.yml \
	--filter kind=Bucket \
	--filter resource=Dashboard:example-dashboard
```
