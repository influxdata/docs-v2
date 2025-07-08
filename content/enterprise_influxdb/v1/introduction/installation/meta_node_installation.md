---
title: Install InfluxDB Enterprise meta nodes
aliases:
    - /enterprise_influxdb/v1/installation/meta_node_installation/
    - /enterprise_influxdb/v1/introduction/install-and-deploy/installation/meta_node_installation/
menu:
  enterprise_influxdb_v1:
    name: Install meta nodes
    weight: 10
    parent: Install
---

InfluxDB Enterprise offers highly scalable clusters on your infrastructure
and a management UI ([via Chronograf](/chronograf/v1)) for working with clusters.
The installation process is designed for users looking to
deploy InfluxDB Enterprise in a production environment.
The following steps will get you up and running with the first essential component of
your InfluxDB Enterprise cluster--meta nodes.

- [Meta node setup and requirements](#meta-node-setup-and-requirements)
  - [At least three meta nodes](#at-least-three-meta-nodes)
  - [License key or file](#license-key-or-file)
  - [Networking](#networking)
  - [User account](#user-account)
- [Set up meta nodes](#set-up-meta-nodes):
    1.  [Add DNS entries](#add-dns-entries)
    2.  [Set up, configure, and start the meta services](#set-up-configure-and-start-the-meta-services)
        1. [Download and install the meta service](#download-and-install-the-meta-service)
        2. [Edit the configuration file](#edit-the-configuration-file)
        3. [Start the meta service](#start-the-meta-service)
    3.  [Join meta nodes to the cluster](#join-meta-nodes-to-the-cluster)

## Meta node setup and requirements

- [At least three meta nodes](#at-least-three-meta-nodes)
- [License key or file](#license-key-or-file)
- [Networking](#networking)
- [User account](#user-account)

### At least three meta nodes

The installation process sets up three [meta nodes](/enterprise_influxdb/v1/concepts/glossary/#meta-node),
with each meta node running on its own server.

InfluxDB Enterprise clusters require an *odd number* of *at least three* meta nodes
for high availability and redundancy.
We typically recommend three meta nodes.
If your servers have chronic communication or reliability issues, you can try adding nodes.

> [!Note]
>
> #### Run meta nodes on separate servers
>
> Avoid deploying multiple meta nodes on the same server.
> Doing so increases the risk of failure if the server becomes unresponsive.  
> InfluxData recommends deploying meta nodes on separate, low-resource servers
> to minimize risks and optimize performance.
>
> #### Using a single meta node for non-production environments
>
> Installing and running InfluxDB Enterprise on a single server, or node, is an
alternative to using [InfluxDB OSS 1.x](/influxdb/v1).
> To start a {{% product-name %}} cluster with a single meta node,
> pass the `-single-server flag` when starting the node.
> 
> _A cluster with only one meta node is **not** recommended for
> production environments._
> 
> For more information, see how to [install InfluxDB Enterprise on a single server](/enterprise_influxdb/v1/introduction/installation/single-server/).

_See [Clustering in InfluxDB Enterprise](/enterprise_influxdb/v1/concepts/clustering/)
for more information about cluster architecture._

### License key or file

InfluxDB Enterprise requires a license key *or* a license file to run.
Your license key is available at [InfluxPortal](https://portal.influxdata.com/licenses).
Contact support at the email we provided at signup to receive a license file.
License files are required only if the nodes in your cluster cannot reach
`portal.influxdata.com` on port `80` or `443`.

### Networking

Meta nodes communicate over ports `8088`, `8089`, and `8091`.

For licensing purposes, meta nodes must also be able to reach `portal.influxdata.com`
on port `80` or `443`.
If the meta nodes cannot reach `portal.influxdata.com` on port `80` or `443`,
you'll need to set the `license-path` setting instead of the `license-key`
setting in the meta node configuration file.

### User account

The installation package creates an `influxdb` user on the operating system.
The `influxdb` user runs the InfluxDB meta service.
The `influxdb` user also owns certain files needed to start the service.
In some cases, local policies may prevent the local user account from being created and the service fails to start.
Contact your systems administrator for assistance with this requirement.

## Set up meta nodes

1.  [Add DNS entries](#add-dns-entries)
2.  [Set up, configure, and start the meta services](#set-up-configure-and-start-the-meta-services)
    1. [Download and install the meta service](#download-and-install-the-meta-service)
    2. [Edit the configuration file](#edit-the-configuration-file)
    3. [Start the meta service](#start-the-meta-service)
3.  [Join meta nodes to the cluster](#join-meta-nodes-to-the-cluster)

### Add DNS entries

Ensure that your servers' hostnames and IP addresses are added to your network's DNS environment.
The addition of DNS entries and IP assignment is usually site and policy specific.
Contact your DNS administrator for assistance as necessary.
Ultimately, use entries similar to the following (hostnames and domain IP addresses are representative).

| Record Type | Hostname                          |            IP |
|:------------|:---------------------------------:|--------------:|
| `A`         | `enterprise-meta-01.mydomain.com` | `<Meta_1_IP>` |
| `A`         | `enterprise-meta-02.mydomain.com` | `<Meta_2_IP>` |
| `A`         | `enterprise-meta-03.mydomain.com` | `<Meta_3_IP>` |


#### Verify DNS resolution

Before proceeding with the installation, verify on each server that the other
servers are resolvable. Here is an example set of shell commands using `ping`:

```
ping -qc 1 enterprise-meta-01
ping -qc 1 enterprise-meta-02
ping -qc 1 enterprise-meta-03
```

We highly recommend that each server be able to resolve the IP from the hostname alone as shown here.
Resolve any connectivity issues before proceeding with the installation.
A healthy cluster requires that every meta node can communicate with every other
meta node.

### Set up, configure, and start the meta services

Perform the following steps _on each meta server_:

1. [Download and install the meta service](#download-and-install-the-meta-service)
2. [Edit the configuration file](#edit-the-configuration-file)
3. [Start the meta service](#start-the-meta-service)

#### Download and install the meta service

InfluxDB Enterprise 1.11+ provides a standard build and a
[Federal Information Processing Standards (FIPS)-compliant build](/enterprise_influxdb/v1/introduction/installation/fips-compliant/).
Instructions for both are provided below.

##### Ubuntu & Debian (64-bit)

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Standard](#)
[FIPS-compliant](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
wget https://dl.influxdata.com/enterprise/releases/influxdb-meta_{{< latest-patch >}}-c{{< latest-patch >}}-1_amd64.deb
sudo dpkg -i influxdb-meta_{{< latest-patch >}}-c{{< latest-patch >}}-1_amd64.deb
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sh
wget https://dl.influxdata.com/enterprise/releases/fips/influxdb-meta_{{< latest-patch >}}-c{{< latest-patch >}}-1_amd64.deb
sudo dpkg -i influxdb-meta_{{< latest-patch >}}-c{{< latest-patch >}}-1_amd64.deb
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

##### RedHat & CentOS (64-bit)

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Standard](#)
[FIPS-compliant](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
wget https://dl.influxdata.com/enterprise/releases/influxdb-meta-{{< latest-patch >}}_c{{< latest-patch >}}-1.x86_64.rpm
sudo yum localinstall influxdb-meta-{{< latest-patch >}}_c{{< latest-patch >}}-1.x86_64.rpm
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sh
wget https://dl.influxdata.com/enterprise/releases/fips/influxdb-meta-{{< latest-patch >}}_c{{< latest-patch >}}-1.x86_64.rpm
sudo yum localinstall influxdb-meta-{{< latest-patch >}}_c{{< latest-patch >}}-1.x86_64.rpm
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

{{< expand-wrapper >}}
{{% expand "<span class='req'>Recommended:</span> Verify the authenticity of the release download" %}}

For added security, follow these steps to verify the signature of your InfluxDB download with `gpg`.

1.  Download and import InfluxData's public key:

    ```sh
    curl -s https://repos.influxdata.com/influxdata-archive.key | gpg --import
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
wget https://dl.influxdata.com/enterprise/releases/influxdb-meta-{{< latest-patch >}}_c{{< latest-patch >}}-1.x86_64.rpm.asc
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sh
wget https://dl.influxdata.com/enterprise/releases/fips/influxdb-meta-{{< latest-patch >}}_c{{< latest-patch >}}-1.x86_64.rpm.asc
```
{{% /code-tab-content %}}
  {{< /code-tabs-wrapper >}}

3.  Verify the signature with `gpg --verify`:

    ```sh
    gpg --verify influxdb-meta-{{< latest-patch >}}_c{{< latest-patch >}}-1.x86_64.rpm.asc influxdb-meta-{{< latest-patch >}}_c{{< latest-patch >}}-1.x86_64.rpm
    ```

    The output from this command should include the following:

    ```sh
    gpg: Good signature from "InfluxData Package Signing Key <support@influxdata.com>" [unknown]
    ```
{{% /expand %}}
{{< /expand-wrapper >}}

#### Edit the configuration file

In `/etc/influxdb/influxdb-meta.conf`:

- Uncomment `hostname` and set to the full hostname of the meta node.
- Uncomment `internal-shared-secret` in the `[meta]` section and set it to a
  long pass phrase to be used in JWT authentication for intra-node communication.
  This value must the same for all of your meta nodes and match the
  `[meta] meta-internal-shared-secret` settings in the configuration files of
  your data nodes.
- Set `license-key` in the `[enterprise]` section to the license key you received
  on InfluxPortal **OR** `license-path` in the `[enterprise]` section to the
  local path to the JSON license file you received from InfluxData.

  {{% warn %}}
The `license-key` and `license-path` settings are mutually exclusive and one
must remain set to the empty string.
  {{% /warn %}}

**If using a FIPS-compliant InfluxDB Enterprise build, also do the following**:

- Set `[enterprise].license-path` to the local path to the JSON license file
  you received from InfluxData.
- Set `[meta].password-hash` to `pbkdf2-sha256` or `pbkdf2-sha512`.

```toml
# Hostname advertised by this host for remote addresses.  This must be resolvable by all
# other nodes in the cluster
hostname="<enterprise-meta-0x>"

[enterprise]
  # license-key and license-path are mutually exclusive, use only one and leave the other blank
  license-key = "<your_license_key>" # Mutually exclusive with license-path

  # license-key and license-path are mutually exclusive, use only one and leave the other blank
  license-path = "/path/to/readable/JSON.license.file" # Mutually exclusive with license-key

[meta]
  # FIPS-compliant builds do not support bcrypt for password hashing
  password-hash = "pbkdf2-sha512"
```

#### Start the meta service

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[sysvinit](#)
[systemd](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
service influxdb-meta start
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sh
sudo systemctl start influxdb-meta
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

{{< expand-wrapper >}}
{{% expand "<span style='opacity:.5;font-style:italic'>Optional:</span> Verify the `influxdb-meta` service is running" %}}

Run the following command to search for a running `influxdb-meta` process:

```
ps aux | grep -v grep | grep influxdb-meta
```

The output is similar to the following:

```
influxdb  3207  0.8  4.4 483000 22168 ?        Ssl  17:05   0:08 /usr/bin/influxd-meta -config /etc/influxdb/influxdb-meta.conf
```

{{% /expand %}}
{{< /expand-wrapper >}}

### Join meta nodes to the cluster

From one and only one meta node, join all meta nodes including itself.
For example, from `enterprise-meta-01`, run:

```
influxd-ctl add-meta enterprise-meta-01:8091
influxd-ctl add-meta enterprise-meta-02:8091
influxd-ctl add-meta enterprise-meta-03:8091
```

{{% note %}}
Make sure that you specify the fully qualified host name of
the meta node during the join process.
Please do not specify `localhost` as this can cause cluster connection issues.
{{% /note %}}

{{< expand-wrapper >}}
{{% expand "<span style='opacity:.5;font-style:italic'>Optional:</span> Verify the meta nodes are added to the cluster" %}}

To verify the meta nodes are added to the cluster, run the following command on
any meta node:

```
influxd-ctl show
```

The expected output is:

```
Data Nodes
==========
ID      TCP Address      Version

Meta Nodes
==========
TCP Address               Version
enterprise-meta-01:8091   {{< latest-patch >}}-c{{< latest-patch >}}
enterprise-meta-02:8091   {{< latest-patch >}}-c{{< latest-patch >}}
enterprise-meta-03:8091   {{< latest-patch >}}-c{{< latest-patch >}}
```

_Your cluster must have at least three meta nodes.
If you do not see your meta nodes in the output, retry adding them to
the cluster._

{{% /expand %}}
{{< /expand-wrapper >}}

## Docker installation

For Docker-based installations, see [Install and run InfluxDB v1 Enterprise with Docker](/enterprise_influxdb/v1/introduction/installation/docker/) for complete instructions on setting up meta nodes using Docker images.

After your meta nodes are part of your cluster,
[install data nodes](/enterprise_influxdb/v1/introduction/installation/data_node_installation/).

{{< page-nav next="/enterprise_influxdb/v1/introduction/installation/data_node_installation/" nextText="Install data nodes" >}}
