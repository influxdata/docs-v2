---
title: influxd inspect delete-tsm
description: >
  The `influxd inspect delete-tsm` command deletes a measurement from a raw TSM file.
influxdb/v2.1/tags: [tsm]
menu:
  influxdb_2_1_ref:
    parent: influxd inspect
weight: 301
---

The `influxd inspect delete-tsm` command deletes a measurement from a raw TSM file.

## Usage
```sh
influxd inspect delete-tsm [flags]
```

## Flags
| Flag |                 | Description                                           | Input Type |
| :--- | :-------------- | :---------------------------------------------------- | :--------: |
| `-h` | `--help`        | Help for `delete-tsm`                                 |            |
|      | `--measurement` | Name of the measurement to delete                     |   string   |
|      | `--sanitize`    | Remove all keys with non-printable unicode characters |            |
| `-v` | `--verbose`     | Enable verbose logging                                |            |

## Examples

##### Delete a measurement from a TSM file
```sh
influxd inspect delete-tsm \
  --measurement example-measurement
```

##### Remove non-printable unicode characters from all TSM files
```sh
influxd inspect delete-tsm --sanitize
```
