---
title: influx template validate
description: >
  The `influx template validate` command validates the provided InfluxDB template.
menu:
  influxdb_2_1_ref:
    parent: influx template
weight: 201
aliases:
  - /influxdb/v2.1/reference/cli/influx/pkg/validate/
---

The `influx template validate` command validates the provided InfluxDB template.

## Usage
```
influx template validate [flags]
```

## Flags

| Flag |              | Description                                                        | Input Type  |
|:---- |:---          |:-----------                                                        |:----------  |
| `-e` | `--encoding` | Template encoding                                                  | string      |
| `-f` | `--file`     | Path to template file (supports HTTP(S) URLs or file paths)        | stringArray |
| `-h` | `--help`     | Help for the `validate` command                                    |             |
| `-R` | `--recurse`  | Recurse through files in the directory specified in `-f`, `--file` |             |

## Examples

{{< cli/influx-creds-note >}}

**Validate InfluxDB Templates:**

- [from a local file](#validate-an-influxdb-template-from-a-local-file)
- [from multiple files](#validate-influxdb-templates-from-multiple-files)
- [from a URL](#validate-an-influxdb-template-from-a-url)
- [from a directory](#validate-all-influxdb-templates-in-a-directory)
- [using a specific encoding](#specify-the-encoding-of-the-influxdb-template-to-validate)

##### Validate an InfluxDB template from a local file
```sh
influx template validate --file /path/to/template.yml
```

##### Validate InfluxDB templates from multiple files
```sh
influx template validate \
  --file /path/to/template1.yml \
  --file /path/to/template2.yml
```

##### Validate an InfluxDB template from a URL
```sh
influx template validate --file https://example.com/path/to/template.yml
```

##### Validate all InfluxDB templates in a directory
```sh
influx template validate \
  --file /path/to/template/dir/ \
  --recurse
```

##### Specify the encoding of the InfluxDB template to validate
```sh
influx template validate \
  --file /path/to/template \
  --encoding json
```