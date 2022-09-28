---
title: Renew or update a license key or file
description: >
  Renew or update a license key or file for your InfluxDB enterprise cluster.
menu:
  enterprise_influxdb_1_9:
    name: Renew a license
    weight: 50
    parent: Administration
---

Use this procedure to renew or update an existing license key or file, switch from a license key to a license file, or switch from a license file to a license key.

> **Note:** To request a new license to renew or expand your InfluxDB Enterprise cluster, contact [sales@influxdb.com](mailto:sales@influxdb.com).

To update a license key or file, do the following:

1. If you are switching from a license key to a license file (or vice versa), delete your existing license key or file.
2. **Add the license key or file** to your [meta nodes](/enterprise_influxdb/v1.9/administration/config-meta-nodes/#enterprise-license-settings) and [data nodes](/enterprise_influxdb/v1.9/administration/config-data-nodes/#enterprise-license-settings) configuration settings. For more information, see [how to configure InfluxDB Enterprise clusters](/enterprise_influxdb/v1.9/administration/configuration/).
3. **On each meta node**, run `service influxdb-meta restart`, and wait for the meta node service to come back up successfully before restarting the next meta node.
The cluster should remain unaffected as long as only one node is restarting at a time.
4. **On each data node**, run `killall -s HUP influxd` to signal the `influxd` process to reload its configuration file.
