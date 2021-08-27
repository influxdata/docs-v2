---
title: Migrate InfluxDB OSS instances to InfluxDB Enterprise clusters
description: >
  Migrate a running instance of InfluxDB open source (OSS) to an InfluxDB Enterprise cluster.
aliases:
  - /enterprise/v1.9/guides/migration/
menu:
  enterprise_influxdb_1_9:
    name: Migrate InfluxDB OSS to Enterprise
    weight: 10
    parent: Guides
---

Migrate a running instance of InfluxDB open source (OSS) to an InfluxDB Enterprise cluster.

{{% note %}}
- Migration transfers all users from the OSS instance to the InfluxDB Enterprise cluster.
{{% /note %}}

## Migrate an OSS instance to InfluxDB Enterprise

Complete the following tasks
to migrate data from OSS to an InfluxDB Enterprise cluster without downtime or missing data.

1. Upgrade InfluxDB OSS and InfluxDB Enterprise to the latest stable versions.
   - [Upgrade InfluxDB OSS](/{{< latest "influxdb" "v1" >}}/administration/upgrading/)
   - [Upgrade InfluxDB Enterprise](/enterprise_influxdb/v1.9/administration/upgrading/)

2. On each meta node and each data node,
   add the IP and hostname of your OSS instance to the `/etc/hosts` file.
   This will allow the nodes to communicate with the OSS instance.

3. On the OSS instance, take a portable backup from OSS:

   ```sh
   influxd-ctl backup -portable -host <IP address>:8088 /tmp/mysnapshot
   ```

   Note the current date and time when you take the backup.
   For more information, see [`-backup`](/enterprise_influxdb/v1.9/administration/backup-and-restore/#backup)

4. Restore the backup on the cluster by running the following:

   ```sh
   influxd-ctl restore -portable  [ -host <host:port> ] <path-to-backup-files>
   ```
   For more information, see [`-restore`](/enterprise_influxdb/v1.9/administration/backup-and-restore/#restore)

5. To avoid data loss, dual write to both OSS and Enterprise while completing the upgrade.
   See [Write data with the InfluxDB API](/enterprise_influxdb/v1.9/guides/write_data/).
   This keeps the OSS and cluster active for testing and acceptance work.

6. [Export data from OSS](/enterprise_influxdb/v1.9/administration/backup-and-restore/#exporting-data)
   from the time the backup was taken to the time the dual write started.
   For example, if you take the backup on `2020-07-19T00:00:00.000Z`,
   and started writing data to Enterprise at `2020-07-19T23:59:59.999Z`,
   you would run the following command:

   ```sh
   influx_inspect export -compress -start 2020-07-19T00:00:00.000Z -end 2020-07-19T23:59:59.999Z`
   ```

   For more information, see [`-export`](/enterprise_influxdb/v1.9/tools/influx_inspect#export).

7. [Import data into Enterprise](/enterprise_influxdb/v1.9/administration/backup-and-restore/#importing-data).

8. Verify data is successfully migrated to your Enterprise cluster. See:
   - [Query data with the InfluxDB API](/enterprise_influxdb/v1.9/guides/query_data/)
   - [View data in Chronograf](/{{< latest "chronograf" >}}/)

9. Follow [Stop writes and remove OSS](#stop-writes-and-remove-oss) below.

<!--
### Migrate a data set with downtime

1. [Stop writes and remove OSS](#stop-writes-and-remove-oss)
2. [Back up OSS configuration](#back-up-oss-configuration)
3. [Add the upgraded OSS instance to the InfluxDB Enterprise cluster](#add-the-new-data-node-to-the-cluster)
4. [Add existing data nodes back to the cluster](#add-existing-data-nodes-back-to-the-cluster)
5. [Rebalance the cluster](#rebalance-the-cluster)

#### Stop writes and remove OSS

1. Stop all writes to the InfluxDB OSS instance.
2. Stop the `influxdb` service on the InfluxDB OSS instance.

    {{< code-tabs-wrapper >}}
    {{% code-tabs %}}
[sysvinit](#)
[systemd](#)
    {{% /code-tabs %}}
    {{% code-tab-content %}}
```bash
sudo service influxdb stop
```
    {{% /code-tab-content %}}
    {{% code-tab-content %}}
```bash
sudo systemctl stop influxdb
```
    {{% /code-tab-content %}}
    {{< /code-tabs-wrapper >}}

    Double check that the service is stopped.
    The following command should return nothing:

    ```bash
    ps ax | grep influxd
    ```

3. Remove the InfluxDB OSS package.

    {{< code-tabs-wrapper >}}
    {{% code-tabs %}}
[Debian & Ubuntu](#)
[RHEL & CentOS](#)
    {{% /code-tabs %}}
    {{% code-tab-content %}}
```bash
sudo apt-get remove influxdb
```
    {{% /code-tab-content %}}
    {{% code-tab-content %}}
```bash
sudo yum remove influxdb
```
    {{% /code-tab-content %}}
    {{< /code-tabs-wrapper >}}

#### Back up and migrate your InfluxDB OSS configuration file

1. **Back up your InfluxDB OSS configuration file**.
    If you have custom configuration settings for InfluxDB OSS, back up and save your configuration file.

    {{% warn %}}
Without a backup, you'll lose custom configuration settings when updating the InfluxDB binary.
    {{% /warn %}}

2. **Update the InfluxDB binary**.

    > Updating the InfluxDB binary overwrites the existing configuration file.
    > To keep custom settings, back up your configuration file.

    {{< code-tabs-wrapper >}}
    {{% code-tabs %}}
[Debian & Ubuntu](#)
[RHEL & CentOS](#)
    {{% /code-tabs %}}
    {{% code-tab-content %}}
```bash
wget https://dl.influxdata.com/enterprise/releases/influxdb-data_{{< latest-patch >}}-c{{< latest-patch >}}_amd64.deb
sudo dpkg -i influxdb-data_{{< latest-patch >}}-c{{< latest-patch >}}_amd64.deb
```
    {{% /code-tab-content %}}
    {{% code-tab-content %}}
```bash
wget https://dl.influxdata.com/enterprise/releases/influxdb-data-{{< latest-patch >}}_c{{< latest-patch >}}.x86_64.rpm
sudo yum localinstall influxdb-data-{{< latest-patch >}}_c{{< latest-patch >}}.x86_64.rpm
```
    {{% /code-tab-content %}}
    {{< /code-tabs-wrapper >}}

3. **Update the configuration file**.

    In `/etc/influxdb/influxdb.conf`:

    - set `hostname` to the full hostname of the data node
    - set `license-key` in the `[enterprise]` section to the license key you received on InfluxPortal
      **or** set `license-path` in the `[enterprise]` section to
      the local path to the JSON license file you received from InfluxData.

      {{% warn %}}
The `license-key` and `license-path` settings are mutually exclusive and one must remain set to an empty string.
      {{% /warn %}}

      ```toml
      # Hostname advertised by this host for remote addresses.
      # This must be accessible to all nodes in the cluster.
      hostname="<data-node-hostname>"

      [enterprise]
      # license-key and license-path are mutually exclusive,
      # use only one and leave the other blank
      license-key = "<your_license_key>"
      license-path = "/path/to/readable/JSON.license.file"
      ```

      {{% note %}}
Transfer any custom settings from the backup of your OSS configuration file
to the new Enterprise configuration file.
      {{% /note %}}

4. **Update the `/etc/hosts` file**.

    Add all meta and data nodes to the `/etc/hosts` file to allow the OSS instance
    to communicate with other nodes in the InfluxDB Enterprise cluster.

5. **Start the data node**.

    {{< code-tabs-wrapper >}}
    {{% code-tabs %}}
[sysvinit](#)
[systemd](#)
    {{% /code-tabs %}}
    {{% code-tab-content %}}
```bash
sudo service influxdb start
```
    {{% /code-tab-content %}}
    {{% code-tab-content %}}
```bash
sudo systemctl start influxdb
```
    {{% /code-tab-content %}}
    {{< /code-tabs-wrapper >}}

#### Add the new data node to the cluster

After you upgrade your OSS instance to InfluxDB Enterprise, add the node to your Enterprise cluster.

From a **meta** node in the cluster, run:

```bash
influxd-ctl add-data <new-data-node-hostname>:8088
```

The output should look like:

```bash
Added data node y at new-data-node-hostname:8088
```

#### Add existing data nodes back to the cluster

If you removed any existing data nodes from your InfluxDB Enterprise cluster,
add them back to the cluster.

1. From a **meta** node in the InfluxDB Enterprise cluster, run the following for
   **each data node**:

    ```bash
    influxd-ctl add-data <the-hostname>:8088
    ```

    It should output:

    ```bash
    Added data node y at the-hostname:8088
    ```

2. Verify that all nodes are now members of the cluster as expected:

    ```bash
    influxd-ctl show
    ```

Once added to the cluster, InfluxDB synchronizes data stored on the upgraded OSS
node with other data nodes in the cluster.
It may take a few minutes before the existing data is available.

-->
## Rebalance the cluster

1. Use the [`ALTER RETENTION POLICY`](/enterprise_influxdb/v1.9/query_language/manage-database/#modify-retention-policies-with-alter-retention-policy)
   statement to increase the [replication factor](/enterprise_influxdb/v1.9/concepts/glossary/#replication-factor)
   on all existing retention polices to the number of data nodes in your cluster.
2. [Rebalance your cluster manually](/enterprise_influxdb/v1.9/guides/rebalance/)
   to meet the desired replication factor for existing shards.
3. If you were using [Chronograf](/{{< latest "chronograf" >}}/),
   add your Enterprise instance as a new data source.
