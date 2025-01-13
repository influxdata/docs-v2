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
- [Download InfluxDB 3 Core binaries](#download-influxdb-3-enterprise-binaries)
- [Docker image](#docker-image)

## System Requirements

#### Operating system

InfluxDB 3 Core runs on **Linux**, **macOS**, and **Windows**.

#### Object storage

A key feature of InfluxDB 3 is its use of object storage to store time series
data in Apache Parquet format. You can choose to store these files on your local
file system, however, we recommend using an object store for the best overall
performance. {{< product-name >}} natively supports Amazon S3,
Azure Blob Storage, and Google Cloud Storage.
You can also use many local object storage implementations that provide an
S3-compatible API, such as [Minio](https://min.io/).

## Quick install

1.  Use the following command to download and install the appropriate
    {{< product-name >}} package on your local machine:

    ```bash
    curl -O https://www.influxdata.com/d/install_influxdb3.sh && sh install_influxdb3.sh
    ```

2.  Ensure installation completed successfully:

    ```bash
    influxdb3 --version
    ```

> [!Note]
> 
> #### influxdb3 not found
> 
> If it your system can't locate your `influxdb3` binary, `source` your
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

## Download InfluxDB 3 Core binaries

{{< tabs-wrapper >}}
{{% tabs %}}
[Linux](#)
[macOS](#)
[Windows](#)
{{% /tabs %}}
{{% tab-content %}}

<!-------------------------------- BEGIN LINUX -------------------------------->

- **InfluxDB 3 Core • Linux (x86) • GNU**  
  <https://download.influxdata.com/influxdb/snapshots/influxdb3-core_x86_64-unknown-linux-gnu.tar.gz>

- **InfluxDB 3 Core • Linux (x86) • MUSL**  
  <https://download.influxdata.com/influxdb/snapshots/influxdb3-core_x86_64-unknown-linux-musl.tar.gz>

- **InfluxDB 3 Core • Linux (ARM) • GNU**  
  <https://download.influxdata.com/influxdb/snapshots/influxdb3-core_aarch64-unknown-linux-gnu.tar.gz>

- **InfluxDB 3 Core • Linux (ARM) • MUSL**  
  <https://download.influxdata.com/influxdb/snapshots/influxdb3-core_aarch64-unknown-linux-musl.tar.gz>

<!--------------------------------- END LINUX --------------------------------->

{{% /tab-content %}}
{{% tab-content %}}

<!-------------------------------- BEGIN MACOS -------------------------------->

<a class="btn download" href="https://download.influxdata.com/influxdb/snapshots/influxdb3-core_aarch64-apple-darwin.tar.gz" download>InfluxDB 3 Core • macOS (Silicon)</a>

> [!Note]
> macOS Intel builds are coming soon.

<!--------------------------------- END MACOS --------------------------------->

{{% /tab-content %}}
{{% tab-content %}}

<!------------------------------- BEGIN WINDOWS ------------------------------->

<a class="btn download" href="https://download.influxdata.com/influxdb/snapshots/influxdb3-core_aarch64-apple-darwin.tar.gz" download>InfluxDB 3 Core • Windows (x86)</a>

<!-------------------------------- END WINDOWS -------------------------------->

{{% /tab-content %}}
{{< /tabs-wrapper >}}

## Docker image

Use the {{< product-name >}} Docker image to deploy {{< product-name >}} in a
Docker container.

```
docker pull quay.io/influxdb/influxdb3-core:latest
```

{{< page-nav next="/influxdb3/core/get-started/" nextText="Get started with InfluxDB 3 Core" >}}
