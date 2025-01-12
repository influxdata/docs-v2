---
title: influxdb3 delete
description: >
  The `influxdb3 delete` command deletes a resource such as a database or a table.
menu:
  influxdb3_enterprise:
    parent: influxdb3
    name: influxdb3 delete
weight: 300
---
## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 delete <SUBCOMMAND>
```

## Subcommands

| Subcommand                                                                     | Description                                    |
| :----------------------------------------------------------------------------- | :--------------------------------------------- |
| [database](/influxdb3/enterprise/reference/cli/influxdb3/delete/database/)     | Delete a database                              |
| [file_index](/influxdb3/enterprise/reference/cli/influxdb3/delete/file_index/) | Delete a file index for a database or table    |
| [last_cache](/influxdb3/enterprise/reference/cli/influxdb3/delete/last_cache/) | Delete a last value cache                      |
| [distinct_cache](/influxdb3/enterprise/reference/cli/influxdb3/delete/distinct_cache/) | Delete a metadata cache                        |
| [plugin](/influxdb3/enterprise/reference/cli/influxdb3/delete/plugin/)         | Delete a processing engine plugin              |
| [table](/influxdb3/enterprise/reference/cli/influxdb3/delete/table/)           | Delete a table from a database                 |
| [trigger](/influxdb3/enterprise/reference/cli/influxdb3/delete/trigger/)       | Delete a trigger for the processing engine     |
| help                                                                           | Print command help or the help of a subcommand |

## Options

| Option |          | Description            |
| :----- | :------- | :--------------------- |
| `-h`   | `--help` | Print help information |
