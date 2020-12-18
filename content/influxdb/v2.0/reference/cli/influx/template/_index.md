---
title: influx template
description: The `influx template` command summarizes the specified InfluxDB template.
menu:
  influxdb_2_0_ref:
    name: influx template
    parent: influx
weight: 101
influxdb/v2.0/tags: [templates]
aliases:
  - /influxdb/v2.0/reference/cli/influx/pkg/summary/
---

The `influx template` command summarizes the specified InfluxDB template.

## Usage
```
influx template [flags]
influx template [command]
```

## Subcommands
| Subcommand                                                        | Description         |
|:----------                                                        |:-----------         |
| [validate](/influxdb/v2.0/reference/cli/influx/template/validate) | Validate a template |

## Flags
| Flag |                           | Description                                                        | Input Type  | {{< cli/mapped >}}   |
|:---- |:---                       |:-----------                                                        |:----------  |:------------------   |
|      | `--disable-color`         | Disable color in output                                            |             |                      |
|      | `--disable-table-borders` | Disable table borders                                              |             |                      |
| `-e` | `--encoding`              | Encoding of the input stream (`yaml`,`yml`,`json`, or `jsonnet`)   | string      |                      |
| `-f` | `--file`                  | Path to template file (supports HTTP(S) URLs or file paths)        | stringArray |                      |
| `-h` | `--help`                  | Help for the `template` command                                    |             |                      |
|      | `--json`                  | Output data as JSON (default `false`)                              |             | `INFLUX_OUTPUT_JSON` |
| `-R` | `--recurse`               | Recurse through files in the directory specified in `-f`, `--file` |             |                      |

## Examples

{{< cli/influx-creds-note >}}

- [Summarize an InfluxDB template from a local file](#summarize-an-influxdb-template-from-a-local-file)
- [Summarize InfluxDB templates from multiple files](#summarize-influxdb-templates-from-multiple-files)
- [Summarize an InfluxDB template from a URL](#summarize-an-influxdb-template-from-a-url)
- [Summarize all InfluxDB templates in a directory](#summarize-all-influxdb-templates-in-a-directory)
- [Specify the encoding of the InfluxDB template to summarize](#specify-the-encoding-of-the-influxdb-template-to-summarize)

##### Summarize an InfluxDB template from a local file
```sh
influx template --file /path/to/template.yml
```

##### Summarize InfluxDB templates from multiple files
```sh
influx template \
  --file /path/to/template1.yml \
  --file /path/to/template2.yml
```

##### Summarize an InfluxDB template from a URL
```sh
influx template --file https://example.com/path/to/template.yml
```

##### Summarize all InfluxDB templates in a directory
```sh
influx template \
  --file /path/to/template/dir/ \
  --recurse
```

##### Specify the encoding of the InfluxDB template to summarize
```sh
influx template \
  --file /path/to/template \
  --encoding json
```
