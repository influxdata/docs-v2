---
title: influx user password
description: The `influx user password` command updates the password for a user in InfluxDB.
menu:
  influxdb_cloud_ref:
    name: influx user password
    parent: influx user
weight: 201
related:
  - /influxdb/cloud/account-management/change-password/
  - /influxdb/cloud/reference/cli/influx/#patterns-and-conventions, influx CLI patterns and conventions
canonical: /{{< latest "influxdb" "v2" >}}/reference/cli/influx/user/password/
---

{{% cloud %}}
#### This command does not work with InfluxDB Cloud
The `influx user password` command **does not** update passwords for **InfluxDB Cloud** accounts.
It updates passwords for **InfluxDB OSS 2.x** users only.
To change your InfluxDB Cloud account password, see
[Change your password](/influxdb/cloud/account-management/change-password/).
{{% /cloud %}}

{{< duplicate-oss >}}
