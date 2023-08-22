---
title: Rebuild the TSI index
description: >
  Flush and rebuild the TSI index to purge corrupt index files or remove indexed
  data that is out of date. 
menu:
  influxdb_2_7:
    parent: Manage TSI indexes
weight: 201
related:
  - /influxdb/v2.7/reference/internals/storage-engine/
  - /influxdb/v2.7/reference/internals/file-system-layout/
  - /influxdb/v2.7/reference/cli/influxd/inspect/build-tsi/
---

In some cases, it may be necessary to flush and rebuild the TSI index.
For example, purging corrupt index files or removing outdated indexed data.

To rebuild your InfluxDB TSI index:

1.  **Stop the InfluxDB (`influxd`) process**.

    {{% warn %}}
Rebuilding the TSI index while the `influxd` is running could prevent some data
from being queryable.
    {{% /warn %}}

2.  Navigate to the `data` directory in your
    [InfluxDB engine path](/influxdb/v2.7/reference/internals/file-system-layout/).
    _The engine path depends on your operating system or
    [custom engine path setting](/influxdb/v2.7/reference/config-options/#engine-path)._

    {{< code-tabs-wrapper >}}
{{% code-tabs %}}
[macOS & Linux](#)
[Windows (PowerShell)](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
cd ~/.influxdbv2/engine/data/
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```powershell
cd -Path 'C:\%USERPROFILE%\.influxdbv2\engine\data\'
```
{{% /code-tab-content %}}
    {{< /code-tabs-wrapper >}}

3.  **Delete all `_series` directories in your InfluxDB `data` directory.**
    By default, `_series` directories are are stored at `/data/<bucket-id>/_series`,
    but check for and remove `_series` directories throughout the
    `data` directory.

    {{< code-tabs-wrapper >}}
{{% code-tabs %}}
[macOS & Linux](#)
[Windows (PowerShell)](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
find . -type d -name _series -exec -delete
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```powershell
get-childitem -Include _series -Recurse -force | Remove-Item -Force -Recurse
```
{{% /code-tab-content %}}
    {{< /code-tabs-wrapper >}}


4.  **Delete all `index` directories.** By default, `index` directories are stored at
    `/data/<bucket-id>/autogen/<shard-id>/index`, but check for and remove
    `index` directories throughout the `data` directory.

    {{< code-tabs-wrapper >}}
{{% code-tabs %}}
[macOS & Linux](#)
[Windows (PowerShell)](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
find . -type d -name index -exec -delete
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```powershell
get-childitem -Include index -Recurse -force | Remove-Item -Force -Recurse
```
{{% /code-tab-content %}}
    {{< /code-tabs-wrapper >}}


5.  Use the [`influxd inspect build-tsi` command](/influxdb/v2.7/reference/cli/influxd/inspect/build-tsi/)
    to rebuild the TSI index.

    ```sh
    influxd inspect build-tsi
    ```