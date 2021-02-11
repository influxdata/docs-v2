---
title: Renew a license key or file
description: >
  Renew a license key or file for your InfluxDB enterprise cluster.
menu:
  enterprise_influxdb_1_8:
    name: Renew a license
    weight: 80
    parent: Administration
---

Renew a license key or file for your InfluxDB Enterprise cluster. To request a new license key for renewing or expanding your InfluxDB Enterprise cluster, contact [InfluxData Support](mailto:support@influxdata.com).

1. Add the new InfluxDB Enterprise license key (or license file) to your your [meta nodes](/enterprise_influxdb/v1.8/administration/config-meta-nodes/#enterprise-license-settings) and [data nodes](/enterprise_influxdb/v1.8/administration/config-data-nodes/#enterprise-license-settings) configuration settings. For more information, see [how to configure InfluxDB Enterprise clusters](/enterprise_influxdb/v1.8/administration/configuration/).
2. On each meta node, run `service influxdb-meta restart` to restart the node.
3. On each data node, run `killall -s HUP influxd` to restart `influxd` processes with having to perform a rolling restart.
