---
title: Manage the InfluxDB time series index (TSI)
description: >
  ...
menu:
  influxdb_2_4:
    name: Manage TSI indexes
    parent: Manage internal systems
weight: 101
---

The InfluxDB [Time Series Index (TSI)](/influxdb/v2.4/reference/internals/storage-engine/#time-series-index-tsi)
indexes or caches measurement and tag data to ensure queries are performant.

{{% note %}}
#### Windows influxd location

All Windows (PowerShell) examples below assume the `influxd` executable is located
at `C:\Program Files\InfluxData\influxdb`. If using Windows, navigate to this 
directory to execute `influxd` commands.
{{% /note %}}

## Rebuild the TSI index

1.  **Stop InfluxDB** by stopping the `influxd` process.

    {{% warn %}}
#### Important

Rebuilding the TSI index while the `influxd` is running could prevent some data
from being queryable.
    {{% /warn %}}

2.  Navigate to the `data` directory in your
    [InfluxDB engine path](/influxdb/v2.4/reference/internals/file-system-layout/).
    _The engine path depends on your operating system or
    [custom engine path setting](/influxdb/v2.4/reference/config-options/#engine-path)._

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
    but you should check for and remove `_series` directories throughout the
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
    `/data/<bucket-id>/autogen/<shard-id>/index`, but you should check for and remove
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


5.  Use the [`influxd inspect build-tsi` command](/influxdb/v2.4/reference/cli/influxd/inspect/build-tsi/)
    to rebuild the TSI index.

    {{< code-tabs-wrapper >}}
{{% code-tabs %}}
[macOS & Linux](#)
[Windows (PowerShell)](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
influxd inspect build-tsi
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```powershell
> cd -Path 'C:\Program Files\InfluxData\influxdb'
> ./influxd inspect build-tsi
```
{{% /code-tab-content %}}
    {{< /code-tabs-wrapper >}}   




## Output information about TSI index files

dump-tsi          Dumps low-level details about tsi1 files.

## Export TSI index data

export-index      Exports TSI index data

## Report the cardinality of TSI files

report-tsi        Reports the cardinality of TSI files

