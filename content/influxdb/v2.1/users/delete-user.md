---
title: Delete a user
seotitle: Delete a user from InfluxDB
description: Delete a user from InfluxDB using the InfluxDB UI or the influx CLI.
menu:
  influxdb_2_1:
    name: Delete a user
    parent: Manage users
weight: 103
products: [oss]
---

Use the InfluxDB user interface (UI) or the `influx` command line interface (CLI)
to delete a user.

{{% warn %}}
Deleting a user removes them completely from InfluxDB.
To remove a user from an organization without deleting the user entirely, see
[Remove a member from an organization](/influxdb/v2.1/organizations/members/remove-member/).
{{% /warn %}}

## Delete a user from the InfluxDB UI

{{% note %}}
Users cannot be deleted from the InfluxDB UI.
{{% /note %}}

## Delete a user using the influx CLI

Use the [`influx user delete` command](/influxdb/v2.1/reference/cli/influx/user/delete)
to delete a user. Deleting a user requires the following:

- The user ID _(provided in the output of `influx user list`)_

```sh
# Syntax
influx user delete -i <user-id>

# Example
influx user delete -i 034ad714fdd6f000
```
