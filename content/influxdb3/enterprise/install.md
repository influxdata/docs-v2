---
title: Install InfluxDB 3 Enterprise
description: Download and install InfluxDB 3 Enterprise.
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
- [Download InfluxDB 3 Enterprise binaries](#download-influxdb-3-enterprise-binaries)
- [Docker image](#docker-image)

## System Requirements

#### Operating system

InfluxDB 3 Enterprise runs on **Linux**, **macOS**, and **Windows**.

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
> If using Windows, [download the {{% product-name %}} Windows binary](?t=Windows#download-influxdb-3-enterprise-binaries).

1.  Use the following command to download and install the appropriate
    {{< product-name >}} package on your local machine:

    ```bash
    curl -O https://www.influxdata.com/d/install_influxdb3.sh && sh install_influxdb3.sh enterprise
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
```bash
source ~/.zshrc
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

## Download InfluxDB 3 Enterprise binaries

{{< tabs-wrapper >}}
{{% tabs %}}
[Linux](#)
[macOS](#)
[Windows](#)
{{% /tabs %}}
{{% tab-content %}}

<!-------------------------------- BEGIN LINUX -------------------------------->

- [InfluxDB 3 Enterprise • Linux (x86) • GNU](https://download.influxdata.com/influxdb/snapshots/influxdb3-enterprise_x86_64-unknown-linux-gnu.tar.gz)
  •
  [sha256](https://dl.influxdata.com/influxdb/snapshots/influxdb3-enterprise_x86_64-unknown-linux-gnu.tar.gz.sha256)

- [InfluxDB 3 Enterprise • Linux (ARM) • GNU](https://download.influxdata.com/influxdb/snapshots/influxdb3-enterprise_aarch64-unknown-linux-gnu.tar.gz)
  •
  [sha256](https://dl.influxdata.com/influxdb/snapshots/influxdb3-enterprise_aarch64-unknown-linux-gnu.tar.gz.sha256)

<!--------------------------------- END LINUX --------------------------------->

{{% /tab-content %}}
{{% tab-content %}}

<!-------------------------------- BEGIN MACOS -------------------------------->

- [InfluxDB 3 Enterprise • macOS (Silicon)](https://download.influxdata.com/influxdb/snapshots/influxdb3-enterprise_aarch64-apple-darwin.tar.gz)
  •
  [sha256](https://dl.influxdata.com/influxdb/snapshots/influxdb3-enterprise_aarch64-apple-darwin.tar.gz.sha256)

> [!Note]
> macOS Intel builds are coming soon.

<!--------------------------------- END MACOS --------------------------------->

{{% /tab-content %}}
{{% tab-content %}}

<!------------------------------- BEGIN WINDOWS ------------------------------->

- [InfluxDB 3 Enterprise • Windows (x86)](https://dl.influxdata.com/influxdb/snapshots/influxdb3-enterprise_x86_64-pc-windows-gnu.tar.gz)
  •
  [sha256](https://dl.influxdata.com/influxdb/snapshots/influxdb3-enterprise_x86_64-pc-windows-gnu.tar.gz.sha256)

<!-------------------------------- END WINDOWS -------------------------------->

{{% /tab-content %}}
{{< /tabs-wrapper >}}

## Docker image

Use the `influxdb3-enterprise` Docker image to deploy {{< product-name >}} in a
Docker container.

```bash
docker pull quay.io/influxdb/influxdb3-enterprise:latest
```

{{< page-nav next="/influxdb3/enterprise/get-started/" nextText="Get started with InfluxDB 3 Enterprise" >}}
