---
title: influx setup
description: >
  The `influx setup` command walks through the initial InfluxDB setup process,
  creating a default user, organization, and bucket.
menu:
  v2_0_ref:
    name: influx setup
    parent: influx
weight: 101
v2.0/tags: [get-started]
---

The `influx setup` command walks through the initial InfluxDB setup process,
creating a default user, organization, and bucket.

## Usage
```
influx setup [flags]
```

## Flags
| Flag |               | Description                                                         | Data type |
|:---- |:---           |:-----------                                                         |:---------:|
| `-b` | `--bucket`    | Primary bucket name                                                 | string    |
| `-f` | `--force`     | Skip confirmation prompt                                            |           |
| `-h` | `--help`      | Help for the `setup` command                                        |           |
| `-o` | `--org`       | Primary organization name                                           | string    |
| `-p` | `--password`  | Password for primary user                                           | string    |
| `-r` | `--retention` | Duration the bucket will retain data (0 is infinite, default is 0). | duration  |
| `-u` | `--username`  | Primary username                                                    | string    |

{{% note %}}
Valid `--retention` units are nanoseconds (`ns`), microseconds (`us` or `µs`), milliseconds (`ms`), seconds (`s`), minutes (`m`), hours (`h`), days (`d`), and weeks (`w`).
{{% /note %}}

{{% cli/influx-global-flags %}}
