---
title: List clusters
description: >
  Use the Admin UI or the [`influxctl cluster list` command](/influxdb3/cloud-dedicated/reference/cli/influxctl/cluster/list/)
  to view information about InfluxDB Cloud Dedicated clusters associated with your account ID.
menu:
  influxdb3_cloud_dedicated:
    parent: Manage clusters
weight: 202
list_code_example: |
  ```sh
  influxctl cluster list
  ```
aliases:
  - /influxdb3/cloud-dedicated/admin/clusters/list/
---

Use the Admin UI or the [`influxctl cluster list` CLI command](/influxdb3/cloud-dedicated/reference/cli/influxctl/list/)
to view information about all {{< product-name omit=" Clustered" >}} clusters associated with your account ID.

{{< tabs-wrapper >}}
{{% tabs %}}
[Admin UI](#)
[influxctl](#)
{{% /tabs %}}
{{% tab-content %}}
{{< admin-ui-access >}}

### View cluster details

The cluster list displays the following cluster details:

- Cluster ID and name
- Status (ready, provisioning, etc.)
- Size (standard or custom)
- URL endpoint
{{% /tab-content %}}
{{% tab-content %}}

## Use the CLI

1.  If you haven't already, [download and install the `influxctl` CLI](/influxdb3/cloud-dedicated/reference/cli/influxctl/#download-and-install-influxctl), and then [configure a connection profile](/influxdb3/cloud-dedicated/reference/cli/influxctl/#configure-connection-profiles) for your cluster.

2.  Run `influxctl cluster list` with the following:

    - _Optional_: [Output format](#output-formats)

    ```sh
    influxctl cluster list --format table
    ```

### Output formats

The `influxctl cluster list` command supports two output formats: `table` and `json`.
By default, the output is formatted as a table.

#### Example table

```sh
+--------------------------------------+------------------+-------+----------------------------------------------------+
| ID                                   | NAME             | STATE | URL                                                |
+--------------------------------------+------------------+-------+----------------------------------------------------+
| X0x0xxx0-0XXx-000x-00x0-0X000Xx00000 | Internal - Cluster 1 | ready | X0x0xxx0-0XXx-000x-00x0-0X000Xx00000.a.influxdb.io |
+--------------------------------------+------------------+-------+----------------------------------------------------+
```

#### Detailed output in JSON

For additional cluster details and easier programmatic access to the command output, include `--format json`
with your command--for example:

```sh
influxctl cluster list --format json
```

The output is a JSON array of cluster objects that include additional fields such as account ID and created date.

```json
[
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
]
```
{{% /tab-content %}}
{{< /tabs-wrapper >}}

