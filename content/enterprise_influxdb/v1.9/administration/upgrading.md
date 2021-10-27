---
title: Upgrade InfluxDB Enterprise clusters
description: Upgrade to the latest version of InfluxDB Enterprise.
aliases:
    - /enterprise/v1.9/administration/upgrading/
menu:
  enterprise_influxdb_1_9:
    name: Upgrade
    weight: 50
    parent: Administration
---

To successfully perform a rolling upgrade of InfluxDB Enterprise clusters to {{< latest-patch >}}, complete the following steps:

1. [Back up your cluster](#back-up-your-cluster).
2. [Upgrade meta nodes](#upgrade-meta-nodes).
3. [Upgrade data nodes](#upgrade-data-nodes).

> ***Note:*** A rolling upgrade lets you update your cluster with zero downtime. To downgrade to an earlier version, complete the following procedures, replacing the version numbers with the version that you want to downgrade to.

## Back up your cluster

Before performing an upgrade, create a full backup of your InfluxDB Enterprise cluster. Also, if you create incremental backups, trigger a final incremental backup.

> ***Note:*** For information on performing a final incremental backup or a full backup,
> see [Back up and restore InfluxDB Enterprise clusters](/enterprise_influxdb/v1.9/administration/backup-and-restore/).

## Upgrade meta nodes

Complete the following steps to upgrade meta nodes:

1. [Download the meta node package](#download-the-meta-node-package).
2. [Install the meta node package](#install-the-meta-node-package).
3. [Update the meta node configuration file](#update-the-meta-node-configuration-file).
4. [Restart the `influxdb-meta` service](#restart-the-influxdb-meta-service).
5. Repeat steps 1-4 for each meta node in your cluster.
6. [Confirm the meta nodes upgrade](#confirm-the-meta-nodes-upgrade).

### Download the meta node package

##### Ubuntu and Debian (64-bit)

```bash
wget https://dl.influxdata.com/enterprise/releases/influxdb-meta_{{< latest-patch >}}-c{{< latest-patch >}}_amd64.deb
```

##### RedHat and CentOS (64-bit)

```bash
wget https://dl.influxdata.com/enterprise/releases/influxdb-meta-{{< latest-patch >}}_c{{< latest-patch >}}.x86_64.rpm
```

### Install the meta node package

##### Ubuntu and Debian (64-bit)

```bash
sudo dpkg -i influxdb-meta_{{< latest-patch >}}-c{{< latest-patch >}}_amd64.deb
```

##### RedHat and CentOS (64-bit)

```bash
sudo yum localinstall influxdb-meta-{{< latest-patch >}}-c{{< latest-patch >}}.x86_64.rpm
```

### Update the meta node configuration file

Migrate any custom settings from your previous meta node configuration file.

To enable HTTPS, you must update the meta node configuration file (`influxdb-meta.conf`). For information, see [Enable HTTPS within the configuration file for each Meta Node](/enterprise_influxdb/v1.9/guides/https_setup/#set-up-https-in-an-influxdb-enterprise-cluster).

### Restart the `influxdb-meta` service

##### sysvinit systems

```bash
service influxdb-meta restart
```

##### systemd systems

```bash
sudo systemctl restart influxdb-meta
```

### Confirm the meta nodes upgrade

After upgrading _**all**_ meta nodes, check your node version numbers using the
`influxd-ctl show` command.
The [`influxd-ctl` utility](/enterprise_influxdb/v1.9/tools/influxd-ctl/) is available on all meta nodes.

```bash
~# influxd-ctl show

Data Nodes
==========
ID	TCP Address		Version
4	rk-upgrading-01:8088	1.8.x_c1.8.y
5	rk-upgrading-02:8088	1.8.x_c1.8.y
6	rk-upgrading-03:8088	1.8.x_c1.8.y

Meta Nodes
==========
TCP Address		Version
rk-upgrading-01:8091	{{< latest-patch >}}-c{{< latest-patch >}}   # {{< latest-patch >}}-c{{< latest-patch >}} = 👍
rk-upgrading-02:8091	{{< latest-patch >}}-c{{< latest-patch >}}
rk-upgrading-03:8091	{{< latest-patch >}}-c{{< latest-patch >}}
```

Ensure that the meta cluster is healthy before upgrading the data nodes.

## Upgrade data nodes

Complete the following steps to upgrade data nodes:

1. [Stop traffic to data nodes](#stop-traffic-to-the-data-node).
2. [Download the data node package](#download-the-data-node-package).
3. [Install the data node package](#install-the-data-node-package).
4. [Update the data node configuration file](#update-the-data-node-configuration-file).
5. For Time Series Index (TSI) only. [Rebuild TSI indexes](#rebuild-tsi-indexes).
6. [Restart the `influxdb` service](#restart-the-influxdb-service).
7. [Restart traffic to data nodes](#restart-traffic-to-data-nodes).
8. Repeat steps 1-7 for each data node in your cluster.
9. [Confirm the data nodes upgrade](#confirm-the-data-nodes-upgrade).

### Stop traffic to the data node
To stop traffic to data nodes, **do one of the following:**

- **Disable traffic to data nodes in the node balancer**
    
    - If you have access to the load balancer configuration, use your load balancer to stop routing read and write requests to the data node server (port 8086).
    - If you cannot access the load balancer configuration, work with your networking team to prevent traffic to the data node server before continuing to upgrade.

    {{% note %}}
Disabling traffic to a data node in the load balancer still allows other data
node in the cluster to write to current data node.
    {{% /note %}}

- **Stop the `influxdb` service on the data node** 

    {{< code-tabs-wrapper >}}
{{% code-tabs %}}
[sysvinit](#)
[systemd](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```bash
service influxdb stop
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```bash
sudo systemctl stop influxdb
```
{{% /code-tab-content %}}
    {{< /code-tabs-wrapper >}}

    {{% note %}}
Stopping the `influxdb` process the data node takes longer than disabling
traffic at the load balancer, but but ensures all writes stop, including writes
from other data nodes in the cluster.
    {{% /note %}}

### Download the data node package

##### Ubuntu and Debian (64-bit)

```bash
wget https://dl.influxdata.com/enterprise/releases/influxdb-data_{{< latest-patch >}}_c{{< latest-patch >}}_amd64.deb
```

##### RedHat and CentOS (64-bit)

```bash
wget https://dl.influxdata.com/enterprise/releases/influxdb-data-{{< latest-patch >}}_c{{< latest-patch >}}.x86_64.rpm
```

### Install the data node package

When you run the install command, you're prompted to keep or overwrite your
current configuration file with the file for version {{< latest-patch >}}.
Enter `N` or `O` to keep your current configuration file.
You'll make the configuration changes for version {{< latest-patch >}} in the
next procedure, [Update the data node configuration file](#update-the-data-node-configuration-file).


##### Ubuntu & Debian (64-bit)

```bash
sudo dpkg -i influxdb-data_{{< latest-patch >}}-c{{< latest-patch >}}_amd64.deb
```

##### RedHat & CentOS (64-bit)

```bash
sudo yum localinstall influxdb-data-{{< latest-patch >}}-c{{< latest-patch >}}.x86_64.rpm
```

### Update the data node configuration file

Migrate any custom settings from your previous data node configuration file.

- To enable HTTPS, see [Enable HTTPS within the configuration file for each Data Node](/enterprise_influxdb/v1.9/guides/https_setup/#set-up-https-in-an-influxdb-enterprise-cluster).

- To enable TSI, open `/etc/influxdb/influxdb.conf`, and then adjust and save the settings shown in the following table.

    | Section | Setting                                                   |
    | --------| ----------------------------------------------------------|
    | `[data]` |  <ul><li>To use Time Series Index (TSI) disk-based indexing, add [`index-version = "tsi1"`](/enterprise_influxdb/v1.9/administration/config-data-nodes#index-version-inmem) <li>To use TSM in-memory index, add [`index-version = "inmem"`](/enterprise_influxdb/v1.9/administration/config-data-nodes#index-version-inmem) <li>Add [`wal-fsync-delay = "0s"`](/enterprise_influxdb/v1.9/administration/config-data-nodes#wal-fsync-delay-0s) <li>Add [`max-concurrent-compactions = 0`](/enterprise_influxdb/v1.9/administration/config-data-nodes#max-concurrent-compactions-0)<li>Set[`cache-max-memory-size`](/enterprise_influxdb/v1.9/administration/config-data-nodes#cache-max-memory-size-1g) to `1073741824` |
    | `[cluster]`| <ul><li>Add [`pool-max-idle-streams = 100`](/enterprise_influxdb/v1.9/administration/config-data-nodes#pool-max-idle-streams-100) <li>Add[`pool-max-idle-time = "1m0s"`](/enterprise_influxdb/v1.9/administration/config-data-nodes#pool-max-idle-time-60s) <li>Remove `max-remote-write-connections`
    |[`[anti-entropy]`](/enterprise_influxdb/v1.9/administration/config-data-nodes#anti-entropy)| <ul><li>Add `enabled = true` <li>Add `check-interval = "30s"` <li>Add `max-fetch = 10`|
    |`[admin]`| Remove entire section.|

    For more information about TSI, see [TSI overview](/enterprise_influxdb/v1.9/concepts/time-series-index/) and [TSI details](/enterprise_influxdb/v1.9/concepts/tsi-details/).

### Rebuild TSI indexes

Complete the following steps for Time Series Index (TSI) only.

1. Delete all `_series` directories in the `/data` directory (by default, stored at `/data/<dbName>/_series`).

2. Delete all TSM-based shard `index` directories (by default, located at `/data/<dbName/<rpName>/<shardID>/index`).

3. Use the [`influx_inspect buildtsi`](/enterprise_influxdb/v1.9/tools/influx_inspect#buildtsi) utility to rebuild the TSI index. For example, run the following command:

    ```js
    influx_inspect buildtsi -datadir /yourDataDirectory -waldir /wal
    ```

    Replacing `yourDataDirectory` with the name of your directory. Running this command converts TSM-based shards to TSI shards or rebuilds existing TSI shards.

    > **Note:** Run the `buildtsi` command using the same system user that runs the `influxd` service, or a user with the same permissions.

### Restart the `influxdb` service

Restart the `influxdb` service to restart the data nodes.
Do one of the following:

- **If the `influxdb` service is still running**, but isn't receiving traffic from the load balancer:

    {{< code-tabs-wrapper >}}
{{% code-tabs %}}
[sysvinit](#)
[systemd](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```bash
service influxdb restart
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```bash
sudo systemctl restart influxdb
```
{{% /code-tab-content %}}
    {{< /code-tabs-wrapper >}}

- **If the `influxdb` service is stopped**:

    {{< code-tabs-wrapper >}}
{{% code-tabs %}}
[sysvinit](#)
[systemd](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```bash
service influxdb start
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```bash
sudo systemctl start influxdb
```
{{% /code-tab-content %}}
    {{< /code-tabs-wrapper >}}

### Restart traffic to data nodes

Restart routing read and write requests to the data node server (port 8086) through your load balancer.

> **Note:** Allow the hinted handoff queue (HHQ) to write all missed data to the updated node before upgrading the next data node. Once all data has been written, the disk space used in the hinted handoff queue should be 0. Check the disk space on your hh directory by running the [`du`] command, for example, `du /var/lib/influxdb/hh`.

### Confirm the data nodes upgrade

After upgrading _**all**_ data nodes, check your node version numbers using the
`influxd-ctl show` command.
The [`influxd-ctl` utility](/enterprise_influxdb/v1.9/tools/influxd-ctl/) is available on all meta nodes.

```bash
~# influxd-ctl show

Data Nodes
==========
ID	TCP Address		Version
4	rk-upgrading-01:8088	{{< latest-patch >}}-c{{< latest-patch >}}   # {{< latest-patch >}}-c{{< latest-patch >}} = 👍
5	rk-upgrading-02:8088	{{< latest-patch >}}-c{{< latest-patch >}}
6	rk-upgrading-03:8088	{{< latest-patch >}}-c{{< latest-patch >}}

Meta Nodes
==========
TCP Address		Version
rk-upgrading-01:8091	{{< latest-patch >}}-c{{< latest-patch >}}
rk-upgrading-02:8091	{{< latest-patch >}}-c{{< latest-patch >}}
rk-upgrading-03:8091	{{< latest-patch >}}-c{{< latest-patch >}}
```

If you have any issues upgrading your cluster, contact InfluxData support.
