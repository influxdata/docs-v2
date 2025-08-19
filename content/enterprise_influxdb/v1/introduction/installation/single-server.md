---
title: Install InfluxDB Enterprise on a single server
description: >
  Learn how to install and run InfluxDB Enterprise on a single server.
menu:
  enterprise_influxdb_v1:
    name: Install on a single server
    weight: 30
    parent: Install
---

Installing and running InfluxDB Enterprise on a single server, or node, is an
alternative to using [InfluxDB OSS 1.x](/influxdb/v1).
InfluxDB Enterprise provides advanced functionality such as
[LDAP authentication](/enterprise_influxdb/v1/administration/configure/security/ldap/),
[fine-grained authorization](/enterprise_influxdb/v1/administration/manage/users-and-permissions/fine-grained-authorization/),
[incremental backup](/enterprise_influxdb/v1/administration/backup-and-restore/#perform-an-incremental-backup)
and grants you access to official Influx Help Desk Support.

- [Requirements](#requirements)
- [Set up, configure, and start the meta service](#set-up-configure-and-start-the-meta-service)
- [Set up, configure, and start the data services](#set-up-configure-and-start-the-data-services)
- [Install Chronograf](#install-chronograf)
- [Next steps](#next-steps)

{{% warn %}}
#### Not recommended for production

We do not recommend single-node InfluxDB Enterprise "clusters" in production
use cases with high availability requirements.
Single-node InfluxDB Enterprise installations provide no redundancy and are
limited in scalability.
{{% /warn %}}

## Requirements

#### License key or file

InfluxDB Enterprise requires a license key **or** a license file to run.
Your license key is available at [InfluxPortal](https://portal.influxdata.com/licenses).
Contact support at the email we provided at signup to receive a license file.
License files are required only if the nodes in your cluster cannot reach
`portal.influxdata.com` on port `80` or `443`.

#### Networking

Data nodes communicate over ports `8088`, `8089`, and `8091`.

For licensing purposes, data nodes must also be able to reach `portal.influxdata.com`
on port `80` or `443`.
If the data nodes cannot reach `portal.influxdata.com` on port `80` or `443`,
you'll need to set the `license-path` setting instead of the `license-key`
setting in the data node configuration file.

#### User account

The installation package creates an `influxdb` user that is used to run the InfluxDB data service.
The `influxdb` user also owns certain files that are needed for the service to start successfully.
In some cases, local policies may prevent the local user account from being created and the service fails to start.
Contact your systems administrator for assistance with this requirement.

#### Static hostname

If running InfluxDB Enterprise on a cloud provider like Amazon Web Services (AWS)
or Google Cloud Platform (GCP), ensure the hostname for your server is static.
If the server is every restarted, the hostname must remain the same to ensure
network connectivity between your InfluxDB Enterprise meta and data processes.

#### Persistent disk storage

If running InfluxDB Enterprise on a cloud provider like AWS or GCP, ensure the
your server is configured to use a persistent disk store that will persist 
through server restarts.

## Set up, configure, and start the meta service

The InfluxDB Enterprise meta process oversees and manages the InfluxDB Enterprise
data process. In multi-node clusters, meta nodes (typically 3 nodes) manage data syncing and high
availability of data nodes. In a single-server (single-node) installation, a meta process 
and the accompanying [`influxd-ctl` utility](/enterprise_influxdb/v1/tools/influxd-ctl/)
still manage the "cluster", but with a single meta node and the data
processes running on the same server.

1. **Download and install the InfluxDB Enterprise meta service**:

    {{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Ubuntu & Debian](#)
[RedHat & CentOS](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
wget https://dl.influxdata.com/enterprise/releases/influxdb-meta_{{< latest-patch >}}-c{{< latest-patch >}}-1_amd64.deb
sudo dpkg -i influxdb-meta_{{< latest-patch >}}-c{{< latest-patch >}}-1_amd64.deb
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sh
wget https://dl.influxdata.com/enterprise/releases/influxdb-meta-{{< latest-patch >}}_c{{< latest-patch >}}-1.x86_64.rpm
sudo yum localinstall influxdb-meta-{{< latest-patch >}}_c{{< latest-patch >}}-1.x86_64.rpm
```
{{% /code-tab-content %}}
    {{< /code-tabs-wrapper >}}

    {{< expand-wrapper >}}
{{% expand "<span class='req'>Recommended</span> – Verify the authenticity of the meta service download" %}}

For added security, follow these steps to verify the signature of your
InfluxDB Enterprise meta service download with `gpg`.

1. Download and import InfluxData's public key:

    ```sh
    curl -s https://repos.influxdata.com/influxdata-archive.key | gpg --import
    ```

2. Download the signature file for the release by adding `.asc` to the download URL.
   For example:

    ```sh
    wget https://dl.influxdata.com/enterprise/releases/influxdb-meta-{{< latest-patch >}}_c{{< latest-patch >}}-1.x86_64.rpm.asc
    ```

3. Verify the signature with `gpg --verify`:

    ```sh
    gpg --verify influxdb-meta-{{< latest-patch >}}_c{{< latest-patch >}}-1.x86_64.rpm.asc influxdb-meta-{{< latest-patch >}}_c{{< latest-patch >}}-1.x86_64.rpm
    ```

    The output from this command should include the following:

    ```
    gpg: Good signature from "InfluxData Package Signing Key <support@influxdata.com>" [unknown]
    ```
{{% /expand %}}
    {{< /expand-wrapper >}}

2. **Edit the InfluxDB Enterprise meta configuration file**

    In `/etc/influxdb/influxdb-meta.conf`:

    - Uncomment `hostname` and set to the full hostname of the meta node.
    - Set `[enterprise].license-key` to the license key you received on InfluxPortal
      **OR** `[enterprise].license-path` to the local path to the JSON license
      file you received from InfluxData.
    - Uncomment `[meta].internal-shared-secret` set it to a long passphrase to be
      used in JWT authentication for intra-node communication.
      This value must the same for all of your meta nodes and match the
      `[meta].meta-internal-shared-secret` settings in the configuration files
      of your data nodes.

    {{% warn %}}
The `license-key` and `license-path` settings are mutually exclusive and one must remain set to the empty string.
    {{% /warn %}}

    ##### /etc/influxdb/influxdb-meta.conf

    ```toml
    # Hostname advertised by this host for remote addresses.  This must be resolvable by all
    # other nodes in the cluster
    hostname="<your-host-name>"

    [enterprise]
      # license-key and license-path are mutually exclusive, use only one and leave the other blank
      license-key = "<your_license_key>" # Mutually exclusive with license-path

      # license-key and license-path are mutually exclusive, use only one and leave the other blank
      license-path = "/path/to/readable/JSON.license.file" # Mutually exclusive with license-key
    
    [meta]
      # The shared secret used by the internal API for JWT authentication.
      # This setting must have the same value as the data nodes' 
      # meta.meta-internal-shared-secret configuration.
      internal-shared-secret = "<internal-shared-secret>"
    ```

3. **Start the InfluxDB Enterprise meta service in single-server mode**:

    Run the `start` command appropriate to your operating system's service manager.
    In the command, include the `-single-server` flag, which ensures that the single meta node
    is the leader and has all the metadata for the cluster.

    {{< tabs-wrapper >}}
{{% tabs "small" %}}
[sysvinit](#)
[systemd](#)
{{% /tabs %}}
{{% tab-content %}}
<!-----------------------------BEGIN SYSVINIT---------------------------------->
Edit the `influxdb-meta` init script to include the `-single-server` flag:

1. Open the init script for editing, for example:

   ```bash
   sudo nano /etc/init.d/influxdb-meta
   ```

2. Find the section of the script that starts the `influxdb-meta` service and add the `-single-server` flag--for example:

   ```sh
   case "$1" in
       start)
           echo "Starting InfluxDB Meta..."
           /usr/bin/influxdb-meta -single-server &
           ;;
       stop)
           echo "Stopping InfluxDB Meta..."
           killall influxdb-meta
           ;;
       restart)
           $0 stop
           $0 start
           ;;
       *)
           echo "Usage: $0 {start|stop|restart}"
           exit 1
   esac

   exit 0
   ```

3. Restart the service to apply the changes:

   ```bash
   sudo service influxdb-meta restart
   ```

For more information about sysvinit and initscripts, see the [sysvinit](https://wiki.gentoo.org/wiki/Sysvinit) Gentoo Linux documentation.
<!-------------------------------END SYSVINIT---------------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!------------------------------BEGIN SYSTEMD---------------------------------->
Edit the `influxdb-meta` service unit file or a drop-in configuration file to
include the `-single-server` flag--for example: 

1. Use `systemctl edit` with the `--drop-in` option to create the drop-in configuration file for the service:

   ```bash      
   sudo systemctl edit --drop-in influxdb-meta
   ```

2. Add the following to the drop-in configuration file to include the -single-server flag in the startup command:

   ```systemd
   [Service]
   ExecStart=
   ExecStart=/usr/bin/influxdb-meta -single-server
   ```

3. Start the service using `systemctl`:
   
   ```bash
   sudo systemctl start influxdb-meta
   ```

4. Reload the Systemd Daemon: Reload the systemd daemon to apply the changes:
   
   ```bash
   sudo systemctl daemon-reload
   ```

5. Start the service using systemctl:
   
   ```bash
   sudo systemctl start influxdb-meta
   ```

For more information about systemd unit files, see the Arch Linux documentation
for [Writing unit files](https://wiki.archlinux.org/title/Systemd#Writing_unit_files)

<!--------------------------------END SYSTEMD---------------------------------->
{{% /tab-content %}}
    {{< /tabs-wrapper >}}

1. **Ensure the `influxdb-meta` process is running**:

    Use `ps aux` to list running processes and `grep` to filter the list of
    running process to those that contain `influxdb-meta` and filter out the
    `grep` process searching for `influxdb-meta`.

    ```sh
    ps aux | grep -v grep | grep influxdb-meta
    ```

    You should see output similar to:

    ```
    influxdb  3207  0.8  4.4 483000 22168 ?        Ssl  17:05   0:08 /usr/bin/influxd-meta -config /etc/influxdb/influxdb-meta.conf
    ```

2. **Use `influxd-ctl` to add the meta process to the InfluxDB Enterprise "cluster"**:

    ```sh
    influxd-ctl add-meta <your-host-name>:8091
    ```

    The output should be similar to:

    ```
    Added meta node x at <your-host-name>:8091
    ```

3. **Use `influxd-ctl` to verify the meta node was added to the InfluxDB Enterprise "cluster"**:

    ```sh
    influxd-ctl show
    ```

    The output should be similar to:

    ```
    Data Nodes
    ==========
    ID      TCP Address      Version

    Meta Nodes
    ==========
    ID      TCP Address             Version         Labels
    1       <your-host-name>:8091   {{< latest-patch >}}-c{{< latest-patch >}}    {}
    ```

    If you do not see your meta node in the output, repeat **steps 5–6** to 
    retry adding it to the cluster.

## Set up, configure, and start the data services

The InfluxDB Enterprise data service runs the InfluxDB storage and query engines.

1. **Download and install the InfluxDB Enterprise data service**:

    {{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Ubuntu & Debian](#)
[RedHat & CentOS](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
wget https://dl.influxdata.com/enterprise/releases/influxdb-data_{{< latest-patch >}}-c{{< latest-patch >}}-1_amd64.deb
sudo dpkg -i influxdb-data_{{< latest-patch >}}-c{{< latest-patch >}}-1_amd64.deb
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sh
wget https://dl.influxdata.com/enterprise/releases/influxdb-data-{{< latest-patch >}}_c{{< latest-patch >}}-1.x86_64.rpm
sudo yum localinstall influxdb-data-{{< latest-patch >}}_c{{< latest-patch >}}-1.x86_64.rpm
```
{{% /code-tab-content %}}
    {{< /code-tabs-wrapper >}}

    {{< expand-wrapper >}}
{{% expand "<span class='req'>Recommended</span> – Verify the authenticity of the data service download" %}}

For added security, follow these steps to verify the signature of your
InfluxDB Enterprise data service download with `gpg`.

1. Download and import InfluxData's public key:

    ```sh
    curl -s https://repos.influxdata.com/influxdata-archive.key | gpg --import
    ```

2. Download the signature file for the release by adding `.asc` to the download URL.
   For example:

    ```sh
    wget https://dl.influxdata.com/enterprise/releases/influxdb-data-{{< latest-patch >}}_c{{< latest-patch >}}-1.x86_64.rpm.asc
    ```

3. Verify the signature with `gpg --verify`:

    ```sh
    gpg --verify influxdb-data-{{< latest-patch >}}-c{{< latest-patch >}}.x86_64.rpm.asc influxdb-data-{{< latest-patch >}}_c{{< latest-patch >}}-1.x86_64.rpm
    ```

    The output from this command should include the following:

    ```
    gpg: Good signature from "InfluxData Package Signing Key <support@influxdata.com>" [unknown]
    ```
{{% /expand %}}
    {{< /expand-wrapper >}}

2. **Edit the data node configuration files**:

    In `/etc/influxdb/influxdb.conf`:

    - Uncomment `hostname` at the top of the file and set it to the full hostname of the data node.
    - Set `enterprise.license-key` to the license key you received on InfluxPortal
      **OR** `enterprise.license-path` to the local path to the JSON license
      file you received from InfluxData.
    - Uncomment `[meta].meta-auth-enabled` and set it to `true`.
    - Uncomment `[meta].meta-internal-shared-secret` and set it to a long pass phrase.
      The internal shared secret is used in JWT authentication for intra-node communication.
      This value must match the `[meta].internal-shared-secret` value in the your
      meta node configuration file (`/etc/influxdb/influxdb-meta.conf`).
    - Uncomment `[http].auth-enabled` set it to `true`.

    {{% warn %}}
The `license-key` and `license-path` settings are mutually exclusive and one must remain set to the empty string.
    {{% /warn %}}

    ```toml
    # Change this option to true to disable reporting.
    # reporting-disabled = false
    # bind-address = ":8088"
    hostname="<your-host-name>"

    [enterprise]
      # license-key and license-path are mutually exclusive, use only one and leave the other blank
      license-key = "<your_license_key>" # Mutually exclusive with license-path

      # The path to a valid license file.  license-key and license-path are mutually exclusive,
      # use only one and leave the other blank.
      license-path = "/path/to/readable/JSON.license.file" # Mutually exclusive with license-key

    [meta]
      # Where the cluster metadata is stored
      dir = "/var/lib/influxdb/meta" # data nodes do require a local meta directory
      
      # This setting must have the same value as the meta nodes' meta.auth-enabled configuration.
      meta-auth-enabled = true

      # This setting must have the same value as the meta nodes' meta.internal-shared-secret configuration
      # and must be non-empty if set.
      meta-internal-shared-secret = "<internal-shared-secret>"

    # ...

    [http]
      # Determines whether HTTP endpoint is enabled.
      enabled = true

      # The bind address used by the HTTP service.
      bind-address = ":8086"

      # Determines whether HTTP authentication is enabled.
      auth-enabled = true # Recommended, but not required
    ```

3. **Start the InfluxDB Enterprise data service**:

    Run the command appropriate to your operating system's service manager.

    {{< tabs-wrapper >}}
{{% tabs "small" %}}
[sysvinit](#)
[systemd](#)
{{% /tabs %}}
{{% tab-content %}}
```sh
service influxdb start
```
{{% /tab-content %}}
{{% tab-content %}}
```sh
sudo systemctl start influxdb
```
{{% /tab-content %}}
    {{< /tabs-wrapper >}}

4. **Ensure the `influxdb` process is running**:

    Use `ps aux` to list running processes and `grep` to filter the list of
    running process to those that contain `influxdb` and filter out the
    `grep` process searching for `influxdb`.

    ```sh
    ps aux | grep -v grep | grep influxdb
    ```

    You should see output similar to:

    ```
    influxdb  3207  0.8  4.4 483000 22168 ?        Ssl  17:05   0:08 /usr/bin/influxd -config /etc/influxdb/influxdb.conf
    ```

    If you do not see the expected output, the process is either not launching or is exiting prematurely.
    Check the [logs](/enterprise_influxdb/v1/administration/monitor/logs/)
    for error messages and verify the previous setup steps are complete.

5. **Use `influxd-ctl` to add the data process to the InfluxDB Enterprise "cluster"**:

    ```sh
    influxd-ctl add-data <your-host-name>:8088
    ```

    The output should be similar to:

    ```
    Added meta node y at <your-host-name>:8088
    ```

6. **Use `influxd-ctl` to verify the data node was added to the InfluxDB Enterprise "cluster"**:

    ```sh
    influxd-ctl show
    ```

    The output should be similar to:

    ```
    Data Nodes
    ==========
    ID      TCP Address             Version         Labels
    2       <your-host-name>:8088   {{< latest-patch >}}-c{{< latest-patch >}}    {}

    Meta Nodes
    ==========
    ID      TCP Address             Version         Labels
    1       <your-host-name>:8091   {{< latest-patch >}}-c{{< latest-patch >}}    {}
    ```

    If you do not see your data node in the output, repeat **steps 5–6** to 
    retry adding it to the cluster.

7. **Create an admin user**:

    In **Step 2**, you modified the InfluxDB Enterprise configuration file to
    enable authentication.
    To access the cluster, create at least one admin user:

    1.  Use the [`influx` CLI](/enterprise_influxdb/v1/tools/influx-cli/) to
        start an interactive shell.

        ```sh
        influx
        ```

    2. Use the `CREATE USER` statement to create a user with all privileges.

        ```sql
        CREATE USER admin WITH PASSWORD '<password>' WITH ALL PRIVILEGES
        ```

## Install Chronograf

Chronograf is InfluxData’s open source web application that visualizes your 
time series data, manage InfluxDB Enterprise users, and easily create alerting
and automation rules.

For Chronograf installation instructions, see
[Install Chronograf](/chronograf/v1/introduction/installation/).

## Next steps
- For information about adding users, see [Manage users and permissions](/enterprise_influxdb/v1/administration/manage/users-and-permissions/)
- [Enable TLS](/enterprise_influxdb/v1/guides/enable-tls/)
- [Write data with the InfluxDB API](/enterprise_influxdb/v1/guides/write_data/)
- [Query data with the InfluxDB API](/enterprise_influxdb/v1/guides/query_data/)
