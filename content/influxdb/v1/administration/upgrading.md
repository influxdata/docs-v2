---
title: Upgrade to InfluxDB 1.11.x
description: Upgrade to the latest version of InfluxDB.
menu:
  influxdb_v1:
    name: Upgrade InfluxDB
    weight: 25
    parent: Administration
related:
  - /enterprise_influxdb/v1/guides/migration/
  - /enterprise_influxdb/v1/administration/upgrading/
---

Upgrade to the latest version of InfluxDB OSS v1.

## Upgrade to InfluxDB 1.11.x

1. [Download](https://www.influxdata.com/downloads/) InfluxDB version 1.11.x and [install the upgrade](/influxdb/v1/introduction/installation/).

2. Migrate configuration file customizations from your existing configuration file to the InfluxDB 1.11.x [configuration file](/influxdb/v1/administration/config/). Add or modify your environment variables as needed.

> [!Important]
> #### Choose your index type
> InfluxDB 1.11.x supports two index types:
> 
> - **Time Series Index (TSI)** - Recommended for most users. Removes RAM-based limits on series cardinality and provides better performance for high-cardinality datasets.
> - **In-memory index (inmem)** - Default option that maintains compatibility with earlier versions but has RAM limitations.
> 
> **When to use TSI:**
> - General purpose production instances.
> - Especially recommended for:
>    - High-cardinality datasets (many unique tag combinations)
>    - Experiencing high memory usage or out-of-memory errors
>    - Large production deployments
>
> **When to use inmem:**
> - Small datasets when memory is not a constraint
> - Ephemeral deployments such as development or testing environments
> 
> To learn more about TSI, see [Time Series Index overview](/influxdb/v1/concepts/time-series-index/) and [TSI details](/influxdb/v1/concepts/tsi-details/).

3. **Optional:** To enable TSI in InfluxDB 1.11.x, complete the following steps:

    1. If using the InfluxDB configuration file, find the `[data]` section, uncomment `index-version = "inmem"` and change the value to `tsi1`.

    2. If using environment variables, set `INFLUXDB_DATA_INDEX_VERSION` to `tsi1`.

    3. Delete shard `index` directories in your [InfluxDB `data/` directory](/influxdb/v1/concepts/file-system-layout).
       For example, in a Linux environment:

        ```
        /var/lib/influxdb/data/<db-name>/<rp-name>/<shard_ID>/index
        ```

    4. Build TSI by running the [influx_inspect buildtsi](/influxdb/v1/tools/influx_inspect/#buildtsi) command.
       > [!Important] 
       > Run the `buildtsi` command using the user account that you are going to run the database as, or ensure that the permissions match afterward.

4. Restart the `influxdb` service.

> [!Tip]
> #### Switch index types anytime
>
> The default configuration continues to use TSM-based shards with in-memory indexes (as in earlier versions). You can [switch between TSI and inmem index types](#switch-index-types) at any time.

## Switch index types

You can switch between index types at any time after upgrading:

**Switch from inmem to TSI:**
- Complete steps 3 and 4 in [Upgrade to InfluxDB 1.11.x](#upgrade-to-influxdb-111x)
- Recommended when experiencing high memory usage or out-of-memory errors with high-cardinality data

**Switch from TSI to inmem:**
- Change `tsi1` to `inmem` by completing steps 3a-3c and 4 in [Upgrade to InfluxDB 1.11.x](#upgrade-to-influxdb-111x)
- Suitable for small datasets where memory is not a constraint

## Downgrade InfluxDB

To downgrade to an earlier version, complete the procedures above in [Upgrade to InfluxDB 1.11.x](#upgrade-to-influxdb-111x), replacing the version numbers with the version that you want to downgrade to.
After downloading the release, migrating your configuration settings, and enabling TSI or TSM, make sure to [rebuild your index](/influxdb/v1/administration/rebuild-tsi-index/).

> [!Warning]
> Some versions of InfluxDB may have breaking changes that impact your ability to upgrade and downgrade. For example, you cannot downgrade from InfluxDB 1.3 or later to an earlier version. Please review the applicable version of release notes to check for compatibility issues between releases.

## Upgrade to InfluxDB Enterprise

To upgrade from InfluxDB OSS to InfluxDB Enterprise, [contact InfluxData Sales](https://www.influxdata.com/contact-sales/).
