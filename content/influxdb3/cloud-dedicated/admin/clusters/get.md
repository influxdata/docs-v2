---
title: Get cluster information
description: >
  Use the Admin UI or the
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

Use the Admin UI or the [`influxctl cluster get` CLI command](/influxdb3/cloud-dedicated/reference/cli/influxctl/get/) to view information about your
{{< product-name omit=" Clustered" >}} cluster, including:

- Cluster ID
- Cluster name
- Cluster URL
- Cluster status
- Cluster size (standard or custom)

{{< tabs-wrapper >}}
{{% tabs %}}
[Admin UI](#)
[influxctl](#)
{{% /tabs %}}
{{% tab-content %}}
Access the InfluxDB Cloud Dedicated Admin UI at [console.influxdata.com](https://console.influxdata.com).
If you don't have login credentials, [contact InfluxData support](https://support.influxdata.com).

### View cluster details

The cluster list displays the following cluster details:

- Cluster ID and name
- Status (ready, provisioning, etc.)
- Size (standard or custom)
- URL endpoint

### Cluster management tools

The options button (3 vertical dots) to the right of any cluster provides additional tools for cluster management:

- Copy Cluster ID
- Copy Cluster URL
- Observe in Grafana _(only if your cluster has enabled operational dashboards. For more information, see how to [monitor your cluster](/influxdb3/cloud-dedicated/admin/monitor-your-cluster/).)_

### View cluster overview and metrics

{{< img-hd src="/img/influxdb3/cloud-dedicated-admin-ui-overview.png" alt="InfluxDB Cloud Dedicated Admin UI cluster overview" />}}

After selecting a cluster, the **Overview** page displays real-time cluster information and metrics:

- **Cluster Details**: View cluster name, status, creation date, cluster ID, and cluster URL.
- **Cluster Size**: See CPU allocation and component vCPU distribution (Ingest, Compaction, Query, System).
- **Cluster Metrics**: Monitor CPU usage, memory usage, and ingest line protocol rate with time-series charts.
- Configure the metrics time range and enable live updates for real-time monitoring.

{{% /tab-content %}}
{{% tab-content %}}

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
{{% /tab-content %}}
{{< /tabs-wrapper >}}
