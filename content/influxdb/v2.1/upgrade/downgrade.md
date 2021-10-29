---
title: Downgrade InfluxDB
description: >
  To downgrade from InfluxDB {{< current-version >}} to a previous 2.x version,
  use the `influxd downgrade` command to downgrade the metadata schema used by
  `influxd` to match the metadata schema of a older release.
menu:
  influxdb_2_1:
    parent: Upgrade InfluxDB
    name: Downgrade InfluxDB
weight: 12
related:
  - /influxdb/v2.1/reference/cli/influxd/downgrade/
---

To downgrade from InfluxDB {{< current-version >}} to a previous 2.x version,
use the `influxd downgrade` command to downgrade the metadata schema used by
`influxd` to match the metadata schema of a older release.

InfluxDB does not guarantee backwards-compatibility with older releases in its embedded metadata stores.
Attempting to start an older `influxd` binary with a BoltDB or SQLite file that has
been migrated to a newer schema will result in a startup error similar to:

```
Error: up: reading migrations: migration "...": migration specification not found
```

**To downgrade from InfluxDB {{< current-version >}} to a previous 2.x version**:

1.  Run `influxd downgrade` using the **{{< current-version >}} `influxd` binary**.
    Specify the previous InfluxDB version to downgrade to.
    For example, to downgrade to InfluxDB 2.0: 

    ```sh
    influxd downgrade 2.0
    ```

2. Install the older version of InfluxDB.
3. Start InfluxDB with the **older `influxd` binary**.
