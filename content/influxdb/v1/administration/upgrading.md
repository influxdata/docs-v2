---
title: Upgrade to InfluxDB 1.11.x
description: Upgrade to the latest version of InfluxDB.
menu:
  influxdb_v1:
    name: Upgrade InfluxDB
    weight: 25
    parent: Administration
---


We recommend enabling Time Series Index (TSI) (step 3 of Upgrade to InfluxDB 1.11.x) because it removes RAM-based limits on series cardinality and provides better performance for high-cardinality datasets compared to the default in-memory index. [Switch between TSI and inmem index types](#switch-index-types) as needed. To learn more about TSI, see:

- [Time Series Index (TSI) overview](/influxdb/v1/concepts/time-series-index/)
- [Time Series Index (TSI) details](/influxdb/v1/concepts/tsi-details/)

> **_Note:_** The default configuration continues to use TSM-based shards with in-memory indexes (as in earlier versions).

{{% note %}}
### Upgrade to InfluxDB Enterprise

To upgrade from InfluxDB OSS to InfluxDB Enterprise, [contact InfluxData Sales](https://www.influxdata.com/contact-sales/)
and see [Migrate to InfluxDB Enterprise](/enterprise_influxdb/v1/guides/migration/).
{{% /note %}}

## Upgrade to InfluxDB 1.11.x

1. [Download](https://www.influxdata.com/downloads/) InfluxDB version 1.11.x and [install the upgrade](/influxdb/v1/introduction/installation/).

2. Migrate configuration file customizations from your existing configuration file to the InfluxDB 1.11.x [configuration file](/influxdb/v1/administration/config/). Add or modify your environment variables as needed.

3. To enable TSI in InfluxDB 1.11.x, complete the following steps:

    1. If using the InfluxDB configuration file, find the `[data]` section, uncomment `index-version = "inmem"` and change the value to `tsi1`.

    2. If using environment variables, set `INFLUXDB_DATA_INDEX_VERSION` to `tsi1`.

    3. Delete shard `index` directories in your [InfluxDB `data/` directory](/influxdb/v1/concepts/file-system-layout).
       For example, in a Linux environment:

        ```
        /var/lib/influxdb/data/<db-name>/<rp-name>/<shard_ID>/index
        ```

    4. Build TSI by running the [influx_inspect buildtsi](/influxdb/v1/tools/influx_inspect/#buildtsi) command.
        {{% note %}}
Run the `buildtsi` command using the user account that you are going to run the database as, or ensure that the permissions match afterward.
        {{% /note %}}

4. Restart the `influxdb` service.

## Switch index types

Switch index types at any time by doing one of the following:

- To switch from `inmem` to `tsi1` (for example, when experiencing high memory usage or out-of-memory errors with high-cardinality data), complete steps 3 and 4 in [Upgrade to InfluxDB 1.11.x](#upgrade-to-influxdb-111x).
- To switch from `tsi1` to `inmem` (for example, for small datasets where memory is not a constraint), change `tsi1` to `inmem` by completing steps 3a-3c and 4 in [Upgrade to InfluxDB 1.11.x](#upgrade-to-influxdb-111x).

## Downgrade InfluxDB

To downgrade to an earlier version, complete the procedures above in [Upgrade to InfluxDB 1.11.x](#upgrade-to-influxdb-111x), replacing the version numbers with the version that you want to downgrade to.
After downloading the release, migrating your configuration settings, and enabling TSI or TSM, make sure to [rebuild your index](/influxdb/v1/administration/rebuild-tsi-index/).

>**Note:** Some versions of InfluxDB may have breaking changes that impact your ability to upgrade and downgrade. For example, you cannot downgrade from InfluxDB 1.3 or later to an earlier version. Please review the applicable version of release notes to check for compatibility issues between releases.

## Upgrade InfluxDB Enterprise clusters

See [Upgrading InfluxDB Enterprise clusters](/enterprise_influxdb/v1/administration/upgrading/).
