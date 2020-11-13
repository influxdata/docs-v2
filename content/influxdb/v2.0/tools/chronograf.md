---
title: Use Chronograf with InfluxDB OSS
description: >
  Use [Chronograf](/chronograf/) to visualize data from your **InfluxDB OSS 2.0** instance.
menu:
  influxdb_2_0:
    name: Use Chronograf
    parent: Tools & integrations
weight: 103
related:
  - /{{< latest "chronograf" >}}/
---

Use [Chronograf](/{{< latest "chronograf" >}}/) to visualize data from **InfluxDB Cloud** and **InfluxDB OSS 2.0**.

- Chronogaf will use the v1 compatibility APIs
- Limited write functionality
- Continue to use InfluxQL
- If using an admin user for visualization or Chronograf's administrative functions, create a new read-only user before upgrading.
  Admin rights are granted to the primary user created in the InfluxDB 2.0 setup process which runs at the end of the upgrade process.
  This provides you with the opportunity to re-assess who should be granted admin-level access in your InfluxDB 2.0 setup.

1. Create a new connection
2. Enter your InfluxDB URL:
    ```
    http://localhost:8086
    ```
3. Test the connection
