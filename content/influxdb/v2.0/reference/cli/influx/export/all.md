---
title: influx export all
description: >
  The `influx export all` command exports all resources in an organization as an InfluxDB template.
menu:
  influxdb_2_0_ref:
    parent: influx export
weight: 201
aliases:
  - /influxdb/v2.0/reference/cli/influx/pkg/export/all/
related:
  - /influxdb/v2.0/influxdb-templates/create/
---

The `influx export all` command exports all resources in an
organization as an InfluxDB template.
_For detailed examples of exporting InfluxDB templates, see
[Create an InfluxDB template](/influxdb/v2.0/influxdb-templates/create/)._

{{% note %}}
To be capable of export your resources as templates, you need to get an All Access Token. Look at this article to learn how to create an All Access Token: [Create an authentication token in InfluxDB 2.0](https://docs.influxdata.com/influxdb/v2.0/security/tokens/create-token/).
{{% /note %}}

## Usage
```
influx export all [flags]
```

## Flags
| Flag |                   | Description                                                                                     | Input Type      | {{< cli/mapped >}}   |
|:---- |:---               |:-----------                                                                                     |:----------      |:------------------   |
| `-c` | `--active-config` | CLI configuration to use for command                                                            | string          |                      |
|      | `--configs-path`  | Path to `influx` CLI configurations (default `~/.influxdbv2/configs`)                           | string          |`INFLUX_CONFIGS_PATH` |
| `-f` | `--file`          | Template output file. Defaults to stdout. Use `.yml` or `.json` file extensions.                | string          |                      |
|      | `--filter`        | Specify resources to export by labelName or resourceKind (format: `--filter=labelName=example`) | list of strings |                      |
| `-h` | `--help`          | Help for the `export all` command                                                               |                 |                      |
|      | `--host`          | HTTP address of InfluxDB (default `http://localhost:8086`)                                      | string          | `INFLUX_HOST`        |
| `-o` | `--org`           | Organization name that owns the resources                                                       | string          | `INFLUX_ORG`         |
|      | `--org-id`        | Organization ID that owns the resources                                                         | string          | `INFLUX_ORG_ID`      |
|      | `--skip-verify`   | Skip TLS certificate verification                                                               |                 |                      |
| `-t` | `--token`         | Authentication token                                                                            | string          | `INFLUX_TOKEN`       |


## Examples

{{< cli/influx-creds-note >}}

### Export all resources in an organization as a template
```sh
influx export all --org $INFLUX_ORG
```

### Export all bucket resources as a template
```sh
influx export all --org $INFLUX_ORG --filter=resourceKind=Bucket
```

### Export all resources associated with label Foo
```sh
influx export all --org $INFLUX_ORG --filter=labelName=Foo
```

### Export all bucket resources and filter by label Foo
```sh
influx export all --org $INFLUX_ORG \
	--filter=resourceKind=Bucket \
	--filter=labelName=Foo
```

### Export all bucket or dashboard resources and filter by label Foo.

<b>Note</b>: "like" filters are unioned and filter types are intersections.
For example, the following will export a resource if it is a dashboard or bucket and has an associated label of `Foo`.

```influx export all --org $INFLUX_ORG \
	--filter=resourceKind=Bucket \
	--filter=resourceKind=Dashboard \
	--filter=labelName=Foo
```
