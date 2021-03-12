---
title: Upgrading to InfluxDB 1.7.x

menu:
    influxdb_1_7:
        name: Upgrading
        weight: 25
        parent: Administration
---

We recommend enabling Time Series Index (TSI) (step 3 of Upgrade to InfluxDB 1.7.x). To learn more about TSI, see:

- [Time Series Index (TSI) overview](/influxdb/v1.7/concepts/time-series-index/)
- [Time Series Index (TSI) details](/influxdb/v1.7/concepts/tsi-details/)

> **_Note:_** The default InfluxDB configuration continues to use in-memory indexes (`inmem`) (as in earlier versions).

{{% note %}}
### Upgrade to InfluxDB Enterprise
To upgrade from InfluxDB OSS to InfluxDB Enterprise, [contact InfluxData Sales](https://www.influxdata.com/contact-sales/)
and see [Migrate to InfluxDB Enterprise](/enterprise_influxdb/v1.7/guides/migration/).
{{% /note %}}

## Upgrade to InfluxDB 1.7.x

1. [Download](https://portal.influxdata.com/downloads) InfluxDB 1.7.x and [install the upgrade](/influxdb/v1.7/introduction/installation).

2. Migrate configuration file customizations from your existing configuration file to the InfluxDB 1.7.x [configuration file](/influxdb/v1.7/administration/config/). Add or modify your environment variables as needed.

3. To enable TSI in InfluxDB 1.7.x, complete the following steps:

    a. If using the InfluxDB configuration file, find the `[data]` section, uncomment `index-version = "inmem"` and change the value to `tsi1`.

    b. If using environment variables, set `INFLUXDB_DATA_INDEX_VERSION` to `tsi1`.

    c. Delete shard `index` directories (by default, located at `/<shard_ID>/index`).

    d. Build TSI by running the [influx_inspect buildtsi](/influxdb/v1.7/tools/influx_inspect/#buildtsi) command.

    > **Note** Run the buildtsi command using the user account that you are going to run the database as, or ensure that the permissions match afterward.

4. Restart the `influxdb` service.

## Switch index types

Switch index types at any time by doing one of the following:

- To switch from to `inmem` to `tsi1`, complete steps 3 and 4 above in [Upgrade to InfluxDB 1.7.x](#upgrade-to-influxdb-1-7-x).
- To switch from to `tsi1` to `inmem`, change `tsi1` to `inmem` by completing steps 3a-3c and 4 above in [Upgrade to InfluxDB 1.7.x](#upgrade-to-influxdb-1-7-x).

## Downgrade InfluxDB

To downgrade to an earlier version, complete the procedures above in [Upgrade to InfluxDB 1.7.x](#upgrade-to-influxdb-1-7-x), replacing the version numbers with the version that you want to downgrade to.
After downloading the release, migrating your configuration settings, and enabling TSI or TSM, make sure to [rebuild your index](/influxdb/v1.7/administration/rebuild-tsi-index/).

>**Note:** Some versions of InfluxDB may have breaking changes that impact your ability to upgrade and downgrade. For example, you cannot downgrade from InfluxDB 1.3 or later to an earlier version. Please review the applicable version of release notes to check for compatibility issues between releases.

## Upgrade InfluxDB Enterprise clusters

See [Upgrading InfluxDB Enterprise clusters](/enterprise_influxdb/v1.7/administration/upgrading/).
