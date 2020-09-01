---
title: Administering InfluxDB
menu:
  influxdb_1_7:
    name: Administration
    weight: 50
---

The administration documentation contains all the information needed to administer a working InfluxDB installation.

{{< children hlevel="h2" >}}

## Downgrading

To revert to a prior version, complete the same steps as when [Upgrading to InfluxDB 1.7.x](/influxdb/v1.7/administration/upgrading/), replacing 1.7.x with the version you want to downgrade to. After downloading the release, migrating your configuration settings, and enabling TSI or TSM, make sure to [rebuild your index](/influxdb/v1.7/administration/rebuild-tsi-index/).

>**Note:** Some versions of InfluxDB may have breaking changes that impact your ability to upgrade and downgrade. For example, you cannot downgrade from InfluxDB 1.3 or later to an earlier version. Please review the applicable version of release notes to check for compatibility issues between releases.
