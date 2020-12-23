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
related:
  - /influxdb/v2.0/reference/cli/influx/#provide-required-authentication-credentials, influx CLI—Provide required authentication credentials
  - /influxdb/v2.0/reference/cli/influx/#flag-patterns-and-conventions, influx CLI—Flag patterns and conventions
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
| `-o` | `--org`                   | Organization name that owns the bucket (mutually exclusive with `--org-id`)                 | string     | `INFLUX_ORG`         |
|      | `--org-id`                | Organization ID that owns the bucket (mutually exclusive with `--org`)                      | string     | `INFLUX_ORG_ID`      |
| `-q` | `--quiet`                 | Disable output printing                                                                     |            |                      |
| `-R` | `--recurse`               | Recurse through files in the directory specified in `-f`, `--file`                          |            |                      |
|      | `--secret`                | Secrets to provide with the template (format: `--secret=SECRET_KEY=SECRET_VALUE`)           | string     |                      |
|      | `--skip-verify`           | Skip TLS certificate verification                                                           |            |                      |
|      | `--stack-id`              | Stack ID to associate when applying the template                                            | string     |                      |
| `-t` | `--token`                 | Authentication token                                                                        | string     | `INFLUX_TOKEN`       |

## Examples: how to apply a template or stack

{{< cli/influx-creds-note >}}

- [from a file](#apply-a-template-from-a-file)
- [from a URL](#apply-a-template-from-a-url)
- [from a stack that has associated templates](#apply-a-stack-that-has-associated-templates)
- [a template to a stack](#apply-a-template-to-a-stack)
- [multiple template files together](#apply-multiple-template-files-together)
- [a template from stdin](#apply-a-template-from-stdin)
- [all templates in a directory](#apply-all-templates-in-a-directory)
- [recursively from a directory](#recursively-apply-templates-from-a-directory)
- [from multiple sources](#apply-templates-from-multiple-sources)
- [skip resources](#apply-a-template-but-skip-resources)

##### Apply a template from a file
```sh
influx apply --file path/to/template.json
```

##### Apply a template from a URL
```sh
influx apply --file https://raw.githubusercontent.com/influxdata/community-templates/master/docker/docker.yml
```

##### Apply a stack that has associated templates
To apply all templates associated with a stack ID to a new stack:

```sh
influx apply --stack-id $STACK_ID
```

##### Apply a template to a stack
```sh
influx apply --file path/to/template.json --stack-id $STACK_ID
```

##### Apply multiple template files together
```sh
influx apply \
  --file path/to/template_1.json \
  --file path/to/template_2.yml
```

##### Apply a template from stdin
```sh
cat template.json | influx apply --encoding json
```

##### Apply all templates in a directory
```sh
influx apply --file path/to/template_directory
```

##### Recursively apply templates from a directory
```sh
influx apply --recurse --file path/to/template_directory
```

##### Apply templates from multiple sources
```sh
influx apply \
  --file path/to/template.yml
  --file path/to/templates_directory
  --file https://example.com/template.json
```

##### Apply a template, but skip resources
```sh
# The following example skips all buckets and the dashboard
# whose metadata.name field matches "example-dashboard".

# Filter format:
#	--filter=kind=Bucket
#	--filter=resource=Label:$Label_TMPL_NAME

influx apply \
	--file path/to/template.yml \
	--filter kind=Bucket \
	--filter resource=Dashboard:example-dashboard
```
