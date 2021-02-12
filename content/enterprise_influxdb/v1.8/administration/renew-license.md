---
title: Renew or update a license key or file
description: >
  Renew or update a license key or file for your InfluxDB enterprise cluster.
menu:
  enterprise_influxdb_1_8:
    name: Renew a license
    weight: 50
    parent: Administration
---

> **Note:** To request a new license to renew or expand your InfluxDB Enterprise cluster, contact [sales@influxdb.com](mailto:sales@influxdb.com).

To update a license key or file, do the following:

1. **Add the license key or file** to your [meta nodes](/enterprise_influxdb/v1.8/administration/config-meta-nodes/#enterprise-license-settings) and [data nodes](/enterprise_influxdb/v1.8/administration/config-data-nodes/#enterprise-license-settings) configuration settings. For more information, see [how to configure InfluxDB Enterprise clusters](/enterprise_influxdb/v1.8/administration/configuration/).
2. **On each meta node**, run `service influxdb-meta restart`, and wait for the meta node service to come back up successfully before restarting the next meta node.
The cluster should remain unaffected as long as only one node is restarting at a time.
3. **On each data node**, run `killall -s HUP influxd` to restart all `influxd` processes. This reads the new license without restarting the data nodes.
