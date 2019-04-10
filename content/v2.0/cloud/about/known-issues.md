---
title: Known issues in InfluxDB Cloud
description: Information related to known issues in InfluxDB Cloud 2.
weight: 102
menu:
  v2_0_cloud:
    name: Known issues
    parent: About InfluxDB Cloud
---

The following issues currently exist in {{< cloud-name >}}:

- Usage statistics on the Usage page may show incorrect values (still in development).
- Existing tasks may have duration specified in nanoseconds and need to be resubmitted.
- IDPE-2860: Additional user shows up as owner under Cloud 2 organization.
- IDPE 2868: User must not be able to delete token with an active Telegraf configuration pointed to it.
- IDPE-2869: As a Cloud 2.0 user, I cannot use any CLI tools to interact with my Cloud 2 tenant.
- [TELEGRAF-5600](https://github.com/influxdata/telegraf/issues/5600): Improve error message in Telegraf when bucket it's reporting to is not found.
- [INFLUXDB-12687](https://github.com/influxdata/influxdb/issues/12687): Create org should display only for the create org permission.
