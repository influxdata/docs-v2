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
  - /influxdb/cloud/reference/cli/influx/#provide-required-authentication-credentials, influx CLI—Provide required authentication credentials
  - /influxdb/cloud/reference/cli/influx/#flag-patterns-and-conventions, influx CLI—Flag patterns and conventions
canonical: /{{< latest "influxdb" "v2" >}}/reference/cli/influx/user/password/
---

{{% note %}}
#### Available with InfluxDB OSS 2.x only
The `influx user password` command updates passwords for **InfluxDB OSS 2.x** users,
but does not update passwords for **InfluxDB Cloud** accounts.
To change your InfluxDB Cloud account password, see
[Change your password](/influxdb/cloud/account-management/change-password/).
{{% /note %}}

{{< duplicate-oss >}}
