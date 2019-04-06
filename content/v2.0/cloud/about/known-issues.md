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

- IDPE-2860: Additional user shows up as owner under Cloud 2 organization.
- IDPE 2868: User must not be able to delete token with an active Telegraf configuration pointed to it.
- IDPE-2869: As a Cloud 2.0 user, I cannot use any CLI tools to interact with my Cloud 2 tenant.
- IDPE-2896: Logout does not work in Cloud 2.0 UI.
- IDPE-2897: Single sign on does not work between `https://cloud2.influxdata.com`
  and `https://us-west-2-1.aws.cloud2.influxdata.com`.
- [TELEGRAF-5600](https://github.com/influxdata/telegraf/issues/5600): Improve error message in Telegraf when bucket it's reporting to is not found.
- [INFLUXDB-12686](https://github.com/influxdata/influxdb/issues/12686): Unable to copy error message from UI.
- [INFLUXDB-12690](https://github.com/influxdata/influxdb/issues/12690): Impossible to change a task from `every` to `cron`.
- [INFLUXDB-12688](https://github.com/influxdata/influxdb/issues/12688): Create bucket switching between periodically and never fails to create bucket.
- [INFLUXDB-12687](https://github.com/influxdata/influxdb/issues/12687): Create org should display only for the create org permission.
