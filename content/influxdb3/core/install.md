---
title: Install InfluxDB 3 Core
description: Download and install InfluxDB 3 Core.
menu:
  influxdb3_core:
    name: Install InfluxDB 3 Core
weight: 2
influxdb3/core/tags: [install]
alt_links:
  v1: /influxdb/v1/introduction/install/
---

- [System Requirements](#system-requirements)
- [Quick install](#quick-install)
- [Download InfluxDB 3 Core binaries](#download-influxdb-3-core-binaries)
- [Docker image](#docker-image)

## System Requirements

#### Operating system

InfluxDB 3 Core runs on **Linux**, **macOS**, and **Windows**.

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
> If using Windows, [download the {{% product-name %}} Windows binary](?t=Windows#download-influxdb-3-core-binaries).

1.  Use the following command to download and install the appropriate
    {{< product-name >}} package on your local machine:
    <!--pytest.mark.skip-->
    ```bash
    curl -O https://www.influxdata.com/d/install_influxdb3.sh && sh install_influxdb3.sh
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

## Download InfluxDB 3 Core binaries

{{< tabs-wrapper >}}
{{% tabs %}}
[Linux](#)
[macOS](#)
[Windows](#)
{{% /tabs %}}
{{% tab-content %}}

<!-------------------------------- BEGIN LINUX -------------------------------->

- [InfluxDB 3 Core • Linux (x86) • GNU](https://download.influxdata.com/influxdb/snapshots/influxdb3-core_x86_64-unknown-linux-gnu.tar.gz)
  •
  [sha256](https://dl.influxdata.com/influxdb/snapshots/influxdb3-core_x86_64-unknown-linux-gnu.tar.gz.sha256)

- [InfluxDB 3 Core • Linux (x86) • MUSL](https://download.influxdata.com/influxdb/snapshots/influxdb3-core_x86_64-unknown-linux-musl.tar.gz)
  •
  [sha256](https://dl.influxdata.com/influxdb/snapshots/influxdb3-core_x86_64-unknown-linux-musl.tar.gz.sha256)

- [InfluxDB 3 Core • Linux (ARM) • GNU](https://download.influxdata.com/influxdb/snapshots/influxdb3-core_aarch64-unknown-linux-gnu.tar.gz)
  •
  [sha256](https://dl.influxdata.com/influxdb/snapshots/influxdb3-core_aarch64-unknown-linux-gnu.tar.gz.sha256)

- [InfluxDB 3 Core • Linux (ARM) • MUSL](https://download.influxdata.com/influxdb/snapshots/influxdb3-core_aarch64-unknown-linux-musl.tar.gz)
  •
  [sha256](https://dl.influxdata.com/influxdb/snapshots/influxdb3-core_aarch64-unknown-linux-musl.tar.gz)

<!--------------------------------- END LINUX --------------------------------->

{{% /tab-content %}}
{{% tab-content %}}

<!-------------------------------- BEGIN MACOS -------------------------------->

- [InfluxDB 3 Core • macOS (Silicon)](https://download.influxdata.com/influxdb/snapshots/influxdb3-core_aarch64-apple-darwin.tar.gz)
  •
  [sha256](https://dl.influxdata.com/influxdb/snapshots/influxdb3-core_aarch64-apple-darwin.tar.gz.sha256)

> [!Note]
> macOS Intel builds are coming soon.

<!--------------------------------- END MACOS --------------------------------->

{{% /tab-content %}}
{{% tab-content %}}

<!------------------------------- BEGIN WINDOWS ------------------------------->

- [InfluxDB 3 Core • Windows (x86)](https://dl.influxdata.com/influxdb/snapshots/influxdb3-core_x86_64-pc-windows-gnu.tar.gz)
  •
  [sha256](https://dl.influxdata.com/influxdb/snapshots/influxdb3-core_x86_64-pc-windows-gnu.tar.gz.sha256)

<!-------------------------------- END WINDOWS -------------------------------->

{{% /tab-content %}}
{{< /tabs-wrapper >}}

## Docker image

Use the `influxdb3-core` Docker image to deploy {{< product-name >}} in a
Docker container.

### Using Docker CLI

<!--pytest.mark.skip-->
```bash
docker pull quay.io/influxdb/influxdb3-core:latest
```

### Using Docker Compose

1. Open `compose.yaml` for editing and add a `services` entry for {{% product-name %}}--for example:

   ```yaml
   # compose.yaml
   services
     influxdb3-core:
       container_name: influxdb3-core
       image: quay.io/influxdb/influxdb3-core:latest
       ports:
         - 9999:9999
       command:
         - serve
         - --node-id=node0
         - --log-filter=debug
         - --object-store=file
         - --data-dir=/var/lib/influxdb3
   ```

2. Use the Docker Compose CLI to start the server.

   Optional: to make sure you have the latest version of the image before you
   start the server, run `docker compose pull`.

   <!--pytest.mark.skip-->
   ```bash
   docker compose pull && docker compose run influxdb3-core
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
> Currently, a bug prevents using `Ctrl-c` in the terminal to stop an InfluxDB 3 container.

{{< page-nav next="/influxdb3/core/get-started/" nextText="Get started with InfluxDB 3 Core" >}}
