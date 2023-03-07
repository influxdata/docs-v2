---
title: Upgrade from InfluxDB 2.x to InfluxDB 2.6
description: >
  To upgrade from InfluxDB 2.0 beta 16 or earlier to InfluxDB 2.6 (stable),
  manually upgrade all resources and data to the latest version by completing these steps.
menu:
  influxdb_2_6:
    parent: Upgrade InfluxDB
    name: InfluxDB 2.x to 2.6
weight: 10
related:
  - /influxdb/v2.6/reference/cli/influxd/downgrade/
  - /influxdb/v2.6/install/
---

Upgrade to InfluxDB {{< current-version >}} from an earlier version of InfluxDB 2.x.

{{% note %}}
#### InfluxDB 2.0 beta-16 or earlier
If you're upgrading from InfluxDB 2.0 beta-16 or earlier, you must first
[upgrade to InfluxDB 2.0](/influxdb/v2.0/upgrade/v2-beta-to-v2/), 
and then complete the steps below.
{{% /note %}}

{{< tabs-wrapper >}}
{{% tabs %}}
[macOS](#)
[Linux](#)
[Windows](#)
[Docker](#)
{{% /tabs %}}

<!---------------------------- BEGIN MACOS CONTENT ---------------------------->
{{% tab-content %}}
Do one of the following:

- [Use homebrew to upgrade](#use-homebrew-to-upgrade)
- [Manually upgrade](#manually-upgrade)

### Use homebrew to upgrade
```
brew upgrade influxdb
```

### Manually upgrade
To manually upgrade, [download and install the latest version of InfluxDB {{< current-version >}} for macOS](/influxdb/v2.6/install/#manually-download-and-install)
in place of your current 2.x version.
{{% /tab-content %}}
<!----------------------------- END MACOS CONTENT ----------------------------->

<!---------------------------- BEGIN LINUX CONTENT ---------------------------->
{{% tab-content %}}

[Download and install the latest version of InfluxDB {{< current-version >}} for Linux](/influxdb/v2.6/install/?t=Linux#download-and-install-influxdb-v21)
in place of current 2.x version.

{{% /tab-content %}}
<!----------------------------- END LINUX CONTENT ----------------------------->

<!--------------------------- BEGIN WINDOWS CONTENT --------------------------->
{{% tab-content %}}

[Download and install the latest version of InfluxDB {{< current-version >}} for Windows](/influxdb/v2.6/install/?t=Windows)
in place of current 2.x version.

{{% /tab-content %}}
<!---------------------------- END WINDOWS CONTENT ---------------------------->

<!--------------------------- BEGIN DOCKER CONTENT ---------------------------->
{{% tab-content %}}

To upgrade to InfluxDB {{< current-version >}} with Docker, update your Docker
image to use the latest InfluxDB image.

```sh
influxdb:{{< latest-patch >}}
```
{{% /tab-content %}}
<!---------------------------- END DOCKER CONTENT ----------------------------->

{{< /tabs-wrapper >}}
