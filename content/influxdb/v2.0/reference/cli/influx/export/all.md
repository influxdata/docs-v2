---
title: influx export all
description: >
  The `influx export all` command exports all resources in an organization as an InfluxDB template.
menu:
  influxdb_2_0_ref:
    parent: influx export
weight: 201
aliases:
  - /v2.0/reference/cli/influx/pkg/export/all/
  - /v2.0/reference/cli/influx/export/all/
related:
  - /influxdb/v2.0/influxdb-templates/create/
---

The `influx export all` command exports all resources in an
organization as an InfluxDB template.
_For detailed examples of exporting InfluxDB templates, see
[Create an InfluxDB template](/influxdb/v2.0/influxdb-templates/create/)._

## Usage
```
influx export all [flags]
```

## Flags
| Flag |                  | Description                                                                                     | Input Type      | {{< cli/mapped >}}   |
|:---- |:---              |:-----------                                                                                     |:----------      |:------------------   |
|      | `--configs-path` | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`)                           | string          |`INFLUX_CONFIGS_PATH` |
| `-f` | `--file`         | Template output file. Defaults to stdout. Use `.yml` or `.json` file extensions.                | string          |                      |
|      | `--filter`       | Specify resources to export by labelName or resourceKind (format: `--filter=labelName=example`) | list of strings |                      |
| `-h` | `--help`         | Help for the `export all` command                                                               |                 |                      |
|      | `--host`         | HTTP address of InfluxDB (default `http://localhost:9999`)                                      | string          | `INFLUX_HOST`        |
| `-o` | `--org`          | Organization name that owns the resources                                                       | string          | `INFLUX_ORG`         |
|      | `--org-id`       | Organization ID that owns the resources                                                         | string          | `INFLUX_ORG_ID`      |
|      | `--skip-verify`  | Skip TLS certificate verification                                                               |                 |                      |
| `-t` | `--token`        | Authentication token                                                                            | string          | `INFLUX_TOKEN`       |


## Examples
```sh
# Export all resources in an organization as a template
influx export all --org $INFLUX_ORG

# Export all bucket resources as a template
influx export all --org $INFLUX_ORG --filter=resourceKind=Bucket

# Export all resources associated with label Foo
influx export all --org $INFLUX_ORG --filter=labelName=Foo

# Export all bucket resources and filter by label Foo
influx export all --org $INFLUX_ORG \
	--filter=resourceKind=Bucket \
	--filter=labelName=Foo

# Export all bucket or dashboard resources and filter by label Foo.
#
# Note: "like" filters are unioned and filter types are intersections.
#	For example, the following will export a resource if it is a dashboard or
#	bucket and has an associated label of Foo.
influx export all --org $INFLUX_ORG \
	--filter=resourceKind=Bucket \
	--filter=resourceKind=Dashboard \
	--filter=labelName=Foo
``
