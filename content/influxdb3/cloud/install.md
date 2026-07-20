---
title: Install the influxdb3 CLI for InfluxDB 3 Cloud
description: >
  Install the InfluxDB 3 Enterprise CLI to write data to and query InfluxDB 3
  Cloud.
menu:
  influxdb3_cloud:
    name: Install the influxdb3 CLI
weight: 2
influxdb3/cloud/tags: [install]
related:
  - /influxdb3/cloud/get-started/setup/
canonical: self
---

InfluxDB 3 Cloud is fully managed, so you don't install or run an InfluxDB server.
To write data to and query your Cloud instance, install the `influxdb3` CLI.

The CLI is included with InfluxDB 3 Enterprise.
Install the Enterprise build using one of the following methods.

- [Quick install for Linux and macOS](#quick-install-for-linux-and-macos)
- [Download the CLI binary](#download-the-cli-binary)
- [Verify the installation](#verify-the-installation)

## Quick install for Linux and macOS

To install the CLI on **Linux** or **macOS**, download and run the InfluxDB 3
Enterprise quick installer:

<!--pytest.mark.skip-->
```bash
curl -O https://www.influxdata.com/d/install_influxdb3.sh \
&& sh install_influxdb3.sh enterprise
```

> [!Note]
> The installer also sets up a local InfluxDB 3 server.
> For InfluxDB 3 Cloud, you only need the CLI, so skip the prompts to start a server.

## Download the CLI binary

Download an InfluxDB 3 Enterprise archive for your operating system.
The archive includes the `influxdb3` CLI.

{{< expand-wrapper >}}
{{% expand "Linux binaries" %}}

- [Linux | AMD64 (x86_64) | GNU](https://dl.influxdata.com/influxdb/releases/influxdb3-enterprise-{{< latest-patch product="influxdb3_enterprise" >}}_linux_amd64.tar.gz)
  •
  [sha256](https://dl.influxdata.com/influxdb/releases/influxdb3-enterprise-{{< latest-patch product="influxdb3_enterprise" >}}_linux_amd64.tar.gz.sha256)
- [Linux | ARM64 (AArch64) | GNU](https://dl.influxdata.com/influxdb/releases/influxdb3-enterprise-{{< latest-patch product="influxdb3_enterprise" >}}_linux_arm64.tar.gz)
  •
  [sha256](https://dl.influxdata.com/influxdb/releases/influxdb3-enterprise-{{< latest-patch product="influxdb3_enterprise" >}}_linux_arm64.tar.gz.sha256)

{{% /expand %}}
{{% expand "macOS binaries" %}}

- [macOS | Silicon (ARM64)](https://dl.influxdata.com/influxdb/releases/influxdb3-enterprise-{{< latest-patch product="influxdb3_enterprise" >}}_darwin_arm64.tar.gz)
  •
  [sha256](https://dl.influxdata.com/influxdb/releases/influxdb3-enterprise-{{< latest-patch product="influxdb3_enterprise" >}}_darwin_arm64.tar.gz.sha256)

> [!Note]
> macOS Intel builds are coming soon.

{{% /expand %}}
{{% expand "Windows binaries" %}}

- [Windows (AMD64, x86_64) binary](https://dl.influxdata.com/influxdb/releases/influxdb3-enterprise-{{< latest-patch product="influxdb3_enterprise" >}}-windows_amd64.zip)
  •
  [sha256](https://dl.influxdata.com/influxdb/releases/influxdb3-enterprise-{{< latest-patch product="influxdb3_enterprise" >}}-windows_amd64.zip.sha256)

{{% /expand %}}
{{< /expand-wrapper >}}

Extract the archive and add the directory that contains the `influxdb3` binary
to your `PATH`.

## Verify the installation

Run the following command to verify that the CLI is installed:

```bash
influxdb3 --version
```

If your shell can't locate `influxdb3` after a [quick install](#quick-install-for-linux-and-macos),
reload your shell configuration--for example:

<!--pytest.mark.skip-->
```zsh
source ~/.zshrc
```

To connect the CLI to your Cloud instance, continue to
[set up InfluxDB 3 Cloud](/influxdb3/cloud/get-started/setup/).
