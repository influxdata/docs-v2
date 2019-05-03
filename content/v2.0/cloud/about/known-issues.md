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

- IDPE 2868: Users can delete a token with an active Telegraf configuration pointed to it.
- IDPE 3388: Users can delete themselves from their Cloud 2.0 account.
- IDPE 3392: Free tier users bucket retention is unlimited and should be set to 72 hours.
- IDPE 3392: Retention period for buckets in free tier can be changed by users. 
- [TELEGRAF-5600](https://github.com/influxdata/telegraf/issues/5600): Improve error message in Telegraf when the bucket it's reporting to is not found.
- [INFLUXDB-12687](https://github.com/influxdata/influxdb/issues/12687): Create organization button should only be displayed for users with permissions to create an organization.
