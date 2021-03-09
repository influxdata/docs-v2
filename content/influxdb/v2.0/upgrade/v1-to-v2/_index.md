---
title: Upgrade InfluxDB
description: >
  Upgrade from InfluxDB 1.x to InfluxDB 2.0.
menu:
  influxdb_2_0:
    parent: Upgrade InfluxDB
    name: InfluxDB 1.x to 2.0
weight: 10
---

## Migrate data
{{% warn %}}
Before doing any data migration,
stop your running InfluxDB 1.x instance and make a backup copy of all 1.x data:
```sh
cp -R .influxdb/ .influxdb_bak/
```
{{% /warn %}}

1. Stop running InfluxDB 1.x.
1. Do one of the following:
   - **Migrate all data**:
     To migrate all data, use the `influxd upgrade` tool.
     <!-- Is there a way to use `influxd upgrade` for time series data only, and ignore other resources/configs? -->
   - **Migrate specified data**:
     To selectively migrate data, use the v1 [`influx_inspect export`](/influxdb/v1.8/tools/influx_inspect/#export) command to export data as line protocol.
     Then write the exported line protocol to InfluxDB 2.0.



<!-- context for choosing upgrade path -->
If you will be continuing to use 1.x client libraries to write data to InfluxDB 2.0,
**and** do not have auth enabled,
see the [manual upgrade process](/influxdb/v2.0/upgrade/v1-to-v2/manual-upgrade).


To migrate all data, use automatic.


{{< children >}}
