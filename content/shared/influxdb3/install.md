<!-- Comment: This file is used to generate the InfluxDB 3 install page. -->
- [System Requirements](#system-requirements)
- [Quick install](#quick-install)
- [Download {{% product-name %}} binaries](#download-influxdb-3-{{< product-key >}}-binaries)
- [Docker image](#docker-image)

{{% show-in "enterprise" %}}
> [!Note]
> For information about setting up a multi-node {{% product-name %}} cluster,
> see [Create a multi-node cluster](/influxdb3/enterprise/install/multi-server/).
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

## Install {{% product-name %}}

{{% product-name %}} runs on **Linux**, **macOS**, and **Windows**.

Choose one of the following methods to install {{% product-name %}}:

- [Quick install for Linux and macOS](#quick-install-for-linux-and-macos)
- [Download and install the latest build artifacts](#download-and-install-the-latest-build-artifacts)
- [Pull the Docker image](#pull-the-docker-image)

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

### Download and install the latest build artifacts

You can also download and install [{{% product-name %}} build artifacts](/influxdb3/enterprise/install/#download-influxdb-3-enterprise-binaries) directly:

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


### Verify the installation

After installing {{% product-name %}}, enter the following command to verify
that it installed successfully:

```bash
influxdb3 --version
```

If your system doesn't locate `influxdb3`, then `source` the configuration file (for example, .bashrc, .zshrc) for your shell--for example:

<!--pytest.mark.skip-->
```zsh
source ~/.zshrc
```

{{% show-in "enterprise" %}}
> [!Note]
> For information about setting up a multi-node {{% product-name %}} cluster,
> see [Create a multi-node cluster](/influxdb3/enterprise/install/multi-server/).
{{% /show-in %}}

{{% show-in "enterprise" %}}
{{< page-nav next="/influxdb3/enterprise/get-started/" nextText="Get started with InfluxDB 3 Enterprise" >}}
{{% /show-in %}}
{{% show-in "core" %}}
{{< page-nav next="/influxdb3/core/get-started/" nextText="Get started with InfluxDB 3 Core" >}}
{{% /show-in %}}