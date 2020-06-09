---
title: influx export all
description: >
  The 'influx export all' command exports all resources in an organization as an InfluxDB template.
menu:
  v2_0_ref:
    parent: influx export
weight: 201
aliases:
  - /v2.0/reference/cli/influx/pkg/export/all/
related:
  - /v2.0/influxdb-templates/create/
---

The `influx export all` command exports all resources in an
organization as an InfluxDB template.
_For detailed examples of exporting InfluxDB templates, see
[Create an InfluxDB template](/v2.0/influxdb-templates/create/)._

## Usage
```
influx export all [flags]
```

## Flags
| Flag           | Description                                                                                     | Input Type      | {{< cli/mapped >}} |
|:----           |:-----------                                                                                     |:----------      |:------------------ |
| `-f`, `--file` | Template output file. Defaults to stdout. Use `.yml` or `.json` file extensions.                | string          |                    |
| `--filter`     | Specify resources to export by labelName or resourceKind (format: `--filter=labelName=example`) | list of strings |
| `-h`, `--help` | Help for the `export all` command                                                               |                 |                    |
| `-o`, `--org`  | Organization name that owns the resources                                                       | string          | `INFLUX_ORG`       |
| `--org-id`     | Organization ID that owns the resources                                                         | string          | `INFLUX_ORG_ID`    |

{{% cli/influx-global-flags %}}

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
