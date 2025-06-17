---
title: Install {{< product-name >}}
description: Download and install {{< product-name >}}.
menu:
  influxdb3_enterprise:
    name: Install InfluxDB 3 Enterprise
weight: 2
influxdb3/enterprise/tags: [install]
alt_links:
  v1: /influxdb/v1/introduction/install/
---

- [System Requirements](#system-requirements)
- [Quick install](#quick-install)
- [Download {{% product-name %}} binaries](#download-influxdb-3-{{< product-key >}}-binaries)
- [Docker image](#docker-image)
- [Create a multi-node cluster](#create-a-multi-node-cluster)

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

## Quick install

Use the InfluxDB 3 quick install script to install {{< product-name >}} on
**Linux** and **macOS**.

> [!Important]
> If using Windows, [download the {{% product-name %}} Windows binary](?t=Windows#download-influxdb-3-{{< product-key >}}-binaries).

1.  Use the following command to download and install the appropriate
    {{< product-name >}} package on your local machine:
    <!--pytest.mark.skip-->
    ```bash
    curl -O https://www.influxdata.com/d/install_influxdb3.sh \
    && sh install_influxdb3.sh enterprise
    ```

2.  Verify that installation completed successfully:

    ```bash
    influxdb3 --version
    ```

> [!Note]
> 
> #### influxdb3 not found
> 
> If your system can't locate your `influxdb3` binary, `source` your
> current shell configuration file (`.bashrc`, `.zshrc`, etc.). 
>
> {{< code-tabs-wrapper >}}
{{% code-tabs %}}
[.bashrc](#)
[.zshrc](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```bash
source ~/.bashrc
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!--pytest.mark.skip-->
```bash
source ~/.zshrc
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

## Download {{% product-name %}} binaries

{{< tabs-wrapper >}}
{{% tabs %}}
[Linux](#)
[macOS](#)
[Windows](#)
{{% /tabs %}}
{{% tab-content %}}

<!-------------------------------- BEGIN LINUX -------------------------------->

- [{{< product-name >}} • Linux (AMD64, x86_64) • GNU](https://dl.influxdata.com/influxdb/releases/influxdb3-{{< product-key >}}-{{< latest-patch >}}_linux_amd64.tar.gz)
  •
  [sha256](https://dl.influxdata.com/influxdb/releases/influxdb3-{{< product-key >}}-{{< latest-patch >}}_linux_amd64.tar.gz.sha256)

- [{{< product-name >}} • Linux (ARM64, AArch64) • GNU](https://dl.influxdata.com/influxdb/releases/influxdb3-{{< product-key >}}-{{< latest-patch >}}_linux_arm64.tar.gz)
  •
  [sha256](https://dl.influxdata.com/influxdb/releases/influxdb3-{{< product-key >}}-{{< latest-patch >}}_linux_arm64.tar.gz.sha256)

<!--------------------------------- END LINUX --------------------------------->

{{% /tab-content %}}
{{% tab-content %}}

<!-------------------------------- BEGIN MACOS -------------------------------->

- [{{< product-name >}} • macOS (Silicon, ARM64)](https://dl.influxdata.com/influxdb/releases/influxdb3-{{< product-key >}}-{{< latest-patch >}}_darwin_arm64.tar.gz)
  •
  [sha256](https://dl.influxdata.com/influxdb/releases/influxdb3-{{< product-key >}}-{{< latest-patch >}}_darwin_arm64.tar.gz.sha256)

> [!Note]
> macOS Intel builds are coming soon.

<!--------------------------------- END MACOS --------------------------------->

{{% /tab-content %}}
{{% tab-content %}}

<!------------------------------- BEGIN WINDOWS ------------------------------->

- [{{< product-name >}} • Windows (AMD64, x86_64)](https://dl.influxdata.com/influxdb/releases/influxdb3-{{< product-key >}}-{{< latest-patch >}}-windows_amd64.zip)
  •
  [sha256](https://dl.influxdata.com/influxdb/releases/influxdb3-{{< product-key >}}-{{< latest-patch >}}-windows_amd64.zip.sha256)

<!-------------------------------- END WINDOWS -------------------------------->

{{% /tab-content %}}
{{< /tabs-wrapper >}}

## Docker image

Use the `influxdb:3-{{< product-key >}}` Docker image to deploy {{< product-name >}} in a
Docker container.
The image is available for x86_64 (AMD64) and ARM64 architectures.

### Use Docker CLI

<!--pytest.mark.skip-->
```bash
docker pull influxdb:3-{{< product-key >}}
```

Docker automatically pulls the appropriate image for your system architecture.

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

> [!Note]
> The {{% product-name %}} Docker image exposes port `8181`, the `influxdb3` server default for HTTP connections.
> To map the exposed port to a different port when running a container, see the Docker guide for [Publishing and exposing ports](https://docs.docker.com/get-started/docker-concepts/running-containers/publishing-ports/).

### Use Docker Compose

1. Open `compose.yaml` for editing and add a `services` entry for {{% product-name %}}--for example:

   ```yaml
   # compose.yaml
   services:
     influxdb3-{{< product-key >}}:
       container_name: influxdb3-{{< product-key >}}
       image: influxdb:3-{{< product-key >}}
       ports:
         - 9999:9999
       command:
         - influxdb3
         - serve
         - --node-id=node0
         - --cluster-id=cluster0
         - --object-store=file
         - --data-dir=/var/lib/influxdb3
   ```

2. Use the Docker Compose CLI to start the server.

   Optional: to make sure you have the latest version of the image before you
   start the server, run `docker compose pull`.

   <!--pytest.mark.skip-->
   ```bash
   docker compose pull && docker compose run influxdb3-{{< product-key >}}
   ```

> [!Note]
> #### Stopping an InfluxDB 3 container
>
> To stop a running InfluxDB 3 container, find and terminate the process--for example:
>
> <!--pytest.mark.skip-->
> ```bash
> ps -ef | grep influxdb3
> kill -9 <PROCESS_ID>
> ```
>
> Currently, a bug prevents using {{< keybind all="Ctrl+c" >}} in the terminal to stop an InfluxDB 3 container.

{{< children hlevel="h2" >}}

{{< page-nav next="/influxdb3/enterprise/get-started/" nextText="Get started with InfluxDB 3 Enterprise" >}}
