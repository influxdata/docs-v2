---
title: Web Admin Interface
newversionredirect: chronograf/
menu:
  influxdb_1_3:
    weight: 30
    parent: Tools
---

{{% warn %}}
In version 1.3, the web admin interface is no longer available in InfluxDB.
The interface does not run on port `8083` and InfluxDB ignores the `[admin]` section in the configuration file if that section is present.
[Chronograf](/{{< latest "chronograf" >}}/) replaces the web admin interface with improved tooling for querying data, writing data, and database management.
See [Chronograf's transition guide](/chronograf/v1.7/guides/transition-web-admin-interface/) for more information.
{{% /warn %}}
