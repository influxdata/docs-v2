---
title: Install InfluxDB Enterprise data nodes
aliases:
    - /enterprise_influxdb/v1/installation/data_node_installation/
    - /enterprise_influxdb/v1/introduction/install-and-deploy/installation/data_node_installation/
menu:
  enterprise_influxdb_v1:
    name: Install data nodes
    weight: 20
    parent: Install
---

InfluxDB Enterprise offers highly scalable clusters on your infrastructure
and a management UI for working with clusters.
The next steps will get you up and running with the second essential component of
your InfluxDB Enterprise cluster: the data nodes.

{{% warn %}}
If you have not set up your meta nodes, please visit
[Installing meta nodes](/enterprise_influxdb/v1/introduction/installation/meta_node_installation/).
Bad things can happen if you complete the following steps without meta nodes.
{{% /warn %}}

- [Requirements](#requirements)
  - [Two or more data nodes](#two-or-more-data-nodes)
  - [License key or file](#license-key-or-file)
  - [Networking](#networking)
  - [Load balancer](#load-balancer)
  - [User account](#user-account)
- [Set up data nodes](#set-up-data-nodes)
  1.  [Add DNS entries for each of your servers](#add-dns-entries-for-each-of-your-servers)
  2.  [Set up, configure, and start the data node services](#set-up-configure-and-start-the-data-node-services)
      1. [Download and install the data service](#download-and-install-the-data-service)
      2. [Edit the data node configuration files](#edit-the-data-node-configuration-files)
      3. [Start the data service](#start-the-data-service)
  3.  [Join the data nodes to the cluster](#join-the-data-nodes-to-the-cluster)
- [Next steps](#next-steps)

## Requirements

- [Two or more data nodes](#two-or-more-data-nodes)
- [License key or file](#license-key-or-file)
- [Networking](#networking)
- [Load balancer](#load-balancer)
- [User account](#user-account)

### Two or more data nodes

The installation process sets up two [data nodes](/enterprise_influxdb/v1/concepts/glossary#data-node)
and each data node runs on its own server.
You **must** have a minimum of two data nodes in a cluster.
InfluxDB Enterprise clusters require at least two data nodes for high availability and redundancy.

{{% note %}}
There is no requirement for each data node to run on its own server.
However, best practices are to deploy each data node on a dedicated server.
{{% /note %}}

_See the [Clustering guide](/enterprise_influxdb/v1/concepts/clustering/#optimal-server-counts)
for more on cluster architecture._

### License key or file

InfluxDB Enterprise requires a license key **or** a license file to run.
Your license key is available at [InfluxPortal](https://portal.influxdata.com/licenses).
Contact support at the email we provided at signup to receive a license file.

**License _files_ are required in the following conditions:**

- Nodes in your cluster cannot reach `portal.influxdata.com` on port `80` or `443`
- You're using a [FIPS-compliant InfluxDB Enterprise build](/enterprise_influxdb/v1/introduction/installation/fips-compliant/)

### Networking

Data nodes communicate over ports `8088`, `8089`, and `8091`.

For licensing purposes, data nodes must also be able to reach `portal.influxdata.com`
on port `80` or `443`.
If the data nodes cannot reach `portal.influxdata.com` on port `80` or `443`,
you'll need to set the `license-path` setting instead of the `license-key`
setting in the data node configuration file.

### Load balancer

InfluxDB Enterprise does not function as a load balancer.
You will need to configure your own load balancer to send client traffic to the
data nodes on port `8086` (the default port for the [HTTP API](/enterprise_influxdb/v1/tools/api/)).

#### User account

The installation package creates an `influxdb` user that is used to run the InfluxDB data service.
The `influxdb` user also owns certain files that are needed for the service to start successfully.
In some cases, local policies may prevent the local user account from being created and the service fails to start.
Contact your systems administrator for assistance with this requirement.

## Set up data nodes

1.  [Add DNS entries for each of your servers](#add-dns-entries-for-each-of-your-servers)
2.  [Set up, configure, and start the data node services](#set-up-configure-and-start-the-data-node-services)
    1. [Download and install the data service](#download-and-install-the-data-service)
    2. [Edit the data node configuration files](#edit-the-data-node-configuration-files)
    3. [Start the data service](#start-the-data-service)
3.  [Join the data nodes to the cluster](#join-the-data-nodes-to-the-cluster)

### Add DNS entries for each of your servers

Ensure that your servers' hostnames and IP addresses are added to your network's DNS environment.
The addition of DNS entries and IP assignment is usually site and policy specific.
Contact your DNS administrator for assistance as necessary.
Ultimately, use entries similar to the following:

| Record Type |             Hostname              |            IP |
| :---------- | :-------------------------------: | ------------: |
| A           | `enterprise-data-01.mydomain.com` | `<Data_1_IP>` |
| A           | `enterprise-data-02.mydomain.com` | `<Data_2_IP>` |

Verify on each meta and data server that the other servers are resolvable.
Here is an example set of shell commands using `ping`:

```sh
ping -qc 1 enterprise-meta-01
ping -qc 1 enterprise-meta-02
ping -qc 1 enterprise-meta-03
ping -qc 1 enterprise-data-01
ping -qc 1 enterprise-data-02
```

We highly recommend that each server be able to resolve the IP from the hostname alone as shown here.
Resolve any connectivity issues before proceeding with the installation.
A healthy cluster requires that every meta node and data node in a cluster be able to communicate.

### Set up, configure, and start the data node services

Perform the following steps _on each data node_:

1. [Download and install the data service](#download-and-install-the-data-service)
2. [Edit the data node configuration files](#edit-the-data-node-configuration-files)
3. [Start the data service](#start-the-data-service)

#### Download and install the data service

InfluxDB Enterprise 1.11+ provides a standard build and a
[Federal Information Processing Standards (FIPS)-compliant build](/enterprise_influxdb/v1/introduction/installation/fips-compliant/).
Instructions for both are provided below.

##### Ubuntu and Debian (64-bit)

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Standard](#)
[FIPS-compliant](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
wget https://dl.influxdata.com/enterprise/releases/influxdb-data_{{< latest-patch >}}-c{{< latest-patch >}}-1_amd64.deb
sudo dpkg -i influxdb-data_{{< latest-patch >}}-c{{< latest-patch >}}-1_amd64.deb
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sh
wget https://dl.influxdata.com/enterprise/releases/fips/influxdb-data_{{< latest-patch >}}-c{{< latest-patch >}}-1_amd64.deb
sudo dpkg -i influxdb-data_{{< latest-patch >}}-c{{< latest-patch >}}-1_amd64.deb
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

##### RedHat and CentOS (64-bit)

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Standard](#)
[FIPS-compliant](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
wget https://dl.influxdata.com/enterprise/releases/influxdb-data-{{< latest-patch >}}_c{{< latest-patch >}}-1.x86_64.rpm
sudo yum localinstall influxdb-data-{{< latest-patch >}}_c{{< latest-patch >}}-1.x86_64.rpm
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sh
wget https://dl.influxdata.com/enterprise/releases/fips/influxdb-data-{{< latest-patch >}}_c{{< latest-patch >}}-1.x86_64.rpm
sudo yum localinstall influxdb-data-{{< latest-patch >}}_c{{< latest-patch >}}-1.x86_64.rpm
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

{{< expand-wrapper >}}
{{% expand "<span class='req'>Recommended:</span> Verify the authenticity of the release download" %}}

For added security, follow these steps to verify the signature of your InfluxDB download with `gpg`.

1.  Download and import InfluxData's public key:
   
    ```sh
    curl -s https://repos.influxdata.com/influxdata-archive_compat.key | gpg --import
    ```
2.  Download the signature file for the release by adding `.asc` to the download URL.
    For example:

    {{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Standard](#)
[FIPS-compliant](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
wget https://dl.influxdata.com/enterprise/releases/influxdb-data-{{< latest-patch >}}_c{{< latest-patch >}}-1.x86_64.rpm.asc
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sh
wget https://dl.influxdata.com/enterprise/releases/fips/influxdb-data-{{< latest-patch >}}_c{{< latest-patch >}}-1.x86_64.rpm.asc
```
{{% /code-tab-content %}}
  {{< /code-tabs-wrapper >}}

3.  Verify the signature with `gpg --verify`:
   
    ```sh
    gpg --verify influxdb-data-{{< latest-patch >}}-c{{< latest-patch >}}.x86_64.rpm.asc influxdb-data-{{< latest-patch >}}_c{{< latest-patch >}}-1.x86_64.rpm
    ```
    
    The output from this command should include the following:
   
    ```sh
    gpg: Good signature from "InfluxDB Packaging Service <support@influxdb.com>" [unknown]
    ```
{{% /expand %}}
{{< /expand-wrapper >}}

#### Edit the data node configuration files

In `/etc/influxdb/influxdb.conf`:

- Uncomment `hostname` at the top of the file and set it to the full hostname of the data node.
- Uncomment `meta-auth-enabled` in the `[meta]` section and set it to `true`.
- Uncomment `meta-internal-shared-secret` in the `[meta]` section and set it to a long passphrase.
  The internal shared secret is used in JWT authentication for intra-node communication.
  This value must be same for all of your data nodes and match the
  `[meta].internal-shared-secret` value in the configuration files of your meta nodes.
- Set `license-key` in the `[enterprise]` section to the license key you received
  on InfluxPortal **OR** `license-path` in the `[enterprise]` section to the local
  path to the JSON license file you received from InfluxData.

  {{% warn %}}
  The `license-key` and `license-path` settings are mutually exclusive and one must remain set to the empty string.
  {{% /warn %}}

**If using a FIPS-compliant InfluxDB Enterprise build, also do the following**:

- Set `[enterprise].license-path` to the local path to the JSON license file
  you received from InfluxData.
- Set `[meta].password-hash` to `pbkdf2-sha256` or `pbkdf2-sha512`.

```toml
# Change this option to true to disable reporting.
# reporting-disabled = false
# bind-address = ":8088"
hostname="<enterprise-data-0x>"

[enterprise]
  # license-key and license-path are mutually exclusive, use only one and leave the other blank
  license-key = "<your_license_key>" # Mutually exclusive with license-path

  # The path to a valid license file.  license-key and license-path are mutually exclusive,
  # use only one and leave the other blank.
  license-path = "/path/to/readable/JSON.license.file" # Mutually exclusive with license-key

[meta]
  # Where the cluster metadata is stored
  dir = "/var/lib/influxdb/meta" # data nodes do require a local meta directory
...
  # This setting must have the same value as the meta nodes' meta.auth-enabled configuration.
  meta-auth-enabled = true

  # FIPS-compliant builds do not support bcrypt for password hashing
  password-hash = "pbkdf2-sha512"

[...]

[http]
  # Determines whether HTTP endpoint is enabled.
  # enabled = true

  # The bind address used by the HTTP service.
  # bind-address = ":8086"

[...]

  # The JWT auth shared secret to validate requests using JSON web tokens.
  shared-secret = "long pass phrase used for signing tokens"
```

#### Start the data service

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[sysvinit](#)
[systemd](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
service influxdb start
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sh
sudo systemctl start influxdb
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

{{< expand-wrapper >}}
{{% expand "<span style='opacity:.5;font-style:italic'>Optional:</span> Verify the `influxdb` service is running" %}}

Run the following command to search for a running `influxdb` process:

```sh
ps aux | grep -v grep | grep influxdb
```

You should see output similar to:

```
influxdb  2706  0.2  7.0 571008 35376 ?        Sl   15:37   0:16 /usr/bin/influxd -config /etc/influxdb/influxdb.conf
```

If you do not see the expected output, the process is either not launching or is exiting prematurely.
Check the [logs](/enterprise_influxdb/v1/administration/monitor/logs/)
for error messages and verify the previous setup steps are complete.

If you see the expected output, repeat for the remaining data nodes.
Once all data nodes have been installed, configured, and launched, move on to
the next section to join the data nodes to the cluster.

{{% /expand %}}
{{< /expand-wrapper >}}

### Join the data nodes to the cluster

{{% warn %}}
You should join your data nodes to the cluster only when you are adding a brand new node,
either during the initial creation of your cluster or when growing the number of data nodes.
If you are replacing an existing data node with `influxd-ctl update-data`, skip the rest of this guide.
{{% /warn %}}

On one and only one of the [meta nodes that you set up](/enterprise_influxdb/v1/introduction/installation/meta_node_installation/),
run the following command for _each_ of your data nodes using the hostname of the
data node and port `8088`:

```sh
influxd-ctl add-data enterprise-data-01:8088
```

Run the `add-data` command once and only once for each data node you are joining
to the cluster.

{{< expand-wrapper >}}
{{% expand "<span style='opacity:.5;font-style:italic'>Optional:</span> Verify the data node was added to the cluster" %}}

To verify the nodes are added to the cluster, run the following command on any
meta node:

```sh
influxd-ctl show
```

The output should be similar to:

```
Data Nodes
==========
ID   TCP Address               Version
4    enterprise-data-01:8088   {{< latest-patch >}}-c{{< latest-patch >}}
5    enterprise-data-02:8088   {{< latest-patch >}}-c{{< latest-patch >}}

Meta Nodes
==========
TCP Address               Version
enterprise-meta-01:8091   {{< latest-patch >}}-c{{< latest-patch >}}
enterprise-meta-02:8091   {{< latest-patch >}}-c{{< latest-patch >}}
enterprise-meta-03:8091   {{< latest-patch >}}-c{{< latest-patch >}}
```

The output should include every data node that was added to the cluster.
The first data node added should have `ID=N`, where `N` is equal to one plus the number of meta nodes.
In a standard three meta node cluster, the first data node should have `ID=4`
Subsequently added data nodes should have monotonically increasing IDs.
If not, there may be artifacts of a previous cluster in the metastore.

If you do not see your data nodes in the output, please retry adding them
to the cluster.

{{% /expand %}}
{{< /expand-wrapper >}}

## Docker installation

For Docker-based installations, see [Install and run InfluxDB v1 Enterprise with Docker](/enterprise_influxdb/v1/introduction/installation/docker/) for complete instructions on setting up data nodes using Docker images.

## Next steps

Once your data nodes are part of your cluster, do the following:

- Set up [authentication](/enterprise_influxdb/v1/administration/configure/security/authentication/).
  Once you cluster is configured for authentication,
  if you want to add more users in addition to admin user,
  see [Manage users and permissions](/enterprise_influxdb/v1/administration/manage/users-and-permissions/).
- [Enable TLS](/enterprise_influxdb/v1/guides/enable-tls/).
- [Set up Chronograf](/enterprise_influxdb/v1/introduction/installation/chrono_install)
  for UI visualization, dashboards, and management.

{{< page-nav prev="/enterprise_influxdb/v1/introduction/installation/meta_node_installation/" prevText="Install meta nodes" next="/enterprise_influxdb/v1/introduction/installation/chrono_install" >}}
