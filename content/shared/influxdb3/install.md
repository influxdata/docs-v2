<!-- Comment: This file is used to generate the InfluxDB 3 install page. -->
- [System Requirements](#system-requirements)
- [Install](#install)
  - [Quick install for Linux and macOS](#quick-install-for-linux-and-macos)
  - [Download and install the latest build artifacts](#download-and-install-the-latest-build-artifacts)
  - [Pull the Docker image](#pull-the-docker-image)
  - [Linux DEB and RPM install](#linux-deb-and-rpm-install)
    - [TOML configuration (Linux)](#toml-configuration-linux)
    - [Run as a system service (Linux)](#run-as-a-system-service-linux)
  - [Verify the installation](#verify-the-installation)

{{% show-in "enterprise" %}}
> [!Note]
> #### Multi-node cluster setup
> For information about setting up a multi-node {{% product-name %}} cluster,
> see [Create a multi-node cluster](/influxdb3/enterprise/get-started/multi-server/) in the Get started guide.
>
> For steps to upgrade an existing InfluxDB 3 Enterprise cluster,
> see [Upgrade InfluxDB](/influxdb3/enterprise/admin/upgrade/).
{{% /show-in %}}

## System Requirements

#### Operating system

{{< product-name >}} runs on **Linux**, **macOS**, and **Windows**.

#### Object storage

A key feature of InfluxDB 3 is its use of object storage to store time series
data in Apache Parquet format. You can choose to store these files on your local
file system. Performance on your local filesystem will likely be better, but 
object storage has the advantage of not running out of space and being accessible
by other systems over the network. {{< product-name >}} natively supports Amazon S3,
Azure Blob Storage, and Google Cloud Storage.
You can also use many local object storage implementations that provide an
S3-compatible API, such as [Minio](https://min.io/).

## Install

{{% product-name %}} runs on **Linux**, **macOS**, and **Windows**.

Choose one of the following methods to install {{% product-name %}}:

- [Quick install for Linux and macOS](#quick-install-for-linux-and-macos)
- [Download and install the latest build artifacts](#download-and-install-the-latest-build-artifacts)
- [Pull the Docker image](#pull-the-docker-image)
- [Linux DEB and RPM install](#linux-deb-and-rpm-install)

### Quick install for Linux and macOS

To install {{% product-name %}} on **Linux** or **macOS**, download and run the quick
installer script for {{% product-name %}}--for example, using [`curl`](https://curl.se/)
to download the script:

<!--pytest.mark.skip-->
```bash
curl -O https://www.influxdata.com/d/install_influxdb3.sh \
&& sh install_influxdb3.sh {{% show-in "enterprise" %}}enterprise{{% /show-in %}}
```

> [!Note]
> The quick installer script is updated with each {{% product-name %}} release,
> so it always installs the latest version.

> [!Important]
> #### Production deployment
>
> For production deployments, use [Linux DEB or RPM](#linux-deb-and-rpm-install)
> for built-in systemd sandboxing, or [Docker](#pull-the-docker-image) with your own
> container security configuration.
>
> For detailed security options, see [Manage security](/influxdb3/version/admin/security/).
### Download and install the latest build artifacts

You can download and install [{{% product-name %}} build artifacts](/influxdb3/version/install/#download-influxdb-3-{{< product-key >}}-binaries) directly:
{{< expand-wrapper >}}
{{% expand "Linux binaries" %}}

- [Linux | AMD64 (x86_64) | GNU](https://dl.influxdata.com/influxdb/releases/influxdb3-{{< product-key >}}-{{< latest-patch >}}_linux_amd64.tar.gz)
  •
  [sha256](https://dl.influxdata.com/influxdb/releases/influxdb3-{{< product-key >}}-{{< latest-patch >}}_linux_amd64.tar.gz.sha256)
- [Linux | ARM64 (AArch64) | GNU](https://dl.influxdata.com/influxdb/releases/influxdb3-{{< product-key >}}-{{< latest-patch >}}_linux_arm64.tar.gz)
  •
  [sha256](https://dl.influxdata.com/influxdb/releases/influxdb3-{{< product-key >}}-{{< latest-patch >}}_linux_arm64.tar.gz.sha256)

{{% /expand %}}
{{% expand "macOS binaries" %}}

- [macOS | Silicon (ARM64)](https://dl.influxdata.com/influxdb/releases/influxdb3-{{< product-key >}}-{{< latest-patch >}}_darwin_arm64.tar.gz)
  •
  [sha256](https://dl.influxdata.com/influxdb/releases/influxdb3-{{< product-key >}}-{{< latest-patch >}}_darwin_arm64.tar.gz.sha256)

> [!Note]
> macOS Intel builds are coming soon.

{{% /expand %}}
{{% expand "Windows binaries" %}}

- [Windows (AMD64, x86_64) binary](https://dl.influxdata.com/influxdb/releases/influxdb3-{{< product-key >}}-{{< latest-patch >}}-windows_amd64.zip)
 •
[sha256](https://dl.influxdata.com/influxdb/releases/influxdb3-{{< product-key >}}-{{< latest-patch >}}-windows_amd64.zip.sha256)

{{% /expand %}}
{{< /expand-wrapper >}}

### Pull the Docker image

Run the following command to pull the [`influxdb:3-{{< product-key >}}` image](https://hub.docker.com/_/influxdb/tags?tag=3-{{< product-key >}}&name=3-{{< product-key >}}), available for x86_64 (AMD64) and ARM64 architectures:

<!--pytest.mark.skip-->
```bash
docker pull influxdb:3-{{< product-key >}}
```

Docker automatically pulls the appropriate image for your system architecture.

{{< expand-wrapper >}}
{{% expand "Pull for a specific system architecture" %}}
To specify the system architecture, use platform-specific tags--for example:

```bash
# For x86_64/AMD64
docker pull \
--platform linux/amd64 \
influxdb:3-{{< product-key >}}
```

```bash
# For ARM64
docker pull \
--platform linux/arm64 \
influxdb:3-{{< product-key >}}
```
{{% /expand %}}
{{< /expand-wrapper >}}


### Linux DEB and RPM install

When installed via DEB or RPM on a `systemd`-enabled system, {{< product-name >}} runs in a sandboxed environment.
The included `systemd` unit file configures the environment to provide security isolation for typical deployments.
For more information, see [Manage security](/influxdb3/version/admin/security/).

> [!Note]
> DEB and RPM installation is **recommended for non-Docker production deployments** due to built-in systemd sandboxing.
{{< expand-wrapper >}}
{{% expand "DEB-based systems" %}}

Use `apt-get` to install {{< product-name >}} from the InfluxData repository:

```bash
curl --silent --location -O https://repos.influxdata.com/influxdata-archive.key
gpg --show-keys --with-fingerprint --with-colons ./influxdata-archive.key 2>&1 \
| grep -q '^fpr:\+24C975CBA61A024EE1B631787C3D57159FC2F927:$' \
&& cat influxdata-archive.key \
| gpg --dearmor \
| sudo tee /usr/share/keyrings/influxdata-archive.gpg > /dev/null \
&& echo 'deb [signed-by=/usr/share/keyrings/influxdata-archive.gpg] https://repos.influxdata.com/debian stable main' \
| sudo tee /etc/apt/sources.list.d/influxdata.list
sudo apt-get update && sudo apt-get install influxdb3-{{< product-key >}}
```
{{% /expand %}}
{{% expand "RPM-based systems" %}}

Use `yum` to install {{< product-name >}} from the InfluxData repository:

```bash
curl --silent --location -O https://repos.influxdata.com/influxdata-archive.key
gpg --show-keys --with-fingerprint --with-colons ./influxdata-archive.key 2>&1 \
| grep -q '^fpr:\+24C975CBA61A024EE1B631787C3D57159FC2F927:$' \
&& sudo cp ./influxdata-archive.key /usr/share/influxdata-archive-keyring/keyrings/influxdata-archive.asc \
&& cat <<EOF | sudo tee /etc/yum.repos.d/influxdata.repo
[influxdata]
name = InfluxData Repository - Stable
baseurl = https://repos.influxdata.com/stable/\$basearch/main
enabled = 1
gpgcheck = 1
gpgkey = file:///usr/share/influxdata-archive-keyring/keyrings/influxdata-archive.asc
yum install influxdb3-{{< product-key >}}
EOF
```

{{% /expand %}}
{{< /expand-wrapper >}}

#### TOML configuration (Linux)

After you install the DEB or RPM package, the {{% product-name %}} TOML
configuration file is located at `/etc/influxdb3/influxdb3-{{< product-key >}}.conf`
and contains the following settings:

- [object-store](/influxdb3/version/reference/config-options/#object-store): `file`
- [data-dir](/influxdb3/version/reference/config-options/#data-dir): `/var/lib/influxdb3/data`
- [plugin-dir](/influxdb3/version/reference/config-options/#plugin-dir): `/var/lib/influxdb3/plugins`
- [node-id](/influxdb3/version/reference/config-options/#node-id): `primary-node`
{{% show-in "enterprise" %}}
- [cluster-id](/influxdb3/version/reference/config-options/#cluster-id): `primary-cluster`
- [mode](/influxdb3/version/reference/config-options/#mode): `all`

> [!Important]
> #### License required
>
> {{% product-name %}} requires an active license to start.
> See how to [Activate a license](/influxdb3/enterprise/admin/license/#activate-a-license).
{{% /show-in %}}

#### Run as a system service (Linux)

{{% product-name %}} DEB and RPM installs include service files for running as
a managed system service on Linux:

- **systemd**: For modern Linux distributions
- **SysV init**: For legacy system compatibility

##### Run using systemd

On `systemd` systems, the `influxdb3-{{< product-key >}}` unit file is
`enabled` on install, but the unit is not started in order to allow
configuration.

To start the database, enter the following commands:

```bash
# Start the service
systemctl start influxdb3-{{< product-key >}}

# View status
systemctl status influxdb3-{{< product-key >}}

# View logs
journalctl --unit influxdb3-{{< product-key >}}
```

##### Run using SysV

On SysV init systems, `influxdb3-{{< product-key >}}` is disabled on install
and can be enabled by adjusting `/etc/default/influxdb3-{{< product-key >}}` to
contain `ENABLED=yes`.

To start the database, enter the following commands:

```bash
# Start the database
/etc/init.d/influxdb3-{{< product-key >}} start

# View status
/etc/init.d/influxdb3-{{< product-key >}} status

# View logs
tail -f /var/lib/influxdb3/influxdb3-{{< product-key >}}.log
```


### Verify the installation

After installing {{% product-name %}}, enter the following command to verify
that it installed successfully:

```bash
influxdb3 --version
```

If your system doesn't locate `influxdb3` with the quick install method, then `source` the configuration file (for example, .bashrc, .zshrc) for your shell--for example:

<!--pytest.mark.skip-->
```zsh
source ~/.zshrc
```

{{% show-in "enterprise" %}}
> [!Note]
> For information about setting up a multi-node {{% product-name %}} cluster,
> see [Create a multi-node cluster](/influxdb3/enterprise/get-started/multi-server/) in the Get started guide.
{{% /show-in %}}

{{% show-in "enterprise" %}}
{{< page-nav next="/influxdb3/enterprise/get-started/" nextText="Get started with InfluxDB 3 Enterprise" >}}
{{% /show-in %}}
{{% show-in "core" %}}
{{< page-nav next="/influxdb3/core/get-started/" nextText="Get started with InfluxDB 3 Core" >}}
{{% /show-in %}}
