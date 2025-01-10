---
title: Get cluster information
description: >
  Use the
  [`influxctl cluster get <CLUSTER_ID>` command](/influxdb3/cloud-dedicated/reference/cli/influxctl/cluster/get/) to view information about your InfluxDB Cloud Dedicated cluster.
menu:
  influxdb3_cloud_dedicated:
    parent: Manage clusters
weight: 202
list_code_example: |
  ```sh
  influxctl cluster get 0x000000-xy00-0xy-x00-0x00y0000000
  ```
---

Use the [`influxctl cluster get` CLI command](/influxdb3/cloud-dedicated/reference/cli/influxctl/get/)
to view information about your {{< product-name omit=" Clustered" >}} cluster.

1.  If you haven't already, [download and install the `influxctl` CLI](/influxdb3/cloud-dedicated/reference/cli/influxctl/#download-and-install-influxctl), and then [configure a connection profile](/influxdb3/cloud-dedicated/reference/cli/influxctl/#configure-connection-profiles) for your cluster.
2.  Run `influxctl cluster get` with the following:

    - Cluster ID
    - _Optional_: [Output format](#output-formats)

{{% code-placeholders "CLUSTER_ID" %}}
```sh
influxctl cluster get --format table CLUSTER_ID
```
{{% /code-placeholders %}}

Replace {{% code-placeholder-key %}}`CLUSTER_ID` {{% /code-placeholder-key %}} with the
ID of the cluster you want to view information about.

### Output formats

The `influxctl cluster get` command supports two output formats: `table` and `json`.
By default, the output is formatted as a table.
For additional cluster details and easier programmatic access to the command output, include `--format json`
with your command to format the cluster as a JSON object.

#### Example output

```sh
+-------+----------------------------------------------------+
|    id | X0x0xxx0-0XXx-000x-00x0-0X000Xx00000                |
|  name | Internal - Cluster 1                               |
| state | ready                                              |
|   url | X0x0xxx0-0XXx-000x-00x0-0X000Xx00000.a.influxdb.io  |
+-------+----------------------------------------------------+
```

#### Detailed output in JSON

For additional cluster details and easier programmatic access to the command output, include `--format json`
with your command--for example:

```sh
influxctl cluster get --format json X0x0xxx0-0XXx-000x-00x0-0X000Xx00000
```

The output is the cluster as a JSON object that includes additional fields such as account ID and created date.

```json
{
    "account_id": "0x0x0x00-0Xx0-00x0-x0X0-00x00XX0Xx0X",
    "cluster_id": "X0x0xxx0-0XXx-000x-00x0-0X000Xx00000",
    "name": "Internal - Cluster 1",
    "url": "X0x0xxx0-0XXx-000x-00x0-0X000Xx00000.a.influxdb.io",
    "state": "ready",
    "created_at": {
      "seconds": 1686670941,
      "nanos": 520023000
    },
    "category": 1
}
```
